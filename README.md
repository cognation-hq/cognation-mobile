# Cognation Mobile

Lean Expo (React Native) TypeScript app for Cognation — calm wellness aesthetic, **Expo Router** side-drawer navigation, **Supabase auth**, live **Profile / Tower** data, and **EAS Build** config (slices 1–4).

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
- EAS: `npx eas-cli@latest build --profile preview --platform android` (after login + `eas init`)


## EAS Build (slice 4)

Cloud native builds via [Expo Application Services](https://docs.expo.dev/build/introduction/) — no local Xcode / Android Studio required for CI-style binaries. This repo ships `eas.json` profiles and native IDs; **linking an Expo project and running a paid/cloud build is a follow-up** for Alexa / Eng with an Expo account (no `EXPO_TOKEN` or secrets in git).

### Profiles (`eas.json`)

| Profile | Purpose |
|---------|---------|
| **development** | Dev client (`expo-dev-client`), internal distribution |
| **preview** | Internal shareable build (Android APK); first stakeholder smoke |
| **production** | Store-oriented; auto-increments version on EAS (`appVersionSource: remote`) |

### One-time: link Expo account + EAS project

1. Create / use an Expo account at [expo.dev](https://expo.dev) (org account preferred for Cognation).
2. From this repo:

```bash
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest init          # creates/links EAS project; writes extra.eas.projectId into app.json
```

3. Commit the resulting `app.json` `extra.eas.projectId` (UUID from Expo — not a secret). Do **not** commit `.env`, credentials, or `EXPO_TOKEN`.

Native IDs already set for first configure:

- iOS `bundleIdentifier`: `com.cognation.mobile`
- Android `package`: `com.cognation.mobile`

Change them only if Cognation owns different store IDs.

### Supabase env on EAS builds

Local Metro uses `.env` (`EXPO_PUBLIC_*`). Cloud builds do **not** see gitignored `.env`. After the EAS project exists, set secrets on Expo (dashboard **Environment variables**, or CLI), mirrored per profile `environment` (`development` / `preview` / `production`):

```bash
npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_URL --value 'https://YOUR_REF.supabase.co' --environment preview --visibility sensitive
npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value 'YOUR_ANON_KEY' --environment preview --visibility sensitive
```

Repeat for `development` / `production` as needed. Never put real keys in `eas.json` `env` blocks.

### First preview build (recommended smoke)

```bash
npx eas-cli@latest build --profile preview --platform android
# or iOS simulator-friendly later: add ios.simulator on a profile, or use internal + device
npx eas-cli@latest build --profile preview --platform ios
```

When the build finishes, open the Expo build page → **Install** (internal distribution). Android preview produces an **APK** for sideload.

Development client (optional):

```bash
npx eas-cli@latest build --profile development --platform android
```

Then `npx expo start --dev-client` against that install.

Production / store submit is out of this slice (`eas submit` after Apple / Play credentials).

### CLI tip

Prefer `npx eas-cli@latest …` (see `AGENTS.md`) so the CLI matches current Expo docs without pinning a global install.

## Stack

- Expo SDK 57 + TypeScript
- **Expo Router** drawer + nested stack under Commune (`src/app/`)
- `@supabase/supabase-js` + `expo-sqlite` session storage
- Shared Cognation tables: `profiles`, `tower_posts` (website migrations / `js/supabase-social.js` shapes)
- Local theme under `src/theme/`
- **EAS Build** (`eas.json` + `expo-dev-client`) — projectId linked via `eas init`

## Roadmap (out of this slice)

| Slice | Scope |
|-------|--------|
| 1 | ✅ Supabase auth |
| 2 | ✅ Expo Router migration |
| 3 | ✅ Profile / Tower data wire |
| 4 | ✅ EAS init (`eas.json` + runbook; link projectId on first `eas init`) |

Also later: Commune queue, ads, chat, matching, Classroom content, App Store / Play submission.
