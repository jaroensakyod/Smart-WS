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
    
    const originalZoom = window.wbGetZoom?.() || 1;
    if (window.wbSetZoom) window.wbSetZoom(1);

    for (let i = 0; i < count; i++) {
        await window.wbGoToPage(i);
        canvas.discardActiveObject();
        canvas.renderAll();
        pages.push(canvas.toDataURL({ format: 'png', quality: 1, multiplier }));
    }

    await window.wbGoToPage(original);
    if (window.wbSetZoom) window.wbSetZoom(originalZoom);
    return pages;
}

function getExportScale300Dpi() {
    return 300 / 96;
}

function getPdfFormatByPaper() {
    const paper = window.wbGetPaperConfig?.() || { key: 'a4' };
    return paper.key === 'letter' ? 'letter' : 'a4';
}

/* ── 1. EXPORT PNG (CURRENT PAGE) ─────────────────────────── */
document.getElementById('btnExportPNG')?.addEventListener('click', () => {
    const canvas = window.wbCanvas;
    if (!canvas) return;

    window.wbPersistCurrentPage?.();
    canvas.discardActiveObject();
    
    const originalZoom = window.wbGetZoom?.() || 1;
    if (window.wbSetZoom) window.wbSetZoom(1);
    
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    
    if (window.wbSetZoom) window.wbSetZoom(originalZoom);
    
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
        window.showToast?.('⏳ กำลังสร้าง PDF 300 DPI...');
        const images = await collectAllPagesPng(getExportScale300Dpi());
        if (!images.length) return;

        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        const format = getPdfFormatByPaper();
        const pdf = new JsPDF({ unit: 'mm', format, orientation: 'portrait' });
        const isLetter = format === 'letter';
        const pageW = isLetter ? 215.9 : 210;
        const pageH = isLetter ? 279.4 : 297;

        images.forEach((imgData, index) => {
            if (index > 0) pdf.addPage(format, 'portrait');
            pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);
        });

        pdf.save(`worksheet_${Date.now()}.pdf`);
        window.showToast?.('📄 ดาวน์โหลด PDF (Flatten 300 DPI) เรียบร้อย');
    } catch (err) {
        console.error('[export.pdf]', err);
        window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ');
    }
});

document.getElementById('btnExportPreview')?.addEventListener('click', async () => {
    const canvas = window.wbCanvas;
    if (!canvas) return;

    try {
        window.wbPersistCurrentPage?.();
        canvas.discardActiveObject();
        
        const originalZoom = window.wbGetZoom?.() || 1;
        if (window.wbSetZoom) window.wbSetZoom(1);
        
        canvas.renderAll();

        const src = canvas.toDataURL({ format: 'png', quality: 0.9, multiplier: 1.2 });
        
        if (window.wbSetZoom) window.wbSetZoom(originalZoom);
        
        const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = src;
        });

        const out = document.createElement('canvas');
        out.width = img.width;
        out.height = img.height;
        const ctx = out.getContext('2d');
        ctx.drawImage(img, 0, 0);

        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.translate(out.width / 2, out.height / 2);
        ctx.rotate(-Math.PI / 5);
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.max(34, Math.floor(out.width / 9))}px Inter, sans-serif`;
        ctx.fillStyle = '#dc2626';
        ctx.fillText('PREVIEW', 0, 0);
        ctx.restore();

        const a = document.createElement('a');
        a.href = out.toDataURL('image/jpeg', 0.86);
        a.download = `worksheet_preview_${Date.now()}.jpg`;
        a.click();
        window.showToast?.('👁 ดาวน์โหลด Preview (Watermark) แล้ว');
    } catch (err) {
        console.error('[export.preview]', err);
        window.showToast?.('❌ ส่งออก Preview ไม่สำเร็จ');
    }
});

/* ── 3. SAVE WORKBOOK (chrome.storage.local) ───────────────── */
document.getElementById('btnSave')?.addEventListener('click', () => {
    const key = 'wb_project_autosave';
    const payload = window.wbGetWorkbookData?.() || null;
    if (!payload) return;

    const json = JSON.stringify(payload);

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        window.wbSetSaveIndicator?.('saving');
        chrome.storage.local.set({ [key]: json }, () => {
            window.wbSetSaveIndicator?.('saved');
            window.showToast?.('💾 บันทึกแล้ว');
        });
    } else {
        const blob = new Blob([json], { type: 'application/smartws+json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `worksheet_${Date.now()}.smartws`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        window.wbSetSaveIndicator?.('saved');
        window.showToast?.('💾 ดาวน์โหลด Project .smartws แล้ว');
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
    fi.accept = '.smartws,.json';
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
    window.wbSetSaveIndicator?.('saving');
    chrome.storage.local.set({ wb_project_autosave: JSON.stringify(payload) });
    window.wbSetSaveIndicator?.('saved');
}, 60_000);
