# Cognation Mobile

Lean Expo (React Native) TypeScript app for Cognation — calm wellness aesthetic, side-drawer navigation, **Supabase auth** (slice 1).

No public Demo unlock, no SeedOps secrets, no Instagram/copycat feed patterns.

## Screens (drawer)

| Screen | Role |
|--------|------|
| **Tower** | Home / personal base |
| **Commune** | 1:1 featured mix; nested stack → Classroom, Dating |
| **News** | Curated updates placeholder |
| **Circle** | Close community placeholder |
| **Profile** | Sign in / sign up / sign out + settings placeholder |

**Under Commune** (not drawer roots): **Classroom** (learning), **Dating** (intentional connection) — opened via in-screen section links / nested stack.

Primary navigation is a **side drawer**, not bottom tabs. Visual language: dark navy, soft glow accents.

## Environment (Supabase auth)

Same Cognation Supabase project as the website.

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

Scan the QR with **Expo Go** (same Wi‑Fi), open **Profile** in the drawer:

- Without env: “Env not set” card.
- With env: Sign in / Sign up form → create or use a real Cognation account → Signed in shows email → Sign out clears session.
- Soft note when unsigned: other drawer screens stay browsable (no hard redirect wall).

Useful scripts:

- `npm start` → `expo start`
- `npm run ios` / `android` / `web`
- `npm run typecheck` → `tsc --noEmit`

## Stack

- Expo SDK 57 + TypeScript
- React Navigation drawer + nested native stack under Commune
- `@supabase/supabase-js` + `expo-sqlite` session storage
- Local theme under `src/theme/`

## Roadmap (out of this slice)

| Slice | Scope |
|-------|--------|
| 2 | Expo Router migration |
| 3 | Full Tower / Profile data wire |
| 4 | EAS builds |

Also later: Commune queue, ads, chat, matching, Classroom content, App Store / Play submission.
