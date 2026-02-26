(function (root) {
    'use strict';

    function toNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function getSafePageCount(value) {
        return Math.max(1, Math.floor(toNumber(value, 1)));
    }

    function mmFromPixels(px) {
        return toNumber(px, 0) * 25.4 / 96;
    }

    function getPaperMetrics(paper) {
        const p = paper || {};
        let mmW = toNumber(p.mmW, 0);
        let mmH = toNumber(p.mmH, 0);
        if (!mmW || !mmH) {
            mmW = mmFromPixels(toNumber(p.width, 794)) || 210;
            mmH = mmFromPixels(toNumber(p.height, 1123)) || 297;
        }
        return {
            key: String(p.key || 'a4'),
            mmW,
            mmH,
            orientation: mmW >= mmH ? 'landscape' : 'portrait',
        };
    }

    function getPdfRenderProfile(pageCount) {
        const count = getSafePageCount(pageCount);
        if (count <= 4) {
            return { multiplier: 300 / 96, imageType: 'png', quality: 1, label: 'High (300 DPI)' };
        }
        if (count <= 10) {
            return { multiplier: 2.2, imageType: 'jpeg', quality: 0.92, label: 'Balanced' };
        }
        if (count <= 20) {
            return { multiplier: 1.6, imageType: 'jpeg', quality: 0.88, label: 'Memory Saver' };
        }
        return { multiplier: 1.25, imageType: 'jpeg', quality: 0.82, label: 'Low-Memory' };
    }

    function getPptxRenderProfile(pageCount) {
        const count = getSafePageCount(pageCount);
        if (count <= 10) {
            return { multiplier: 1.5, imageType: 'jpeg', quality: 0.9, label: 'Balanced' };
        }
        return { multiplier: 1.2, imageType: 'jpeg', quality: 0.85, label: 'Low-Memory' };
    }

    function getPdfPageSpec(paper) {
        const metrics = getPaperMetrics(paper);
        return {
            format: [metrics.mmW, metrics.mmH],
            orientation: metrics.orientation,
            pageWmm: metrics.mmW,
            pageHmm: metrics.mmH,
        };
    }

    function getPptxLayoutSpec(paper) {
        const metrics = getPaperMetrics(paper);
        const widthIn = clamp(metrics.mmW / 25.4, 1, 56);
        const heightIn = clamp(metrics.mmH / 25.4, 1, 56);
        return {
            name: 'SMARTWS_LAYOUT',
            widthIn,
            heightIn,
        };
    }

    const api = {
        getSafePageCount,
        getPaperMetrics,
        getPdfRenderProfile,
        getPptxRenderProfile,
        getPdfPageSpec,
        getPptxLayoutSpec,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.wbExportUtils = api;
})(typeof window !== 'undefined' ? window : globalThis);
