/**
 * Signature "site line" diagram: YOU (wherever you are) — connected via
 * ANCHORLINE (an anchor mark, your eyes on site) — to SITE (Nigeria).
 * A simple visual restatement of the tagline, not a stock photo.
 */
export function SiteLineDiagram() {
  return (
    <svg viewBox="0 0 460 150" className="w-full max-w-md" role="img" aria-label="You, wherever you are, connected through Anchorline to your site in Nigeria">
      <line x1="30" y1="100" x2="430" y2="100" stroke="currentColor" className="text-white/25" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="30" cy="100" r="5" fill="none" stroke="#e8c583" strokeWidth="1.5" />
      <text x="30" y="124" textAnchor="middle" className="fill-white/60 font-mono text-[11px] tracking-wide">YOU</text>
      <text x="30" y="138" textAnchor="middle" className="fill-white/60 font-mono text-[11px] tracking-wide">wherever you are</text>

      <g transform="translate(230,100)">
        <path
          d="M0,-30 L0,4 M0,4 a14,14 0 1 0 0.01,0 M-16,-14 L16,-14 M-8,-30 a8,8 0 1 1 16,0"
          fill="none"
          stroke="#d6a544"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </g>
      <text x="230" y="130" textAnchor="middle" className="fill-gold-400 font-mono text-[11px] font-semibold tracking-wide">ANCHORLINE</text>
      <text x="230" y="144" textAnchor="middle" className="fill-white/60 font-mono text-[11px] tracking-wide">your eyes on site</text>

      <circle cx="430" cy="100" r="5" fill="#e8c583" />
      <text x="430" y="124" textAnchor="middle" className="fill-gold-400 font-mono text-[11px] font-semibold tracking-wide">SITE</text>
      <text x="430" y="138" textAnchor="middle" className="fill-white/60 font-mono text-[11px] tracking-wide">Nigeria</text>
    </svg>
  );
}
