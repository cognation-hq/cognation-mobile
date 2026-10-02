import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { GlassCard } from '../components/GlassCard';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';
import type { CommuneStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const MIX_SLOTS = ['Classroom', 'Ad', 'Chat', 'Dating', 'Content'] as const;

type Dest = {
  screen: 'Classroom' | 'Dating';
  label: string;
  blurb: string;
  accent: 'cyan' | 'magenta';
};

const DESTINATIONS: Dest[] = [
  {
    screen: 'Classroom',
    label: 'Classroom',
    blurb: 'Learn at a human pace — lessons & sessions.',
    accent: 'cyan',
  },
  {
    screen: 'Dating',
    label: 'Dating',
    blurb: 'Intentional connection — not swipes as sport.',
    accent: 'magenta',
  },
];

export function CommuneScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommuneStackParamList>>();

  return (
    <ScreenShell
      title="Commune"
      subtitle="One-to-one featured mix — not an endless scroll."
    >
      <ComingSoonBlock
        label="1:1 featured mix"
        heading="Placeholder"
        accent="magenta"
        footer="Shell only — no live queue, ads, or matching yet."
      >
        <Text style={styles.body}>
          Commune surfaces a calm, intentional mix of moments across Cognation —
          one at a time. Slots in this mix:
        </Text>
        <View style={styles.chips}>
          {MIX_SLOTS.map((slot) => (
            <View key={slot} style={styles.chip}>
              <Text style={styles.chipText}>{slot}</Text>
            </View>
          ))}
        </View>
      </ComingSoonBlock>

      <Text style={styles.sectionLabel}>Open under Commune</Text>
      <View style={styles.destList}>
        {DESTINATIONS.map((dest) => (
          <Pressable
            key={dest.screen}
            accessibilityRole="button"
            accessibilityLabel={`Open ${dest.label}`}
            onPress={() => navigation.navigate(dest.screen)}
            style={({ pressed }) => pressed && styles.destPressed}
          >
            <GlassCard accent={dest.accent}>
              <Text
                style={[
                  styles.destTitle,
                  dest.accent === 'magenta' && styles.destTitleMagenta,
                ]}
              >
                {dest.label}
              </Text>
              <Text style={styles.destBlurb}>{dest.blurb}</Text>
              <Text
                style={[
                  styles.destCue,
                  dest.accent === 'magenta' && styles.destCueMagenta,
                ]}
              >
                Open →
              </Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>

      <MockPanel
        title="Featured slot"
        hint="One card at a time — not a feed"
        accent="magenta"
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.glowMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.glow,
    fontSize: 13,
    fontWeight: '500',
  },
  sectionLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 2,
  },
  destList: {
    gap: 12,
  },
  destPressed: {
    opacity: 0.85,
  },
  destTitle: {
    color: colors.glow,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  destTitleMagenta: {
    color: colors.accent,
  },
  destBlurb: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  destCue: {
    color: colors.glowBright,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  destCueMagenta: {
    color: colors.pearl,
  },
});
