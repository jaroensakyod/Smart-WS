# Nexus Auth Phase 4 Manual Test (Smart-WS)

## Objective
Validate Nexus connection behavior after Phase 4 runtime configurability.

## Runtime Config
Phase 4 supports these sources (priority order):
1. `window.__SMARTWS_AUTH_CONFIG__ = { baseUrl, productSlug }`
2. `window.__SMARTWS_HUB_BASE_URL__` / `window.__SMARTWS_PRODUCT_SLUG__`
3. Query params on New Tab URL: `?hub=<url>&product=<slug>`
4. `localStorage` keys:
   - `smartws_hub_base_url`
   - `smartws_product_slug`
5. Defaults (`https://simple-eq-hub.vercel.app`, `smart-ws`)

## Manual Verification Steps
1. Load extension (`Load unpacked`) and open new tab.
2. Set local target for Hub (optional local test):
   - Open DevTools Console and run:
     - `localStorage.setItem('smartws_hub_base_url', 'http://localhost:3000')`
     - `localStorage.setItem('smartws_product_slug', 'smart-ws')`
   - Refresh new tab.
3. Verify ANONYMOUS guard:
   - Overlay is visible.
   - Login button appears.
4. Click login and authenticate on Hub.
5. Return to Smart-WS tab:
   - Overlay disappears.
   - Status badge shows `PRO` (or `FREE` if no license).
   - Logout button appears.
6. In Hub admin, revoke Smart-WS license.
7. Wait up to 45 seconds (poll interval) or refresh manually.
8. Verify lock behavior:
   - Status changes from `PRO` to `FREE`/`Guest` based on backend response.
   - Overlay appears if backend returns anonymous.

## Pass Criteria
- Login flow opens correct Hub URL.
- Cookie-based status check works with `credentials: include`.
- Polling reflects license changes within 45 seconds.
- Logout triggers sign-out endpoint and refreshes guard state.
