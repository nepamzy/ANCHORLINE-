import { ComingSoon } from "@/components/portal/ComingSoon";

export default function PortalMessagesPage() {
  return (
    <ComingSoon
      eyebrow="Messages"
      title="Talk to our team"
      description="Direct, in-portal messaging with Anchorline is on its way, so you can discuss your project without leaving your dashboard."
      icon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    />
  );
}
