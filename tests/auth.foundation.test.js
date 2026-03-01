const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
    HUB_DEFAULT_BASE_URL,
    DEFAULT_PRODUCT_SLUG,
    normalizeHubBaseUrl,
    buildUserStatusUrl,
    createAuthClient,
} = require('../auth.js');

test('normalizeHubBaseUrl trims and removes trailing slashes', () => {
    assert.equal(normalizeHubBaseUrl(' https://example.com/// '), 'https://example.com');
    assert.equal(normalizeHubBaseUrl(''), HUB_DEFAULT_BASE_URL);
});

test('buildUserStatusUrl includes encoded product slug', () => {
    const url = buildUserStatusUrl('https://hub.example', 'smart ws');
    assert.equal(url, 'https://hub.example/api/v1/user/status?product=smart%20ws');
});

test('createAuthClient checkStatus calls fetch with credentials include', async () => {
    let capturedUrl = '';
    let capturedOptions = null;

    const fakeFetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
            ok: true,
            status: 200,
            async json() {
                return { status: 'PRO', product: 'smart-ws' };
            },
        };
    };

    const client = createAuthClient({
        baseUrl: 'https://simple-eq-hub.vercel.app',
        productSlug: DEFAULT_PRODUCT_SLUG,
        fetchImpl: fakeFetch,
    });

    const result = await client.checkStatus();

    assert.equal(capturedUrl, 'https://simple-eq-hub.vercel.app/api/v1/user/status?product=smart-ws');
    assert.equal(capturedOptions.credentials, 'include');
    assert.equal(result.ok, true);
    assert.equal(result.status, 'PRO');
});

test('phase 1 wiring exists in manifest and newtab', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const manifestPath = path.join(projectRoot, 'manifest.json');
    const newtabPath = path.join(projectRoot, 'newtab.html');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const newtabHtml = fs.readFileSync(newtabPath, 'utf8');

    assert.ok(Array.isArray(manifest.host_permissions));
    assert.ok(manifest.host_permissions.includes('https://simple-eq-hub.vercel.app/*'));
    assert.ok(manifest.host_permissions.includes('http://localhost:3000/*'));
    assert.ok(newtabHtml.includes('<script src="auth.js"></script>'));
});

test('phase 2 auth UI shell exists in newtab', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const newtabPath = path.join(projectRoot, 'newtab.html');
    const newtabHtml = fs.readFileSync(newtabPath, 'utf8');

    assert.ok(newtabHtml.includes('id="authWidget"'));
    assert.ok(newtabHtml.includes('id="authOverlay"'));
    assert.ok(newtabHtml.includes('id="authLoginBtn"'));
    assert.ok(newtabHtml.includes('id="authOverlayLoginBtn"'));
});
