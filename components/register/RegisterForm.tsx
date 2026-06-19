"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AlertCircle } from "lucide-react";
import {
  registrationSchema,
  toFullPhone,
  type RegistrationFormValues,
} from "@/lib/validation";
import { createRegistration } from "@/lib/registrations";
import { PACKAGES, isTablePackage, type PackageType } from "@/lib/packages";
import { Spinner } from "@/components/ui/Spinner";
import { OrderSummary } from "./OrderSummary";

export function RegisterForm({ packageType }: { packageType: PackageType }) {
  const router = useRouter();
  const pkg = PACKAGES[packageType];
  const isTable = isTablePackage(packageType);
  const guestSeats = isTable ? pkg.seats - 1 : 0;

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      tableName: "",
      guests: Array.from({ length: guestSeats }, () => ({ name: "", contact: "" })),
    },
  });

  const { fields } = useFieldArray({ control, name: "guests" });
  const hostName = watch("fullName");
  const hostEmail = watch("email");

  async function onSubmit(values: RegistrationFormValues) {
    setSubmitError(null);
    try {
      const guests = isTable
        ? [
            { seat_number: 1, name: values.fullName, contact: values.email },
            ...(values.guests ?? []).map((g, i) => ({
              seat_number: i + 2,
              name: g.name?.trim() || null,
              contact: g.contact?.trim() || null,
            })),
          ].filter((g) => g.name)
        : undefined;

      const reg = await createRegistration({
        packageType,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: toFullPhone(values.phone),
        tableName: values.tableName?.trim() || undefined,
        guests,
      });

      if (pkg.price === 0) {
        // Free ticket — auto-approve and go straight to ticket page
        await fetch(`/api/approve-free/${encodeURIComponent(reg.ref_number)}`, {
          method: "POST",
        });
        router.push(`/ticket/${encodeURIComponent(reg.ref_number)}`);
      } else {
        router.push(`/payment/${encodeURIComponent(reg.ref_number)}`);
      }
    } catch (e) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : "We couldn't save your registration. Please try again."
      );
    }
  }

  return (
    <div className="grid gap-7 px-5 py-9 md:px-10 md:py-14 lg:grid-cols-[1fr_380px] lg:gap-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* heading */}
        <div className="mb-8">
          <div className="eyebrow">{pkg.tier} · {pkg.name}</div>
          <h1 className="mb-3 mt-3 font-display text-[clamp(32px,4vw,44px)] uppercase leading-none tracking-[.03em] text-cream">
            {isTable ? (
              <>Who&apos;s holding<br />the table?</>
            ) : (
              <>Your details</>
            )}
          </h1>
          <p className="max-w-[480px] text-[14px] text-mute">
            {isTable
              ? "One person books the table and brings the crew. We'll need the host's details now — guest names can be added any time before the show."
              : pkg.price === 0
              ? "Tell us who's coming. Your free ticket will be sent to you instantly."
              : "Tell us who's coming. We'll send your ticket here once payment is confirmed."}
          </p>
        </div>

        {/* host fields */}
        <div className="mb-[30px] grid gap-x-5 gap-y-[18px] sm:grid-cols-2">
          <Field
            label="Full name"
            hint="— as it appears on ID"
            error={errors.fullName?.message}
            className="sm:col-span-2"
          >
            <input
              className="input"
              type="text"
              autoComplete="name"
              placeholder="Chinedu Okafor"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <input
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <div className="flex items-stretch">
              <span className="grid place-items-center rounded-l-sm border border-r-0 border-line bg-ink-1 px-[14px] font-mono text-[13px] text-mute">
                +234
              </span>
              <input
                className="input flex-1 !rounded-l-none"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="803 000 0000"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </div>
          </Field>

          {isTable && (
            <Field
              label="Table name"
              hint="— optional, shown on the table card"
              error={errors.tableName?.message}
              className="sm:col-span-2"
            >
              <input
                className="input"
                type="text"
                placeholder="e.g. The Okafor Five"
                {...register("tableName")}
              />
            </Field>
          )}
        </div>

        {/* guests (tables only) */}
        {isTable && (
          <div className="mb-[30px] rounded-md border border-dashed border-[rgba(212,167,74,.3)] bg-ink-1 p-6">
            <h3 className="font-display text-[18px] uppercase tracking-[.08em] text-gold-1">
              Add your guests
            </h3>
            <p className="mb-[18px] mt-[6px] text-[13px] text-mute">
              Your booking covers{" "}
              <strong className="text-gold-1">{pkg.seats} seats</strong>. Add names now
              or leave blank and send guests a join link later.
            </p>

            {/* seat 1 = host (read-only, mirrors the host fields) */}
            <SeatRow seat="01">
              <input
                className="input opacity-70"
                value={hostName ? `${hostName} (host)` : "Host"}
                readOnly
                tabIndex={-1}
                aria-label="Seat 1 — host name"
              />
              <input
                className="input opacity-70"
                value={hostEmail || ""}
                readOnly
                tabIndex={-1}
                aria-label="Seat 1 — host contact"
              />
            </SeatRow>

            {fields.map((field, i) => (
              <SeatRow key={field.id} seat={String(i + 2).padStart(2, "0")}>
                <input
                  className="input"
                  type="text"
                  placeholder="Guest name"
                  aria-label={`Seat ${i + 2} — guest name`}
                  {...register(`guests.${i}.name` as const)}
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Email or phone (optional)"
                  aria-label={`Seat ${i + 2} — guest contact`}
                  {...register(`guests.${i}.contact` as const)}
                />
              </SeatRow>
            ))}
          </div>
        )}

        {submitError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-sm border border-[rgba(239,68,68,.3)] bg-[rgba(239,68,68,.08)] p-4 text-[13px] text-cream-2"
          >
            <AlertCircle size={18} className="mt-[1px] flex-shrink-0 text-err" />
            <span>{submitError}</span>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-block">
          {isSubmitting ? (
            <>
              <Spinner size={16} /> Saving…
            </>
          ) : (
            <>
              {pkg.price === 0 ? "Get my free ticket" : "Continue to payment"}{" "}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <OrderSummary packageType={packageType} hostName={hostName} />
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[11px] font-bold uppercase tracking-[.14em] text-gold-2">
        {label}
        {hint && <span className="ml-[6px] font-medium text-mute">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-[12px] font-medium text-err">
          {error}
        </span>
      )}
    </label>
  );
}

function SeatRow({ seat, children }: { seat: string; children: React.ReactNode }) {
  return (
    <div className="mb-[10px] grid grid-cols-[36px_1fr] items-center gap-3 sm:grid-cols-[40px_1fr_1fr]">
      <span className="grid h-[38px] place-items-center rounded-sm bg-[rgba(212,167,74,.1)] font-mono text-[12px] font-bold text-gold-1">
        {seat}
      </span>
      {children}
    </div>
  );
}