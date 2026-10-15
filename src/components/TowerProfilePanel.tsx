import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  fetchMyProfiles,
  fetchProfileByHandle,
  fetchProfilePosts,
  searchProfiles,
} from '../lib/cognation-data';
import type { CognationProfile, ProfileKind, TowerPost } from '../lib/types';
import { colors } from '../theme/colors';
import { body, eyebrow, panelTitle } from '../theme/typography';
import { DemoBadge } from './DemoBadge';
import { GlassCard } from './GlassCard';
import { TowerWidgets } from './TowerWidgets';

type Props = {
  userId: string | null;
  /** Bumped by pull-to-refresh to re-fetch. */
  refreshKey: number;
  /** True while a profile (own or searched) is showing, so the feed hides. */
  onShowingProfile: (showing: boolean) => void;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Tower profile: Personal | Professional switch, people search, profile + posts. */
export function TowerProfilePanel({ userId, refreshKey, onShowingProfile }: Props) {
  const [side, setSide] = useState<ProfileKind>('personal');
  const [mine, setMine] = useState<CognationProfile[]>([]);
  const [viewed, setViewed] = useState<CognationProfile | null>(null);
  const [posts, setPosts] = useState<TowerPost[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CognationProfile[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { handle } = useLocalSearchParams<{ handle?: string }>();

  // PULSE ring taps open a person's Tower via ?handle=.
  useEffect(() => {
    if (!handle) return;
    void fetchProfileByHandle(String(handle)).then((r) => {
      if (r.ok && r.data) {
        setSide(r.data.kind);
        setViewed(r.data);
      }
    });
  }, [handle]);

  useEffect(() => {
    if (!userId) {
      setMine([]);
      return;
    }
    void fetchMyProfiles(userId).then((r) => setMine(r.ok ? r.data : []));
  }, [userId, refreshKey]);

  const own = mine.find((p) => p.kind === side) ?? null;
  const shown = viewed ?? own;

  useEffect(() => {
    onShowingProfile(!!shown);
    if (!shown) {
      setPosts([]);
      return;
    }
    void fetchProfilePosts(shown.id).then((r) => setPosts(r.ok ? r.data : []));
  }, [shown?.id, refreshKey, onShowingProfile]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const t = setTimeout(() => {
      void searchProfiles(term, side, userId ?? undefined).then((r) => {
        setResults(r.ok ? r.data : []);
        setSearchError(r.ok ? null : r.error);
      });
    }, 200);
    return () => clearTimeout(t);
  }, [query, side, userId, refreshKey]);

  const pickSide = useCallback((next: ProfileKind) => {
    setSide(next);
    setViewed(null);
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={styles.pipe}>
        {(['personal', 'professional'] as ProfileKind[]).map((k, i) => (
          <View key={k} style={styles.pipeRow}>
            {i > 0 ? <Text style={styles.pipeBar}>|</Text> : null}
            <Pressable onPress={() => pickSide(k)} accessibilityRole="button">
              <Text style={[styles.pipeText, side === k && styles.pipeActive]}>
                {k === 'personal' ? 'Personal' : 'Professional'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <TextInput
        style={styles.search}
        placeholder={side === 'personal' ? 'Search friends and people' : 'Search professional pages'}
        placeholderTextColor={colors.textDim}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query.trim() ? (
        <GlassCard>
          {searchError ? <Text style={styles.body}>{searchError}</Text> : null}
          {!searchError && results.length === 0 ? (
            <Text style={styles.body}>No one found on this side.</Text>
          ) : null}
          {results.map((p) => (
            <Pressable
              key={p.id}
              style={styles.result}
              onPress={() => {
                setViewed(p);
                setQuery('');
              }}
            >
              <Text style={styles.name}>{p.display_name}</Text>
              <Text style={styles.handle}>@{p.handle}</Text>
              <DemoBadge accountKind={p.account_kind ?? 'real'} />
            </Pressable>
          ))}
        </GlassCard>
      ) : null}

      {shown ? (
        <GlassCard accent="violet">
          {viewed ? (
            <Pressable onPress={() => setViewed(null)}>
              <Text style={styles.back}>‹ Back</Text>
            </Pressable>
          ) : null}
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(shown.display_name)}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.name}>{shown.display_name}</Text>
              <Text style={styles.handle}>@{shown.handle}</Text>
              <DemoBadge accountKind={shown.account_kind ?? 'real'} />
            </View>
          </View>
          {shown.bio ? <Text style={styles.body}>{shown.bio}</Text> : null}
        </GlassCard>
      ) : userId ? (
        <GlassCard>
          <Text style={styles.label}>{side === 'personal' ? 'Personal' : 'Professional'}</Text>
          <Text style={styles.body}>No {side} page yet. Create one on the website.</Text>
        </GlassCard>
      ) : null}

      {shown ? <TowerWidgets profile={shown} /> : null}

      {shown
        ? posts.map((post) => (
            <GlassCard key={post.id}>
              <Text style={styles.body}>{post.body}</Text>
            </GlassCard>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  pipe: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10, 8, 22, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(196, 167, 255, 0.45)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pipeRow: { flexDirection: 'row', alignItems: 'center' },
  pipeBar: { color: colors.textDim, marginHorizontal: 10 },
  pipeText: { color: colors.textDim, fontWeight: '600', fontSize: 13 },
  pipeActive: { color: colors.lavender },
  search: {
    borderWidth: 1,
    borderColor: colors.glowBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    backgroundColor: colors.glowSoft,
  },
  result: { paddingVertical: 8, gap: 2 },
  identity: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetSoft,
    borderWidth: 1,
    borderColor: colors.glowBorder,
  },
  avatarText: { color: colors.lavender, fontSize: 22, fontWeight: '700' },
  flex: { flex: 1, gap: 2 },
  label: { ...eyebrow, marginBottom: 8 },
  name: { ...panelTitle, fontSize: 17 },
  handle: { color: colors.sky, fontSize: 13, fontWeight: '600' },
  body: { ...body },
  back: { color: colors.glow, fontWeight: '600', marginBottom: 8 },
});
