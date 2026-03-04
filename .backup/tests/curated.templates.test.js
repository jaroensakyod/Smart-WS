const test = require('node:test');
const assert = require('node:assert/strict');

const {
    CURATED_TEMPLATES,
    getCuratedTemplateById,
} = require('../data/curatedTemplates.v1.js');

test('curated templates list is available and non-empty', () => {
    assert.equal(Array.isArray(CURATED_TEMPLATES), true);
    assert.ok(CURATED_TEMPLATES.length >= 10);
});

test('every curated template has required fields and canvas objects', () => {
    CURATED_TEMPLATES.forEach((item) => {
        assert.ok(item.id, 'missing id');
        assert.ok(item.title, `missing title for ${item.id}`);
        assert.ok(item.thumbnail, `missing thumbnail for ${item.id}`);
        assert.ok(item.canvasData && typeof item.canvasData === 'object', `missing canvasData for ${item.id}`);
        assert.equal(Array.isArray(item.canvasData.objects), true, `missing objects array for ${item.id}`);
        assert.ok(item.canvasData.objects.length >= 1, `empty objects for ${item.id}`);
    });
});

test('getCuratedTemplateById resolves known ids and rejects unknown ids', () => {
    const first = CURATED_TEMPLATES[0];
    const found = getCuratedTemplateById(first.id);
    assert.equal(found?.id, first.id);
    assert.equal(getCuratedTemplateById('NOT-FOUND-ID'), null);
});
