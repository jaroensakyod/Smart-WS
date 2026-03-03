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
