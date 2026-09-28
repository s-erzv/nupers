/** A late-night desk scene, drawn in the site's own tokens so it follows the theme. */
export default function DeskIllustration() {
  return (
    <svg className="desk" viewBox="0 0 480 560" role="img" aria-labelledby="desk-title">
      <title id="desk-title">Illustration of a cozy desk at night: a laptop full of code, a hanging bulb, a mug of tea and a plant</title>
      <defs>
        <radialGradient id="desk-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--amber)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--amber)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="desk-window">
          <rect x="52" y="56" width="176" height="196" rx="20" />
        </clipPath>
      </defs>

      {/* room */}
      <rect width="480" height="560" rx="32" className="d-wall" />
      <circle cx="356" cy="160" r="170" fill="url(#desk-glow)" className="d-glow" />

      {/* window */}
      <g clipPath="url(#desk-window)">
        <rect x="52" y="56" width="176" height="196" className="d-sky" />
        <g className="d-stars">
          <circle cx="82" cy="92" r="2" />
          <circle cx="120" cy="140" r="1.6" />
          <circle cx="98" cy="200" r="1.8" />
          <circle cx="200" cy="210" r="1.5" />
          <circle cx="150" cy="84" r="1.4" />
        </g>
        <g className="d-moon">
          <circle cx="178" cy="112" r="24" />
          <circle cx="190" cy="104" r="22" className="d-sky" />
        </g>
        <circle cx="176" cy="112" r="26" className="d-sun" />
        <path d="M52 232 q40 -26 80 -8 t96 -6 V252 H52z" className="d-hills" />
      </g>
      <rect x="52" y="56" width="176" height="196" rx="20" className="d-frame" />
      <path d="M140 56 V252 M52 154 H228" className="d-frame" />

      {/* sticky notes */}
      <g transform="rotate(-6 275 175)">
        <rect x="250" y="150" width="50" height="50" rx="6" fill="var(--lime)" />
        <path d="M260 168 h30 M260 178 h22 M260 188 h26" stroke="#1c2a0c" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      </g>
      <g transform="rotate(5 284 230)">
        <rect x="262" y="208" width="44" height="44" rx="6" fill="var(--lavender)" />
        <path d="M272 224 l6 6 l12 -12" stroke="#1a1c46" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* hanging bulb */}
      <path d="M356 0 V96" className="d-cord" />
      <rect x="346" y="94" width="20" height="18" rx="4" className="d-socket" />
      <path d="M340 112 h32 l4 10 q14 14 14 32 a34 34 0 0 1 -68 0 q0 -18 14 -32z" className="d-bulb" />
      <path d="M350 146 q6 -10 12 0" className="d-filament" />

      {/* shelf with books */}
      <rect x="300" y="282" width="140" height="10" rx="5" className="d-wood" />
      <rect x="318" y="246" width="16" height="36" rx="3" fill="var(--lavender)" />
      <rect x="336" y="254" width="14" height="28" rx="3" fill="var(--amber)" />
      <rect x="352" y="242" width="18" height="40" rx="3" fill="var(--lime)" />
      <rect x="380" y="262" width="36" height="18" rx="4" className="d-surface" transform="rotate(-8 398 271)" />

      {/* desk */}
      <rect x="24" y="452" width="432" height="20" rx="10" className="d-wood" />
      <rect x="52" y="472" width="14" height="88" rx="4" className="d-wood-dark" />
      <rect x="414" y="472" width="14" height="88" rx="4" className="d-wood-dark" />

      {/* plant */}
      <path d="M58 452 l6 -44 h44 l6 44z" fill="var(--amber)" />
      <g fill="var(--lime)">
        <ellipse cx="86" cy="374" rx="10" ry="30" transform="rotate(-8 86 374)" />
        <ellipse cx="66" cy="384" rx="9" ry="26" transform="rotate(-38 66 384)" />
        <ellipse cx="106" cy="386" rx="9" ry="24" transform="rotate(34 106 386)" />
      </g>

      {/* laptop */}
      <g className="d-laptop">
        <rect x="150" y="318" width="196" height="128" rx="12" className="d-screen-frame" />
        <rect x="160" y="328" width="176" height="108" rx="6" className="d-screen" />
        <g strokeLinecap="round" strokeWidth="6">
          <path d="M174 346 h40" stroke="var(--lavender)" />
          <path d="M222 346 h54" stroke="#efedfb" opacity="0.5" />
          <path d="M186 364 h30" stroke="var(--lime)" />
          <path d="M224 364 h70" stroke="#efedfb" opacity="0.35" />
          <path d="M186 382 h58" stroke="var(--amber)" />
          <path d="M198 400 h44" stroke="var(--lavender)" />
          <path d="M250 400 h30" stroke="var(--lime)" />
          <path d="M174 418 h24" stroke="var(--lavender)" />
        </g>
        <rect x="206" y="411" width="4" height="14" rx="1" fill="#efedfb" className="d-caret" />
        <path d="M130 446 h236 a6 6 0 0 1 -6 6 h-224 a6 6 0 0 1 -6 -6z" className="d-surface" />
      </g>

      {/* mug */}
      <g>
        <path d="M384 410 q-6 -16 0 -26 M398 408 q-6 -14 0 -26" className="d-steam" />
        <rect x="370" y="412" width="42" height="40" rx="9" fill="var(--lime)" />
        <path d="M412 422 h6 a10 10 0 0 1 0 20 h-6" fill="none" stroke="var(--lime)" strokeWidth="6" />
        <rect x="378" y="424" width="12" height="12" rx="6" fill="#1c2a0c" opacity="0.25" />
      </g>
    </svg>
  )
}
