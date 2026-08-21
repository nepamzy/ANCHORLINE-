import { Button } from "@/components/ui/Button";
import { business, contactNav, trustPillars } from "@/content/site";

/**
 * Homepage opening hero, matching the structure of the client-supplied
 * fraxBiT reference clip: a two-part headline (company name, with the
 * closing word carrying a gold accent, mirroring the reference's
 * "Creating a Brighter Future / Starting Today"), a catchphrase line
 * directly under it (the reference's small paragraph slot; here it's
 * Anchorline's real tagline), two CTAs (a filled primary + a plain text
 * link, mirroring "Book" / "Meet Us"), and a large photo panel with a
 * notched corner and overlaid trust badges (mirroring the reference's
 * client-avatar/"trusted in X countries" badges).
 *
 * The photo is representative/licensed architecture photography, not
 * real Anchorline site photography and not an AI-generated render — a
 * frame pulled from the client's reference video was tried first, but
 * at ~650x200px with baked-in captions and heavy compression/motion
 * blur (a phone recording of a laptop screen) it wasn't usable at
 * production size. This is the closest clean, high-resolution
 * substitute already in the project's asset set (see
 * ANCHORLINE-HANDOFF.md, Section P for the full reasoning).
 */
export function Hero({ heroDescription }: { heroDescription: string }) {
  const [nameLead, nameAccent] = splitCompanyName(business.name);

  return (
    <section className="relative overflow-hidden bg-paper">
      {/* Full-background logo watermark, tiled across the whole section — opacity kept low
          enough that the headline/tagline/CTAs stay easy to read without straining, per
          instruction ("the logo should cover the whole background... user should be able
          to see clearly without straining the main text"). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "url(/assets/logo/anchorline-logo.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "220px auto",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-[6vw] pt-14 pb-10 sm:pt-20 sm:pb-14">
        <p className="font-mono text-[10px] tracking-[0.4em] text-gold-600">
          {business.location.toUpperCase()} &middot; INDEPENDENT CONSTRUCTION OVERSIGHT
        </p>

        <h1 className="mt-5 max-w-3xl text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-navy-950">
          {nameLead} <span className="text-gold-600">{nameAccent}</span>
        </h1>

        <p className="mt-4 max-w-xl text-xl font-medium text-navy-800">{business.tagline}</p>

        <p className="mt-4 max-w-xl text-slate">{heroDescription}</p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button href={contactNav.href} variant="gold">
            Get a Quote
          </Button>
          <a
            href="/how-it-works"
            className="text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-navy-700"
          >
            See How It Works
          </a>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-tl-[3rem] rounded-tr-lg rounded-br-[3rem] rounded-bl-lg">
          <img
            src="/assets/film/shot-2.jpg"
            alt="Illustrative modern residential architecture, representative of the kind of build Anchorline verifies"
            className="h-[52vh] w-full object-cover sm:h-[62vh]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/0 to-navy-950/10" />

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6">
            {trustPillars.map((p) => (
              <span
                key={p}
                className="rounded-full bg-paper/95 px-3 py-1.5 text-xs font-semibold text-navy-900 backdrop-blur"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="absolute right-4 bottom-4 max-w-[60vw] truncate rounded-full bg-navy-950/70 px-2.5 py-1.5 text-[10px] font-medium text-paper backdrop-blur sm:right-6 sm:bottom-6 sm:max-w-none sm:px-3 sm:text-xs">
            Founder-led &middot; {business.principal}
          </div>
        </div>
        <p className="mt-3 text-xs text-slate/70">
          Illustrative architecture photography, representative of the kind of build Anchorline verifies. Not an actual Anchorline client project.
        </p>
      </div>
    </section>
  );
}

/** Splits the company name on its last space so the closing word can carry the gold accent. */
function splitCompanyName(name: string): [string, string] {
  const idx = name.lastIndexOf(" ");
  if (idx === -1) return [name, ""];
  return [name.slice(0, idx), name.slice(idx + 1)];
}
