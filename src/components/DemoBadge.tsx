import { StyleSheet, Text, View } from 'react-native';
import { demoBadgeLabel, type AccountKind } from '../lib/types';
import { colors } from '../theme/colors';

type Props = {
  accountKind?: AccountKind | null;
};

/** Visible Demo/Seed marker — mirrors website seedops-badge.js (no unlock cheat). */
export function DemoBadge({ accountKind }: Props) {
  const label = demoBadgeLabel(accountKind);
  if (!label) return null;
  return (
    <View style={styles.badge} accessibilityLabel={label}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.orangeSoft,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 61, 0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
