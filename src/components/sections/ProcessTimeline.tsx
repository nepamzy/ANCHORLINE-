import type { HowItWorksStep } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Connected vertical timeline for the dedicated /how-it-works page —
 * a single continuous line running through numbered markers, each with
 * its own card. Replaces the plain equal-width grid (HowItWorksSteps,
 * still used as-is for the compact homepage teaser) with something that
 * reads as a sequence, not just a list.
 */
export function ProcessTimeline({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <ol className="relative mx-auto max-w-2xl">
      <div className="absolute top-2 bottom-2 left-[19px] w-px bg-line sm:left-[23px]" aria-hidden />
      {steps.map((step, i) => (
        <Reveal key={step.step} delayMs={i * 90}>
          <li className="relative flex gap-6 pb-10 last:pb-0">
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-navy-900 text-sm font-bold text-white sm:h-12 sm:w-12">
              {step.step}
            </span>
            <div className="pt-1.5">
              <p className="font-display text-lg font-medium text-navy-900 sm:text-xl">{step.title}</p>
              <p className="mt-1.5 text-slate">{step.body}</p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
