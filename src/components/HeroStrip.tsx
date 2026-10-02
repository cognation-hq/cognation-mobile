import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

/** Thin prismatic accent bar under screen titles */
export function HeroStrip() {
  return (
    <View style={styles.wrap}>
      <View style={[styles.seg, { flex: 2.2, backgroundColor: colors.glow }]} />
      <View style={[styles.seg, { flex: 1.4, backgroundColor: colors.sky }]} />
      <View style={[styles.seg, { flex: 1.6, backgroundColor: colors.lavender }]} />
      <View style={[styles.seg, { flex: 1.2, backgroundColor: colors.accent }]} />
      <View style={[styles.seg, { flex: 1, backgroundColor: colors.violet }]} />
      <View style={[styles.seg, { flex: 0.5, backgroundColor: colors.orange, opacity: 0.85 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 4,
    maxWidth: 220,
    opacity: 0.9,
    shadowColor: colors.glow,
    shadowOpacity: 0.55,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  seg: {
    height: '100%',
  },
});
