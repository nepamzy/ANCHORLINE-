import { Button } from "@/components/ui/Button";
import { business, contactNav, trustPillars } from "@/content/site";

/**
 * Homepage opening hero: text on the left, the full-clarity intro video on
 * the right — two separate blocks side by side (stacked on mobile) so
 * neither the text nor the video encroaches on the other, and both show
 * completely (no dimming overlay on the video, no truncated text).
 */
export function Hero({ heroDescription }: { heroDescription: string }) {
  const [nameLead, nameAccent] = splitCompanyName(business.name);

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-[6vw] pt-14 pb-10 sm:pt-20 sm:pb-14 md:grid-cols-2 md:items-center md:gap-12">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.4em] text-gold-600">
            {business.location.toUpperCase()} &middot; INDEPENDENT CONSTRUCTION OVERSIGHT
          </p>

          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-navy-950">
            {nameLead} <span className="text-gold-600">{nameAccent}</span>
          </h1>

          <p className="mt-4 text-xl font-medium text-navy-800">{business.tagline}</p>

          <p className="mt-4 text-slate">{heroDescription}</p>

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

          <div className="mt-8 flex flex-wrap gap-2">
            {trustPillars.map((p) => (
              <span
                key={p}
                className="rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-900"
              >
                {p}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate/70">
            Founder-led &middot; {business.principal}
          </p>
        </div>

        <div className="relative min-h-[280px] w-full overflow-hidden rounded-tl-[3rem] rounded-tr-lg rounded-br-[3rem] rounded-bl-lg shadow-card sm:min-h-[380px] md:min-h-[460px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/assets/film/hero-background.mp4" type="video/mp4" />
          </video>
        </div>
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
