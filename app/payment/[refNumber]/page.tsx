import { PaymentClient } from "@/components/payment/PaymentClient";

export const metadata = {
  title: "Send your transfer — Seriously Joking",
};

export default function PaymentPage({
  params,
}: {
  params: { refNumber: string };
}) {
  return <PaymentClient refNumber={decodeURIComponent(params.refNumber)} />;
}
