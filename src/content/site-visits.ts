/**
 * Real photos/video of the Nile University of Nigeria Senate Building,
 * Abuja (contractor: Allison Rich). This was a project the Principal
 * Consultant worked on in his prior construction-management role,
 * before founding Anchorline, not an Anchorline client engagement.
 * Shown on the About page to illustrate that hands-on experience.
 *
 * Photos and video supplied directly by the client (source: WhatsApp
 * export). Shown at full frame, uncropped, including the two exterior
 * shots that carry visible site-verification app overlays (CamScanner
 * timestamp/location tag, GPS Map Camera tag), left in deliberately,
 * per instruction, since they're genuine artifacts of a real site visit
 * rather than something to hide.
 */

const siteName = "Nile University of Nigeria Senate Building";
const location = "Abuja, FCT";

export const siteVisitPhotos = [
  { src: "/assets/site-visits/excavation.jpg", alt: "Excavation and formwork laid out at the site", caption: "Groundworks: excavation and formwork", siteName, location },
  { src: "/assets/site-visits/foundation-wide.jpg", alt: "Foundation reinforcement mat, wide view", caption: "Foundation reinforcement, wide view", siteName, location },
  { src: "/assets/site-visits/foundation-pour-1.jpg", alt: "Blinding with the structural team", caption: "Blinding, structural team", siteName, location },
  { src: "/assets/site-visits/foundation-pour-2.jpg", alt: "Concrete slab poured to line", caption: "Slab poured to line", siteName, location },
  { src: "/assets/site-visits/team-formwork.jpg", alt: "On the first floor slab with rebar cages and the site team", caption: "On the first floor slab, with the site team", siteName, location },
  { src: "/assets/site-visits/portrait-slab-level.jpg", alt: "On site at slab level", caption: "On site, slab level", siteName, location },
  { src: "/assets/site-visits/team-group.jpg", alt: "Site inspection team on site", caption: "Site inspection team", siteName, location },
  { src: "/assets/site-visits/structural-framing.jpg", alt: "Block walls rising with scaffold up", caption: "Block walls and scaffold", siteName, location },
  { src: "/assets/site-visits/exterior-progress-1.jpg", alt: "Building envelope with safety netting up", caption: "Envelope, netting up", siteName, location },
  { src: "/assets/site-visits/exterior-progress-2.jpg", alt: "Full building elevation with netting and scaffold", caption: "Full elevation, netting and scaffold", siteName, location },
] as const;

export const siteVisitVideos = [
  { src: "/assets/site-videos/site-wide-pan.mp4", poster: "/assets/site-videos/site-wide-pan-poster.jpg", caption: "Site walkthrough: wide pan across the build" },
  { src: "/assets/site-videos/pour-column.mp4", poster: "/assets/site-videos/pour-column-poster.jpg", caption: "Concrete pour at a structural column" },
  { src: "/assets/site-videos/reinforcement-tie.mp4", poster: "/assets/site-videos/reinforcement-tie-poster.jpg", caption: "Reinforcement cage, tying steel" },
  { src: "/assets/site-videos/formwork-detail.mp4", poster: "/assets/site-videos/formwork-detail-poster.jpg", caption: "Formwork and scaffold detail" },
  { src: "/assets/site-videos/rebar-mat.mp4", poster: "/assets/site-videos/rebar-mat-poster.jpg", caption: "Reinforcement mat, tying steel at slab level" },
  { src: "/assets/site-videos/slab-finish.mp4", poster: "/assets/site-videos/slab-finish-poster.jpg", caption: "Freshly poured slab, finishing" },
] as const;

/** Primary portrait used for the About page's hero watermark treatment. */
export const watermarkPhoto = {
  src: "/assets/site-visits/portrait-slab-level.jpg",
  alt: "Anchorline's Principal Consultant on site",
};
