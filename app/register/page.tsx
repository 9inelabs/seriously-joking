import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { StepStrip } from "@/components/StepStrip";
import { RegisterForm } from "@/components/register/RegisterForm";
import { isPackageType } from "@/lib/packages";

export const metadata = {
  title: "Your details — Seriously Joking",
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { package?: string };
}) {
  const pkg = searchParams.package;
  if (!isPackageType(pkg)) {
    redirect("/#packages");
  }

  return (
    <main className="min-h-screen bg-ink-2">
      <SiteHeader backHref="/#packages" backLabel="← Back to packages" />
      <div className="px-5 pt-9 md:px-10">
        <StepStrip current={2} />
      </div>
      <RegisterForm packageType={pkg} />
    </main>
  );
}
