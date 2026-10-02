import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  /** Magenta-tinted border accent instead of cyan */
  accent?: 'cyan' | 'magenta' | 'violet';
};

export function GlassCard({ children, style, accent = 'cyan' }: Props) {
  const borderColor =
    accent === 'magenta'
      ? colors.borderMagenta
      : accent === 'violet'
        ? 'rgba(168, 85, 247, 0.32)'
        : colors.glowBorder;

  return (
    <View style={[styles.outer, { borderColor }, style]}>
      <View style={[styles.sheen, accent === 'cyan' && styles.sheenCyan]} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    // Soft cyan elevation glow
    shadowColor: colors.glowBright,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  sheenCyan: {
    shadowColor: colors.glow,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  inner: {
    padding: 20,
  },
});
