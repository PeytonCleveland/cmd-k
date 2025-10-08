# @dorado.dev/cmd-k

A drop-in **command-palette style** assistant for your app.  
Connects directly to **Dorado** (your AI runtime) for chat, streaming, RAG, and tools—**no secrets in the browser**.

- ⚡️ Plug & play: mount a component, pass your `projectId` & a user JWT getter.
- 💬 Realtime: token-level streaming (SSE) with auto-reconnect.
- 📚 Grounded: works with Dorado Knowledge Bases (RAG) when your assistant is configured to retrieve.
- 🛠 Tools: renders tool call states and results (when enabled server-side).
- 🧭 Keyboard-first: “cmd-k” palette UI with accessible navigation.
- 🌍 Anywhere: talks to Dorado Cloud or your on-prem/classified deployment.

---

## Quick start

### 1) Install

```bash
npm i @dorado/cmd-k
# or
yarn add @dorado/cmd-k
# or
pnpm add @dorado/cmd-k
```

### 2) Configure Dorado (one-time per project)

In the **Dorado Console → Project → End-User Auth**:

1. **Mode:** `JWT`
2. **Issuer:** your IdP issuer (e.g., `https://acme.okta.com/oauth2/default`)
3. **JWKS URI:** your IdP JWKS endpoint
4. **Audience:** add `dorado:<project_id>` (or your chosen audience)
5. **Claim mapping:**
   - `externalUserId` ← `sub`
   - (optional) `email` ← `email`, `name` ← `name`
6. **CORS:** add your app origin(s), e.g., `https://app.acme.com`

> Dorado will validate incoming `Authorization: EndUser <USER_IDP_JWT>` against this config.

**Required claims in the user JWT:** `iss`, `aud` (must include your Dorado audience), `sub`, `exp`.

---

## Usage

```tsx
import { CmdK } from "@dorado/cmd-k";

export default function App() {
  return (
    <CmdK
      projectId="proj_12345678-90ab-cdef-1234-567890abcdef"
      assistantId="asst_abc"
      getUserToken={async () => {
        // Return the user's IdP JWT (ID token preferred).
        const token = await myAuthLib.getIdToken();
        return token;
      }}
    />
  );
}
```

That’s it—you have a working assistant with streaming responses.  
No Dorado API keys are ever exposed to the browser.

---

## Auth patterns by IdP

> Use whichever yields a short-lived JWT with `iss/aud/sub/exp`.

### NextAuth (Next.js)

```ts
import { getSession } from "next-auth/react";
export async function getUserToken() {
  const session = await getSession();
  return session?.idToken ?? ""; // configure your NextAuth provider to include an ID token
}
```

### Auth0 (SPA)

```ts
import { useAuth0 } from "@auth0/auth0-react";
const { getIdTokenClaims } = useAuth0();

async function getUserToken() {
  const claims = await getIdTokenClaims();
  return claims.__raw; // raw ID token JWT
}
```

### Okta

```ts
import { OktaAuth } from "@okta/okta-auth-js";
const okta = new OktaAuth({ /* config */ });

async function getUserToken() {
  const { tokens } = await okta.tokenManager.getTokens();
  return tokens.idToken?.idToken || ""; // prefer ID token
}
```

### Azure AD (MSAL)

```ts
import { PublicClientApplication } from "@azure/msal-browser";
const msal = new PublicClientApplication(msalConfig);

async function getUserToken() {
  const accounts = msal.getAllAccounts();
  const req = { scopes: ["openid", "profile"], account: accounts[0] };
  const { idToken } = await msal.acquireTokenSilent(req);
  return idToken;
}
```

---

## Component props

```ts
type CmdKProps = {
  /** Dorado project that holds auth config & resources */
  projectId: string;

  /** Assistant to use (model, system prompt, tools/RAG config live server-side) */
  assistantId: string;

  /** Return a fresh EndUser JWT from your IdP (short-lived) */
  getUserToken: () => Promise<string>;

  /** Optional: Dorado API base (defaults to window.location-based or https://api.dorado.dev/v1) */
  apiBaseUrl?: string;

  /** Optional: seed metadata saved on Dorado sessions/messages */
  initialMetadata?: Record<string, unknown>;

  /** Called when authentication fails (JWT invalid/expired/CORS) */
  onAuthError?: (err: unknown) => void;

  /** Called for run-level lifecycle (created/started/completed/errored) */
  onRunEvent?: (evt: { type: string; data?: unknown }) => void;

  /** Provide your own className or style overrides */
  className?: string;

  /** i18n/localization overrides */
  locale?: string;
};
```

### What it sends to Dorado

- `Authorization: EndUser <USER_IDP_JWT>`
- `X-Dorado-Project-Id: <projectId>`
- JSON body per API (see OpenAPI).  
It uses:
- `POST /v1/assistants/{assistant_id}:stream` for live responses (SSE)
- `POST /v1/assistants/{assistant_id}:respond` for one-shot (fallback)
- `POST /v1/sessions` and `POST /v1/sessions/{id}/messages` under the hood to persist conversation

Each write includes an **Idempotency-Key** header to avoid duplicate runs on flaky networks.

---

## Styling & UX

- **Command palette** UX (⌘K / Ctrl+K to open), full keyboard navigation.
- **Theming:** component is unstyled primitives by default + minimal sensible styles. Add your CSS or Tailwind classes by passing `className` or targeting data attributes.
- **A11y:** ARIA roles for listbox/menu/dialog, focus traps, screen-reader labels.

---

## Examples

### Minimal (one-liner)

```tsx
<CmdK
  projectId={PROJECT_ID}
  assistantId={ASSISTANT_ID}
  getUserToken={() => auth.getIdToken()}
/>
```

### With custom container + events

```tsx
<CmdK
  className="fixed bottom-4 right-4 w-[420px] rounded-xl shadow-xl"
  projectId={PROJECT_ID}
  assistantId={ASSISTANT_ID}
  getUserToken={getUserToken}
  initialMetadata={{ app: "dashboard", plan: "pro" }}
  onRunEvent={(e) => {
    if (e.type === "run.completed") console.log("Tokens:", e.data);
  }}
  onAuthError={(e) => toast.error("Sign in to use the assistant")}
/>
```

---

## Security notes

- **Never** pass Dorado API keys to the client. This package does not accept an apiKey prop.
- Ensure your IdP JWT is **short-lived** (≤ 60 minutes; 5–15 ideal).
- Lock CORS in Dorado to your app origins.
- Use opaque `sub` (no PII) as the stable external user id; store PII in `end_users.profile` if desired.
- If your JWT `aud` isn’t `dorado:<project_id>`, set the expected audience in Dorado to match your IdP.

---

## Troubleshooting

**401 `jwt_invalid_audience`**  
Your token’s `aud` doesn’t match Dorado’s expected audience. Update Dorado Project → End-User Auth to include your token audience, or configure your IdP to issue `aud = dorado:<project_id>`.

**401 `jwks_signature_mismatch`**  
Dorado can’t validate the signature. Check the Issuer/JWKS URI in project settings; make sure you’re passing an ID token from the same issuer.

**403 `project_not_configured_for_jwt`**  
Enable JWT mode in Dorado and add your issuer/JWKS/audience.

**CORS error in browser**  
Add your app origin to Dorado’s allowed origins list.

**Streams don’t update**  
Corporate proxies sometimes buffer SSE. The component auto-retries with `respond` as a fallback; consider proxying via your backend if SSE is blocked.

---

## FAQ

**ID token or access token?**  
Prefer **ID token** (more predictable claims). Access tokens can work if their `aud`/issuer are configured.

**Multi-tenant apps?**  
Pass the right `projectId` per tenant; configure each Dorado project with that tenant’s IdP.

**Can I bring my own UI?**  
Yes. `@dorado/sdk` (coming alongside) offers typed client calls. This component is for zero-lift UI.

---

## Roadmap (MVP → near term)

- [ ] File upload & inline citations UI (when assistant retrieval returns sources)
- [ ] Tool call UI affordances (pending/accepted/failed states, input forms)
- [ ] Theming tokens + dark mode primitives
- [ ] i18n strings externalization
- [ ] Optional WebSocket transport (alongside SSE)

---

## Development

```bash
pnpm i
pnpm dev     # storybook/dev playground
pnpm build   # typecheck + bundle
```

---

## License

AGPL-3.0

