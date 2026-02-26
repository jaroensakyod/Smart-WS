const test = require('node:test');
const assert = require('node:assert/strict');

const utils = require('../odl.import.utils.js');

test('normalizeType maps aliases correctly', () => {
    assert.equal(utils.normalizeType('title'), 'heading');
    assert.equal(utils.normalizeType('picture'), 'image');
    assert.equal(utils.normalizeType('Equation'), 'formula');
});

test('normalizeOdlDocument groups elements by page', () => {
    const raw = {
        type: 'document',
        kids: [
            { type: 'heading', content: 'Intro', 'page number': 1, 'bounding box': [72, 700, 540, 730] },
            { type: 'paragraph', content: 'Hello', 'page number': 2, 'bounding box': [72, 640, 540, 680] },
        ],
        'page width': 612,
        'page height': 792,
    };

    const normalized = utils.normalizeOdlDocument(raw);
    assert.equal(normalized.pages.length, 2);
    assert.equal(normalized.pages[0].pageNumber, 1);
    assert.equal(normalized.pages[1].pageNumber, 2);
    assert.equal(normalized.pageSize.width, 612);
    assert.equal(normalized.pageSize.height, 792);
});

test('bboxToCanvasRect converts PDF coordinates into canvas coordinates', () => {
    const rect = utils.bboxToCanvasRect([72, 700, 540, 730], { width: 612, height: 792 }, { width: 794, height: 1123 });
    assert.ok(rect.left > 0);
    assert.ok(rect.top >= 0);
    assert.ok(rect.width > 0);
    assert.ok(rect.height > 0);
});

test('buildWorkbookFromOdl returns Smart-WS workbook payload', () => {
    const raw = {
        type: 'document',
        kids: [
            { type: 'heading', content: 'Worksheet 1', 'page number': 1, 'bounding box': [72, 700, 540, 730] },
            { type: 'list', content: 'item one\nitem two', 'page number': 1, 'bounding box': [72, 600, 540, 680] },
        ],
    };

    const workbook = utils.buildWorkbookFromOdl(raw, {
        paperSize: 'a4',
        paperWidth: 794,
        paperHeight: 1123,
    });

    assert.equal(workbook.version, 2);
    assert.equal(workbook.paperSize, 'a4');
    assert.equal(workbook.activePageIndex, 0);
    assert.equal(workbook.pages.length, 1);

    const pageJson = JSON.parse(workbook.pages[0]);
    assert.ok(Array.isArray(pageJson.objects));
    assert.ok(pageJson.objects.length >= 2);
});
