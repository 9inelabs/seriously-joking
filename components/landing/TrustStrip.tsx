const ITEMS = [
  {
    title: "Verified by humans",
    body: "Bank transfers are confirmed manually, usually within 30 minutes. You'll get a text and email the moment your ticket goes live.",
  },
  {
    title: "Your seat, locked in",
    body: "Reserved seats and tables are held the moment payment is confirmed. No overbooking, no double seats — that's the promise.",
  },
  {
    title: "Built for groups",
    body: "Buy a table once. Bring your people. Walk in together. The host's ticket covers every seat at the table.",
  },
];

export function TrustStrip() {
  return (
    <div
      id="venue"
      className="grid grid-cols-1 gap-5 px-5 py-8 md:grid-cols-3 md:px-10 md:py-12"
      style={{
        borderTop: "1px solid rgba(212,167,74,.1)",
        borderBottom: "1px solid rgba(212,167,74,.1)",
        background: "linear-gradient(180deg, transparent, rgba(15,30,54,.4))",
      }}
    >
      {ITEMS.map((item) => (
        <div key={item.title}>
          <h3 className="mb-[6px] font-display text-[18px] uppercase tracking-[.06em] text-gold-1">
            {item.title}
          </h3>
          <p className="text-[13px] leading-[1.6] text-mute">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
