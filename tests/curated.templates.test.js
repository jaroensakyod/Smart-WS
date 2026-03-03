const test = require('node:test');
const assert = require('node:assert/strict');

const {
    CURATED_TEMPLATES,
    getCuratedTemplateById,
} = require('../data/curatedTemplates.v1.js');

test('curated templates include starter pack', () => {
    assert.equal(Array.isArray(CURATED_TEMPLATES), true);
    assert.ok(CURATED_TEMPLATES.length >= 15);
});

test('curated template ids are unique', () => {
    const ids = CURATED_TEMPLATES.map((item) => item.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length);
});

test('each curated template has required display and canvas fields', () => {
    CURATED_TEMPLATES.forEach((item) => {
        assert.ok(item.id, 'missing id');
        assert.ok(item.title, `missing title for ${item.id}`);
        assert.ok(item.desc, `missing desc for ${item.id}`);
        assert.ok(item.thumbnail, `missing thumbnail for ${item.id}`);
        assert.ok(item.canvasData, `missing canvasData for ${item.id}`);
        assert.equal(Array.isArray(item.canvasData.objects), true, `canvasData.objects must be array for ${item.id}`);
        assert.ok(item.canvasData.objects.length > 0, `canvasData.objects empty for ${item.id}`);
        assert.doesNotThrow(() => JSON.stringify(item.canvasData), `canvasData should be serializable for ${item.id}`);
    });
});

test('all curated templates stay in curated_worksheet category', () => {
    CURATED_TEMPLATES.forEach((item) => {
        assert.equal(item.category, 'curated_worksheet', `category drift for ${item.id}`);
    });
});

test('lookup helper resolves template by id', () => {
    const first = CURATED_TEMPLATES[0];
    const found = getCuratedTemplateById(first.id);
    assert.equal(found?.id, first.id);
    assert.equal(getCuratedTemplateById('missing-id'), null);
});
