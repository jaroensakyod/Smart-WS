const HUB_DEFAULT_BASE_URL = 'https://simple-eq-hub.vercel.app';
const DEFAULT_PRODUCT_SLUG = 'smart-ws';
const AUTH_POLL_INTERVAL_MS = 45_000;

function normalizeHubBaseUrl(input) {
    if (typeof input !== 'string') return HUB_DEFAULT_BASE_URL;
    const trimmed = input.trim();
    if (!trimmed) return HUB_DEFAULT_BASE_URL;
    return trimmed.replace(/\/+$/, '');
}

function normalizeProductSlug(input) {
    if (typeof input !== 'string') return DEFAULT_PRODUCT_SLUG;
    const trimmed = input.trim();
    return trimmed || DEFAULT_PRODUCT_SLUG;
}

function buildUserStatusUrl(baseUrl, productSlug = DEFAULT_PRODUCT_SLUG) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    const safeSlug = encodeURIComponent(normalizeProductSlug(productSlug));
    return `${safeBaseUrl}/api/v1/user/status?product=${safeSlug}`;
}

function buildLoginUrl(baseUrl) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    return `${safeBaseUrl}/login`;
}

function buildLogoutUrl(baseUrl) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    return `${safeBaseUrl}/api/v1/auth/sign-out`;
}

function normalizeAuthStatus(rawStatus, httpStatus) {
    if (typeof rawStatus === 'string' && rawStatus.trim()) {
        const upper = rawStatus.trim().toUpperCase();
        if (upper === 'PRO') return 'PRO';
        if (upper === 'FREE') return 'FREE';
        if (upper === 'ANONYMOUS') return 'ANONYMOUS';
        return 'UNKNOWN';
    }

    if (httpStatus === 401 || httpStatus === 403) return 'ANONYMOUS';
    if (httpStatus === 404) return 'FREE';
    if (typeof httpStatus === 'number' && httpStatus >= 200 && httpStatus < 300) return 'UNKNOWN';
    return 'ANONYMOUS';
}

function createAuthClient(options = {}) {
    const fetchImpl = typeof options.fetchImpl === 'function'
        ? options.fetchImpl
        : (typeof fetch === 'function' ? fetch.bind(globalThis) : null);

    const baseUrl = normalizeHubBaseUrl(options.baseUrl || HUB_DEFAULT_BASE_URL);
    const productSlug = normalizeProductSlug(options.productSlug || DEFAULT_PRODUCT_SLUG);

    async function checkStatus() {
        if (!fetchImpl) {
            return {
                ok: false,
                status: 'UNAVAILABLE',
                reason: 'fetch-not-available',
                product: productSlug,
            };
        }

        const url = buildUserStatusUrl(baseUrl, productSlug);

        try {
            const response = await fetchImpl(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
            });

            let payload = null;
            try {
                payload = await response.json();
            } catch {
                payload = null;
            }

            const status = payload && typeof payload.status === 'string'
                ? normalizeAuthStatus(payload.status, response.status)
                : normalizeAuthStatus(null, response.status);

            return {
                ok: response.ok,
                httpStatus: response.status,
                status,
                product: payload?.product || productSlug,
                raw: payload,
            };
        } catch (error) {
            return {
                ok: false,
                status: 'ANONYMOUS',
                reason: error instanceof Error ? error.message : 'network-error',
                product: productSlug,
            };
        }
    }

    async function logout() {
        if (!fetchImpl) {
            return {
                ok: false,
                status: 'ANONYMOUS',
                reason: 'fetch-not-available',
            };
        }

        try {
            const response = await fetchImpl(buildLogoutUrl(baseUrl), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
            });

            return {
                ok: response.ok,
                httpStatus: response.status,
                status: response.ok ? 'ANONYMOUS' : 'UNKNOWN',
            };
        } catch (error) {
            return {
                ok: false,
                status: 'UNKNOWN',
                reason: error instanceof Error ? error.message : 'logout-error',
            };
        }
    }

    return {
        baseUrl,
        productSlug,
        buildUserStatusUrl: () => buildUserStatusUrl(baseUrl, productSlug),
        buildLoginUrl: () => buildLoginUrl(baseUrl),
        buildLogoutUrl: () => buildLogoutUrl(baseUrl),
        checkStatus,
        logout,
    };
}

function setAuthUiState(status, elements) {
    const safeStatus = normalizeAuthStatus(status);
    const isAnonymous = safeStatus === 'ANONYMOUS';
    const isPro = safeStatus === 'PRO';
    const isFree = safeStatus === 'FREE';

    if (elements.statusBadge) {
        elements.statusBadge.classList.remove('is-pro', 'is-free', 'is-anonymous', 'is-unknown');
        if (isPro) {
            elements.statusBadge.textContent = 'PRO';
            elements.statusBadge.classList.add('is-pro');
        } else if (isFree) {
            elements.statusBadge.textContent = 'FREE';
            elements.statusBadge.classList.add('is-free');
        } else if (isAnonymous) {
            elements.statusBadge.textContent = 'Guest';
            elements.statusBadge.classList.add('is-anonymous');
        } else {
            elements.statusBadge.textContent = safeStatus;
            elements.statusBadge.classList.add('is-unknown');
        }
    }

    if (elements.loginBtn) {
        elements.loginBtn.style.display = isAnonymous ? '' : 'none';
    }
    if (elements.logoutBtn) {
        elements.logoutBtn.style.display = isAnonymous ? 'none' : '';
    }
    if (elements.overlay) {
        elements.overlay.style.display = isAnonymous ? 'flex' : 'none';
    }
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('auth-locked', isAnonymous);
    }
}

function resolveAuthElements() {
    if (typeof document === 'undefined') {
        return null;
    }

    return {
        widget: document.getElementById('authWidget'),
        statusBadge: document.getElementById('authStatusBadge'),
        loginBtn: document.getElementById('authLoginBtn'),
        overlayLoginBtn: document.getElementById('authOverlayLoginBtn'),
        logoutBtn: document.getElementById('authLogoutBtn'),
        overlay: document.getElementById('authOverlay'),
    };
}

function openLoginWindow(baseUrl) {
    const loginUrl = buildLoginUrl(baseUrl);
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
        window.open(loginUrl, '_blank', 'noopener');
    }
    return loginUrl;
}

function initAuth(options = {}) {
    const elements = resolveAuthElements();
    const client = createAuthClient(options);

    if (!elements || !elements.widget) {
        return {
            client,
            refresh: async () => ({ ok: false, status: 'UNKNOWN', reason: 'auth-widget-not-found' }),
            stop: () => undefined,
        };
    }

    const pollIntervalMs = Number(options.pollIntervalMs) > 0
        ? Number(options.pollIntervalMs)
        : AUTH_POLL_INTERVAL_MS;

    let pollHandle = null;

    const refresh = async () => {
        const result = await client.checkStatus();
        setAuthUiState(result.status, elements);
        return result;
    };

    const onLogin = () => {
        openLoginWindow(client.baseUrl);
    };

    const onLogout = async () => {
        await client.logout();
        await refresh();
    };

    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', onLogin);
    }
    if (elements.overlayLoginBtn) {
        elements.overlayLoginBtn.addEventListener('click', onLogin);
    }
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', onLogout);
    }

    void refresh();
    pollHandle = setInterval(() => {
        void refresh();
    }, pollIntervalMs);

    return {
        client,
        refresh,
        stop() {
            if (pollHandle) {
                clearInterval(pollHandle);
                pollHandle = null;
            }
        },
    };
}

const SmartWSAuth = {
    HUB_DEFAULT_BASE_URL,
    DEFAULT_PRODUCT_SLUG,
    AUTH_POLL_INTERVAL_MS,
    normalizeHubBaseUrl,
    normalizeProductSlug,
    buildUserStatusUrl,
    buildLoginUrl,
    buildLogoutUrl,
    normalizeAuthStatus,
    resolveAuthElements,
    setAuthUiState,
    openLoginWindow,
    createAuthClient,
    initAuth,
};

if (typeof window !== 'undefined') {
    window.SmartWSAuth = SmartWSAuth;

    const shouldAutoInit = window.__SMARTWS_AUTH_AUTO_INIT__ !== false;
    if (shouldAutoInit && !window.__SMARTWS_AUTH_RUNTIME__) {
        const run = () => {
            window.__SMARTWS_AUTH_RUNTIME__ = initAuth();
        };

        if (typeof document !== 'undefined' && document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run, { once: true });
        } else {
            run();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartWSAuth;
}
