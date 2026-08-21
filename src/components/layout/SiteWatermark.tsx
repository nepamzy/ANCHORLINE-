/**
 * A single, persistent, bright watermark photo fixed in the corner of
 * the viewport across every public page — a real construction photo
 * (project-relevant) rather than the client logo, per instruction.
 * Deliberately not styled as a functional element (no link, no hover
 * state, pointer-events-none) so it never competes with the
 * WhatsApp/Get a Quote buttons in the header.
 */
export function SiteWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-20 right-4 z-40 sm:right-6"
    >
      <img
        src="/assets/site-visits/exterior-progress-2.jpg"
        alt=""
        className="h-16 w-24 rounded-control border border-paper/40 object-cover shadow-lg sm:h-20 sm:w-28"
      />
    </div>
  );
}
