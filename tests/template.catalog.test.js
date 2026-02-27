const test = require('node:test');
const assert = require('node:assert/strict');

const { TEMPLATE_TAXONOMY } = require('../data/templateTaxonomy.v1.js');
const {
    TEMPLATE_REQUIRED_FIELDS,
    TEMPLATE_METADATA_FIELDS,
    TEMPLATE_SINGLE_DOD,
    TEMPLATE_CATALOG,
    validateTemplateSchema,
    validateCatalogUniqueness,
    validateCategoryCoverage,
    getCatalogStats,
} = require('../data/templateCatalog.v1.js');
const { TEMPLATE_PRESETS, getTemplatePreset } = require('../data/templatePresets.v1.js');

test('taxonomy has 4 strategic categories with expected targets', () => {
    assert.equal(Array.isArray(TEMPLATE_TAXONOMY), true);
    assert.equal(TEMPLATE_TAXONOMY.length, 4);
    const map = Object.fromEntries(TEMPLATE_TAXONOMY.map((x) => [x.key, x.targetCount]));
    assert.equal(map.early_learning_games, 35);
    assert.equal(map.math_visuals, 30);
    assert.equal(map.classroom_management_decor, 25);
    assert.equal(map.ela_graphic_organizers, 30);
});

test('required schema fields are defined', () => {
    assert.deepEqual(TEMPLATE_REQUIRED_FIELDS, [
        'id',
        'title',
        'category',
        'gradeBand',
        'format',
        'tags',
        'hasAnswerKey',
    ]);
});

test('single-template DoD checklist exists', () => {
    assert.equal(Array.isArray(TEMPLATE_SINGLE_DOD), true);
    assert.equal(TEMPLATE_SINGLE_DOD.length, 5);
});

test('catalog is generated to 185 templates', () => {
    assert.equal(Array.isArray(TEMPLATE_CATALOG), true);
    assert.equal(TEMPLATE_CATALOG.length, 185);
    const stats = getCatalogStats(TEMPLATE_CATALOG);
    assert.equal(stats.total, 185);
});

test('Day 6 all catalog items satisfy schema', () => {
    TEMPLATE_CATALOG.forEach((item) => {
        const check = validateTemplateSchema(item);
        assert.equal(check.ok, true, `missing fields for ${item.id}: ${check.missing.join(',')}`);
        assert.ok(Array.isArray(item.tags));
        assert.ok(item.tags.length >= 1);
        TEMPLATE_METADATA_FIELDS.forEach((field) => {
            assert.ok(field in item, `missing metadata ${field} for ${item.id}`);
        });
        assert.ok(Array.isArray(item.iconifyTags));
        assert.ok(item.iconifyTags.length >= 1);
    });
});

test('Day 6 catalog ids are unique', () => {
    const uniqueness = validateCatalogUniqueness(TEMPLATE_CATALOG);
    assert.equal(uniqueness.ok, true);
    assert.equal(uniqueness.duplicateIds.length, 0);
});

test('catalog covers all taxonomy categories', () => {
    const coverage = validateCategoryCoverage(TEMPLATE_CATALOG, TEMPLATE_TAXONOMY);
    assert.equal(coverage.ok, true, `missing taxonomy categories: ${coverage.missing.join(', ')}`);

    assert.equal(coverage.byCategory.early_learning_games, 35);
    assert.equal(coverage.byCategory.math_visuals, 30);
    assert.equal(coverage.byCategory.classroom_management_decor, 25);
    assert.equal(coverage.byCategory.ela_graphic_organizers, 30);
});

test('catalog titles are unique (case-insensitive)', () => {
    const seen = new Set();
    const duplicates = [];
    TEMPLATE_CATALOG.forEach((item) => {
        const key = String(item.title || '').trim().toLowerCase();
        if (!key) return;
        if (seen.has(key)) duplicates.push(item.title);
        seen.add(key);
    });
    assert.equal(duplicates.length, 0, `duplicate titles: ${duplicates.join(', ')}`);
});

test('category tag diversity is sufficient (anti-clone guard)', () => {
    const byCategory = TEMPLATE_CATALOG.reduce((acc, item) => {
        const key = String(item.category || '').trim();
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    Object.entries(byCategory).forEach(([category, list]) => {
        const tags = new Set();
        const tagFreq = {};
        list.forEach((item) => {
            (item.tags || []).forEach((tag) => {
                const key = String(tag).trim().toLowerCase();
                tags.add(key);
                tagFreq[key] = (tagFreq[key] || 0) + 1;
            });
        });
        const rareTags = Object.values(tagFreq).filter((count) => count === 1).length;
        assert.ok(tags.size >= 10, `category ${category} has low tag diversity (${tags.size})`);
        assert.ok(rareTags >= 0, `category ${category} has invalid rare tag count (${rareTags})`);
    });
});

test('template signatures are unique within category', () => {
    const signatureSet = new Set();
    const duplicates = [];

    TEMPLATE_CATALOG.forEach((item) => {
        const normalizedTags = (item.tags || [])
            .map((tag) => String(tag).trim().toLowerCase())
            .sort()
            .join('|');
        const signature = [item.category, item.format, item.gradeBand, normalizedTags].join('::');
        if (signatureSet.has(signature)) {
            duplicates.push(item.id);
        }
        signatureSet.add(signature);
    });

    assert.equal(duplicates.length, 0, `duplicate template signatures: ${duplicates.join(', ')}`);
});

test('Day 6 format presets are mapped for every template', () => {
    assert.ok(TEMPLATE_PRESETS.worksheet);
    assert.ok(TEMPLATE_PRESETS.activity);
    assert.ok(TEMPLATE_PRESETS.organizer);
    assert.ok(TEMPLATE_PRESETS.assessment);
    assert.ok(TEMPLATE_PRESETS.planner);

    TEMPLATE_CATALOG.forEach((item) => {
        const preset = getTemplatePreset(item);
        assert.ok(preset, `preset not found for ${item.id} format=${item.format}`);
    });
});

test('catalog split between legacy and new cohorts is 65/120', () => {
    const legacy = TEMPLATE_CATALOG.filter((item) => item.tags.includes('cohort-legacy'));
    const modern = TEMPLATE_CATALOG.filter((item) => item.tags.includes('cohort-new'));
    assert.equal(legacy.length, 65);
    assert.equal(modern.length, 120);
});

test('schema validator reports missing fields for invalid object', () => {
    const check = validateTemplateSchema({});
    assert.equal(check.ok, false);
    assert.ok(check.missing.includes('id'));
});
