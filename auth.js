const HUB_DEFAULT_BASE_URL = 'https://simple-eq-hub.vercel.app';
const DEFAULT_PRODUCT_SLUG = 'smart-ws';
const AUTH_POLL_INTERVAL_MS = 45_000;
const HUB_STORAGE_KEY = 'smartws_hub_base_url';
const PRODUCT_STORAGE_KEY = 'smartws_product_slug';

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

function getSearchParam(name, locationObj) {
    if (!locationObj || typeof locationObj.search !== 'string') return '';
    try {
        const params = new URLSearchParams(locationObj.search);
        return params.get(name) || '';
    } catch {
        return '';
    }
}

function resolveRuntimeConfig(globalScope) {
    const scope = globalScope || (typeof window !== 'undefined' ? window : null);
    const configFromWindow = scope && scope.__SMARTWS_AUTH_CONFIG__ && typeof scope.__SMARTWS_AUTH_CONFIG__ === 'object'
        ? scope.__SMARTWS_AUTH_CONFIG__
        : {};

    const queryHub = getSearchParam('hub', scope?.location);
    const queryProduct = getSearchParam('product', scope?.location);

    let storageHub = '';
    let storageProduct = '';
    try {
        if (scope?.localStorage) {
            storageHub = scope.localStorage.getItem(HUB_STORAGE_KEY) || '';
            storageProduct = scope.localStorage.getItem(PRODUCT_STORAGE_KEY) || '';
        }
    } catch {
        storageHub = '';
        storageProduct = '';
    }

    const rawBaseUrl = configFromWindow.baseUrl
        || scope?.__SMARTWS_HUB_BASE_URL__
        || queryHub
        || storageHub
        || HUB_DEFAULT_BASE_URL;

    const rawProductSlug = configFromWindow.productSlug
        || scope?.__SMARTWS_PRODUCT_SLUG__
        || queryProduct
        || storageProduct
        || DEFAULT_PRODUCT_SLUG;

    return {
        baseUrl: normalizeHubBaseUrl(rawBaseUrl),
        productSlug: normalizeProductSlug(rawProductSlug),
        source: {
            baseUrl: configFromWindow.baseUrl
                ? 'window-config'
                : (scope?.__SMARTWS_HUB_BASE_URL__
                    ? 'window-variable'
                    : (queryHub ? 'query-param' : (storageHub ? 'local-storage' : 'default'))),
            productSlug: configFromWindow.productSlug
                ? 'window-config'
                : (scope?.__SMARTWS_PRODUCT_SLUG__
                    ? 'window-variable'
                    : (queryProduct ? 'query-param' : (storageProduct ? 'local-storage' : 'default'))),
        },
    };
}

function persistRuntimeConfig(baseUrl, productSlug, globalScope) {
    const scope = globalScope || (typeof window !== 'undefined' ? window : null);
    if (!scope?.localStorage) return false;

    try {
        if (baseUrl) {
            scope.localStorage.setItem(HUB_STORAGE_KEY, normalizeHubBaseUrl(baseUrl));
        }
        if (productSlug) {
            scope.localStorage.setItem(PRODUCT_STORAGE_KEY, normalizeProductSlug(productSlug));
        }
        return true;
    } catch {
        return false;
    }
}

function buildUserStatusUrl(baseUrl, productSlug = DEFAULT_PRODUCT_SLUG) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    const safeSlug = encodeURIComponent(normalizeProductSlug(productSlug));
    return `${safeBaseUrl}/api/v1/user/status?product=${safeSlug}`;
}

function buildLoginUrl(baseUrl) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    return `${safeBaseUrl}/auth/login`;
}

function buildLogoutUrl(baseUrl) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    return `${safeBaseUrl}/api/v1/auth/sign-out`;
}

function buildOnboardingUrl(baseUrl) {
    const safeBaseUrl = normalizeHubBaseUrl(baseUrl);
    return `${safeBaseUrl}/onboarding`;
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

    const runtimeConfig = resolveRuntimeConfig(options.globalScope);
    const baseUrl = normalizeHubBaseUrl(options.baseUrl || runtimeConfig.baseUrl || HUB_DEFAULT_BASE_URL);
    const productSlug = normalizeProductSlug(options.productSlug || runtimeConfig.productSlug || DEFAULT_PRODUCT_SLUG);

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
                cache: 'no-store',
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
                cache: 'no-store',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
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
        runtimeSource: runtimeConfig.source,
        buildUserStatusUrl: () => buildUserStatusUrl(baseUrl, productSlug),
        buildLoginUrl: () => buildLoginUrl(baseUrl),
        buildLogoutUrl: () => buildLogoutUrl(baseUrl),
        checkStatus,
        logout,
    };
}

function resolveAuthPresentation(input, baseUrl) {
    const authResult = input && typeof input === 'object' ? input : { status: input };
    const status = normalizeAuthStatus(authResult.status);
    const raw = authResult.raw && typeof authResult.raw === 'object' ? authResult.raw : {};

    const payloadLink = typeof raw.link === 'string' && raw.link.trim() ? raw.link.trim() : '';
    const payloadOnboardingLink = typeof raw.onboardingLink === 'string' && raw.onboardingLink.trim()
        ? raw.onboardingLink.trim()
        : '';
    const onboardingRequired = Boolean(raw.onboardingRequired);

    const loginUrl = payloadLink || buildLoginUrl(baseUrl);
    const onboardingUrl = payloadOnboardingLink || payloadLink || buildOnboardingUrl(baseUrl);

    if (status === 'PRO') {
        return {
            status,
            locked: false,
            actionLabel: '🔐 Login with Nexus',
            actionUrl: loginUrl,
            message: '',
            title: '',
            meta: '',
        };
    }

    if (status === 'FREE' && onboardingRequired) {
        return {
            status,
            locked: true,
            actionLabel: '🚀 Continue Onboarding',
            actionUrl: onboardingUrl,
            title: 'Activation required',
            message: 'ชำระเงิน/ส่งหลักฐานที่ Nexus Hub ก่อน เพื่อเปิดใช้งาน Smart-WS Pro',
            meta: 'ระบบจะตรวจสอบสถานะอัตโนมัติทุก 45 วินาที',
        };
    }

    if (status === 'FREE') {
        return {
            status,
            locked: true,
            actionLabel: '💳 Open Nexus Hub',
            actionUrl: onboardingUrl,
            title: 'PRO license required',
            message: 'บัญชีนี้ยังไม่มีสิทธิ์ใช้งาน Smart-WS Pro',
            meta: 'หากเพิ่งอัปเกรด ให้รอสักครู่แล้วกด Refresh Status',
        };
    }

    if (status === 'ANONYMOUS') {
        return {
            status,
            locked: true,
            actionLabel: '🔐 Login with Nexus',
            actionUrl: loginUrl,
            title: 'Sign in to continue',
            message: 'เข้าสู่ระบบ Nexus เพื่อปลดล็อกการใช้งาน Smart-WS Pro',
            meta: 'ระบบจะตรวจสอบสถานะอัตโนมัติทุก 45 วินาที',
        };
    }

    return {
        status,
        locked: true,
        actionLabel: '🔄 Retry Nexus',
        actionUrl: loginUrl,
        title: 'Status unavailable',
        message: 'ยังไม่สามารถยืนยันสิทธิ์การใช้งานได้ในขณะนี้',
        meta: 'ลอง Refresh Status หรือเปิด Nexus Hub เพื่อตรวจสอบบัญชี',
    };
}

function setAuthUiState(input, elements, options = {}) {
    const baseUrl = normalizeHubBaseUrl(options.baseUrl || HUB_DEFAULT_BASE_URL);
    const presentation = resolveAuthPresentation(input, baseUrl);
    const safeStatus = presentation.status;
    const isAnonymous = safeStatus === 'ANONYMOUS';
    const isPro = safeStatus === 'PRO';
    const isFree = safeStatus === 'FREE';
    const isLocked = presentation.locked;
    const logoutBusy = Boolean(options.logoutBusy);

    let lastSyncText = '';
    if (options.lastCheckedAt instanceof Date) {
        lastSyncText = options.lastCheckedAt.toLocaleTimeString('th-TH', { hour12: false });
    }

    if (elements.statusBadge) {
        elements.statusBadge.classList.remove('is-pro', 'is-free', 'is-anonymous', 'is-unknown');
        if (isPro) {
            elements.statusBadge.textContent = 'PRO';
            elements.statusBadge.classList.add('is-pro');
        } else if (isFree) {
            elements.statusBadge.textContent = 'FREE';
            elements.statusBadge.classList.add('is-free');
        } else if (isAnonymous) {
            elements.statusBadge.textContent = 'LOGIN';
            elements.statusBadge.classList.add('is-anonymous');
        } else {
            elements.statusBadge.textContent = safeStatus;
            elements.statusBadge.classList.add('is-unknown');
        }
    }

    if (elements.loginBtn) {
        elements.loginBtn.style.display = isAnonymous ? '' : 'none';
        elements.loginBtn.disabled = logoutBusy;
    }
    if (elements.logoutBtn) {
        elements.logoutBtn.style.display = isAnonymous ? 'none' : '';
        elements.logoutBtn.disabled = logoutBusy;
        elements.logoutBtn.textContent = logoutBusy ? '⏳ Logging out...' : '🚪 Logout';
    }
    if (elements.overlay) {
        elements.overlay.style.display = isLocked ? 'flex' : 'none';
    }
    if (elements.overlayTitle) {
        elements.overlayTitle.textContent = presentation.title;
    }
    if (elements.overlayText) {
        elements.overlayText.textContent = presentation.message;
    }
    if (elements.overlayMeta) {
        const metaParts = [];
        if (presentation.meta) metaParts.push(presentation.meta);
        if (lastSyncText) metaParts.push(`ตรวจล่าสุด ${lastSyncText}`);
        elements.overlayMeta.textContent = metaParts.join(' • ');
    }
    if (elements.overlayLoginBtn) {
        elements.overlayLoginBtn.textContent = presentation.actionLabel;
        elements.overlayLoginBtn.disabled = logoutBusy;
    }
    if (elements.overlayRefreshBtn) {
        elements.overlayRefreshBtn.disabled = logoutBusy;
    }
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.toggle('auth-locked', isLocked);
    }

    return presentation;
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
        overlayRefreshBtn: document.getElementById('authOverlayRefreshBtn'),
        logoutBtn: document.getElementById('authLogoutBtn'),
        overlay: document.getElementById('authOverlay'),
        overlayTitle: document.getElementById('authOverlayTitle'),
        overlayText: document.getElementById('authOverlayText'),
        overlayMeta: document.getElementById('authOverlayMeta'),
    };
}

function openAuthWindow(url, baseUrl) {
    const targetUrl = typeof url === 'string' && url.trim() ? url.trim() : buildLoginUrl(baseUrl);
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
        window.open(targetUrl, '_blank', 'noopener');
    }
    return targetUrl;
}

function initAuth(options = {}) {
    if (options.persistConfig) {
        persistRuntimeConfig(options.baseUrl, options.productSlug, options.globalScope);
    }

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
    let authActionUrl = client.buildLoginUrl();
    let lastCheckedAt = null;
    let isLoggingOut = false;

    const runPostLogoutReset = async (result) => {
        const fallbackHandler = typeof window !== 'undefined' && typeof window.wbResetWorkspaceAfterLogout === 'function'
            ? window.wbResetWorkspaceAfterLogout
            : null;

        const handler = typeof options.onPostLogoutReset === 'function'
            ? options.onPostLogoutReset
            : fallbackHandler;

        if (typeof handler !== 'function') return;

        try {
            await handler({
                ok: result?.ok === true,
                status: normalizeAuthStatus(result?.status, result?.httpStatus),
            });
        } catch {
            return;
        }
    };

    const applyUiState = (result, uiOptions = {}) => {
        lastCheckedAt = new Date();
        const presentation = setAuthUiState(result, elements, {
            baseUrl: client.baseUrl,
            lastCheckedAt,
            logoutBusy: Boolean(uiOptions.logoutBusy),
        });
        authActionUrl = presentation.actionUrl || client.buildLoginUrl();
        return presentation;
    };

    const refresh = async (uiOptions = {}) => {
        if (isLoggingOut) {
            return {
                ok: false,
                status: 'ANONYMOUS',
                reason: 'logout-in-progress',
            };
        }

        const result = await client.checkStatus();
        applyUiState(result, uiOptions);
        return result;
    };

    const onLogin = () => {
        openAuthWindow(authActionUrl, client.baseUrl);
    };

    const onLogout = async () => {
        if (isLoggingOut) return;

        isLoggingOut = true;
        applyUiState({ status: 'ANONYMOUS' }, { logoutBusy: true });
        if (elements.overlayTitle) {
            elements.overlayTitle.textContent = 'Signing out...';
        }
        if (elements.overlayText) {
            elements.overlayText.textContent = 'กำลังออกจากระบบ และล้างข้อมูลใบงานชั่วคราว';
        }
        if (elements.overlayMeta) {
            elements.overlayMeta.textContent = 'ระบบจะตรวจสอบสถานะอัตโนมัติทุก 45 วินาที';
        }

        let logoutResult = null;
        try {
            logoutResult = await client.logout();
        } finally {
            await runPostLogoutReset(logoutResult);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            isLoggingOut = false;
        }

        await refresh({ logoutBusy: false });
    };

    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', onLogin);
    }
    if (elements.overlayLoginBtn) {
        elements.overlayLoginBtn.addEventListener('click', onLogin);
    }
    if (elements.overlayRefreshBtn) {
        elements.overlayRefreshBtn.addEventListener('click', () => {
            void refresh();
        });
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
    HUB_STORAGE_KEY,
    PRODUCT_STORAGE_KEY,
    normalizeHubBaseUrl,
    normalizeProductSlug,
    resolveRuntimeConfig,
    persistRuntimeConfig,
    buildUserStatusUrl,
    buildLoginUrl,
    buildLogoutUrl,
    normalizeAuthStatus,
    resolveAuthElements,
    setAuthUiState,
    buildOnboardingUrl,
    openAuthWindow,
    resolveAuthPresentation,
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
