import { ComingSoon } from "@/components/portal/ComingSoon";

export default function PortalPaymentsPage() {
  return (
    <ComingSoon
      eyebrow="Payments"
      title="Payments"
      description="Online payment via card or bank transfer (Paystack and Stripe) is being wired up next, so you can settle invoices directly from here."
      icon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z M3 10h18 M7 15h4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
    />
  );
}
