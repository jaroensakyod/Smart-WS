const test = require('node:test');
const assert = require('node:assert/strict');

function createUnsafePager(initialPages) {
    const workbook = {
        pages: initialPages.map((json) => ({ json })),
    };

    let activePageIndex = 0;
    let canvasState = workbook.pages[0].json;

    function serializeCanvasNow() {
        return canvasState;
    }

    function persistCurrentPage() {
        workbook.pages[activePageIndex].json = serializeCanvasNow();
    }

    function loadCanvasJson(json) {
        return new Promise((resolve) => {
            canvasState = 'EMPTY_CANVAS';
            setTimeout(() => {
                canvasState = json;
                resolve();
            }, 20);
        });
    }

    async function goToPage(index) {
        if (index < 0 || index >= workbook.pages.length || index === activePageIndex) return false;
        persistCurrentPage();
        activePageIndex = index;
        await loadCanvasJson(workbook.pages[activePageIndex].json);
        return true;
    }

    return {
        workbook,
        goToPage,
    };
}

function createSafePager(initialPages, options = {}) {
    const workbook = {
        pages: initialPages.map((json) => ({ json })),
    };

    let activePageIndex = 0;
    let canvasState = workbook.pages[0].json;
    let isPageLoading = false;
    let pageSwitchSafetySnapshot = null;
    const toasts = [];

    function showToast(message) {
        toasts.push(message);
    }

    function capturePageSwitchSafetySnapshot() {
        const page = workbook.pages[activePageIndex];
        if (!page) {
            pageSwitchSafetySnapshot = null;
            return;
        }
        pageSwitchSafetySnapshot = {
            index: activePageIndex,
            json: page.json,
        };
    }

    function restorePageSwitchSafetySnapshot() {
        const snapshot = pageSwitchSafetySnapshot;
        if (!snapshot || snapshot.index < 0 || snapshot.index >= workbook.pages.length) return false;
        workbook.pages[snapshot.index].json = snapshot.json;
        activePageIndex = snapshot.index;
        return true;
    }

    function serializeCanvasNow() {
        return canvasState;
    }

    function persistCurrentPage() {
        if (isPageLoading) return;
        workbook.pages[activePageIndex].json = serializeCanvasNow();
    }

    function loadCanvasJson(json, targetIndex) {
        return new Promise((resolve, reject) => {
            canvasState = 'EMPTY_CANVAS';
            setTimeout(() => {
                if (options.failOnIndexes?.has(targetIndex)) {
                    reject(new Error('simulated-load-failure'));
                    return;
                }
                canvasState = json;
                resolve();
            }, 20);
        });
    }

    async function goToPage(index) {
        if (index < 0 || index >= workbook.pages.length || index === activePageIndex) return false;
        if (isPageLoading) {
            showToast('กำลังเปลี่ยนหน้า กรุณารอสักครู่');
            return false;
        }
        const previousPageIndex = activePageIndex;
        capturePageSwitchSafetySnapshot();
        persistCurrentPage();
        activePageIndex = index;
        isPageLoading = true;
        try {
            await loadCanvasJson(workbook.pages[activePageIndex].json, activePageIndex);
            return true;
        } catch {
            const restored = restorePageSwitchSafetySnapshot();
            if (restored) {
                await loadCanvasJson(workbook.pages[activePageIndex].json, activePageIndex).catch(() => {
                    canvasState = workbook.pages[activePageIndex].json;
                });
            } else {
                activePageIndex = previousPageIndex;
            }
            showToast('เกิดข้อผิดพลาดระหว่างเปลี่ยนหน้า ระบบคืนค่าหน้าก่อนหน้าให้แล้ว');
            return false;
        } finally {
            isPageLoading = false;
        }
    }

    return {
        workbook,
        goToPage,
        getActivePageIndex: () => activePageIndex,
        getToasts: () => [...toasts],
    };
}

test('phase1 diagnostic: rapid page switching reproduces data corruption in unsafe lifecycle', async () => {
    const pager = createUnsafePager(['PAGE_1_DATA', 'PAGE_2_DATA', 'PAGE_3_DATA']);

    const firstSwitch = pager.goToPage(1);
    const secondSwitch = pager.goToPage(2);

    await Promise.all([firstSwitch, secondSwitch]);

    assert.equal(
        pager.workbook.pages[1].json,
        'EMPTY_CANVAS',
        'unsafe lifecycle should expose the corruption window when switching pages rapidly',
    );
});

test('phase1 control: sequential switch keeps page payload stable', async () => {
    const pager = createUnsafePager(['PAGE_1_DATA', 'PAGE_2_DATA']);

    await pager.goToPage(1);

    assert.equal(pager.workbook.pages[0].json, 'PAGE_1_DATA');
    assert.equal(pager.workbook.pages[1].json, 'PAGE_2_DATA');
});

test('phase2 lock: rapid switch is blocked while loading and page data stays intact', async () => {
    const pager = createSafePager(['PAGE_1_DATA', 'PAGE_2_DATA', 'PAGE_3_DATA']);

    const firstSwitch = pager.goToPage(1);
    const secondSwitch = pager.goToPage(2);

    const results = await Promise.all([firstSwitch, secondSwitch]);

    assert.deepEqual(results, [true, false]);
    assert.equal(pager.workbook.pages[1].json, 'PAGE_2_DATA');
    assert.equal(pager.workbook.pages[2].json, 'PAGE_3_DATA');
});

test('phase3 feedback: blocked rapid switch emits loading toast', async () => {
    const pager = createSafePager(['PAGE_1_DATA', 'PAGE_2_DATA', 'PAGE_3_DATA']);

    const firstSwitch = pager.goToPage(1);
    const secondSwitch = pager.goToPage(2);
    const results = await Promise.all([firstSwitch, secondSwitch]);

    assert.deepEqual(results, [true, false]);
    assert.equal(
        pager.getToasts().includes('กำลังเปลี่ยนหน้า กรุณารอสักครู่'),
        true,
    );
});

test('phase3 safety buffer: failed page load restores previous page and data', async () => {
    const pager = createSafePager(['PAGE_1_DATA', 'PAGE_2_DATA'], {
        failOnIndexes: new Set([1]),
    });

    const changed = await pager.goToPage(1);

    assert.equal(changed, false);
    assert.equal(pager.getActivePageIndex(), 0);
    assert.equal(pager.workbook.pages[0].json, 'PAGE_1_DATA');
    assert.equal(
        pager.getToasts().includes('เกิดข้อผิดพลาดระหว่างเปลี่ยนหน้า ระบบคืนค่าหน้าก่อนหน้าให้แล้ว'),
        true,
    );
});
