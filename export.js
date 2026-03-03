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

function isTaintedCanvasError(error) {
    const msg = String(error?.message || error || '').toLowerCase();
    return msg.includes('tainted') || msg.includes('insecure') || msg.includes('cross-origin');
}

function isRemoteHttpUrl(url) {
    if (typeof EXPORT_UTILS.isRemoteHttpUrl === 'function') return EXPORT_UTILS.isRemoteHttpUrl(url);
    const src = String(url || '').trim();
    return /^https?:\/\//i.test(src) || /^\/\//.test(src);
}

function getImageSourceFromObject(obj) {
    if (typeof EXPORT_UTILS.getImageSourceFromObject === 'function') return EXPORT_UTILS.getImageSourceFromObject(obj);
    if (!obj || typeof obj !== 'object') return '';
    const direct = obj.src || obj._src || obj.imageUrl || obj.url;
    if (direct) return String(direct);
    const data = obj.data && typeof obj.data === 'object' ? obj.data : null;
    if (!data) return '';
    return String(data.src || data.imageSourceUrl || data.url || '');
}

function collectRiskyImageObjects(pageJsonLike) {
    if (typeof EXPORT_UTILS.collectRiskyImageObjects === 'function') {
        return EXPORT_UTILS.collectRiskyImageObjects(pageJsonLike);
    }

    let parsed = pageJsonLike;
    if (typeof parsed === 'string') {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            return [];
        }
    }

    const root = parsed && typeof parsed === 'object' ? parsed : null;
    const objects = Array.isArray(root?.objects) ? root.objects : [];
    const risky = [];

    objects.forEach((obj, index) => {
        if (!obj || obj.type !== 'image') return;
        const src = getImageSourceFromObject(obj);
        if (!isRemoteHttpUrl(src)) return;
        const crossOrigin = String(obj.crossOrigin || obj?.data?.crossOrigin || '').trim().toLowerCase();
        if (crossOrigin === 'anonymous') return;
        risky.push({ index, src, reason: 'missing-anonymous-cors' });
    });

    return risky;
}

function getExportRiskSummary(snapshot, selectedIndices) {
    const pages = Array.isArray(snapshot?.pages) ? snapshot.pages : [];
    const indices = Array.isArray(selectedIndices) && selectedIndices.length
        ? selectedIndices.filter((x) => x >= 0 && x < pages.length)
        : createAllPageIndices(pages.length);
    const riskyByPage = [];
    let riskyImageCount = 0;

    indices.forEach((idx) => {
        const risky = collectRiskyImageObjects(pages[idx]);
        if (!risky.length) return;
        riskyImageCount += risky.length;
        riskyByPage.push({ page: idx + 1, count: risky.length, risky });
    });

    return {
        totalPages: indices.length,
        riskyPages: riskyByPage.length,
        riskyImageCount,
        riskyByPage,
    };
}

function summarizeRiskyPages(riskyByPage, maxPages = 6) {
    const pages = (Array.isArray(riskyByPage) ? riskyByPage : [])
        .map((x) => x?.page)
        .filter((x) => Number.isFinite(x));
    if (!pages.length) return '';
    const sorted = [...new Set(pages)].sort((a, b) => a - b);
    if (sorted.length <= maxPages) return sorted.join(', ');
    const head = sorted.slice(0, maxPages).join(', ');
    return `${head} (+${sorted.length - maxPages} หน้า)`;
}

function waitForCanvasImagesReady(targetCanvas, options = {}) {
    const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 6000);
    const pollMs = Math.max(20, Number(options.pollMs) || 60);
    const startedAt = Date.now();

    const isReady = (obj) => {
        if (!obj || obj.type !== 'image') return true;
        const el = obj._element || obj._originalElement || (typeof obj.getElement === 'function' ? obj.getElement() : null);
        if (!el) return false;
        if (el.complete === false) return false;
        if (typeof el.naturalWidth === 'number' && el.naturalWidth <= 0) return false;
        return true;
    };

    return new Promise((resolve) => {
        const tick = () => {
            const images = typeof targetCanvas.getObjects === 'function'
                ? targetCanvas.getObjects().filter((obj) => obj?.type === 'image')
                : [];
            const ready = images.every(isReady);
            if (ready) {
                resolve({ ready: true, waitedMs: Date.now() - startedAt, pending: 0 });
                return;
            }
            if (Date.now() - startedAt >= timeoutMs) {
                const pending = images.filter((obj) => !isReady(obj)).length;
                resolve({ ready: false, waitedMs: Date.now() - startedAt, pending });
                return;
            }
            setTimeout(tick, pollMs);
        };
        tick();
    });
}

function getPdfRetryProfiles(pageCount) {
    const primary = getPdfRenderProfile(pageCount);
    const fallback = [
        primary,
        { multiplier: 1.55, imageType: 'jpeg', quality: 0.84, label: 'Fallback-1' },
        { multiplier: 1.2, imageType: 'jpeg', quality: 0.76, label: 'Fallback-2' },
    ];
    const unique = [];
    const seen = new Set();
    fallback.forEach((p) => {
        const key = `${p.multiplier}|${p.imageType}|${p.quality}`;
        if (seen.has(key)) return;
        seen.add(key);
        unique.push(p);
    });
    return unique;
}

async function exportPdfInBatches(selectedPages, pageSpec, options = {}) {
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!JsPDF) throw new Error('jspdf-not-ready');

    const chunkSize = Math.max(2, Number(options.chunkSize) || 8);
    const profile = options.profile || { multiplier: 1.0, imageType: 'jpeg', quality: 0.7, label: 'Batch-Low-Memory' };
    const baseName = `worksheet_${Date.now()}`;
    const skippedAll = [];
    const skippedDetailsAll = [];
    let part = 0;
    let exportedParts = 0;

    for (let offset = 0; offset < selectedPages.length; offset += chunkSize) {
        part += 1;
        const chunk = selectedPages.slice(offset, offset + chunkSize);
        if (!chunk.length) continue;

        window.showToast?.(`⏳ กำลังแยกไฟล์ PDF part ${part} (${chunk.length} หน้า)`);
        const pdf = new JsPDF({
            unit: 'mm',
            format: pageSpec.format,
            orientation: pageSpec.orientation,
        });

        const result = await forEachWorkbookPageImage(profile, async (imgData, index) => {
            if (index > 0) pdf.addPage(pageSpec.format, pageSpec.orientation);
            pdf.addImage(
                imgData,
                toJsPdfImageType(profile.imageType),
                0,
                0,
                pageSpec.pageWmm,
                pageSpec.pageHmm,
                undefined,
                'FAST'
            );
        }, {
            pageIndices: chunk,
            skipOnError: true,
        });

        if (!result?.rendered) {
            skippedAll.push(...chunk.map((x) => x + 1));
            if (Array.isArray(result?.skippedDetails)) skippedDetailsAll.push(...result.skippedDetails);
            continue;
        }

        skippedAll.push(...(result.skippedPages || []));
        if (Array.isArray(result?.skippedDetails)) skippedDetailsAll.push(...result.skippedDetails);
        pdf.save(`${baseName}_part${String(part).padStart(2, '0')}.pdf`);
        exportedParts += 1;
        await waitForUiBreath();
    }

    return {
        exportedParts,
        skippedPages: skippedAll.sort((a, b) => a - b),
        skippedDetails: skippedDetailsAll,
    };
}

function waitForUiBreath() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

function createAllPageIndices(total) {
    return Array.from({ length: total }, (_, i) => i);
}

function parsePageSelectionInput(input, totalPages) {
    const total = Math.max(1, Math.floor(Number(totalPages) || 1));
    const raw = String(input || '').trim().toLowerCase();
    if (!raw || raw === 'all' || raw === '*') return createAllPageIndices(total);

    const tokens = raw
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    if (!tokens.length) return createAllPageIndices(total);

    const include = new Set();
    const exclude = new Set();
    let hasInclude = false;

    const addRange = (targetSet, start, end) => {
        const lo = Math.max(1, Math.min(start, end));
        const hi = Math.min(total, Math.max(start, end));
        for (let p = lo; p <= hi; p++) targetSet.add(p - 1);
    };

    for (const token of tokens) {
        const isExclude = token.startsWith('!');
        const body = isExclude ? token.slice(1).trim() : token;
        if (!body) throw new Error('รูปแบบไม่ถูกต้อง');

        const rangeMatch = body.match(/^(\d+)\s*-\s*(\d+)$/);
        const singleMatch = body.match(/^\d+$/);
        const target = isExclude ? exclude : include;

        if (rangeMatch) {
            const start = Number(rangeMatch[1]);
            const end = Number(rangeMatch[2]);
            if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error('ช่วงหน้าไม่ถูกต้อง');
            addRange(target, start, end);
            if (!isExclude) hasInclude = true;
            continue;
        }

        if (singleMatch) {
            const page = Number(body);
            if (!Number.isFinite(page) || page < 1 || page > total) throw new Error(`หน้าต้องอยู่ระหว่าง 1-${total}`);
            target.add(page - 1);
            if (!isExclude) hasInclude = true;
            continue;
        }

        throw new Error(`ไม่รองรับรูปแบบ: ${token}`);
    }

    const base = hasInclude ? include : new Set(createAllPageIndices(total));
    exclude.forEach((idx) => base.delete(idx));
    return Array.from(base).sort((a, b) => a - b);
}

function askExportPageIndices(totalPages, label) {
    const total = Math.max(1, Math.floor(Number(totalPages) || 1));
    const answer = window.prompt(
        `เลือกหน้าที่ต้องการส่งออก (${label})\n` +
        `ทั้งหมด ${total} หน้า\n` +
        `ตัวอย่าง: all, 1, 1-5, 1-10,!4,!7`,
        'all'
    );
    if (answer === null) return null;
    try {
        return parsePageSelectionInput(answer, total);
    } catch (error) {
        window.showToast?.(`❌ รูปแบบหน้าไม่ถูกต้อง: ${error?.message || 'invalid input'}`);
        return [];
    }
}

function getWorkbookSnapshotForExport() {
    const payload = window.wbGetWorkbookData?.();
    if (!payload || !Array.isArray(payload.pages) || !payload.pages.length) return null;
    return payload;
}

function normalizePageJsonForExport(pageJson, options = {}) {
    let parsed = pageJson;
    if (typeof parsed === 'string') {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            parsed = { version: '5.2.4', objects: [] };
        }
    }

    const root = parsed && typeof parsed === 'object' ? parsed : { version: '5.2.4', objects: [] };
    const rawObjects = Array.isArray(root.objects) ? root.objects : [];
    const dropImages = !!options.dropImages;
    const dropImagePredicate = typeof options.dropImagePredicate === 'function' ? options.dropImagePredicate : null;

    const sanitizedObjects = rawObjects
        .filter((obj) => obj && typeof obj === 'object' && typeof obj.type === 'string')
        .filter((obj) => !(dropImages && obj.type === 'image'))
        .filter((obj, index) => !(obj.type === 'image' && dropImagePredicate && dropImagePredicate(obj, index)))
        .map((obj) => {
            const out = { ...obj };
            ['left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'fontSize', 'strokeWidth', 'angle', 'opacity'].forEach((key) => {
                if (out[key] === undefined) return;
                const n = Number(out[key]);
                if (!Number.isFinite(n)) delete out[key];
            });
            return out;
        });

    return {
        ...root,
        objects: sanitizedObjects,
    };
}

function applyWorksheetVisibilityForCanvas(targetCanvas) {
    const mode = window.wbGetWorksheetMode?.() === 'answer' ? 'answer' : 'student';
    targetCanvas.getObjects().forEach((obj) => {
        const answerOnly = !!obj?.data?.answerOnly;
        obj.visible = mode === 'answer' ? true : !answerOnly;
    });
}

async function renderPageJsonToImage(pageJson, profile, width, height) {
    if (!window.fabric) throw new Error('Fabric.js not available');
    const el = document.createElement('canvas');
    el.width = Math.max(1, Math.floor(Number(width) || 794));
    el.height = Math.max(1, Math.floor(Number(height) || 1123));

    const TempCanvasCtor = window.fabric.StaticCanvas || window.fabric.Canvas;
    const tempCanvas = new TempCanvasCtor(el, {
        width: el.width,
        height: el.height,
        backgroundColor: '#ffffff',
        selection: false,
        renderOnAddRemove: false,
    });

    const loadAndRender = async (jsonLike) => {
        await new Promise((resolve, reject) => {
            try {
                tempCanvas.loadFromJSON(jsonLike || '{}', () => {
                    try {
                        applyWorksheetVisibilityForCanvas(tempCanvas);
                        if (typeof tempCanvas.discardActiveObject === 'function') {
                            tempCanvas.discardActiveObject();
                        }
                        tempCanvas.renderAll();
                        resolve();
                    } catch (callbackError) {
                        reject(callbackError);
                    }
                });
            } catch (loadError) {
                reject(loadError);
            }
        });

        const imageWait = await waitForCanvasImagesReady(tempCanvas, { timeoutMs: 6000, pollMs: 60 });
        if (!imageWait.ready) {
            window.wbTrackTelemetry?.('export_image_wait_timeout', {
                pending: imageWait.pending,
                waitedMs: imageWait.waitedMs,
            });
        }

        if (document.fonts?.ready) {
            try { await document.fonts.ready; } catch { }
        }

        return tempCanvas.toDataURL({
            format: profile.imageType === 'jpeg' ? 'jpeg' : 'png',
            quality: profile.quality,
            multiplier: profile.multiplier,
        });
    };

    const normalized = normalizePageJsonForExport(pageJson, { dropImages: false });
    const riskyImageIndexes = new Set(
        collectRiskyImageObjects(pageJson)
            .map((x) => Number(x?.index))
            .filter((x) => Number.isInteger(x) && x >= 0)
    );
    let dataUrl = '';
    try {
        dataUrl = await loadAndRender(normalized);
    } catch (error) {
        if (!isTaintedCanvasError(error)) {
            tempCanvas.dispose?.();
            throw error;
        }

        if (riskyImageIndexes.size) {
            window.wbTrackTelemetry?.('export_tainted_fallback_drop_risky', {
                droppedImages: riskyImageIndexes.size,
            });
            try {
                tempCanvas.clear();
                const noRiskyImagesJson = normalizePageJsonForExport(pageJson, {
                    dropImagePredicate: (_, objectIndex) => riskyImageIndexes.has(objectIndex),
                });
                dataUrl = await loadAndRender(noRiskyImagesJson);
                tempCanvas.dispose?.();
                return dataUrl;
            } catch {
                // fallback to full image-drop path below
            }
        }

        const noImageJson = normalizePageJsonForExport(pageJson, { dropImages: true });
        try {
            tempCanvas.clear();
            dataUrl = await loadAndRender(noImageJson);
        } catch (fallbackErr) {
            tempCanvas.dispose?.();
            throw fallbackErr;
        }
    }

    tempCanvas.dispose?.();
    return dataUrl;
}

async function forEachWorkbookPageImage(profile, onPage, options = {}) {
    const snapshot = getWorkbookSnapshotForExport();
    const paper = window.wbGetPaperConfig?.() || { width: 794, height: 1123 };
    if (!snapshot) return;

    const pages = Array.isArray(snapshot.pages) ? snapshot.pages : [];
    const requested = Array.isArray(options.pageIndices) && options.pageIndices.length
        ? options.pageIndices.filter((idx) => idx >= 0 && idx < pages.length)
        : createAllPageIndices(pages.length);
    const total = requested.length;
    const skipOnError = !!options.skipOnError;
    const skippedPages = [];
    const skippedDetails = [];
    let rendered = 0;

    for (let i = 0; i < total; i++) {
        const pageIndex = requested[i];
        try {
            const dataUrl = await renderPageJsonToImage(
                pages[pageIndex],
                profile,
                Number(paper.width) || 794,
                Number(paper.height) || 1123
            );
            await onPage(dataUrl, rendered, total, pageIndex + 1);
            rendered += 1;
        } catch (error) {
            if (!skipOnError) throw error;
            skippedPages.push(pageIndex + 1);
            skippedDetails.push({
                page: pageIndex + 1,
                message: String(error?.message || error || 'unknown-error'),
                tainted: isTaintedCanvasError(error),
            });
            console.error('[export.page.skip]', pageIndex + 1, error);
        }
        await waitForUiBreath();
    }

    return { requested: total, rendered, skippedPages, skippedDetails };
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
        const selectedPages = askExportPageIndices(pageCount, 'PDF');
        if (selectedPages === null) {
            window.showToast?.('ยกเลิกการส่งออก PDF');
            return;
        }
        if (!selectedPages.length) {
            window.showToast?.('❌ ไม่มีหน้าที่เลือกสำหรับส่งออก PDF');
            return;
        }

        const snapshot = getWorkbookSnapshotForExport();
        if (!snapshot) {
            window.showToast?.('❌ ไม่พบข้อมูล workbook สำหรับ export');
            return;
        }

        const riskSummary = getExportRiskSummary(snapshot, selectedPages);
        if (riskSummary.riskyImageCount > 0) {
            const pageText = summarizeRiskyPages(riskSummary.riskyByPage);
            window.showToast?.(`⚠️ พบรูปเว็บเสี่ยง CORS ${riskSummary.riskyImageCount} รูป (หน้า ${pageText}) ระบบจะข้ามเฉพาะรูปเสี่ยงอัตโนมัติ`);
            window.wbTrackTelemetry?.('export_risky_images_detected', {
                type: 'pdf',
                riskyPages: riskSummary.riskyPages,
                riskyImageCount: riskSummary.riskyImageCount,
            });
        }

        const profiles = getPdfRetryProfiles(pageCount);
        const paper = window.wbGetPaperConfig?.();
        const pageSpec = getPdfPageSpec(paper);
        let lastError = null;
        for (let attempt = 0; attempt < profiles.length; attempt++) {
            const profile = profiles[attempt];
            try {
                window.showToast?.(`⏳ กำลังสร้าง PDF (${profile.label})...`);
                const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
                const pdf = new JsPDF({
                    unit: 'mm',
                    format: pageSpec.format,
                    orientation: pageSpec.orientation,
                });

                const result = await forEachWorkbookPageImage(profile, async (imgData, index, total) => {
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
                }, {
                    pageIndices: selectedPages,
                    skipOnError: true,
                });

                if (!result?.rendered) {
                    throw new Error('no-pages-rendered');
                }

                pdf.save(`worksheet_${Date.now()}.pdf`);
                if (result.skippedPages.length) {
                    window.showToast?.(`📄 ดาวน์โหลด PDF แล้ว (ข้ามหน้า: ${result.skippedPages.join(', ')})`);
                } else {
                    window.showToast?.('📄 ดาวน์โหลด PDF เรียบร้อย');
                }
                return;
            } catch (err) {
                lastError = err;
                console.error('[export.pdf.attempt]', attempt + 1, err);
                if (isTaintedCanvasError(err)) break;
                if (attempt < profiles.length - 1) {
                    window.showToast?.(`⚠️ หน่วยความจำสูง กำลังลองใหม่ (${attempt + 2}/${profiles.length})`);
                }
            }
        }

        if (isTaintedCanvasError(lastError)) {
            window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ: มีรูปจากเว็บที่ไม่อนุญาต export (CORS)');
            return;
        }

        const allowSplit = window.confirm('หน่วยความจำไม่พอสำหรับไฟล์ PDF เดียว\nต้องการแยกส่งออกเป็นหลายไฟล์ (part) อัตโนมัติหรือไม่?');
        if (!allowSplit) {
            window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ (หน่วยความจำไม่พอ)');
            return;
        }

        const split = await exportPdfInBatches(selectedPages, pageSpec, {
            chunkSize: 8,
            profile: { multiplier: 1.0, imageType: 'jpeg', quality: 0.7, label: 'Batch-Low-Memory' },
        });

        if (!split.exportedParts) {
            const tainted = (split.skippedDetails || []).some((x) => !!x.tainted);
            if (tainted) {
                window.showToast?.('❌ ส่งออกแบบแยกไฟล์ก็ไม่สำเร็จ: มีรูปเว็บบางหน้าไม่อนุญาต export (CORS)');
            } else {
                window.showToast?.('❌ ส่งออกแบบแยกไฟล์ก็ไม่สำเร็จ: สคริปต์เจอหน้าเสียหลายหน้า (ดู Console)');
            }
            return;
        }

        if (split.skippedPages.length) {
            window.showToast?.(`📄 ส่งออกแบบแยกไฟล์แล้ว (ข้ามหน้า: ${split.skippedPages.join(', ')})`);
        } else {
            window.showToast?.(`📄 ส่งออกแบบแยกไฟล์สำเร็จ (${split.exportedParts} ไฟล์)`);
        }
    } catch (err) {
        console.error('[export.pdf]', err);
        if (isTaintedCanvasError(err)) {
            window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ: มีรูปจากเว็บที่ไม่อนุญาต export (CORS)');
        } else {
            window.showToast?.('❌ ส่งออก PDF ไม่สำเร็จ (ลองลดจำนวนหน้าหรือปิดโปรแกรมอื่น)');
        }
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
        const selectedPages = askExportPageIndices(pageCount, 'PPTX');
        if (selectedPages === null) {
            window.showToast?.('ยกเลิกการส่งออก PPTX');
            return;
        }
        if (!selectedPages.length) {
            window.showToast?.('❌ ไม่มีหน้าที่เลือกสำหรับส่งออก PPTX');
            return;
        }

        const snapshot = getWorkbookSnapshotForExport();
        if (!snapshot) {
            window.showToast?.('❌ ไม่พบข้อมูล workbook สำหรับ export');
            return;
        }

        const riskSummary = getExportRiskSummary(snapshot, selectedPages);
        if (riskSummary.riskyImageCount > 0) {
            const pageText = summarizeRiskyPages(riskSummary.riskyByPage);
            window.showToast?.(`⚠️ พบรูปเว็บเสี่ยง CORS ${riskSummary.riskyImageCount} รูป (หน้า ${pageText}) ระบบจะข้ามเฉพาะรูปเสี่ยงอัตโนมัติ`);
            window.wbTrackTelemetry?.('export_risky_images_detected', {
                type: 'pptx',
                riskyPages: riskSummary.riskyPages,
                riskyImageCount: riskSummary.riskyImageCount,
            });
        }

        const profile = getPptxRenderProfile(pageCount);
        const paper = window.wbGetPaperConfig?.();
        const layout = getPptxLayoutSpec(paper);

        window.showToast?.(`⏳ กำลังสร้าง PPTX (${profile.label})...`);

        const pptx = new PptxCtor();
        if (typeof pptx.defineLayout === 'function') {
            pptx.defineLayout({ name: layout.name, width: layout.widthIn, height: layout.heightIn });
            pptx.layout = layout.name;
        }

        const result = await forEachWorkbookPageImage(profile, async (imgData, index, total) => {
            const slide = pptx.addSlide();
            slide.addImage({ data: imgData, x: 0, y: 0, w: layout.widthIn, h: layout.heightIn });

            if ((index + 1) % 2 === 0 || index === total - 1) {
                window.showToast?.(`⏳ กำลังสร้าง PPTX: ${index + 1}/${total}`);
            }
        }, {
            pageIndices: selectedPages,
            skipOnError: true,
        });

        if (!result?.rendered) {
            throw new Error('no-pages-rendered');
        }

        await pptx.writeFile({ fileName: `worksheet_${Date.now()}.pptx`, compression: true });
        if (result.skippedPages.length) {
            window.showToast?.(`📊 ดาวน์โหลด PPTX แล้ว (ข้ามหน้า: ${result.skippedPages.join(', ')})`);
        } else {
            window.showToast?.('📊 ดาวน์โหลด PPTX เรียบร้อย');
        }
    } catch (err) {
        console.error('[export.pptx]', err);
        window.showToast?.('❌ ส่งออก PPTX ไม่สำเร็จ');
    }
});

document.getElementById('btnExportPreview')?.addEventListener('click', async () => {
    const snapshot = getWorkbookSnapshotForExport();
    if (!snapshot) return;

    try {
        const paper = window.wbGetPaperConfig?.() || { width: 794, height: 1123 };
        const selected = askExportPageIndices(snapshot.pages.length, 'Preview (เลือกหน้าเดียว)');
        if (selected === null) {
            window.showToast?.('ยกเลิกการส่งออก Preview');
            return;
        }
        if (!selected.length) {
            window.showToast?.('❌ ไม่มีหน้าที่เลือกสำหรับ Preview');
            return;
        }
        const activeIndex = selected[0];
        const src = await renderPageJsonToImage(
            snapshot.pages[activeIndex],
            { format: 'png', quality: 0.9, multiplier: 1.2, imageType: 'png' },
            Number(paper.width) || 794,
            Number(paper.height) || 1123
        );

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
