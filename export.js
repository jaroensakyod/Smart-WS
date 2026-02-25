/* ================================================================
    export.js — Export PNG / PDF, Save & Load Workbook
    ================================================================ */

async function collectAllPagesPng(multiplier = 2) {
    const canvas = window.wbCanvas;
    if (!canvas || !window.wbGetPageCount || !window.wbGoToPage || !window.wbGetActivePageIndex) return [];

    window.wbPersistCurrentPage?.();

    const original = window.wbGetActivePageIndex();
    const count = window.wbGetPageCount();
    const pages = [];

    for (let i = 0; i < count; i++) {
        await window.wbGoToPage(i);
        canvas.discardActiveObject();
        canvas.renderAll();
        pages.push(canvas.toDataURL({ format: 'png', quality: 1, multiplier }));
    }

    await window.wbGoToPage(original);
    return pages;
}

/* ── 1. EXPORT PNG (CURRENT PAGE) ─────────────────────────── */
document.getElementById('btnExportPNG')?.addEventListener('click', () => {
    const canvas = window.wbCanvas;
    if (!canvas) return;

    window.wbPersistCurrentPage?.();
    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `worksheet_page_${(window.wbGetActivePageIndex?.() ?? 0) + 1}_${Date.now()}.png`;
    a.click();
    window.showToast?.('📥 ดาวน์โหลด PNG เรียบร้อย');
});

/* ── 2. EXPORT PDF (ALL PAGES) ─────────────────────────────── */
document.getElementById('btnExportPDF')?.addEventListener('click', async () => {
    if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        window.showToast?.('❌ jsPDF ยังโหลดไม่เสร็จ');
        return;
    }

    try {
        window.showToast?.('⏳ กำลังสร้าง PDF หลายหน้า...');
        const images = await collectAllPagesPng(2);
        if (!images.length) return;

        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

        images.forEach((imgData, index) => {
            if (index > 0) pdf.addPage('a4', 'portrait');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        });

        pdf.save(`worksheet_${Date.now()}.pdf`);
        window.showToast?.('📄 ดาวน์โหลด PDF เรียบร้อย');
    } catch (err) {
        console.error('[export.pdf]', err);
        window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ');
    }
});

/* ── 3. SAVE WORKBOOK (chrome.storage.local) ───────────────── */
document.getElementById('btnSave')?.addEventListener('click', () => {
    const key = 'wb_project_autosave';
    const payload = window.wbGetWorkbookData?.() || null;
    if (!payload) return;

    const json = JSON.stringify(payload);

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ [key]: json }, () => {
            window.showToast?.('💾 บันทึกแล้ว');
        });
    } else {
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `worksheet_${Date.now()}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        window.showToast?.('💾 ดาวน์โหลด Project JSON แล้ว');
    }
});

/* ── 4. LOAD WORKBOOK ──────────────────────────────────────── */
document.getElementById('btnLoad')?.addEventListener('click', () => {
    const key = 'wb_project_autosave';

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get([key], (result) => {
            if (result[key]) {
                loadJson(result[key]);
            } else {
                openFilePicker();
            }
        });
    } else {
        openFilePicker();
    }
});

async function loadJson(json) {
    try {
        const parsed = JSON.parse(json);

        if (parsed?.version === 2 && Array.isArray(parsed.pages)) {
            await window.wbLoadWorkbookData?.(parsed);
            window.showToast?.('📂 โหลด Project หลายหน้าแล้ว');
            return;
        }

        if (parsed?.objects) {
            await window.wbLoadWorkbookData?.({ version: 2, activePageIndex: 0, pages: [json] });
            window.showToast?.('📂 โหลด Project หน้าเดียวแล้ว');
            return;
        }

        window.showToast?.('❌ รูปแบบไฟล์ไม่รองรับ');
    } catch (err) {
        console.error('[export.loadJson]', err);
        window.showToast?.('❌ โหลดไฟล์ไม่สำเร็จ');
    }
}

function openFilePicker() {
    const fi = document.createElement('input');
    fi.type = 'file';
    fi.accept = '.json';
    fi.onchange = () => {
        const file = fi.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => loadJson(e.target.result);
        reader.readAsText(file);
    };
    fi.click();
}

/* ── 5. AUTO-SAVE every 60 seconds ─────────────────────────── */
setInterval(() => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
    const payload = window.wbGetWorkbookData?.();
    if (!payload) return;
    chrome.storage.local.set({ wb_project_autosave: JSON.stringify(payload) });
}, 60_000);
