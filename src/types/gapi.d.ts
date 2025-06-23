interface GoogleAuthBasicProfile {
  getId(): string;
  getName(): string;
  getGivenName(): string;
  getFamilyName(): string;
  getImageUrl(): string;
  getEmail(): string;
}

interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  first_issued_at: number;
  expires_at: number;
}

interface GoogleUser {
  getBasicProfile(): GoogleAuthBasicProfile;
  getAuthResponse(includeAuthorizationData?: boolean): GoogleAuthResponse;
  grant(options?: object): Promise<any>;
  grantOfflineAccess(options?: object): Promise<any>;
  isSignedIn(): boolean;
}

interface GoogleAuth {
  isSignedIn: {
    get(): boolean;
    listen(callback: (isSignedIn: boolean) => void): void;
  };
  currentUser: {
    get(): GoogleUser;
    listen(callback: (user: GoogleUser) => void): void;
  };
  signIn(options?: {
    prompt?: string;
    ux_mode?: string;
    redirect_uri?: string;
    scope?: string;
  }): Promise<GoogleUser>;
  signOut(): Promise<void>;
  disconnect(): Promise<void>;
}

interface LoadOptions {
  callback: () => void;
  onerror: (error: any) => void;
  timeout?: number;
  ontimeout?: () => void;
}

interface GapiAuth2 {
  init(params: {
    client_id: string;
    scope?: string;
    cookie_policy?: string;
    login_hint?: string;
    hosted_domain?: string;
    fetch_basic_profile?: boolean;
    ux_mode?: 'popup' | 'redirect';
    redirect_uri?: string;
  }): Promise<GoogleAuth>;
  getAuthInstance(): GoogleAuth;
  authorize(params?: object, callback?: () => void): void;
  signIn(params?: object, callback?: () => void): void;
}

interface GapiClient {
  init(params: {
    apiKey?: string;
    discoveryDocs?: string[];
    clientId?: string;
    scope?: string;
  }): Promise<void>;
  request(args: object): Promise<any>;
}

interface Gapi {
  load(apiName: string, options?: LoadOptions | (() => void)): void;
  auth2: GapiAuth2;
  client: GapiClient;
}

declare global {
  interface Window {
    gapi: Gapi;
  }
}
