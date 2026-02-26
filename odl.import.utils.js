(function (root) {
    'use strict';

    const DEFAULT_PAPER_WIDTH = 794;
    const DEFAULT_PAPER_HEIGHT = 1123;

    function toNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function readKey(obj, keys, fallback = undefined) {
        if (!obj || typeof obj !== 'object') return fallback;
        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return obj[key];
            }
        }
        return fallback;
    }

    function normalizeType(rawType) {
        const t = String(rawType || '').trim().toLowerCase();
        if (!t) return 'unknown';
        if (['heading', 'title', 'header'].includes(t)) return 'heading';
        if (['paragraph', 'text', 'body', 'caption'].includes(t)) return 'paragraph';
        if (['list', 'bullet', 'ordered-list', 'unordered-list'].includes(t)) return 'list';
        if (['table'].includes(t)) return 'table';
        if (['image', 'picture', 'figure'].includes(t)) return 'image';
        if (['formula', 'equation', 'math'].includes(t)) return 'formula';
        return t;
    }

    function getPageNumber(node) {
        const raw = readKey(node, ['page number', 'page_number', 'pageNumber', 'page'], 1);
        const page = Math.floor(toNumber(raw, 1));
        return Math.max(1, page);
    }

    function parseBoundingBox(node) {
        const raw = readKey(node, ['bounding box', 'bounding_box', 'bbox', 'box']);
        if (!Array.isArray(raw) || raw.length < 4) return null;
        const x1 = toNumber(raw[0], NaN);
        const y1 = toNumber(raw[1], NaN);
        const x2 = toNumber(raw[2], NaN);
        const y2 = toNumber(raw[3], NaN);
        if (![x1, y1, x2, y2].every(Number.isFinite)) return null;
        return [x1, y1, x2, y2];
    }

    function getElementText(node) {
        const content = readKey(node, ['content', 'text', 'value', 'description'], '');
        if (typeof content === 'string') return content.trim();
        if (Array.isArray(content)) {
            return content.map(x => (typeof x === 'string' ? x : '')).join(' ').trim();
        }
        return '';
    }

    function getChildren(node) {
        const options = [
            readKey(node, ['kids']),
            readKey(node, ['children']),
            readKey(node, ['elements']),
            readKey(node, ['content']),
        ];
        for (const maybe of options) {
            if (Array.isArray(maybe)) return maybe;
        }
        return [];
    }

    function collectCandidateElements(rawDoc) {
        const out = [];
        const stack = [rawDoc];

        while (stack.length) {
            const node = stack.pop();
            if (!node || typeof node !== 'object') continue;

            const rawType = readKey(node, ['type']);
            if (typeof rawType === 'string' && rawType.trim()) {
                const type = normalizeType(rawType);
                const text = getElementText(node);
                const bbox = parseBoundingBox(node);
                if (type !== 'document' && type !== 'page' && (text || bbox || ['table', 'image', 'formula'].includes(type))) {
                    out.push({
                        type,
                        pageNumber: getPageNumber(node),
                        text,
                        bbox,
                    });
                }
            }

            const kids = getChildren(node);
            for (let i = kids.length - 1; i >= 0; i--) {
                stack.push(kids[i]);
            }
        }

        return out;
    }

    function detectSourcePageSize(rawDoc) {
        const width = toNumber(readKey(rawDoc, ['page width', 'page_width', 'pageWidth', 'width']), 0);
        const height = toNumber(readKey(rawDoc, ['page height', 'page_height', 'pageHeight', 'height']), 0);
        if (width > 0 && height > 0) {
            return { width, height };
        }
        return { width: DEFAULT_PAPER_WIDTH, height: DEFAULT_PAPER_HEIGHT };
    }

    function groupByPages(elements) {
        const pageMap = new Map();
        for (const element of elements) {
            const page = Math.max(1, Math.floor(toNumber(element.pageNumber, 1)));
            if (!pageMap.has(page)) pageMap.set(page, []);
            pageMap.get(page).push(element);
        }

        const sortedPages = [...pageMap.keys()].sort((a, b) => a - b);
        return sortedPages.map(pageNumber => ({
            pageNumber,
            elements: pageMap.get(pageNumber),
        }));
    }

    function normalizeOdlDocument(rawDoc) {
        if (!rawDoc || typeof rawDoc !== 'object') {
            throw new Error('ODL document must be a JSON object');
        }

        const elements = collectCandidateElements(rawDoc);
        if (!elements.length) {
            throw new Error('No importable elements found in ODL JSON');
        }

        return {
            pageSize: detectSourcePageSize(rawDoc),
            pages: groupByPages(elements),
        };
    }

    function bboxToCanvasRect(bbox, sourcePage, targetPage) {
        if (!Array.isArray(bbox) || bbox.length < 4) return null;

        const sourceW = Math.max(1, toNumber(sourcePage?.width, DEFAULT_PAPER_WIDTH));
        const sourceH = Math.max(1, toNumber(sourcePage?.height, DEFAULT_PAPER_HEIGHT));
        const targetW = Math.max(1, toNumber(targetPage?.width, DEFAULT_PAPER_WIDTH));
        const targetH = Math.max(1, toNumber(targetPage?.height, DEFAULT_PAPER_HEIGHT));

        const leftPdf = toNumber(bbox[0], 0);
        const bottomPdf = toNumber(bbox[1], 0);
        const rightPdf = toNumber(bbox[2], leftPdf + 1);
        const topPdf = toNumber(bbox[3], bottomPdf + 1);

        const left = clamp((leftPdf / sourceW) * targetW, 0, targetW);
        const width = clamp(((rightPdf - leftPdf) / sourceW) * targetW, 24, targetW);
        const top = clamp(((sourceH - topPdf) / sourceH) * targetH, 0, targetH);
        const height = clamp(((topPdf - bottomPdf) / sourceH) * targetH, 20, targetH);

        return { left, top, width, height };
    }

    function createTextboxObject(text, rect, options = {}) {
        const width = Math.max(80, toNumber(rect?.width, 320));
        return {
            type: 'textbox',
            left: toNumber(rect?.left, 72),
            top: toNumber(rect?.top, 72),
            width,
            text: text || '',
            fontFamily: 'Sarabun',
            fontSize: Math.max(14, toNumber(options.fontSize, 22)),
            fill: '#1e293b',
            lineHeight: 1.35,
            editable: true,
            data: {
                source: 'opendataloader',
                elementType: options.elementType || 'paragraph',
                pageNumber: options.pageNumber || 1,
            },
        };
    }

    function elementToFabricObject(element, context) {
        const rect = bboxToCanvasRect(element.bbox, context.sourcePageSize, context.targetPageSize)
            || { left: 72, top: context.fallbackTop, width: context.targetPageSize.width - 144, height: 32 };

        if (element.type === 'heading') {
            return createTextboxObject(element.text || 'Heading', rect, {
                fontSize: 30,
                elementType: 'heading',
                pageNumber: element.pageNumber,
            });
        }

        if (element.type === 'list') {
            const lineText = (element.text || '').split(/\n+/).map(line => line.trim()).filter(Boolean).map(line => `• ${line}`).join('\n');
            return createTextboxObject(lineText || '• List item', rect, {
                fontSize: 22,
                elementType: 'list',
                pageNumber: element.pageNumber,
            });
        }

        if (element.type === 'table') {
            return createTextboxObject(element.text || '[Table content]', rect, {
                fontSize: 18,
                elementType: 'table',
                pageNumber: element.pageNumber,
            });
        }

        if (element.type === 'image') {
            return createTextboxObject(element.text || '[Image]', rect, {
                fontSize: 16,
                elementType: 'image',
                pageNumber: element.pageNumber,
            });
        }

        if (element.type === 'formula') {
            return createTextboxObject(element.text || '[Formula]', rect, {
                fontSize: 20,
                elementType: 'formula',
                pageNumber: element.pageNumber,
            });
        }

        return createTextboxObject(element.text || '', rect, {
            fontSize: 22,
            elementType: element.type || 'paragraph',
            pageNumber: element.pageNumber,
        });
    }

    function createPageJsonFromElements(page, options = {}) {
        const targetPageSize = {
            width: Math.max(1, toNumber(options.paperWidth, DEFAULT_PAPER_WIDTH)),
            height: Math.max(1, toNumber(options.paperHeight, DEFAULT_PAPER_HEIGHT)),
        };
        const sourcePageSize = {
            width: Math.max(1, toNumber(options.sourcePageWidth, DEFAULT_PAPER_WIDTH)),
            height: Math.max(1, toNumber(options.sourcePageHeight, DEFAULT_PAPER_HEIGHT)),
        };

        let autoTop = 72;
        const objects = [];
        for (const element of page.elements || []) {
            const object = elementToFabricObject(element, {
                sourcePageSize,
                targetPageSize,
                fallbackTop: autoTop,
            });
            objects.push(object);
            autoTop += Math.max(36, toNumber(object.fontSize, 22) + 16);
        }

        return JSON.stringify({
            version: '5.3.0',
            objects,
            background: '#ffffff',
        });
    }

    function buildWorkbookFromOdl(rawDoc, options = {}) {
        const normalized = normalizeOdlDocument(rawDoc);
        const paperSize = options.paperSize || 'a4';
        const paperWidth = Math.max(1, toNumber(options.paperWidth, DEFAULT_PAPER_WIDTH));
        const paperHeight = Math.max(1, toNumber(options.paperHeight, DEFAULT_PAPER_HEIGHT));

        const pages = normalized.pages.map(page => createPageJsonFromElements(page, {
            paperWidth,
            paperHeight,
            sourcePageWidth: normalized.pageSize.width,
            sourcePageHeight: normalized.pageSize.height,
        }));

        return {
            version: 2,
            paperSize,
            worksheetMode: 'student',
            activePageIndex: 0,
            pages,
        };
    }

    const api = {
        normalizeType,
        normalizeOdlDocument,
        bboxToCanvasRect,
        buildWorkbookFromOdl,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    root.wbOdlImportUtils = api;
})(typeof window !== 'undefined' ? window : globalThis);
