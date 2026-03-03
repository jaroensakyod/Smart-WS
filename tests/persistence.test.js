const test = require('node:test');
const assert = require('node:assert/strict');

const {
    sanitizeSerializableValue,
    sanitizeFabricLikeObject,
    sanitizeImportedData,
    sanitizeTemplateCanvasData,
} = require('../persistence.utils.js');

test('sanitizeSerializableValue drops functions and non-serializable links', () => {
    const input = {
        value: 1,
        action: () => 'x',
        nested: {
            canvas: { id: 'drop' },
            keep: 'ok',
            _objects: [1, 2],
        },
    };

    const output = sanitizeSerializableValue(input);
    assert.equal(output.value, 1);
    assert.equal('action' in output, false);
    assert.equal('canvas' in output.nested, false);
    assert.equal('keep' in output.nested, true);
    assert.equal('_objects' in output.nested, false);
});

test('sanitizeFabricLikeObject rejects missing type and normalizes rect dimensions', () => {
    assert.equal(sanitizeFabricLikeObject({ left: 10 }), null);

    const rect = sanitizeFabricLikeObject({ type: 'rect', width: -40, height: -22 });
    assert.equal(rect.type, 'rect');
    assert.equal(rect.width, 40);
    assert.equal(rect.height, 22);
});

test('sanitizeImportedData removes invalid objects and keeps valid ones', () => {
    const payload = {
        version: '5.2.4',
        objects: [
            { type: 'textbox', text: 'ok', left: 10, top: 20 },
            { bogus: true },
            { type: 'rect', width: -30, height: -10 },
        ],
    };

    const out = sanitizeImportedData(payload);
    assert.equal(out.version, '5.2.4');
    assert.equal(Array.isArray(out.objects), true);
    assert.equal(out.objects.length, 2);
    assert.equal(out.objects[0].type, 'textbox');
    assert.equal(out.objects[1].type, 'rect');
    assert.equal(out.objects[1].width, 30);
    assert.equal(out.objects[1].height, 10);
});

test('sanitizeImportedData handles invalid json string safely', () => {
    const out = sanitizeImportedData('{invalid');
    assert.equal(Array.isArray(out.objects), true);
    assert.equal(out.objects.length, 0);
});

test('sanitizeTemplateCanvasData marks curated objects and keeps valid types', () => {
    const out = sanitizeTemplateCanvasData({
        version: '5.2.4',
        objects: [
            { type: 'textbox', text: 'hello' },
            { bogus: true },
        ],
    });

    assert.equal(out.version, '5.2.4');
    assert.equal(out.objects.length, 1);
    assert.equal(out.objects[0].type, 'textbox');
    assert.equal(out.objects[0].data.curatedTemplateObject, true);
});
