import { TicketClient } from "@/components/ticket/TicketClient";

export const metadata = {
  title: "Your ticket — Seriously Joking",
  robots: { index: false, follow: false },
};

export default function TicketPage({
  params,
}: {
  params: { refNumber: string };
}) {
  return <TicketClient refNumber={decodeURIComponent(params.refNumber)} />;
}
