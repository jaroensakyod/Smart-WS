const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('newtab.html loads utility modules before app.js', () => {
    const filePath = path.join(__dirname, '..', 'newtab.html');
    const html = fs.readFileSync(filePath, 'utf8');

    const persistenceIdx = html.indexOf('<script src="persistence.utils.js"></script>');
    const telemetryIdx = html.indexOf('<script src="telemetry.utils.js"></script>');
    const templateFactoryIdx = html.indexOf('<script src="template.factory.js"></script>');
    const appIdx = html.indexOf('<script src="app.js"></script>');

    assert.ok(persistenceIdx >= 0);
    assert.ok(telemetryIdx >= 0);
    assert.ok(templateFactoryIdx >= 0);
    assert.ok(appIdx >= 0);
    assert.ok(persistenceIdx < appIdx);
    assert.ok(telemetryIdx < appIdx);
    assert.ok(templateFactoryIdx < appIdx);
});
