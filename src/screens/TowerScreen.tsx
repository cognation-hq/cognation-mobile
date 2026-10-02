import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { DemoBadge } from '../components/DemoBadge';
import { GlassCard } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { fetchTowerFeed } from '../lib/cognation-data';
import { isSupabaseConfigured } from '../lib/supabase';
import type { TowerPost } from '../lib/types';
import { colors } from '../theme/colors';
import { body, eyebrow, panelTitle } from '../theme/typography';

function formatPostTime(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export function TowerScreen() {
  const { user, configured } = useAuth();
  const [posts, setPosts] = useState<TowerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setPosts([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetchTowerFeed(40);
    setLoading(false);
    if (!result.ok) {
      setPosts([]);
      setError(result.error);
      return;
    }
    setPosts(result.data);
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed, user?.id]);

  const subtitle = user
    ? 'Live Tower feed from Cognation Supabase.'
    : 'Public Tower posts (soft browse) — sign in for friends feed too.';

  return (
    <ScreenShell title="Tower" subtitle={subtitle}>
      {!configured ? (
        <GlassCard accent="violet">
          <Text style={styles.label}>Tower feed</Text>
          <Text style={styles.heading}>Env not set</Text>
          <Text style={styles.body}>
            Copy `.env.example` to `.env` with{' '}
            <Text style={styles.mono}>EXPO_PUBLIC_SUPABASE_URL</Text> and{' '}
            <Text style={styles.mono}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>, then
            restart Expo. Same project as the Cognation website.
          </Text>
        </GlassCard>
      ) : null}

      {configured ? (
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>
              {user ? 'Session feed' : 'Public browse'}
            </Text>
          </View>
          <View style={[styles.metaChip, styles.metaChipAlt]}>
            <Text style={[styles.metaText, styles.metaTextAlt]}>
              {loading ? '…' : `${posts.length} post${posts.length === 1 ? '' : 's'}`}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.metaChip,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              void loadFeed();
            }}
            disabled={loading}
          >
            <Text style={styles.metaText}>Refresh</Text>
          </Pressable>
        </View>
      ) : null}

      {configured && loading ? (
        <GlassCard>
          <View style={styles.centered}>
            <ActivityIndicator color={colors.glow} />
            <Text style={styles.hint}>Loading Tower…</Text>
          </View>
        </GlassCard>
      ) : null}

      {configured && error ? (
        <GlassCard accent="magenta">
          <Text style={styles.label}>Could not load</Text>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
            onPress={() => {
              void loadFeed();
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </GlassCard>
      ) : null}

      {configured && !loading && !error && posts.length === 0 ? (
        <GlassCard>
          <Text style={styles.label}>Tower</Text>
          <Text style={styles.heading}>No posts yet</Text>
          <Text style={styles.body}>
            {user
              ? 'RLS returned no visible posts for this session. Public and friends posts from the website appear here when available.'
              : 'No public Tower posts visible unsigned. Sign in on Profile for friends + your own posts, or post from the website.'}
          </Text>
        </GlassCard>
      ) : null}

      {configured &&
        !loading &&
        posts.map((post) => (
          <GlassCard key={post.id}>
            <View style={styles.postHeader}>
              <View style={styles.postIdentity}>
                <Text style={styles.author}>{post.authorName}</Text>
                <DemoBadge accountKind={post.accountKind} />
              </View>
              <Text style={styles.time}>{formatPostTime(post.createdAt)}</Text>
            </View>
            {post.handle ? (
              <Text style={styles.handle}>@{post.handle}</Text>
            ) : null}
            <Text style={styles.postBody}>{post.body}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.visibility}>
                {post.visibility === 'public' ? 'Public' : 'Friends'}
              </Text>
            </View>
          </GlassCard>
        ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: {
    ...eyebrow,
    marginBottom: 10,
  },
  heading: {
    ...panelTitle,
    marginBottom: 8,
  },
  body: {
    ...body,
  },
  mono: {
    color: colors.lavender,
    fontFamily: 'monospace',
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  hint: {
    ...body,
    fontSize: 13,
  },
  error: {
    color: colors.orange,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  retry: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.glowBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.glowMuted,
  },
  retryText: {
    color: colors.glow,
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  postIdentity: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  author: {
    ...panelTitle,
    fontSize: 16,
  },
  handle: {
    color: colors.sky,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  time: {
    color: colors.textDim,
    fontSize: 12,
  },
  postBody: {
    ...body,
    color: colors.text,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  visibility: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
});
