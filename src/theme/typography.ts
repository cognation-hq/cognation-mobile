import { Platform, TextStyle } from 'react-native';
import { colors, holoGradient } from './colors';

/** Uppercase display title (Oswald-like tracking) */
export const displayTitle: TextStyle = {
  fontSize: 28,
  fontWeight: '700',
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: colors.text,
};

/** Section / panel title */
export const panelTitle: TextStyle = {
  fontSize: 18,
  fontWeight: '600',
  letterSpacing: 0.4,
  color: colors.text,
};

/** Eyebrow / coming-soon label */
export const eyebrow: TextStyle = {
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  color: colors.glow,
};

/** Body copy on glass */
export const body: TextStyle = {
  fontSize: 15,
  lineHeight: 23,
  color: colors.textMuted,
};

/**
 * Holographic wordmark: gradient text on web; cyan + layered glow elsewhere.
 */
export function holoWordmarkStyle(size = 24): TextStyle {
  const base: TextStyle = {
    fontSize: size,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  };

  if (Platform.OS === 'web') {
    return {
      ...base,
      color: 'transparent',
      ...( {
        backgroundImage: holoGradient.css,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter:
          'drop-shadow(0 0 10px rgba(61,232,255,0.55)) drop-shadow(0 0 18px rgba(255,77,219,0.35))',
      } as TextStyle),
    };
  }

  return {
    ...base,
    color: colors.glow,
    textShadowColor: 'rgba(255, 77, 219, 0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  };
}
