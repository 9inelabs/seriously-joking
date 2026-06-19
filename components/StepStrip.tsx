const STEPS = ["Package", "Your details", "Payment", "Ticket"];

/** current: 1-based index of the active step. */
export function StepStrip({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-[14px] text-[11px] uppercase tracking-[.12em] text-mute">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "todo";
        return (
          <li key={label} className="flex items-center gap-[14px]">
            <span
              className={[
                "flex items-center gap-2",
                state === "active" ? "text-gold-1" : "",
                state === "done" ? "text-cream-2" : "",
              ].join(" ")}
              aria-current={state === "active" ? "step" : undefined}
            >
              <span
                aria-hidden
                className={[
                  "h-[6px] w-[6px] rounded-full",
                  state === "active"
                    ? "bg-gold-2 shadow-[0_0_10px_rgba(212,167,74,.6)]"
                    : state === "done"
                      ? "bg-gold-3"
                      : "bg-line",
                ].join(" ")}
              />
              {n} · {label}
            </span>
            {n < STEPS.length && (
              <span aria-hidden className="hidden h-px w-[30px] bg-line sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
