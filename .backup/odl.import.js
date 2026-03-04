/* ================================================================
   odl.import.js — OpenDataLoader JSON Importer (MVP)
   ================================================================ */

(function () {
    'use strict';

    const ODL_UTILS = window.wbOdlImportUtils || {};

    function getPaperConfig() {
        const paper = window.wbGetPaperConfig?.() || {};
        return {
            key: paper.key || 'a4',
            width: Number(paper.width) || 794,
            height: Number(paper.height) || 1123,
        };
    }

    async function importFromJsonText(jsonText) {
        if (typeof ODL_UTILS.buildWorkbookFromOdl !== 'function') {
            throw new Error('ODL import utilities are not available');
        }

        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (error) {
            throw new Error('ไฟล์ JSON ไม่ถูกต้อง');
        }

        const paper = getPaperConfig();
        const workbook = ODL_UTILS.buildWorkbookFromOdl(parsed, {
            paperSize: paper.key,
            paperWidth: paper.width,
            paperHeight: paper.height,
        });

        await window.wbLoadWorkbookData?.(workbook);
        return workbook;
    }

    function openOdlPicker() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                window.showToast?.('⏳ กำลังนำเข้า ODL JSON...');
                const text = await file.text();
                const workbook = await importFromJsonText(text);
                const pageCount = Array.isArray(workbook?.pages) ? workbook.pages.length : 0;
                window.showToast?.(`✅ นำเข้า ODL สำเร็จ (${pageCount} หน้า)`);
            } catch (error) {
                console.error('[odl.import]', error);
                window.showToast?.(`❌ นำเข้า ODL ไม่สำเร็จ: ${error.message || 'unknown error'}`);
            }
        };
        input.click();
    }

    document.getElementById('btnImportODL')?.addEventListener('click', () => {
        openOdlPicker();
    });

    window.wbImportOdlJson = importFromJsonText;
})();
