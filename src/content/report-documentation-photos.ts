/**
 * Photos for the Sample Report page's "Documentation" tab, shown as an
 * interactive per-category gallery (tap a category, see multiple real
 * angles for it) rather than one static image per category.
 *
 * These are AI-generated illustrative construction photography, not
 * real Anchorline or client site photos — clearly disclosed on-page.
 * Generated with a limited image-generation quota, which is why
 * coverage isn't perfectly even: Roofing and Electrical/Plumbing were
 * prioritized (2 photos each) since the client specifically asked for
 * real-looking coverage there; every other category has at least one.
 * More can be generated and added here later.
 */
export type DocPhoto = { url: string; alt: string };

export const documentationPhotos: Record<string, DocPhoto[]> = {
  Foundation: [
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927546/nlgjg5uzs38gwj1yqsva.png",
      alt: "Illustrative photo: foundation trench with steel reinforcement mesh and formwork",
    },
  ],
  Superstructure: [
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927559/yregkjhktjlz6haxcupx.png",
      alt: "Illustrative photo: block walls rising with scaffold and reinforced concrete columns",
    },
  ],
  Roofing: [
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927415/nojervd6wun9emcnedxd.png",
      alt: "Illustrative photo: workers installing corrugated aluminum roofing sheets on timber trusses",
    },
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927519/nhuw7ectn1kt3bfymdgn.png",
      alt: "Illustrative photo: workers installing clay roofing tiles on a two-story house",
    },
  ],
  "Electrical/Plumbing": [
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927467/rxwunam1nr2vu4vo2iwj.png",
      alt: "Illustrative photo: electrician installing PVC conduit and wiring in an unfinished building",
    },
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927532/d9xxohot6h9x50axidfw.png",
      alt: "Illustrative photo: plumber installing PVC water supply pipes in a bathroom under construction",
    },
  ],
  Finishing: [
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927572/v7nzerdajglyswwo8aca.png",
      alt: "Illustrative photo: plastering and screed finish work in progress indoors",
    },
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927584/onuk37i2olsu6lfqk9wa.png",
      alt: "Illustrative photo: exterior painting and driveway paving on a near-complete house",
    },
  ],
  "Site Safety": [
    {
      url: "https://res.cloudinary.com/vzqkfl9t/image/upload/v1786927600/af7hcosnqrsjbc2jwyaq.png",
      alt: "Illustrative photo: workers in hard hats and high-visibility vests, guarded scaffolding",
    },
  ],
};
