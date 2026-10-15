import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DemoBadge } from '../components/DemoBadge';
import { GlassCard } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { isAdultKeyword } from '../lib/age-floor';
import { fetchTowerFeed } from '../lib/cognation-data';
import { fetchNews, type NewsEdition, type NewsItem } from '../lib/news';
import type { TowerPost } from '../lib/types';
import { colors } from '../theme/colors';
import { body, eyebrow, panelTitle } from '../theme/typography';

type Pane = 'news' | 'feed';

export function NewsScreen() {
  const [pane, setPane] = useState<Pane>('news');
  const [edition, setEdition] = useState<NewsEdition>('nationwide');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [feed, setFeed] = useState<TowerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    if (pane === 'news') {
      const r = await fetchNews(edition);
      if (r.ok) setNews(r.items);
      else setError(r.error);
    } else {
      const r = await fetchTowerFeed(40);
      // Under-13 floor (unknown age counts as under-13, same as web).
      if (r.ok) setFeed(r.data.filter((p) => !isAdultKeyword(p.body)));
      else setError(r.error);
    }
  }, [pane, edition]);

  useEffect(() => {
    setLoading(true);
    void load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load().finally(() => setRefreshing(false));
  }, [load]);

  const [lead, ...rest] = news;

  return (
    <ScreenShell
      title="SIGNAL"
      subtitle="Thoughtful updates — not a dopamine feed."
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.glow} />
      }
    >
      <View style={styles.pipe} accessibilityRole="tablist">
        {(['news', 'feed'] as Pane[]).map((p, i) => (
          <View key={p} style={styles.pipeRow}>
            {i > 0 ? <Text style={styles.pipeBar}>|</Text> : null}
            <Pressable
              style={styles.pipeHit}
              onPress={() => setPane(p)}
              accessibilityRole="tab"
              accessibilityState={{ selected: pane === p }}
            >
              <Text style={[styles.pipeText, pane === p && styles.pipeActive]}>
                {p === 'news' ? 'News' : 'Feed'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      {pane === 'news' ? (
        <View style={styles.editions}>
          {(['nationwide', 'international'] as NewsEdition[]).map((e) => (
            <Pressable
              key={e}
              style={[styles.chip, edition === e && styles.chipOn]}
              onPress={() => setEdition(e)}
            >
              <Text style={[styles.chipText, edition === e && styles.chipTextOn]}>
                {e === 'nationwide' ? 'Nationwide' : 'International'}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {loading ? <ActivityIndicator color={colors.glow} /> : null}
      {error ? (
        <GlassCard accent="magenta">
          <Text style={styles.body}>{error}</Text>
        </GlassCard>
      ) : null}

      {!loading && pane === 'news' && lead ? (
        <GlassCard accent="violet">
          <Text style={styles.eyebrow}>COGNATION · NEWS</Text>
          <Pressable onPress={() => lead.link && void Linking.openURL(lead.link)}>
            <Text style={styles.headline}>{lead.title}</Text>
          </Pressable>
          {lead.summary ? <Text style={styles.body}>{lead.summary}</Text> : null}
          <Text style={styles.meta}>{lead.source}</Text>
        </GlassCard>
      ) : null}
      {!loading && pane === 'news'
        ? rest.map((it) => (
            <Pressable key={it.link || it.title} onPress={() => it.link && void Linking.openURL(it.link)}>
              <GlassCard>
                <Text style={styles.story}>{it.title}</Text>
                <Text style={styles.meta}>{it.source}</Text>
              </GlassCard>
            </Pressable>
          ))
        : null}

      {!loading && pane === 'feed'
        ? feed.map((post) => (
            <GlassCard key={post.id}>
              <View style={styles.row}>
                <Text style={styles.author}>{post.authorName}</Text>
                <DemoBadge accountKind={post.accountKind} />
              </View>
              <Text style={styles.body}>{post.body}</Text>
            </GlassCard>
          ))
        : null}
      {!loading && !error && pane === 'feed' && feed.length === 0 ? (
        <GlassCard>
          <Text style={styles.body}>No signals yet.</Text>
        </GlassCard>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pipe: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10, 8, 22, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(196, 167, 255, 0.45)',
    borderRadius: 22,
    paddingHorizontal: 8,
  },
  pipeRow: { flexDirection: 'row', alignItems: 'center' },
  pipeHit: { minHeight: 44, minWidth: 64, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  pipeBar: { color: colors.textDim },
  pipeText: { color: colors.textDim, fontWeight: '600', fontSize: 15 },
  pipeActive: { color: colors.lavender },
  editions: { flexDirection: 'row', gap: 8 },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.glowBorder,
  },
  chipOn: { backgroundColor: colors.violetSoft },
  chipText: { color: colors.textDim, fontSize: 15, fontWeight: '600' },
  chipTextOn: { color: colors.lavender },
  eyebrow: { ...eyebrow, marginBottom: 8 },
  headline: { ...panelTitle, fontSize: 22, lineHeight: 28, marginBottom: 8 },
  story: { ...panelTitle, fontSize: 16, lineHeight: 22 },
  body: { ...body, fontSize: 15 },
  meta: { color: colors.textDim, fontSize: 13, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  author: { ...panelTitle, fontSize: 16 },
});
