const test = require('node:test');
const assert = require('node:assert/strict');

const {
    buildIconGrid,
    getFallbackIcons,
    applyIconStyle,
} = require('../iconify.utils.js');

test('buildIconGrid returns expected placement count', () => {
    const placements = buildIconGrid({ rows: 2, cols: 3, box: 20, gap: 5, startX: 10, startY: 30 });
    assert.equal(placements.length, 6);
    assert.deepEqual(placements[0], { x: 10, y: 30, box: 20, row: 0, col: 0 });
    assert.deepEqual(placements[5], { x: 60, y: 55, box: 20, row: 1, col: 2 });
});

test('getFallbackIcons returns category-specific icon ids', () => {
    const math = getFallbackIcons('math_visuals');
    const unknown = getFallbackIcons('unknown');
    assert.ok(Array.isArray(math));
    assert.ok(math.length >= 2);
    assert.ok(math.some((id) => id.includes('mdi:')));
    assert.ok(Array.isArray(unknown));
    assert.ok(unknown.length >= 2);
});

test('applyIconStyle sets style values on plain group object', () => {
    const mockA = { set(k, v) { this[k] = v; } };
    const mockB = { set(k, v) { this[k] = v; } };
    const group = {
        getObjects() {
            return [mockA, mockB];
        },
    };

    const styled = applyIconStyle(group, { fill: '#111111', stroke: '#222222', scale: 1.5, opacity: 0.7 });
    assert.equal(styled.scaleX, 1.5);
    assert.equal(styled.scaleY, 1.5);
    assert.equal(styled.opacity, 0.7);
    assert.equal(mockA.fill, '#111111');
    assert.equal(mockB.stroke, '#222222');
});
