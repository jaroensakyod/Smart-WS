const test = require('node:test');
const assert = require('node:assert/strict');

const utils = require('../export.utils.js');

test('getSafePageCount normalizes invalid inputs', () => {
    assert.equal(utils.getSafePageCount(undefined), 1);
    assert.equal(utils.getSafePageCount(0), 1);
    assert.equal(utils.getSafePageCount(-7), 1);
    assert.equal(utils.getSafePageCount(3.9), 3);
});

test('getPdfRenderProfile chooses high quality for small docs', () => {
    const profile = utils.getPdfRenderProfile(3);
    assert.equal(profile.imageType, 'png');
    assert.equal(profile.label, 'High (300 DPI)');
    assert.ok(profile.multiplier > 3);
});

test('getPdfRenderProfile downgrades for large docs', () => {
    const profile = utils.getPdfRenderProfile(24);
    assert.equal(profile.imageType, 'jpeg');
    assert.equal(profile.label, 'Low-Memory');
    assert.ok(profile.multiplier <= 1.25);
});

test('getPdfPageSpec respects custom paper dimensions', () => {
    const spec = utils.getPdfPageSpec({ key: 'presentation_16_9', mmW: 338.67, mmH: 190.5 });
    assert.deepEqual(spec.format, [338.67, 190.5]);
    assert.equal(spec.orientation, 'landscape');
    assert.equal(spec.pageWmm, 338.67);
    assert.equal(spec.pageHmm, 190.5);
});

test('getPptxLayoutSpec converts mm to inches safely', () => {
    const layout = utils.getPptxLayoutSpec({ mmW: 210, mmH: 297 });
    assert.equal(layout.name, 'SMARTWS_LAYOUT');
    assert.ok(Math.abs(layout.widthIn - (210 / 25.4)) < 0.0001);
    assert.ok(Math.abs(layout.heightIn - (297 / 25.4)) < 0.0001);
});

test('collectRiskyImageObjects detects remote image without anonymous CORS', () => {
    const pageJson = {
        version: '5.2.4',
        objects: [
            { type: 'rect', width: 10, height: 10 },
            { type: 'image', src: 'https://example.com/a.jpg' },
            { type: 'image', src: 'https://example.com/b.jpg', crossOrigin: 'anonymous' },
        ],
    };

    const risky = utils.collectRiskyImageObjects(pageJson);
    assert.equal(risky.length, 1);
    assert.equal(risky[0].index, 1);
    assert.equal(risky[0].reason, 'missing-anonymous-cors');
});

test('collectRiskyImageObjects supports json string input', () => {
    const raw = JSON.stringify({
        version: '5.2.4',
        objects: [
            { type: 'image', data: { imageSourceUrl: 'https://example.com/x.png' } },
        ],
    });

    const risky = utils.collectRiskyImageObjects(raw);
    assert.equal(risky.length, 1);
    assert.equal(risky[0].index, 0);
});

test('collectRiskyImageObjects ignores local/data URLs', () => {
    const pageJson = {
        version: '5.2.4',
        objects: [
            { type: 'image', src: 'data:image/png;base64,AAAA' },
            { type: 'image', src: '/icons/logo.png' },
            { type: 'image', src: 'chrome-extension://abc/image.png' },
        ],
    };

    const risky = utils.collectRiskyImageObjects(pageJson);
    assert.equal(risky.length, 0);
});
