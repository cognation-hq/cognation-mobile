# Cognation Mobile

Lean Expo (React Native) TypeScript **app shell** for Cognation — calm wellness aesthetic, side-drawer navigation, placeholder screens only.

No backend, no auth, no fake seed users. Navigation and UI scaffolding so you can open it in Expo Go and iterate.

## Screens (drawer)

| Screen | Role |
|--------|------|
| **Tower** | Home / personal base |
| **Commune** | 1:1 featured mix; nested stack → Classroom, Dating |
| **News** | Curated updates placeholder |
| **Circle** | Close community placeholder |
| **Profile** | You / settings placeholder |

**Under Commune** (not drawer roots): **Classroom** (learning), **Dating** (intentional connection) — opened via in-screen section links / nested stack.

Primary navigation is a **side drawer**, not bottom tabs. Visual language: dark navy, soft glow accents — not Instagram/TikTok feed patterns.

## One codebase, iOS + Android

This is a single React Native / Expo project. The same TypeScript sources run on **iOS and Android** (and optionally web). Later you can ship to the **App Store** and **Google Play** via EAS Build / native builds — not set up in this shell yet.

## Run with Expo Go

```bash
cd cognation-mobile
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your phone (same Wi‑Fi as the machine running Metro), or press `i` / `a` for simulators if you have them.

Useful scripts (from `package.json`):

- `npm start` → `expo start`
- `npm run ios` → `expo start --ios`
- `npm run android` → `expo start --android`
- `npm run web` → `expo start --web`
- `npm run typecheck` → `tsc --noEmit`

## Stack

- Expo SDK 57 + TypeScript (`blank-typescript` template)
- React Navigation drawer (`@react-navigation/drawer`) + nested native stack under Commune
- Local theme under `src/theme/`

## Out of scope (for later)

Backend, real Commune queue, ads, chat, matching, Classroom content, App Store / Play Store submission, Expo Router migration if desired.
