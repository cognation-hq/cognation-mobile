import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { fetchWidgetLayout, type WidgetPos } from '../lib/cognation-data';
import type { CognationProfile } from '../lib/types';
import { colors } from '../theme/colors';
import { body, eyebrow } from '../theme/typography';

/** Same rows as web js/tower.js SPAWN_ROWS; a row of two is left | right.
 *  (avatar/identity/slogan live in the profile card.) */
const SPAWN_ROWS: Record<'personal' | 'professional', string[][]> = {
  personal: [['music'], ['friends', 'social'], ['badges', 'calendar'], ['polaroid', 'html'], ['instax']],
  professional: [['youtube'], ['social', 'badges'], ['followers', 'calendar'], ['html']],
};
/** Web FACTORY_SEED_LAYOUTS: x/y never chosen by the owner, so treated as unplaced. */
const FACTORY: Record<string, [number, number]>[] = [
  { social: [2, 22], music: [2, 28], youtube: [2, 28], badges: [2, 38], friends: [2, 52], followers: [2, 52], html: [22, 3], calendar: [55, 28], polaroid: [40, 6], instax: [62, 4] },
  { social: [4, 26], music: [4, 34], badges: [4, 44], friends: [4, 56], html: [28, 4] },
];
function isFactory(id: string, p: WidgetPos): boolean {
  return FACTORY.some((f) => f[id] && f[id][0] === p.x && f[id][1] === p.y);
}
const PROFILE_CARD = new Set(['avatar', 'identity', 'slogan', 'feed', 'messages', 'going-live']);
const LABELS: Record<string, string> = {
  music: 'Music',
  youtube: 'YouTube',
  social: 'Links',
  badges: 'Badges',
  friends: 'Top friends',
  followers: 'Followers',
  calendar: 'Calendar',
  polaroid: 'Polaroid',
  html: 'Custom HTML',
  instax: 'Instax',
};
/** Web stage: x/y are % of the stage. Assumed web stage aspect (h / w). */
const WEB_ASPECT = 1.4;
/** A web half-column widget ≈ 46% of stage width. */
const WIDGET_W = 0.46;

function label(id: string): string {
  return LABELS[id] ?? id.replace(/[-_]/g, ' ');
}

/** Read-only Tower widgets: the saved web layout scaled to the phone, or the default order. */
export function TowerWidgets({ profile }: { profile: CognationProfile }) {
  const { width } = useWindowDimensions();
  const stageW = width - 44;
  const [layout, setLayout] = useState<Record<string, WidgetPos> | null>(null);

  useEffect(() => {
    setLayout(null);
    void fetchWidgetLayout(profile.id).then((r) => setLayout(r.ok ? r.data : null));
  }, [profile.id]);

  const placed = layout
    ? Object.entries(layout).filter(([id, p]) => !PROFILE_CARD.has(id) && !isFactory(id, p))
    : [];

  // Like the web: no owner-placed widget → the default grid, never absolute boxes.
  if (!placed.length) {
    return (
      <View style={styles.column} accessibilityLabel="Tower widgets, read only">
        {SPAWN_ROWS[profile.kind].map((row) => (
          <View key={row.join('|')} style={styles.row}>
            {row.map((id) => (
              <View key={id} style={[styles.card, styles.cell]}>
                <Text style={styles.title}>{label(id)}</Text>
                <Text style={styles.hint}>On the website</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  const stageH = stageW * WEB_ASPECT;
  const w = stageW * WIDGET_W;
  const maxY = Math.max(...placed.map(([, p]) => p.y));
  const height = Math.min(stageH, (maxY / 100) * stageH + 120);
  return (
    <View
      style={[styles.stage, { width: stageW, height }]}
      accessibilityLabel="Tower widgets, read only"
    >
      {placed
        .sort((a, b) => a[1].z - b[1].z)
        .map(([id, p]) => (
          <View
            key={id}
            pointerEvents="none"
            style={[
              styles.card,
              styles.abs,
              {
                width: w,
                left: Math.min((p.x / 100) * stageW, stageW - w),
                top: (p.y / 100) * stageH,
                zIndex: Math.round(p.z),
                transform: [{ rotate: `${p.tilt}deg` }],
              },
            ]}
          >
            <Text style={styles.title}>{label(id)}</Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  cell: { flex: 1 },
  stage: { position: 'relative' },
  abs: { position: 'absolute', minHeight: 72 },
  card: {
    backgroundColor: 'rgba(16, 19, 48, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(209, 241, 255, 0.28)',
    borderRadius: 18,
    padding: 14,
  },
  title: { ...eyebrow },
  hint: { ...body, fontSize: 15, marginTop: 4 },
});
