const INK = 'hsl(var(--ink))';
const HAIR = 'hsl(var(--hairline))';
const SIGNAL = 'hsl(var(--signal))';

export default function HeroDrawing() {
  return (
    <div className="relative border border-hairline bg-card p-3 shadow-[0_24px_60px_-40px_rgba(20,24,29,0.45)]">
      <svg viewBox="0 0 420 330" className="w-full" role="img" aria-label="Dimensioned drawing of an L-bracket with holes and a title block">
        <defs>
          <pattern id="sheetgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke={HAIR} strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="420" height="330" fill="url(#sheetgrid)" />
        <rect x="6" y="6" width="408" height="318" fill="none" stroke={INK} strokeOpacity="0.25" strokeWidth="0.8" />

        <path
          d="M92 66 H268 V122 H150 V246 H92 Z"
          fill={SIGNAL}
          fillOpacity="0.05"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="draw-in"
        />

        <g fill="none" stroke={INK} strokeWidth="2">
          <circle cx="116" cy="94" r="10" className="draw-in" style={{ animationDelay: '0.4s' }} />
          <circle cx="238" cy="94" r="10" className="draw-in" style={{ animationDelay: '0.5s' }} />
          <circle cx="121" cy="204" r="6" className="draw-in" style={{ animationDelay: '0.6s' }} />
        </g>

        <g stroke={SIGNAL} strokeOpacity="0.6" strokeWidth="0.8" strokeDasharray="12 3 3 3">
          <line x1="96" y1="94" x2="136" y2="94" />
          <line x1="116" y1="74" x2="116" y2="114" />
          <line x1="218" y1="94" x2="258" y2="94" />
          <line x1="238" y1="74" x2="238" y2="114" />
          <line x1="105" y1="204" x2="137" y2="204" />
          <line x1="121" y1="188" x2="121" y2="220" />
        </g>

        <g stroke={INK} strokeOpacity="0.3" strokeWidth="0.7" strokeDasharray="10 3 2 3">
          <line x1="92" y1="66" x2="92" y2="278" />
          <line x1="268" y1="66" x2="268" y2="278" />
          <line x1="92" y1="122" x2="70" y2="122" />
          <line x1="92" y1="246" x2="70" y2="246" />
        </g>

        <g stroke={INK} strokeOpacity="0.8" strokeWidth="0.8">
          <line x1="92" y1="262" x2="268" y2="262" />
          <line x1="92" y1="252" x2="92" y2="272" />
          <line x1="268" y1="252" x2="268" y2="272" />
          <line x1="116" y1="52" x2="238" y2="52" />
          <line x1="116" y1="44" x2="116" y2="60" />
          <line x1="238" y1="44" x2="238" y2="60" />
          <line x1="76" y1="122" x2="76" y2="246" />
          <line x1="70" y1="122" x2="82" y2="122" />
          <line x1="70" y1="246" x2="82" y2="246" />
        </g>

        <g fill={INK} fillOpacity="0.8">
          <path d="M92 258 l7 4 -7 4 z" />
          <path d="M268 258 l-7 4 7 4 z" />
          <path d="M116 48 l7 4 -7 4 z" />
          <path d="M238 48 l-7 4 7 4 z" />
          <path d="M76 122 l-4 7 4 7 z" />
          <path d="M76 246 l-4 -7 4 -7 z" />
        </g>

        <text x="180" y="256" textAnchor="middle" fill={INK} className="font-mono" fontSize="9">160</text>
        <text x="177" y="45" textAnchor="middle" fill={INK} className="font-mono" fontSize="9">90</text>
        <text x="68" y="188" textAnchor="middle" fill={INK} className="font-mono" fontSize="9" transform="rotate(-90 68 188)">124</text>

        <path d="M248 94 L286 60 H330" fill="none" stroke={INK} strokeOpacity="0.6" strokeWidth="0.8" />
        <path d="M238 94 l-5 -3 5 -3" fill={INK} fillOpacity="0.6" />
        <text x="332" y="63" fill={INK} className="font-mono" fontSize="8">Ø20 THRU (2X)</text>

        <rect x="248" y="252" width="160" height="62" fill="hsl(var(--card))" stroke={INK} strokeOpacity="0.4" strokeWidth="0.8" />
        <g stroke={INK} strokeOpacity="0.25" strokeWidth="0.8">
          <line x1="248" y1="272" x2="408" y2="272" />
          <line x1="248" y1="292" x2="408" y2="292" />
          <line x1="320" y1="292" x2="320" y2="314" />
        </g>
        <text x="254" y="264" fill={INK} className="font-mono" fontSize="7.5">BRACKET-A · PLATE 6 THK</text>
        <text x="254" y="285" fill={INK} fillOpacity="0.55" className="font-mono" fontSize="6.5">DIMENSIONED FROM DATUM</text>
        <text x="254" y="306" fill={INK} fillOpacity="0.55" className="font-mono" fontSize="6.5">SCALE 1:2</text>
        <text x="326" y="306" fill={INK} fillOpacity="0.55" className="font-mono" fontSize="6.5">SHEET 1/1</text>
      </svg>
      <div className="flex items-center justify-between border-t border-hairline px-1 pt-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Project 01 · reference sheet</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">Reviewed</span>
      </div>
    </div>
  );
}