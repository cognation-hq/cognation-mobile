/**
 * Cognation holographic chrome — dark void + prismatic accents.
 * Adapted from site CGN-040 / CGN-042 for mobile dark UX (not luminous pearl).
 * Navigation-only shell; intentionally not feed/social-first.
 */
export const colors = {
  /** Deep indigo void (site --color-holo-depth) */
  background: '#0B0620',
  /** Glass panel base */
  surface: 'rgba(18, 24, 48, 0.78)',
  surfaceSolid: '#121830',
  surfaceElevated: 'rgba(28, 36, 68, 0.88)',
  surfaceElevatedSolid: '#1C2444',
  /** Soft cyan glow border */
  border: 'rgba(61, 232, 255, 0.28)',
  borderSoft: 'rgba(61, 232, 255, 0.14)',
  borderMagenta: 'rgba(255, 77, 219, 0.22)',

  /** Electric cyan primary (site --color-accent / holo-cyan) */
  glow: '#3DE8FF',
  glowBright: '#00E5FF',
  glowSoft: 'rgba(61, 232, 255, 0.18)',
  glowMuted: 'rgba(61, 232, 255, 0.08)',
  glowBorder: 'rgba(61, 232, 255, 0.35)',

  /** Magenta / violet iridescence */
  accent: '#FF4DDB',
  accentSoft: 'rgba(255, 77, 219, 0.16)',
  violet: '#A855F7',
  violetSoft: 'rgba(168, 85, 247, 0.18)',
  violetHover: '#C77DFF',
  lavender: '#C4B5FD',
  sky: '#7DD3FC',
  pearl: '#F5D0FE',
  /** Neon orange — use sparingly */
  orange: '#FF6A3D',
  orangeSoft: 'rgba(255, 106, 61, 0.14)',

  text: '#E8EEF8',
  textMuted: '#9AA8C0',
  textDim: '#6B7A94',
  /** Near-black ink for cyan-filled chips / selected chrome */
  ink: '#061018',

  drawerBg: '#0A0518',
  drawerActive: 'rgba(61, 232, 255, 0.12)',
  headerBg: 'rgba(11, 6, 32, 0.92)',

  statusBar: 'light' as const,
};

/** Site --holo-title-fill stops (for web CSS / layered glow) */
export const holoGradient = {
  css: 'linear-gradient(135deg, #3DE8FF 0%, #7DD3FC 22%, #C4B5FD 48%, #FF4DDB 72%, #A855F7 100%)',
  stops: ['#3DE8FF', '#7DD3FC', '#C4B5FD', '#FF4DDB', '#A855F7'] as const,
};
