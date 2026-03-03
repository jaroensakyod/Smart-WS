(function (root) {
    const DEFAULT_VERSION = '5.2.4';

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

    function sanitizeImportedData(input, options = {}) {
        const defaultVersion = options.defaultVersion || DEFAULT_VERSION;
        const rootData = typeof input === 'string'
            ? (() => {
                try {
                    return JSON.parse(input);
                } catch {
                    return { version: defaultVersion, objects: [] };
                }
            })()
            : input;

        const rootObj = rootData && typeof rootData === 'object'
            ? rootData
            : { version: defaultVersion, objects: [] };
        const objects = Array.isArray(rootObj.objects)
            ? rootObj.objects
                .map((item) => sanitizeFabricLikeObject(item))
                .filter(Boolean)
            : [];

        return {
            ...rootObj,
            version: rootObj.version || defaultVersion,
            objects,
        };
    }

    function sanitizeTemplateCanvasData(canvasData, options = {}) {
        const defaultVersion = options.defaultVersion || DEFAULT_VERSION;
        const root = sanitizeImportedData(canvasData || {}, { defaultVersion });
        const objects = Array.isArray(root?.objects)
            ? root.objects
                .map((item) => sanitizeFabricLikeObject(item))
                .filter(Boolean)
                .map((item) => ({
                    ...item,
                    data: {
                        ...(item.data || {}),
                        curatedTemplateObject: true,
                    },
                }))
            : [];

        return {
            version: root?.version || defaultVersion,
            objects,
        };
    }

    const api = {
        sanitizeSerializableValue,
        sanitizeFabricLikeObject,
        sanitizeImportedData,
        sanitizeTemplateCanvasData,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_PERSISTENCE_UTILS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
