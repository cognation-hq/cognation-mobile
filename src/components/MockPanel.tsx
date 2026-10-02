import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { GlassCard } from './GlassCard';

type Props = {
  title: string;
  hint: string;
  accent?: 'cyan' | 'magenta' | 'violet';
};

/**
 * Light site-card-shaped placeholder — clearly empty chrome, not a fake feed.
 */
export function MockPanel({ title, hint, accent = 'cyan' }: Props) {
  return (
    <GlassCard accent={accent} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.lines}>
        <View style={[styles.line, { width: '72%' }]} />
        <View style={[styles.line, { width: '54%', opacity: 0.65 }]} />
        <View style={[styles.line, { width: '40%', opacity: 0.4 }]} />
      </View>
      <Text style={styles.hint}>{hint}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    opacity: 0.95,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  lines: {
    gap: 8,
    marginBottom: 14,
  },
  line: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.glowMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
