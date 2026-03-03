(function (root) {
    function sanitizeSerializableValue(value) {
        if (value === null || value === undefined) return value;
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        if (typeof value === 'function') return undefined;
        if (Array.isArray(value)) {
            return value
                .map((item) => sanitizeSerializableValue(item))
                .filter((item) => item !== undefined);
        }
        if (typeof value === 'object') {
            const output = {};
            Object.entries(value).forEach(([key, raw]) => {
                if (key === 'canvas' || key === 'group' || key === '_objects') return;
                const sanitized = sanitizeSerializableValue(raw);
                if (sanitized !== undefined) output[key] = sanitized;
            });
            return output;
        }
        return value;
    }

    function sanitizeFabricLikeObject(raw) {
        const obj = sanitizeSerializableValue(raw);
        if (!obj || typeof obj !== 'object') return null;
        if (!obj.type) return null;
        if (obj.type === 'rect') {
            obj.width = Math.abs(Number(obj.width || 0));
            obj.height = Math.abs(Number(obj.height || 0));
        }
        return obj;
    }

    function sanitizeImportedData(input) {
        const rootData = typeof input === 'string'
            ? (() => {
                try {
                    return JSON.parse(input);
                } catch {
                    return { version: '5.2.4', objects: [] };
                }
            })()
            : input;

        const rootObj = rootData && typeof rootData === 'object' ? rootData : { version: '5.2.4', objects: [] };
        const objects = Array.isArray(rootObj.objects)
            ? rootObj.objects
                .map((item) => sanitizeFabricLikeObject(item))
                .filter(Boolean)
            : [];

        return {
            ...rootObj,
            version: rootObj.version || '5.2.4',
            objects,
        };
    }

    const api = {
        sanitizeSerializableValue,
        sanitizeFabricLikeObject,
        sanitizeImportedData,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_PERSISTENCE_UTILS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
