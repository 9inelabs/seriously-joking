import { PendingClient } from "@/components/pending/PendingClient";

export const metadata = {
  title: "Awaiting confirmation — Seriously Joking",
  robots: { index: false, follow: false },
};

export default function PendingPage({
  params,
}: {
  params: { refNumber: string };
}) {
  return <PendingClient refNumber={decodeURIComponent(params.refNumber)} />;
}
