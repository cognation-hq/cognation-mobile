import { StyleSheet, Text, View } from 'react-native';
import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';

export function TowerScreen() {
  return (
    <ScreenShell
      title="Tower"
      subtitle="Your quiet home base — presence over feed."
    >
      <ComingSoonBlock
        heading="Personal space"
        footer="Shell only — navigation chrome, no live Tower data."
      >
        Tower will hold your personal space and gentle overview. This shell is
        navigation-only for now.
      </ComingSoonBlock>
      <MockPanel
        title="Overview panel"
        hint="Empty glass card — content arrives later"
        accent="cyan"
      />
      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaText}>Presence</Text>
        </View>
        <View style={[styles.metaChip, styles.metaChipAlt]}>
          <Text style={[styles.metaText, styles.metaTextAlt]}>Overview</Text>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  metaChip: {
    backgroundColor: colors.glowSoft,
    borderWidth: 1,
    borderColor: colors.glowBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  metaChipAlt: {
    backgroundColor: colors.violetSoft,
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  metaText: {
    color: colors.glow,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  metaTextAlt: {
    color: colors.lavender,
  },
});
