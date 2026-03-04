(function (root) {
    const CACHE_LIMIT = 80;
    const searchCache = new Map();
    const svgCache = new Map();

    function trimMap(map, limit) {
        while (map.size > limit) {
            const firstKey = map.keys().next().value;
            map.delete(firstKey);
        }
    }

    function setCache(map, key, value) {
        if (map.has(key)) map.delete(key);
        map.set(key, value);
        trimMap(map, CACHE_LIMIT);
    }

    function getCache(map, key) {
        if (!map.has(key)) return null;
        const value = map.get(key);
        map.delete(key);
        map.set(key, value);
        return value;
    }

    function createTimeoutSignal(timeoutMs) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Math.max(50, Number(timeoutMs) || 2500));
        return {
            signal: controller.signal,
            clear: () => clearTimeout(timer),
        };
    }

    async function fetchWithRetry(url, options = {}) {
        const retries = Math.max(0, Number(options.retries) || 0);
        const timeoutMs = Math.max(100, Number(options.timeoutMs) || 2500);
        let lastError = null;

        for (let attempt = 0; attempt <= retries; attempt++) {
            const timeout = createTimeoutSignal(timeoutMs);
            try {
                const response = await fetch(url, {
                    signal: timeout.signal,
                    headers: options.headers || {},
                });
                timeout.clear();
                if (!response.ok) {
                    lastError = new Error(`HTTP ${response.status}`);
                    continue;
                }
                return response;
            } catch (error) {
                timeout.clear();
                lastError = error;
            }
        }
        throw lastError || new Error('Request failed');
    }

    function normalizeQuery(query) {
        return String(query || '').trim().toLowerCase();
    }

    async function searchIcons(query, options = {}) {
        const normalized = normalizeQuery(query);
        if (!normalized) return [];

        const limit = Math.min(30, Math.max(1, Number(options.limit) || 12));
        const cacheKey = `${normalized}|${limit}`;
        const cached = getCache(searchCache, cacheKey);
        if (cached) return [...cached];

        const encoded = encodeURIComponent(normalized);
        const url = `https://api.iconify.design/search?query=${encoded}&limit=${limit}`;
        const response = await fetchWithRetry(url, {
            retries: options.retries ?? 1,
            timeoutMs: options.timeoutMs ?? 2600,
        });
        const data = await response.json();
        const icons = Array.isArray(data?.icons) ? data.icons.filter(Boolean) : [];
        setCache(searchCache, cacheKey, icons);
        return [...icons];
    }

    async function getIconSvg(iconName, options = {}) {
        const name = String(iconName || '').trim();
        if (!name) return '';

        const color = String(options.color || '#334155').trim();
        const cacheKey = `${name}|${color}`;
        const cached = getCache(svgCache, cacheKey);
        if (cached) return cached;

        const encodedColor = encodeURIComponent(color.replace('#', '%23'));
        const url = `https://api.iconify.design/${name}.svg?color=${encodedColor}`;
        const response = await fetchWithRetry(url, {
            retries: options.retries ?? 1,
            timeoutMs: options.timeoutMs ?? 2800,
        });
        const svgText = await response.text();
        setCache(svgCache, cacheKey, svgText);
        return svgText;
    }

    function loadSvgGroupFromUrl(url) {
        return new Promise((resolve, reject) => {
            const fabricApi = root.fabric;
            if (!fabricApi || typeof fabricApi.loadSVGFromURL !== 'function') {
                reject(new Error('Fabric SVG loader unavailable'));
                return;
            }
            try {
                fabricApi.loadSVGFromURL(url, (objects, options) => {
                    if (!objects || !objects.length) {
                        reject(new Error('Empty SVG objects'));
                        return;
                    }
                    const group = fabricApi.util.groupSVGElements(objects, options || {});
                    if (!group) {
                        reject(new Error('SVG group failed'));
                        return;
                    }
                    resolve(group);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function svgToFabricObject(svgText) {
        return new Promise((resolve, reject) => {
            const fabricApi = root.fabric;
            if (!fabricApi || typeof fabricApi.loadSVGFromString !== 'function') {
                reject(new Error('Fabric SVG parser unavailable'));
                return;
            }
            try {
                fabricApi.loadSVGFromString(String(svgText || ''), (objects, options) => {
                    if (!objects || !objects.length) {
                        reject(new Error('Empty SVG objects'));
                        return;
                    }
                    const group = fabricApi.util.groupSVGElements(objects, options || {});
                    if (!group) {
                        reject(new Error('SVG group failed'));
                        return;
                    }
                    resolve(group);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function buildIconGrid(config = {}) {
        const rows = Math.max(1, Number(config.rows) || 1);
        const cols = Math.max(1, Number(config.cols) || 1);
        const box = Math.max(12, Number(config.box) || 36);
        const gap = Math.max(0, Number(config.gap) || 12);
        const startX = Number(config.startX) || 0;
        const startY = Number(config.startY) || 0;
        const total = rows * cols;
        const placements = [];

        for (let i = 0; i < total; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;
            placements.push({
                x: startX + c * (box + gap),
                y: startY + r * (box + gap),
                box,
                row: r,
                col: c,
            });
        }
        return placements;
    }

    function applyIconStyle(group, style = {}) {
        if (!group) return group;
        const fill = style.fill;
        const stroke = style.stroke;
        const scale = Number(style.scale);
        const opacity = Number(style.opacity);

        if (Number.isFinite(scale) && scale > 0) {
            group.scaleX = scale;
            group.scaleY = scale;
        }
        if (Number.isFinite(opacity)) {
            group.opacity = Math.max(0, Math.min(1, opacity));
        }

        if (typeof group.getObjects === 'function') {
            group.getObjects().forEach((item) => {
                if (fill) item.set('fill', fill);
                if (stroke) item.set('stroke', stroke);
            });
        } else {
            if (fill) group.set('fill', fill);
            if (stroke) group.set('stroke', stroke);
        }
        return group;
    }

    function getFallbackIcons(category) {
        const map = {
            early_learning_games: ['mdi:teddy-bear', 'mdi:puzzle', 'mdi:cards'],
            math_visuals: ['mdi:calculator-variant', 'mdi:numeric', 'mdi:chart-bar'],
            classroom_management_decor: ['mdi:calendar', 'mdi:label', 'mdi:clipboard-check'],
            ela_graphic_organizers: ['mdi:book-open-page-variant', 'mdi:lightbulb', 'mdi:sitemap'],
            default: ['mdi:shape', 'mdi:star-outline', 'mdi:circle-outline'],
        };
        const key = String(category || '').trim();
        return [...(map[key] || map.default)];
    }

    function clearIconCaches() {
        searchCache.clear();
        svgCache.clear();
    }

    const api = {
        searchIcons,
        getIconSvg,
        svgToFabricObject,
        loadSvgGroupFromUrl,
        buildIconGrid,
        applyIconStyle,
        getFallbackIcons,
        clearIconCaches,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_ICONIFY_UTILS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
