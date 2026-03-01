const HUB_DEFAULT_BASE_URL = 'https://simple-eq-hub.vercel.app';
const DEFAULT_PRODUCT_SLUG = 'smart-ws';

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
                ? String(payload.status).toUpperCase()
                : (response.ok ? 'UNKNOWN' : 'ANONYMOUS');

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
                status: 'NETWORK_ERROR',
                reason: error instanceof Error ? error.message : 'network-error',
                product: productSlug,
            };
        }
    }

    return {
        baseUrl,
        productSlug,
        buildUserStatusUrl: () => buildUserStatusUrl(baseUrl, productSlug),
        checkStatus,
    };
}

const SmartWSAuth = {
    HUB_DEFAULT_BASE_URL,
    DEFAULT_PRODUCT_SLUG,
    normalizeHubBaseUrl,
    normalizeProductSlug,
    buildUserStatusUrl,
    createAuthClient,
};

if (typeof window !== 'undefined') {
    window.SmartWSAuth = SmartWSAuth;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartWSAuth;
}
