import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';

const extra: any = (Constants as any).expoConfig?.extra || (Constants as any).manifest?.extra || {};
console.log('DEBUG extra:', extra);
console.log('DEBUG TENANT:', extra.tenant);
const MS_CLIENT_ID = 'f6a9843a-5e99-41a5-88f1-34466204cb13';
const TENANT = 'e4e92fef-2d65-4067-b53d-79120c33e2f3';  
const SCOPES: string[] = Array.isArray(extra.scopes) ? extra.scopes : String(extra.scopes || 'User.Read').split(',');
const REDIRECT_SCHEME = extra.redirectScheme || 'connectiq';
const REDIRECT_PATH = extra.redirectPath || 'auth';


const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
  revocationEndpoint: `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/logout`,
};

export async function getTokenAsync(): Promise<string> {
  const isExpoGo = (Constants as any).executionEnvironment === 'storeClient';
  // Redirect strategy:
  // - If explicit exp:// override is provided, use it with no proxy (works only if Azure accepts that URI).
  // - Otherwise: Expo Go uses Expo Auth Proxy (Azure redirect should be https://auth.expo.io/@anonymous/<slug>),
  //   and dev client/standalone uses native scheme connectiq://auth (no proxy).
  let redirectUri = makeRedirectUri({ scheme: REDIRECT_SCHEME, path: REDIRECT_PATH });
  let useProxy = isExpoGo;
  const authorityUrl = `https://login.microsoftonline.com/${TENANT}`;
  console.log('Native scheme redirect URI:', redirectUri);
  console.log('Authority URL:', authorityUrl);
  

  const request = new AuthSession.AuthRequest({
    clientId: MS_CLIENT_ID,
    responseType: AuthSession.ResponseType.Code,
    scopes: SCOPES,
    redirectUri,
    usePKCE: true,
    extraParams: {
      login_hint: 'anand.krishnan20@harman.com',
    },
  });

  await request.makeAuthUrlAsync(discovery);
  const result = await (request as any).promptAsync(discovery, { useProxy });

  if (result.type !== 'success' || !result.params.code) {
    throw new Error('Authentication failed');
  }

  const tokenRes = await AuthSession.exchangeCodeAsync(
    {
      clientId: MS_CLIENT_ID,
      code: result.params.code,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier! },
    },
    { tokenEndpoint: discovery.tokenEndpoint }
  );

  if (!tokenRes.accessToken) {
    throw new Error('Token exchange failed');
  }

  return tokenRes.accessToken;
}

export async function signOutAsync() {
  // On mobile, you typically clear local state or use native MSAL signout.
  return true;
}

export async function getUser(token: string) {
  const res = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Graph error: ${res.status}`);
  return res.json();
}
