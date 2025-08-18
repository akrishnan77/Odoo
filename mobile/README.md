# ConnectIQ Mobile (Expo)

This is a minimal native mobile client (Android/iOS) built with Expo. It signs in with Microsoft and calls Microsoft Graph to fetch the current user.

## Prereqs
- Node.js LTS
- Expo CLI (`npm i -g expo` optional)
- An Azure App Registration configured for mobile auth

## Configure Azure App Registration
- Platforms: add Android and iOS
- Android redirect URI: `msauth://com.connectiq.app/<YOUR_SIGNATURE_HASH>` (Expo dev uses AuthSession; see below)
- iOS redirect URI: `msauth.<BUNDLE_ID>://auth`
- Allow these scopes: `User.Read`, `Tasks.ReadWrite`, `Files.ReadWrite`

For Expo AuthSession (no native modules), we’ll use the system browser with a custom scheme.

1. In `app.json`, set:
   - `scheme`: `connectiq`
   - `android.package`: `com.connectiq.app`
2. In Azure, add redirect URI: `connectiq://auth` (type: Mobile)

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install` inside `mobile/`.
3. Start: `npx expo start -c`

## Files
- `App.tsx` – App entry; handles sign-in and basic screen.
- `src/auth.ts` – Auth helpers using Expo AuthSession for MSAL-like flow.
- `src/graph.ts` – Minimal Graph fetch with access token.
- `app.json` – Expo app config.

## Notes
- This is a starter. Integrate more screens and reuse logic from the web app.
- For production Play Store, build an AAB: `eas build -p android` (requires EAS setup).

## Redirects (Expo Go vs Dev Client)
- Dev client/native: use `connectiq://auth` and add that Mobile redirect URI in Azure.
- Expo Go: either use the Expo Auth Proxy (recommended, add `https://auth.expo.io/@anonymous/connectiq-mobile` in Azure),
  or explicitly override with your exp:// URL.

To force an exp:// redirect (Expo Go), set in `app.json` under `expo.extra`:

```
"expRedirectUri": "exp://j_bv00o-anonymous-8081.exp.direct/--/auth"
```

When `expRedirectUri` is set, the app will use it and disable the proxy.

## npm start