import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { fetchPulseGraph, type PulseGraph } from '../lib/cognation-data';
import { colors } from '../theme/colors';
import { body } from '../theme/typography';

const AVATAR = 52;

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

export function CircleScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 44, 380);
  const [graph, setGraph] = useState<PulseGraph>({ people: [], edges: [] });
  const [error, setError] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);
  const drops = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (!user) return;
    const r = await fetchPulseGraph(user.id);
    if (r.ok) setGraph(r.data);
    else setError(r.error);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const n = graph.people.length;
  const r = size / 2 - AVATAR / 2 - 8;
  const pos = graph.people.map((_, i) => {
    const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
    return { x: size / 2 + r * Math.cos(a), y: size / 2 + r * Math.sin(a) };
  });
  const byUser = new Map(graph.people.map((p, i) => [p.user_id, i]));

  while (drops.length < n) drops.push(new Animated.Value(reduce ? 0 : -900));
  useEffect(() => {
    if (!n) return;
    if (reduce) {
      drops.forEach((d) => d.setValue(0));
      return;
    }
    // Fall from top and bounce; staggered, whole ring settles in well under 1s.
    Animated.stagger(
      Math.min(40, 400 / n),
      drops.slice(0, n).map((d) =>
        Animated.timing(d, {
          toValue: 0,
          duration: 520,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [n, reduce, drops]);

  return (
    <ScreenShell title="PULSE" subtitle="Close community — small by design." halo>
      {error ? (
        <GlassCard accent="magenta">
          <Text style={styles.body}>{error}</Text>
        </GlassCard>
      ) : null}
      {user && n === 0 && !error ? (
        <GlassCard>
          <Text style={styles.body}>No connections yet. Add friends on Tower.</Text>
        </GlassCard>
      ) : null}
      {n > 0 ? (
        <View style={[styles.stage, { width: size, height: size }]}>
          <View style={[styles.halo, { width: size, height: size, borderRadius: size / 2 }]} />
          <View
            style={[
              styles.haloInner,
              { width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, left: size * 0.15, top: size * 0.15 },
            ]}
          />
          {graph.edges.map(([a, b]) => {
            const ia = byUser.get(a);
            const ib = byUser.get(b);
            if (ia == null || ib == null) return null;
            const p = pos[ia];
            const q = pos[ib];
            const len = Math.hypot(q.x - p.x, q.y - p.y);
            const ang = Math.atan2(q.y - p.y, q.x - p.x);
            return (
              <View
                key={`${a}|${b}`}
                pointerEvents="none"
                style={[
                  styles.line,
                  {
                    width: len,
                    left: (p.x + q.x) / 2 - len / 2,
                    top: (p.y + q.y) / 2,
                    transform: [{ rotate: `${ang}rad` }],
                  },
                ]}
              />
            );
          })}
          {graph.people.map((p, i) => (
            <Animated.View
              key={p.id}
              style={[
                styles.avatarWrap,
                { left: pos[i].x - AVATAR / 2, top: pos[i].y - AVATAR / 2, transform: [{ translateY: drops[i] }] },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${p.display_name}'s Tower`}
                style={styles.avatar}
                onPress={() => router.navigate({ pathname: '/', params: { handle: p.handle } })}
              >
                <Text style={styles.avatarText}>{initials(p.display_name)}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { ...body },
  stage: { alignSelf: 'center' },
  halo: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(61, 232, 255, 0.55)',
    shadowColor: colors.glow,
    shadowOpacity: 0.8,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: 'rgba(168, 85, 247, 0.06)',
  },
  haloInner: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(196, 167, 255, 0.4)',
    shadowColor: '#c5a6ff',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  line: { position: 'absolute', height: 1.5, backgroundColor: 'rgba(168, 244, 255, 0.45)' },
  avatarWrap: { position: 'absolute', width: AVATAR, height: AVATAR },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetSoft,
    borderWidth: 2,
    borderColor: colors.glow,
  },
  avatarText: { color: colors.lavender, fontSize: 17, fontWeight: '700' },
});
