(function (root) {
    function getTemplatePrefix(id) {
        const raw = String(id || '').trim().toUpperCase();
        const matched = raw.match(/^([A-Z]+)-\d+$/);
        return matched ? matched[1] : '';
    }

    function getTemplateNumber(id) {
        const raw = String(id || '').match(/(\d+)$/);
        return raw ? Number(raw[1]) : NaN;
    }

    function isWaveA(item) {
        if (getTemplatePrefix(item?.id) !== 'LEG') return false;
        const num = getTemplateNumber(item?.id);
        return Number.isFinite(num) && num >= 1 && num <= 50;
    }

    function isWaveB(item) {
        if (getTemplatePrefix(item?.id) !== 'LEG') return false;
        const num = getTemplateNumber(item?.id);
        return Number.isFinite(num) && num >= 51 && num <= 65;
    }

    function isFirst100(item) {
        return isWaveA(item) || isWaveB(item);
    }

    function isWaveC(item) {
        const prefix = getTemplatePrefix(item?.id);
        return prefix === 'ELG' || prefix === 'MTH' || prefix === 'CLM' || prefix === 'ELA';
    }

    function isFirst150(item) {
        return isWaveA(item) || isWaveB(item) || isWaveC(item);
    }

    function buildHandlerMap(catalog, predicate) {
        const list = Array.isArray(catalog) ? catalog : [];
        const filterFn = typeof predicate === 'function' ? predicate : () => true;
        const entries = list
            .filter(filterFn)
            .map((item) => [item.id, 'generate_from_catalog']);
        return Object.fromEntries(entries);
    }

    function buildWaveAHandlerMap(catalog) {
        return buildHandlerMap(catalog, isWaveA);
    }

    function buildWaveBHandlerMap(catalog) {
        return buildHandlerMap(catalog, isWaveB);
    }

    function buildFirst100HandlerMap(catalog) {
        return buildHandlerMap(catalog, isFirst100);
    }

    function buildWaveCHandlerMap(catalog) {
        return buildHandlerMap(catalog, isWaveC);
    }

    function buildFirst150HandlerMap(catalog) {
        return buildHandlerMap(catalog, isFirst150);
    }

    function buildCategoryHandlerMap(catalog, categoryKey) {
        const category = String(categoryKey || '').trim();
        if (!category) return {};
        return buildHandlerMap(catalog, (item) => String(item?.category || '').trim() === category);
    }

    function buildAllCatalogHandlerMap(catalog) {
        return buildHandlerMap(catalog);
    }

    function resolveHandlerKey(template, map) {
        if (!template || !map) return null;
        return map[template.id] || null;
    }

    const api = {
        getTemplatePrefix,
        isWaveA,
        isWaveB,
        isFirst100,
        isWaveC,
        isFirst150,
        buildHandlerMap,
        buildWaveAHandlerMap,
        buildWaveBHandlerMap,
        buildFirst100HandlerMap,
        buildWaveCHandlerMap,
        buildFirst150HandlerMap,
        buildCategoryHandlerMap,
        buildAllCatalogHandlerMap,
        resolveHandlerKey,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_TEMPLATE_HANDLERS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
