import { ComingSoon } from "@/components/portal/ComingSoon";

export default function PortalDocumentsPage() {
  return (
    <ComingSoon
      eyebrow="Documents"
      title="Reports & documents"
      description="Site-visit reports and project documents will appear here as soon as they're published for your project."
      icon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M14 3v5h5 M9 13h6 M9 17h6"
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
