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
