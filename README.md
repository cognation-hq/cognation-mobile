# Cognation Mobile

Lean Expo (React Native) TypeScript app for Cognation — calm wellness aesthetic, **Expo Router** side-drawer navigation, **Supabase auth**, and live **Profile / Tower** data (slices 1–3).

No public Demo unlock, no SeedOps secrets, no Instagram/copycat feed patterns.

## Screens (drawer)

| Screen | Role |
|--------|------|
| **Tower** | Home — live `tower_posts` feed (public browse unsigned; friends + own when signed in) |
| **Commune** | 1:1 featured mix; nested stack → Classroom, Dating |
| **News** | Curated updates placeholder |
| **Circle** | Close community placeholder |
| **Profile** | Sign in / sign up / sign out + live `profiles` row (name, handle, Demo badge) |

**Under Commune** (not drawer roots): **Classroom** (`/commune/classroom`), **Dating** (`/commune/dating`) — opened via in-screen section links / nested stack.

Primary navigation is a **side drawer**, not bottom tabs. Visual language: dark navy, soft glow accents.

Routes live under `src/app/` (Expo Router file-based). Non-route code stays in `src/` (`auth/`, `screens/`, `components/`, `theme/`, `lib/`).

## Environment (Supabase)

Same Cognation Supabase project as the website (`dkyplmnlgmbrhfunhnfm` patterns).

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Set:

| Variable | Notes |
|----------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://dkyplmnlgmbrhfunhnfm.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Publishable / anon key from Supabase → Project Settings → API Keys |

`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is accepted as an alias for the key (Expo docs name).

3. Restart Metro after changing env (`npx expo start`). Expo only inlines `EXPO_PUBLIC_*` vars.

**Never commit** `.env` / real keys. Only `.env.example` (placeholders) is in git.

Session storage uses **expo-sqlite** `localStorage` (Expo SDK 57 recommended persistence for Supabase Auth).

## Run with Expo Go (smoke)

```bash
cd cognation-mobile
npm install
cp .env.example .env   # then fill real URL + anon key
npx expo start
```

Entry is `expo-router/entry` (see `package.json` `main`). Scan the QR with **Expo Go** (same Wi‑Fi).

### Verify Profile + Tower (slice 3)

1. **Env**: Without `.env`, Profile and Tower show “Env not set”. With env + restart, auth and feeds work.
2. **Profile (unsigned)**: Soft browse note; AuthPanel sign-in form. Other drawer screens remain open.
3. **Profile (signed in)**: AuthPanel email + Sign out. **Your profile** card loads from `profiles` (display name, `@handle`, bio, email). If `account_kind` is `seed` / `ops`, a **Demo** badge appears (no unlock cheat).
4. **Tower (unsigned)**: Soft public browse — RLS returns `visibility = public` posts. Seed/ops authors show Demo badge.
5. **Tower (signed in)**: Same feed query; RLS also includes friends + your own posts. Pull **Refresh** after posting from the website.
6. Cap / seed fleet ops stay on the website — this app only reads.

Useful scripts:

- `npm start` → `expo start`
- `npm run ios` / `android` / `web`
- `npm run typecheck` → `tsc --noEmit`

## Stack

- Expo SDK 57 + TypeScript
- **Expo Router** drawer + nested stack under Commune (`src/app/`)
- `@supabase/supabase-js` + `expo-sqlite` session storage
- Shared Cognation tables: `profiles`, `tower_posts` (website migrations / `js/supabase-social.js` shapes)
- Local theme under `src/theme/`

## Roadmap (out of this slice)

| Slice | Scope |
|-------|--------|
| 1 | ✅ Supabase auth |
| 2 | ✅ Expo Router migration |
| 3 | ✅ Profile / Tower data wire |
| 4 | EAS builds |

Also later: Commune queue, ads, chat, matching, Classroom content, App Store / Play submission.
