/**
 * Live Cognation reads — same tables/joins as website js/supabase-social.js.
 * Cap/seed ops stay on the website; this app only reads profiles + tower_posts.
 */
import { isSupabaseConfigured, supabase } from './supabase';
import {
  type AccountKind,
  type CognationProfile,
  type PostVisibility,
  type TowerPost,
  type TowerPostAuthor,
  type TowerPostRow,
} from './types';

const PROFILE_SELECT =
  'id,user_id,kind,handle,display_name,bio,account_kind,seed_fleet_id';

const TOWER_FEED_SELECT =
  'id,author_profile_id,body,visibility,attachments,created_at,author:profiles!tower_posts_author_profile_id_fkey(id,user_id,kind,handle,display_name,bio,account_kind)';

function normalizeHandle(value: string | null | undefined): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40);
}

function asAccountKind(value: unknown): AccountKind {
  if (value === 'seed' || value === 'ops' || value === 'real') return value;
  return 'real';
}

function unwrapAuthor(
  author: TowerPostRow['author'],
): TowerPostAuthor | null {
  if (!author) return null;
  return Array.isArray(author) ? (author[0] ?? null) : author;
}

function mapPost(row: TowerPostRow): TowerPost {
  const author = unwrapAuthor(row.author);
  return {
    id: String(row.id),
    authorProfileId: String(row.author_profile_id),
    authorName: String(author?.display_name || 'Cognation member').slice(0, 80),
    handle: normalizeHandle(author?.handle),
    body: String(row.body || ''),
    createdAt: String(row.created_at || ''),
    visibility: (row.visibility === 'public' ? 'public' : 'friends') as PostVisibility,
    accountKind: asAccountKind(author?.account_kind),
  };
}

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Profiles owned by the signed-in auth user (personal + optional professional).
 */
export async function fetchMyProfiles(
  userId: string,
): Promise<DataResult<CognationProfile[]>> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured.' };
  }
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('user_id', userId)
    .order('kind', { ascending: true });

  if (error) {
    return { ok: false, error: error.message };
  }
  const rows = (data ?? []) as CognationProfile[];
  return {
    ok: true,
    data: rows.map((row) => ({
      ...row,
      account_kind: asAccountKind(row.account_kind),
      handle: normalizeHandle(row.handle),
      display_name: String(row.display_name || 'Member').slice(0, 80),
      bio: String(row.bio || '').slice(0, 280),
    })),
  };
}

/**
 * Tower feed via RLS: public posts for anon; public + friends + own when signed in.
 * Prefer public-first browse for unsigned soft gate (same project as website).
 */
export async function fetchTowerFeed(
  limit = 40,
): Promise<DataResult<TowerPost[]>> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured.' };
  }
  const { data, error } = await supabase
    .from('tower_posts')
    .select(TOWER_FEED_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { ok: false, error: error.message };
  }
  const rows = (data ?? []) as TowerPostRow[];
  return { ok: true, data: rows.map(mapPost) };
}
