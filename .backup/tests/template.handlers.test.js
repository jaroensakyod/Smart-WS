const test = require('node:test');
const assert = require('node:assert/strict');

const { TEMPLATE_CATALOG } = require('../data/templateCatalog.v1.js');
const {
    buildAllCatalogHandlerMap,
    buildCategoryHandlerMap,
    buildWaveAHandlerMap,
    buildWaveBHandlerMap,
    buildWaveCHandlerMap,
    buildFirst150HandlerMap,
    resolveHandlerKey,
    isWaveA,
    isWaveB,
    isWaveC,
    isFirst150,
} = require('../data/templateHandlers.v1.js');

test('Wave A handler map covers first 50 legacy templates', () => {
    const waveA = TEMPLATE_CATALOG.filter(isWaveA);
    assert.equal(waveA.length, 50);

    const map = buildWaveAHandlerMap(TEMPLATE_CATALOG);
    const keys = Object.keys(map);
    assert.equal(keys.length, 50);

    waveA.forEach((tpl) => {
        assert.equal(map[tpl.id], 'generate_from_catalog');
        assert.equal(resolveHandlerKey(tpl, map), 'generate_from_catalog');
    });
});

test('Day 3 handler map has no duplicate key collisions', () => {
    const map = buildWaveAHandlerMap(TEMPLATE_CATALOG);
    const keys = Object.keys(map);
    const unique = new Set(keys);
    assert.equal(unique.size, keys.length);
});

test('Wave B handler map covers remaining 15 legacy templates', () => {
    const waveB = TEMPLATE_CATALOG.filter(isWaveB);
    assert.equal(waveB.length, 15);

    const map = buildWaveBHandlerMap(TEMPLATE_CATALOG);
    const keys = Object.keys(map);
    assert.equal(keys.length, 15);

    waveB.forEach((tpl) => {
        assert.equal(map[tpl.id], 'generate_from_catalog');
        assert.equal(resolveHandlerKey(tpl, map), 'generate_from_catalog');
    });
});

test('Wave C handler map covers all new visual templates', () => {
    const waveC = TEMPLATE_CATALOG.filter(isWaveC);
    assert.equal(waveC.length, 120);

    const map = buildWaveCHandlerMap(TEMPLATE_CATALOG);
    const keys = Object.keys(map);
    assert.equal(keys.length, 120);

    waveC.forEach((tpl) => {
        assert.equal(map[tpl.id], 'generate_from_catalog');
        assert.equal(resolveHandlerKey(tpl, map), 'generate_from_catalog');
    });
});

test('first-150 handler map includes all catalog templates', () => {
    const first150 = TEMPLATE_CATALOG.filter(isFirst150);
    assert.equal(first150.length, 185);

    const map = buildFirst150HandlerMap(TEMPLATE_CATALOG);
    const keys = Object.keys(map);
    assert.equal(keys.length, 185);

    first150.forEach((tpl) => {
        assert.equal(map[tpl.id], 'generate_from_catalog');
    });
});

test('all-catalog handler map resolves every template id', () => {
    const map = buildAllCatalogHandlerMap(TEMPLATE_CATALOG);
    assert.equal(Object.keys(map).length, TEMPLATE_CATALOG.length);
    TEMPLATE_CATALOG.forEach((tpl) => {
        assert.equal(resolveHandlerKey(tpl, map), 'generate_from_catalog');
    });
});

test('category handler map resolves only selected category', () => {
    const category = 'math_visuals';
    const expected = TEMPLATE_CATALOG.filter((item) => item.category === category);
    const map = buildCategoryHandlerMap(TEMPLATE_CATALOG, category);
    assert.equal(Object.keys(map).length, expected.length);
    expected.forEach((tpl) => {
        assert.equal(map[tpl.id], 'generate_from_catalog');
    });
});
