const test = require('node:test');
const assert = require('node:assert/strict');

const factory = require('../template.factory.js');

test('applyTemplate delegates to context applyTemplateImpl', () => {
    const events = [];
    const result = factory.applyTemplate({
        applyTemplateImpl: (type) => events.push(type),
    }, 'mcq');

    assert.equal(result, true);
    assert.deepEqual(events, ['mcq']);
});

test('markAnswerOnlyForSelection updates active object data', () => {
    const activeObject = { data: { foo: 'bar' } };
    let applied = false;

    const ok = factory.markAnswerOnlyForSelection({
        canvas: {
            getActiveObject: () => activeObject,
        },
        applyWorksheetVisibilityMode: () => {
            applied = true;
        },
    }, true);

    assert.equal(ok, true);
    assert.equal(activeObject.data.answerOnly, true);
    assert.equal(applied, true);
});

test('applyCuratedTemplateById returns false when resolver is missing', () => {
    const originalApi = globalThis.SMARTWS_CURATED_TEMPLATES_API;
    globalThis.SMARTWS_CURATED_TEMPLATES_API = undefined;

    const result = factory.applyCuratedTemplateById({}, 'curated-1', {});
    assert.equal(result, false);

    globalThis.SMARTWS_CURATED_TEMPLATES_API = originalApi;
});

test('duplicateAsAnswerKey returns false when context is incomplete', () => {
    const result = factory.duplicateAsAnswerKey({});
    assert.equal(result, false);
});

test('generateAnswerKeyPage returns false when context is incomplete', () => {
    const result = factory.generateAnswerKeyPage({});
    assert.equal(result, false);
});

test('applyCuratedTemplateById new-page injects normalized data via addPageAndGo (no redundant load)', async () => {
    const originalApi = globalThis.SMARTWS_CURATED_TEMPLATES_API;
    const events = [];
    const sanitized = { version: '5.2.4', objects: [{ id: 'normalized-1' }] };

    globalThis.SMARTWS_CURATED_TEMPLATES_API = {
        getCuratedTemplateById: () => ({
            id: 'curated-atomic',
            title: 'Atomic Template',
            canvasData: { version: '5.2.4', objects: [{ id: 'raw-1' }] },
        }),
    };

    try {
        const ok = factory.applyCuratedTemplateById({
            sanitizeTemplateCanvasData: () => sanitized,
            addPageAndGo: async (payload) => {
                events.push(['addPageAndGo', payload]);
                return true;
            },
            loadCanvasJson: () => {
                events.push(['loadCanvasJson']);
                return Promise.resolve(true);
            },
            saveHistory: () => events.push(['saveHistory']),
            persistCurrentPage: () => events.push(['persistCurrentPage']),
            updatePageIndicator: () => events.push(['updatePageIndicator']),
            showToast: (message) => events.push(['showToast', message]),
            trackTelemetry: (eventName, payload) => events.push(['trackTelemetry', eventName, payload?.mode]),
            canvas: { getObjects: () => [{}, {}] },
        }, 'curated-atomic', { mode: 'new-page', skipConfirm: true });

        assert.equal(ok, true);
        await new Promise((resolve) => setTimeout(resolve, 0));

        assert.deepEqual(events[0], ['addPageAndGo', sanitized]);
        assert.equal(events.some((entry) => entry[0] === 'loadCanvasJson'), false);
        assert.equal(events.some((entry) => entry[0] === 'saveHistory'), true);
        assert.equal(events.some((entry) => entry[0] === 'persistCurrentPage'), true);
        assert.equal(
            events.some((entry) => entry[0] === 'trackTelemetry' && entry[1] === 'curated_template_apply_success' && entry[2] === 'new-page'),
            true,
        );
    } finally {
        globalThis.SMARTWS_CURATED_TEMPLATES_API = originalApi;
    }
});

test('applyCuratedTemplateById replace mode still loads normalized template JSON', async () => {
    const originalApi = globalThis.SMARTWS_CURATED_TEMPLATES_API;
    const events = [];
    const sanitized = { version: '5.2.4', objects: [{ id: 'normalized-replace' }] };

    globalThis.SMARTWS_CURATED_TEMPLATES_API = {
        getCuratedTemplateById: () => ({
            id: 'curated-replace',
            title: 'Replace Template',
            canvasData: { version: '5.2.4', objects: [{ id: 'raw-replace' }] },
        }),
    };

    try {
        const ok = factory.applyCuratedTemplateById({
            sanitizeTemplateCanvasData: () => sanitized,
            loadCanvasJson: async (json) => {
                events.push(['loadCanvasJson', json]);
                return true;
            },
            saveHistory: () => events.push(['saveHistory']),
            persistCurrentPage: () => events.push(['persistCurrentPage']),
            updatePageIndicator: () => events.push(['updatePageIndicator']),
            trackTelemetry: (eventName, payload) => events.push(['trackTelemetry', eventName, payload?.mode]),
            canvas: { getObjects: () => [{}] },
        }, 'curated-replace', { mode: 'replace', skipConfirm: true });

        assert.equal(ok, true);
        await new Promise((resolve) => setTimeout(resolve, 0));

        assert.deepEqual(events[0], ['loadCanvasJson', JSON.stringify(sanitized)]);
        assert.equal(
            events.some((entry) => entry[0] === 'trackTelemetry' && entry[1] === 'curated_template_apply_success' && entry[2] === 'replace'),
            true,
        );
    } finally {
        globalThis.SMARTWS_CURATED_TEMPLATES_API = originalApi;
    }
});
