const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
    HUB_DEFAULT_BASE_URL,
    DEFAULT_PRODUCT_SLUG,
    AUTH_POLL_INTERVAL_MS,
    HUB_STORAGE_KEY,
    PRODUCT_STORAGE_KEY,
    normalizeHubBaseUrl,
    buildUserStatusUrl,
    buildLoginUrl,
    buildLogoutUrl,
    buildOnboardingUrl,
    normalizeAuthStatus,
    resolveAuthPresentation,
    setAuthUiState,
    resolveRuntimeConfig,
    persistRuntimeConfig,
    createAuthClient,
    initAuth,
} = require('../auth.js');

test('normalizeHubBaseUrl trims and removes trailing slashes', () => {
    assert.equal(normalizeHubBaseUrl(' https://example.com/// '), 'https://example.com');
    assert.equal(normalizeHubBaseUrl(''), HUB_DEFAULT_BASE_URL);
});

test('buildUserStatusUrl includes encoded product slug', () => {
    const url = buildUserStatusUrl('https://hub.example', 'smart ws');
    assert.equal(url, 'https://hub.example/api/v1/user/status?product=smart%20ws');
});

test('phase 3 url helpers build login/logout endpoints', () => {
    assert.equal(buildLoginUrl('https://hub.example/'), 'https://hub.example/auth/login');
    assert.equal(buildLogoutUrl('https://hub.example/'), 'https://hub.example/api/v1/auth/sign-out');
    assert.equal(buildOnboardingUrl('https://hub.example/'), 'https://hub.example/onboarding');
});

test('resolveAuthPresentation maps FREE onboarding state from payload', () => {
    const presentation = resolveAuthPresentation({
        status: 'FREE',
        raw: {
            onboardingRequired: true,
            onboardingLink: 'https://hub.example/onboarding',
        },
    }, 'https://hub.example');

    assert.equal(presentation.status, 'FREE');
    assert.equal(presentation.locked, true);
    assert.equal(presentation.actionUrl, 'https://hub.example/onboarding');
    assert.equal(presentation.actionLabel, '🚀 Continue Onboarding');
});

test('normalizeAuthStatus maps payload and http fallback correctly', () => {
    assert.equal(normalizeAuthStatus('pro', 200), 'PRO');
    assert.equal(normalizeAuthStatus('free', 200), 'FREE');
    assert.equal(normalizeAuthStatus(null, 401), 'ANONYMOUS');
    assert.equal(normalizeAuthStatus(null, 404), 'FREE');
    assert.equal(normalizeAuthStatus('mystery', 200), 'UNKNOWN');
});

test('createAuthClient checkStatus calls fetch with credentials include', async () => {
    let capturedUrl = '';
    let capturedOptions = null;

    const fakeFetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
            ok: true,
            status: 200,
            async json() {
                return { status: 'PRO', product: 'smart-ws' };
            },
        };
    };

    const client = createAuthClient({
        baseUrl: 'https://simple-eq-hub.vercel.app',
        productSlug: DEFAULT_PRODUCT_SLUG,
        fetchImpl: fakeFetch,
    });

    const result = await client.checkStatus();

    assert.equal(capturedUrl, 'https://simple-eq-hub.vercel.app/api/v1/user/status?product=smart-ws');
    assert.equal(capturedOptions.credentials, 'include');
    assert.equal(capturedOptions.cache, 'no-store');
    assert.equal(result.ok, true);
    assert.equal(result.status, 'PRO');
});

test('createAuthClient logout calls sign-out endpoint with credentials include', async () => {
    let capturedUrl = '';
    let capturedOptions = null;

    const fakeFetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
            ok: true,
            status: 200,
            async json() {
                return { ok: true };
            },
        };
    };

    const client = createAuthClient({
        baseUrl: 'https://simple-eq-hub.vercel.app',
        productSlug: DEFAULT_PRODUCT_SLUG,
        fetchImpl: fakeFetch,
    });

    const result = await client.logout();

    assert.equal(capturedUrl, 'https://simple-eq-hub.vercel.app/api/v1/auth/sign-out');
    assert.equal(capturedOptions.credentials, 'include');
    assert.equal(capturedOptions.method, 'POST');
    assert.equal(capturedOptions.cache, 'no-store');
    assert.equal(result.ok, true);
    assert.equal(result.status, 'ANONYMOUS');
});

test('phase 1 wiring exists in manifest and newtab', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const manifestPath = path.join(projectRoot, 'manifest.json');
    const newtabPath = path.join(projectRoot, 'newtab.html');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const newtabHtml = fs.readFileSync(newtabPath, 'utf8');

    assert.ok(Array.isArray(manifest.host_permissions));
    assert.ok(manifest.host_permissions.includes('https://simple-eq-hub.vercel.app/*'));
    assert.ok(manifest.host_permissions.includes('http://localhost:3000/*'));
    assert.ok(newtabHtml.includes('<script src="auth.js"></script>'));
});

test('phase 2 auth UI shell exists in newtab', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const newtabPath = path.join(projectRoot, 'newtab.html');
    const newtabHtml = fs.readFileSync(newtabPath, 'utf8');

    assert.ok(newtabHtml.includes('id="authWidget"'));
    assert.ok(newtabHtml.includes('id="authOverlay"'));
    assert.ok(newtabHtml.includes('id="authLoginBtn"'));
    assert.ok(newtabHtml.includes('id="authLogoutBtn"'));
    assert.ok(newtabHtml.includes('id="authOverlayLoginBtn"'));
    assert.ok(newtabHtml.includes('id="authOverlayRefreshBtn"'));
    assert.ok(newtabHtml.includes('id="authOverlayMeta"'));
});

test('phase 3 exports runtime init and polling config', () => {
    assert.equal(typeof initAuth, 'function');
    assert.equal(Number.isInteger(AUTH_POLL_INTERVAL_MS), true);
    assert.ok(AUTH_POLL_INTERVAL_MS >= 30_000);
});

test('setAuthUiState applies logout loading state and disables controls', () => {
    const elements = {
        statusBadge: { classList: { remove() {}, add() {} }, textContent: '' },
        loginBtn: { style: { display: '' }, disabled: false },
        logoutBtn: { style: { display: '' }, disabled: false, textContent: '' },
        overlay: { style: { display: '' } },
        overlayTitle: { textContent: '' },
        overlayText: { textContent: '' },
        overlayMeta: { textContent: '' },
        overlayLoginBtn: { textContent: '', disabled: false },
        overlayRefreshBtn: { disabled: false },
    };

    setAuthUiState({ status: 'FREE' }, elements, {
        baseUrl: 'https://hub.example',
        logoutBusy: true,
    });

    assert.equal(elements.logoutBtn.disabled, true);
    assert.equal(elements.logoutBtn.textContent, '⏳ Logging out...');
    assert.equal(elements.loginBtn.disabled, true);
    assert.equal(elements.overlayLoginBtn.disabled, true);
    assert.equal(elements.overlayRefreshBtn.disabled, true);
});

test('setAuthUiState restores logout button label when not busy', () => {
    const elements = {
        statusBadge: { classList: { remove() {}, add() {} }, textContent: '' },
        loginBtn: { style: { display: '' }, disabled: false },
        logoutBtn: { style: { display: '' }, disabled: true, textContent: '⏳ Logging out...' },
        overlay: { style: { display: '' } },
        overlayTitle: { textContent: '' },
        overlayText: { textContent: '' },
        overlayMeta: { textContent: '' },
        overlayLoginBtn: { textContent: '', disabled: true },
        overlayRefreshBtn: { disabled: true },
    };

    setAuthUiState({ status: 'PRO' }, elements, {
        baseUrl: 'https://hub.example',
        logoutBusy: false,
    });

    assert.equal(elements.logoutBtn.disabled, false);
    assert.equal(elements.logoutBtn.textContent, '🚪 Logout');
    assert.equal(elements.overlayLoginBtn.disabled, false);
    assert.equal(elements.overlayRefreshBtn.disabled, false);
});

test('phase 4 resolveRuntimeConfig prioritizes query and storage values', () => {
    const storage = new Map();
    const fakeScope = {
        location: {
            search: '?hub=http://localhost:3000&product=smart-ws-dev',
        },
        localStorage: {
            getItem(key) {
                return storage.has(key) ? storage.get(key) : null;
            },
            setItem(key, value) {
                storage.set(key, String(value));
            },
        },
    };

    const cfgFromQuery = resolveRuntimeConfig(fakeScope);
    assert.equal(cfgFromQuery.baseUrl, 'http://localhost:3000');
    assert.equal(cfgFromQuery.productSlug, 'smart-ws-dev');

    fakeScope.location.search = '';
    persistRuntimeConfig('http://127.0.0.1:3000/', 'smart-ws-local', fakeScope);
    const cfgFromStorage = resolveRuntimeConfig(fakeScope);
    assert.equal(cfgFromStorage.baseUrl, 'http://127.0.0.1:3000');
    assert.equal(cfgFromStorage.productSlug, 'smart-ws-local');
});

test('phase 4 createAuthClient picks runtime config from global scope', () => {
    const storage = new Map([
        [HUB_STORAGE_KEY, 'http://localhost:3000'],
        [PRODUCT_STORAGE_KEY, 'smart-ws-local'],
    ]);

    const client = createAuthClient({
        globalScope: {
            location: { search: '' },
            localStorage: {
                getItem(key) {
                    return storage.has(key) ? storage.get(key) : null;
                },
                setItem(key, value) {
                    storage.set(key, String(value));
                },
            },
        },
        fetchImpl: async () => ({ ok: true, status: 200, async json() { return { status: 'PRO' }; } }),
    });

    assert.equal(client.baseUrl, 'http://localhost:3000');
    assert.equal(client.productSlug, 'smart-ws-local');
    assert.equal(client.runtimeSource.baseUrl, 'local-storage');
    assert.equal(client.runtimeSource.productSlug, 'local-storage');
});
