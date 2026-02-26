/* ================================================================
   export.js — Export PNG / PDF / PPTX, Save & Load Workbook
   ================================================================ */

const EXPORT_UTILS = window.wbExportUtils || {};

function fallbackPdfRenderProfile(pageCount) {
    if (pageCount <= 4) return { multiplier: 300 / 96, imageType: 'png', quality: 1, label: 'High (300 DPI)' };
    if (pageCount <= 10) return { multiplier: 2.2, imageType: 'jpeg', quality: 0.92, label: 'Balanced' };
    if (pageCount <= 20) return { multiplier: 1.6, imageType: 'jpeg', quality: 0.88, label: 'Memory Saver' };
    return { multiplier: 1.25, imageType: 'jpeg', quality: 0.82, label: 'Low-Memory' };
}

function fallbackPptxRenderProfile(pageCount) {
    if (pageCount <= 10) return { multiplier: 1.5, imageType: 'jpeg', quality: 0.9, label: 'Balanced' };
    return { multiplier: 1.2, imageType: 'jpeg', quality: 0.85, label: 'Low-Memory' };
}

function fallbackPdfPageSpec(paper) {
    const p = paper || {};
    const mmW = Number(p.mmW) || (Number(p.width) || 794) * 25.4 / 96;
    const mmH = Number(p.mmH) || (Number(p.height) || 1123) * 25.4 / 96;
    const orientation = mmW >= mmH ? 'landscape' : 'portrait';
    return { format: [mmW, mmH], orientation, pageWmm: mmW, pageHmm: mmH };
}

function fallbackPptxLayoutSpec(paper) {
    const p = paper || {};
    const mmW = Number(p.mmW) || (Number(p.width) || 794) * 25.4 / 96;
    const mmH = Number(p.mmH) || (Number(p.height) || 1123) * 25.4 / 96;
    return { name: 'SMARTWS_LAYOUT', widthIn: mmW / 25.4, heightIn: mmH / 25.4 };
}

function getSafePageCount(value) {
    if (typeof EXPORT_UTILS.getSafePageCount === 'function') return EXPORT_UTILS.getSafePageCount(value);
    return Math.max(1, Math.floor(Number(value) || 1));
}

function getPdfRenderProfile(pageCount) {
    if (typeof EXPORT_UTILS.getPdfRenderProfile === 'function') return EXPORT_UTILS.getPdfRenderProfile(pageCount);
    return fallbackPdfRenderProfile(pageCount);
}

function getPptxRenderProfile(pageCount) {
    if (typeof EXPORT_UTILS.getPptxRenderProfile === 'function') return EXPORT_UTILS.getPptxRenderProfile(pageCount);
    return fallbackPptxRenderProfile(pageCount);
}

function getPdfPageSpec(paper) {
    if (typeof EXPORT_UTILS.getPdfPageSpec === 'function') return EXPORT_UTILS.getPdfPageSpec(paper);
    return fallbackPdfPageSpec(paper);
}

function getPptxLayoutSpec(paper) {
    if (typeof EXPORT_UTILS.getPptxLayoutSpec === 'function') return EXPORT_UTILS.getPptxLayoutSpec(paper);
    return fallbackPptxLayoutSpec(paper);
}

function toCanvasMime(imageType) {
    return imageType === 'jpeg' ? 'image/jpeg' : 'image/png';
}

function toJsPdfImageType(imageType) {
    return imageType === 'jpeg' ? 'JPEG' : 'PNG';
}

function waitForUiBreath() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

async function forEachWorkbookPageImage(profile, onPage) {
    const canvas = window.wbCanvas;
    if (!canvas || !window.wbGetPageCount || !window.wbGoToPage || !window.wbGetActivePageIndex) return;

    window.wbPersistCurrentPage?.();
    const originalIndex = window.wbGetActivePageIndex();
    const pageCount = getSafePageCount(window.wbGetPageCount?.());

    const originalZoom = window.wbGetZoom?.() || 1;
    if (window.wbSetZoom) window.wbSetZoom(1);

    try {
        for (let i = 0; i < pageCount; i++) {
            await window.wbGoToPage(i);
            canvas.discardActiveObject();
            canvas.renderAll();

            const dataUrl = canvas.toDataURL({
                format: profile.imageType === 'jpeg' ? 'jpeg' : 'png',
                quality: profile.quality,
                multiplier: profile.multiplier,
            });

            await onPage(dataUrl, i, pageCount);
            await waitForUiBreath();
        }
    } finally {
        await window.wbGoToPage(originalIndex);
        if (window.wbSetZoom) window.wbSetZoom(originalZoom);
    }
}

async function collectAllPagesPng(multiplier = 2) {
    const pages = [];
    await forEachWorkbookPageImage({ multiplier, imageType: 'png', quality: 1 }, async (imgData) => {
        pages.push(imgData);
    });
    return pages;
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
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        window.showToast?.('❌ jsPDF ยังโหลดไม่เสร็จ');
        return;
    }

    try {
        const pageCount = getSafePageCount(window.wbGetPageCount?.());
        const profile = getPdfRenderProfile(pageCount);
        const paper = window.wbGetPaperConfig?.();
        const pageSpec = getPdfPageSpec(paper);

        window.showToast?.(`⏳ กำลังสร้าง PDF (${profile.label})...`);

        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        const pdf = new JsPDF({
            unit: 'mm',
            format: pageSpec.format,
            orientation: pageSpec.orientation,
        });

        await forEachWorkbookPageImage(profile, async (imgData, index, total) => {
            if (index > 0) pdf.addPage(pageSpec.format, pageSpec.orientation);
            pdf.addImage(
                imgData,
                toJsPdfImageType(profile.imageType),
                0,
                0,
                pageSpec.pageWmm,
                pageSpec.pageHmm,
                undefined,
                profile.imageType === 'jpeg' ? 'FAST' : 'NONE'
            );

            if ((index + 1) % 2 === 0 || index === total - 1) {
                window.showToast?.(`⏳ กำลังสร้าง PDF: ${index + 1}/${total}`);
            }
        });

        pdf.save(`worksheet_${Date.now()}.pdf`);
        window.showToast?.('📄 ดาวน์โหลด PDF เรียบร้อย');
    } catch (err) {
        console.error('[export.pdf]', err);
        window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ (ลองลดจำนวนหน้าหรือปิดโปรแกรมอื่น)');
    }
});

function getPptxConstructor() {
    if (typeof window.PptxGenJS === 'function') return window.PptxGenJS;
    if (typeof window.pptxgenjs === 'function') return window.pptxgenjs;
    if (typeof window.pptxgen === 'function') return window.pptxgen;
    if (typeof window.pptxgen?.default === 'function') return window.pptxgen.default;
    return null;
}

/* ── 3. EXPORT PPTX (ALL PAGES) ────────────────────────────── */
document.getElementById('btnExportPPTX')?.addEventListener('click', async () => {
    const PptxCtor = getPptxConstructor();
    if (!PptxCtor) {
        window.showToast?.('❌ ไม่พบไลบรารี PptxGenJS');
        return;
    }

    try {
        const pageCount = getSafePageCount(window.wbGetPageCount?.());
        const profile = getPptxRenderProfile(pageCount);
        const paper = window.wbGetPaperConfig?.();
        const layout = getPptxLayoutSpec(paper);

        window.showToast?.(`⏳ กำลังสร้าง PPTX (${profile.label})...`);

        const pptx = new PptxCtor();
        if (typeof pptx.defineLayout === 'function') {
            pptx.defineLayout({ name: layout.name, width: layout.widthIn, height: layout.heightIn });
            pptx.layout = layout.name;
        }

        await forEachWorkbookPageImage(profile, async (imgData, index, total) => {
            const slide = pptx.addSlide();
            slide.addImage({ data: imgData, x: 0, y: 0, w: layout.widthIn, h: layout.heightIn });

            if ((index + 1) % 2 === 0 || index === total - 1) {
                window.showToast?.(`⏳ กำลังสร้าง PPTX: ${index + 1}/${total}`);
            }
        });

        await pptx.writeFile({ fileName: `worksheet_${Date.now()}.pptx`, compression: true });
        window.showToast?.('📊 ดาวน์โหลด PPTX เรียบร้อย');
    } catch (err) {
        console.error('[export.pptx]', err);
        window.showToast?.('❌ ส่งออก PPTX ไม่สำเร็จ');
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

/* ── 4. SAVE WORKBOOK (chrome.storage.local) ───────────────── */
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

/* ── 5. LOAD WORKBOOK ──────────────────────────────────────── */
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

/* ── 6. AUTO-SAVE every 60 seconds ─────────────────────────── */
setInterval(() => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
    const payload = window.wbGetWorkbookData?.();
    if (!payload) return;
    window.wbSetSaveIndicator?.('saving');
    chrome.storage.local.set({ wb_project_autosave: JSON.stringify(payload) });
    window.wbSetSaveIndicator?.('saved');
}, 60_000);

window.wbCollectAllPagesPng = collectAllPagesPng;
