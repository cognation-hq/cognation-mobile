/**
 * Cognation social types — aligned with website supabase migrations
 * (profiles, tower_posts) and js/supabase-social.js select shapes.
 */

export type ProfileKind = 'personal' | 'professional';

/** SeedOps fleet marker on profiles (migration 20261002_seedops_account_kind). */
export type AccountKind = 'real' | 'seed' | 'ops';

export type PostVisibility = 'friends' | 'public';

export type CognationProfile = {
  id: string;
  user_id: string;
  kind: ProfileKind;
  handle: string;
  display_name: string;
  bio: string;
  account_kind?: AccountKind | null;
  seed_fleet_id?: string | null;
};

export type TowerPostAuthor = Pick<
  CognationProfile,
  'id' | 'user_id' | 'kind' | 'handle' | 'display_name' | 'bio' | 'account_kind'
>;

export type TowerPostRow = {
  id: string;
  author_profile_id: string;
  body: string;
  visibility: PostVisibility;
  attachments: unknown;
  created_at: string;
  author: TowerPostAuthor | TowerPostAuthor[] | null;
};

export type TowerPost = {
  id: string;
  authorProfileId: string;
  authorName: string;
  handle: string;
  body: string;
  createdAt: string;
  visibility: PostVisibility;
  accountKind: AccountKind;
};

export function isDemoAccount(kind: AccountKind | null | undefined): boolean {
  return kind === 'seed' || kind === 'ops';
}

export function demoBadgeLabel(kind: AccountKind | null | undefined): string | null {
  if (kind === 'ops') return 'Demo · ops';
  if (kind === 'seed') return 'Demo · seed';
  return null;
}
