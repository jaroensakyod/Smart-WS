/* ================================================================
   app.js  — Worksheet Builder Core
   Fabric.js canvas init, workbook pages, undo/redo, tools, shortcuts
   ================================================================ */

/* ── 1. CANVAS INIT ─────────────────────────────────────────── */
const PAPER_PRESETS = {
    a4: { key: 'a4', label: 'A4', width: 794, height: 1123, mmW: 210, mmH: 297, marginIn: 0.5 },
    a4_landscape: { key: 'a4_landscape', label: 'A4 Landscape', width: 1123, height: 794, mmW: 297, mmH: 210, marginIn: 0.5 },
    letter: { key: 'letter', label: 'US Letter', width: 816, height: 1056, mmW: 215.9, mmH: 279.4, marginIn: 0.5 },
    presentation_16_9: { key: 'presentation_16_9', label: '16:9 Presentation', width: 1280, height: 720, mmW: 338.67, mmH: 190.5, marginIn: 0.35 },
};
let paperSize = 'a4';
let gridEnabled = false;
let worksheetMode = 'student'; // student | answer
const GRID_SIZE = 24;
const SNAP_TOLERANCE = 8;
const PERSISTENCE_UTILS = window.SMARTWS_PERSISTENCE_UTILS || {};
const TELEMETRY_UTILS = window.SMARTWS_TELEMETRY_UTILS || {};

function trackTelemetry(eventName, payload = {}) {
    if (typeof TELEMETRY_UTILS.trackTelemetry === 'function') {
        TELEMETRY_UTILS.trackTelemetry(eventName, payload, { storage: window.localStorage });
    }
}

function getTelemetrySnapshot() {
    if (typeof TELEMETRY_UTILS.getTelemetrySnapshot === 'function') {
        return TELEMETRY_UTILS.getTelemetrySnapshot(window.localStorage);
    }
    return { counts: {}, events: [], lastUpdatedAt: 0 };
}

function clearTelemetryState() {
    if (typeof TELEMETRY_UTILS.clearTelemetryState === 'function') {
        TELEMETRY_UTILS.clearTelemetryState(window.localStorage);
    }
}

function getPaperConfig(size = paperSize) {
    return PAPER_PRESETS[size] || PAPER_PRESETS.a4;
}

let activePaper = getPaperConfig();
let PAPER_W = activePaper.width;
let PAPER_H = activePaper.height;
const SERIALIZE_PROPS = ['id', 'data', 'lockUniScaling', 'lockSkewingX', 'lockSkewingY'];

const canvas = new fabric.Canvas('worksheetCanvas', {
    width: PAPER_W,
    height: PAPER_H,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
});

function syncUiToggles() {
    document.body.classList.toggle('show-grid', gridEnabled);
    const gridBtn = document.getElementById('btnToggleGrid');
    const modeBtn = document.getElementById('btnToggleAnswerMode');
    if (gridBtn) gridBtn.classList.toggle('active', gridEnabled);
    if (modeBtn) {
        modeBtn.textContent = worksheetMode === 'answer' ? '🧑‍🏫 โหมดเฉลย' : '👩‍🎓 โหมดนักเรียน';
    }
}

function applyPaperLayout(size = paperSize) {
    const cfg = getPaperConfig(size);
    paperSize = cfg.key;
    activePaper = cfg;
    PAPER_W = cfg.width;
    PAPER_H = cfg.height;

    if (window.wbSetZoom && window.wbGetZoom) {
        window.wbSetZoom(window.wbGetZoom());
    } else {
        canvas.setWidth(PAPER_W);
        canvas.setHeight(PAPER_H);
        canvas.calcOffset();

        const root = document.documentElement;
        root.style.setProperty('--paper-w', `${PAPER_W}px`);
        root.style.setProperty('--paper-h', `${PAPER_H}px`);
        root.style.setProperty('--grid-size', `${GRID_SIZE}px`);
        root.style.setProperty('--safe-margin', `${Math.round(cfg.marginIn * 96)}px`);
    }

    const pageSelect = document.getElementById('pageSizeSelect');
    if (pageSelect) pageSelect.value = paperSize;
    syncUiToggles();
    canvas.requestRenderAll();
}

function applyWorksheetVisibilityMode() {
    canvas.getObjects().forEach(obj => {
        const answerOnly = !!obj.data?.answerOnly;
        obj.visible = worksheetMode === 'answer' ? true : !answerOnly;
    });
    canvas.requestRenderAll();
}

/* ── 2. WORKBOOK STATE (MULTI-PAGE) ───────────────────────── */
const HISTORY_MAX = 30;
let activePageIndex = 0;
let workbook = { pages: [] };
let isReplaying = false;
let isPageLoading = false;

const BLANK_PAGE_JSON = JSON.stringify(canvas.toJSON(SERIALIZE_PROPS));

function createPageState(json = BLANK_PAGE_JSON) {
    return {
        json,
        undoStack: [json],
        redoStack: [],
    };
}

function currentPage() {
    return workbook.pages[activePageIndex];
}

function updatePageIndicator() {
    const indicator = document.getElementById('pageIndicator');
    if (indicator) indicator.textContent = `หน้า ${activePageIndex + 1} / ${workbook.pages.length}`;

    const jumpInput = document.getElementById('jumpPageInput');
    if (jumpInput) {
        jumpInput.min = '1';
        jumpInput.max = String(Math.max(1, workbook.pages.length));
        jumpInput.value = String(activePageIndex + 1);
    }

    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');
    if (prevBtn) prevBtn.disabled = activePageIndex <= 0;
    if (nextBtn) nextBtn.disabled = activePageIndex >= workbook.pages.length - 1;
}

function serializeCanvasNow() {
    try {
        return JSON.stringify(canvas.toJSON(SERIALIZE_PROPS));
    } catch (error) {
        trackTelemetry('canvas_serialize_error', {
            message: String(error?.message || error || 'unknown-error'),
        });
        return buildSafeCanvasJsonSnapshot();
    }
}

function sanitizeSerializableValue(value) {
    if (typeof PERSISTENCE_UTILS.sanitizeSerializableValue === 'function') {
        return PERSISTENCE_UTILS.sanitizeSerializableValue(value);
    }
    return value;
}

function sanitizeFabricLikeObject(raw) {
    if (typeof PERSISTENCE_UTILS.sanitizeFabricLikeObject === 'function') {
        return PERSISTENCE_UTILS.sanitizeFabricLikeObject(raw);
    }
    return null;
}

function buildSafeCanvasJsonSnapshot() {
    try {
        const safeObjects = [];
        const objects = canvas.getObjects();
        objects.forEach((obj, index) => {
            try {
                const raw = obj.toObject(SERIALIZE_PROPS);
                const normalized = sanitizeFabricLikeObject(raw);
                if (normalized) safeObjects.push(normalized);
            } catch (error) {
                trackTelemetry('canvas_object_serialize_error', {
                    index,
                    type: obj?.type || 'unknown',
                    message: String(error?.message || error || 'unknown-error'),
                });
            }
        });
        return JSON.stringify({
            version: fabric?.version || '5.2.4',
            objects: safeObjects,
        });
    } catch (error) {
        trackTelemetry('canvas_safe_snapshot_error', {
            message: String(error?.message || error || 'unknown-error'),
        });
        return currentPage()?.json || BLANK_PAGE_JSON;
    }
}

function sanitizeTemplateCanvasData(canvasData) {
    if (typeof PERSISTENCE_UTILS.sanitizeTemplateCanvasData === 'function') {
        return PERSISTENCE_UTILS.sanitizeTemplateCanvasData(canvasData, {
            defaultVersion: fabric?.version || '5.2.4',
        });
    }
    return {
        version: fabric?.version || '5.2.4',
        objects: [],
    };
}

function sanitizeImportedData(input) {
    if (typeof PERSISTENCE_UTILS.sanitizeImportedData === 'function') {
        return PERSISTENCE_UTILS.sanitizeImportedData(input, {
            defaultVersion: fabric?.version || '5.2.4',
        });
    }
    return {
        version: fabric?.version || '5.2.4',
        objects: [],
    };
}

function persistCurrentPage() {
    if (isPageLoading) {
        trackTelemetry('page_persist_skipped_loading', {
            activePageIndex,
        });
        return;
    }
    const page = currentPage();
    if (!page) return;
    try {
        page.json = serializeCanvasNow();
    } catch (error) {
        trackTelemetry('page_persist_error', {
            message: String(error?.message || error || 'unknown-error'),
            activePageIndex,
        });
        return;
    }
    if (!page.undoStack.length) page.undoStack = [page.json];
}

function loadCanvasJson(json) {
    return new Promise((resolve) => {
        isReplaying = true;
        const sanitizedJson = sanitizeImportedData(json || BLANK_PAGE_JSON);
        canvas.loadFromJSON(sanitizedJson, () => {
            canvas.backgroundColor = '#ffffff';
            applyWorksheetVisibilityMode();
            canvas.renderAll();
            isReplaying = false;
            resolve();
        });
    });
}

async function goToPage(index) {
    if (index < 0 || index >= workbook.pages.length || index === activePageIndex) return false;
    if (isPageLoading) {
        trackTelemetry('page_switch_blocked_loading', {
            from: activePageIndex,
            to: index,
            pageCount: workbook.pages.length,
        });
        return false;
    }
    persistCurrentPage();
    activePageIndex = index;
    isPageLoading = true;
    try {
        await loadCanvasJson(currentPage().json);
        clearPropsPanel();
        updatePageIndicator();
        return true;
    } finally {
        isPageLoading = false;
    }
}

async function jumpToPageFromInput() {
    const input = document.getElementById('jumpPageInput');
    if (!input) return false;

    const raw = String(input.value || '').trim();
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        showToast('กรอกเลขหน้าเป็นตัวเลขเท่านั้น');
        input.value = String(activePageIndex + 1);
        return false;
    }

    const pageNumber = Math.floor(parsed);
    const pageCount = workbook.pages.length;
    if (pageNumber < 1 || pageNumber > pageCount) {
        showToast(`เลขหน้าต้องอยู่ระหว่าง 1 - ${pageCount}`);
        input.value = String(activePageIndex + 1);
        return false;
    }

    const changed = await goToPage(pageNumber - 1);
    if (!changed && pageNumber - 1 === activePageIndex) {
        showToast('คุณอยู่หน้านี้อยู่แล้ว');
    }
    return changed;
}

async function addPageAndGo() {
    try {
        persistCurrentPage();
        workbook.pages.push(createPageState());
        activePageIndex = workbook.pages.length - 1;
        await loadCanvasJson(currentPage().json);
        clearPropsPanel();
        updatePageIndicator();
        showToast('➕ เพิ่มหน้าใหม่แล้ว');
    } catch (error) {
        trackTelemetry('page_add_error', {
            message: String(error?.message || error || 'unknown-error'),
            activePageIndex,
            pageCount: workbook.pages.length,
        });
        showToast('ไม่สามารถเพิ่มหน้าใหม่ได้');
        throw error;
    }
}

async function duplicateCurrentPage() {
    persistCurrentPage();
    const source = currentPage()?.json || BLANK_PAGE_JSON;
    const insertAt = activePageIndex + 1;
    workbook.pages.splice(insertAt, 0, createPageState(source));
    activePageIndex = insertAt;
    await loadCanvasJson(source);
    clearPropsPanel();
    updatePageIndicator();
    showToast('📄 ทำซ้ำหน้านี้แล้ว');
    return true;
}

async function deleteCurrentPage(index = activePageIndex) {
    if (workbook.pages.length <= 1) {
        showToast('ต้องมีอย่างน้อย 1 หน้า');
        return false;
    }
    const targetIndex = Math.min(Math.max(Number(index) || 0, 0), workbook.pages.length - 1);
    workbook.pages.splice(targetIndex, 1);
    if (activePageIndex > targetIndex) activePageIndex -= 1;
    if (activePageIndex >= workbook.pages.length) activePageIndex = workbook.pages.length - 1;
    await loadCanvasJson(currentPage()?.json || BLANK_PAGE_JSON);
    clearPropsPanel();
    updatePageIndicator();
    showToast('🗑️ ลบหน้าแล้ว');
    return true;
}

function clearCurrentPage() {
    canvas.clear();
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    saveHistory();
    showToast('🧹 ล้างหน้านี้แล้ว');
}

async function movePage(fromIndex, toIndex) {
    const from = Math.min(Math.max(Number(fromIndex) || 0, 0), workbook.pages.length - 1);
    const to = Math.min(Math.max(Number(toIndex) || 0, 0), workbook.pages.length - 1);
    if (from === to) return false;
    const [moved] = workbook.pages.splice(from, 1);
    workbook.pages.splice(to, 0, moved);

    if (activePageIndex === from) {
        activePageIndex = to;
    } else if (from < activePageIndex && to >= activePageIndex) {
        activePageIndex -= 1;
    } else if (from > activePageIndex && to <= activePageIndex) {
        activePageIndex += 1;
    }

    await loadCanvasJson(currentPage()?.json || BLANK_PAGE_JSON);
    clearPropsPanel();
    updatePageIndicator();
    return true;
}

async function getPageThumbnails() {
    persistCurrentPage();
    const originalIndex = activePageIndex;
    const originalZoom = window.wbGetZoom?.() || 1;
    if (window.wbSetZoom) window.wbSetZoom(1);

    const pages = [];
    for (let i = 0; i < workbook.pages.length; i++) {
        await goToPage(i);
        canvas.discardActiveObject();
        canvas.renderAll();
        pages.push({
            index: i,
            preview: canvas.toDataURL({ format: 'png', quality: 0.85, multiplier: 0.25 }),
        });
    }

    await goToPage(originalIndex);
    if (window.wbSetZoom) window.wbSetZoom(originalZoom);
    return pages;
}

function saveHistory() {
    if (isReplaying) return;
    const page = currentPage();
    if (!page) return;

    page.redoStack = [];
    let snapshot = '';
    try {
        snapshot = serializeCanvasNow();
    } catch (error) {
        trackTelemetry('history_serialize_error', {
            message: String(error?.message || error || 'unknown-error'),
            activePageIndex,
        });
        return;
    }
    if (page.undoStack[page.undoStack.length - 1] !== snapshot) {
        page.undoStack.push(snapshot);
        if (page.undoStack.length > HISTORY_MAX) page.undoStack.shift();
    }
    page.json = snapshot;
}

function undo() {
    const page = currentPage();
    if (!page || page.undoStack.length <= 1) { showToast('ไม่มีอะไรให้ย้อนกลับ'); return; }

    page.redoStack.push(page.undoStack.pop());
    const state = page.undoStack[page.undoStack.length - 1];
    loadCanvasJson(state).then(() => {
        page.json = state;
        clearPropsPanel();
    });
}

function redo() {
    const page = currentPage();
    if (!page || !page.redoStack.length) { showToast('ไม่มีอะไรให้ทำซ้ำ'); return; }

    const state = page.redoStack.pop();
    page.undoStack.push(state);
    loadCanvasJson(state).then(() => {
        page.json = state;
        clearPropsPanel();
    });
}

function initWorkbook() {
    workbook.pages = [createPageState(BLANK_PAGE_JSON)];
    activePageIndex = 0;
    updatePageIndicator();
}

initWorkbook();

/* ── 3. ACTIVE TOOL STATE ───────────────────────────────────── */
window.activeTool = 'select'; // 'select' | 'text' | 'rect' | 'table' | 'line' | 'lineDoubleArrow' | 'curve' | 'callout' | 'writingLines'
let isDrawing = false;
let shapeStart = null;
let tempShape = null;
let lineSettings = {
    type: 'line',
    pattern: 'solid',
    width: 2,
};
let writingLineSettings = {
    style: 'primary',
    spacing: 46,
    width: 520,
    rows: 4,
};

function makeWritingLinesAt(x, y, width = 520, rows = 4, style = 'primary', spacing = 46) {
    const lines = [];
    const rowHeight = Math.max(24, Number(spacing) || 46);
    const mode = style || 'primary';

    if (mode === 'grid') {
        const totalH = rows * rowHeight;
        const cols = Math.max(2, Math.round(width / rowHeight));
        for (let r = 0; r <= rows; r++) {
            const yPos = y + r * rowHeight;
            lines.push(new fabric.Line([x, yPos, x + width, yPos], {
                stroke: '#94a3b8',
                strokeWidth: r % 5 === 0 ? 1.4 : 0.8,
                selectable: false,
                evented: false,
            }));
        }
        for (let c = 0; c <= cols; c++) {
            const xPos = x + c * rowHeight;
            lines.push(new fabric.Line([xPos, y, xPos, y + totalH], {
                stroke: '#94a3b8',
                strokeWidth: c % 5 === 0 ? 1.4 : 0.8,
                selectable: false,
                evented: false,
            }));
        }
    } else {
        for (let i = 0; i < rows; i++) {
            const baseY = y + i * rowHeight;
            lines.push(new fabric.Line([x, baseY, x + width, baseY], {
                stroke: '#1e293b',
                strokeWidth: 1.6,
                selectable: false,
                evented: false,
            }));
            if (mode === 'dotted') {
                lines.push(new fabric.Line([x, baseY + rowHeight / 2, x + width, baseY + rowHeight / 2], {
                    stroke: '#475569',
                    strokeWidth: 1.4,
                    strokeDashArray: [1, 8],
                    selectable: false,
                    evented: false,
                }));
            } else {
                lines.push(new fabric.Line([x, baseY + rowHeight / 2, x + width, baseY + rowHeight / 2], {
                    stroke: '#64748b',
                    strokeWidth: 1.2,
                    strokeDashArray: [3, 5],
                    selectable: false,
                    evented: false,
                }));
            }
        }
    }
    const g = new fabric.Group(lines, { objectCaching: false });
    g.data = { type: 'writingLines', style: mode, spacing: rowHeight, width, rows };
    return g;
}

function getNextAutoNumber() {
    let maxN = 0;
    canvas.getObjects().forEach(obj => {
        if (!obj || (obj.type !== 'i-text' && obj.type !== 'text' && obj.type !== 'textbox')) return;
        const t = String(obj.text || '').trim();
        const m = t.match(/^(\d+)\./);
        if (m) maxN = Math.max(maxN, Number(m[1] || 0));
    });
    return maxN + 1;
}

function addAutoNumberAt(x = 72, y = 96) {
    const n = getNextAutoNumber();
    const text = new fabric.IText(`${n}. `, {
        left: x,
        top: y,
        fontFamily: 'Sarabun',
        fontSize: 24,
        fill: document.getElementById('colorText')?.value || '#1e293b',
    });
    text.data = { type: 'autoNumber', seq: n };
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
}

const TEMPLATE_FACTORY = window.SMARTWS_TEMPLATE_FACTORY || {};

function getTemplateFactoryContext() {
    return {
        canvas,
        fabric,
        workbook,
        getPaperWidth: () => PAPER_W,
        getPaperHeight: () => PAPER_H,
        getWorksheetMode: () => worksheetMode,
        setWorksheetMode: (nextMode) => { worksheetMode = nextMode; },
        setActivePageIndex: (nextIndex) => { activePageIndex = nextIndex; },
        persistCurrentPage,
        currentPage,
        createPageState,
        loadCanvasJson,
        syncUiToggles,
        updatePageIndicator,
        showToast,
        trackTelemetry,
        saveHistory,
        applyWorksheetVisibilityMode,
        sanitizeTemplateCanvasData,
        addPageAndGo,
        BLANK_PAGE_JSON,
        applyTemplateImpl,
    };
}

function markAnswerOnlyForSelection(enabled) {
    if (typeof TEMPLATE_FACTORY.markAnswerOnlyForSelection === 'function') {
        return TEMPLATE_FACTORY.markAnswerOnlyForSelection(getTemplateFactoryContext(), enabled);
    }
    return false;
}

function duplicateAsAnswerKey() {
    if (typeof TEMPLATE_FACTORY.duplicateAsAnswerKey === 'function') {
        return TEMPLATE_FACTORY.duplicateAsAnswerKey(getTemplateFactoryContext());
    }
    return false;
}

function generateAnswerKeyPage() {
    if (typeof TEMPLATE_FACTORY.generateAnswerKeyPage === 'function') {
        return TEMPLATE_FACTORY.generateAnswerKeyPage(getTemplateFactoryContext());
    }
    return false;
}

function applyTemplateImpl(type) {
    if (!type) return;
    if (String(type).startsWith('curated_')) {
        const curatedId = String(type).replace(/^curated_/, '');
        applyCuratedTemplateById(curatedId, { mode: 'replace', skipConfirm: false });
        return;
    }
    if (!window.confirm('ใช้เทมเพลตนี้และล้างหน้าปัจจุบัน?')) {
        trackTelemetry('template_apply_cancelled', { template: type });
        return;
    }
    canvas.clear();
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    const txColor = document.getElementById('colorText')?.value || '#1e293b';

    if (type === 'mcq') {
        for (let i = 0; i < 8; i++) {
            const y = 90 + i * 110;
            canvas.add(new fabric.IText(`${i + 1}. ____________________________`, { left: 70, top: y, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
            canvas.add(new fabric.IText('ก. ☐   ข. ☐   ค. ☐   ง. ☐', { left: 95, top: y + 42, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        }
    }
    if (type === 'matching') {
        canvas.add(new fabric.IText('จับคู่คำศัพท์', { left: 70, top: 48, fontFamily: 'Fredoka', fontSize: 30, fill: txColor }));
        for (let i = 0; i < 8; i++) {
            const y = 120 + i * 95;
            canvas.add(new fabric.IText(`${i + 1}. __________`, { left: 90, top: y, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
            canvas.add(new fabric.IText(String.fromCharCode(65 + i) + '. __________', { left: 430, top: y, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        }
    }
    if (type === 'fillblank') {
        canvas.add(new fabric.IText('เติมคำในช่องว่าง', { left: 70, top: 48, fontFamily: 'Fredoka', fontSize: 30, fill: txColor }));
        for (let i = 0; i < 10; i++) {
            const y = 120 + i * 82;
            canvas.add(new fabric.IText(`${i + 1}. _______________________________________________`, { left: 70, top: y, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        }
    }
    if (type === 'bingo') {
        canvas.add(new fabric.IText('BINGO', { left: PAPER_W / 2 - 88, top: 44, fontFamily: 'Fredoka', fontSize: 42, fill: txColor }));
        addTableAt(110, 140, 5, 5);
    }
    if (type === 'taskcards4') {
        canvas.add(new fabric.IText('Task Cards', { left: 70, top: 36, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const marginX = 70;
        const marginY = 110;
        const gap = 22;
        const cardW = (PAPER_W - marginX * 2 - gap) / 2;
        const cardH = (PAPER_H - marginY * 2 - gap - 30) / 2;
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) {
                const left = marginX + c * (cardW + gap);
                const top = marginY + r * (cardH + gap);
                canvas.add(new fabric.Rect({ left, top, width: cardW, height: cardH, fill: '#ffffff', stroke: txColor, strokeWidth: 2, strokeDashArray: [10, 7], rx: 8, ry: 8 }));
                canvas.add(new fabric.IText(`${r * 2 + c + 1}`, { left: left + 12, top: top + 10, fontFamily: 'Fredoka', fontSize: 28, fill: txColor }));
            }
        }
    }
    if (type === 'taskcards8') {
        canvas.add(new fabric.IText('Task Cards', { left: 70, top: 34, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const marginX = 60;
        const marginY = 98;
        const gapX = 16;
        const gapY = 16;
        const cardW = (PAPER_W - marginX * 2 - gapX) / 2;
        const cardH = (PAPER_H - marginY * 2 - gapY * 3) / 4;
        let n = 1;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 2; c++) {
                const left = marginX + c * (cardW + gapX);
                const top = marginY + r * (cardH + gapY);
                canvas.add(new fabric.Rect({ left, top, width: cardW, height: cardH, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, strokeDashArray: [8, 6], rx: 6, ry: 6 }));
                canvas.add(new fabric.IText(`${n++}.`, { left: left + 10, top: top + 8, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
            }
        }
    }
    if (type === 'venn') {
        canvas.add(new fabric.IText('Venn Diagram', { left: 70, top: 46, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        canvas.add(new fabric.Circle({ left: 190, top: 260, radius: 180, fill: 'rgba(37,99,235,0.18)', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Circle({ left: 360, top: 260, radius: 180, fill: 'rgba(168,85,247,0.18)', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.IText('A', { left: 250, top: 220, fontFamily: 'Fredoka', fontSize: 30, fill: txColor }));
        canvas.add(new fabric.IText('B', { left: 470, top: 220, fontFamily: 'Fredoka', fontSize: 30, fill: txColor }));
    }
    if (type === 'frayer') {
        canvas.add(new fabric.IText('Frayer Model', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const top = 120;
        const width = PAPER_W - 140;
        const height = PAPER_H - 190;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + width / 2, top, left + width / 2, top + height], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left, top + height / 2, left + width, top + height / 2], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.IText('Definition', { left: left + 16, top: top + 14, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        canvas.add(new fabric.IText('Characteristics', { left: left + width / 2 + 16, top: top + 14, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        canvas.add(new fabric.IText('Examples', { left: left + 16, top: top + height / 2 + 14, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        canvas.add(new fabric.IText('Non-examples', { left: left + width / 2 + 16, top: top + height / 2 + 14, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
    }
    if (type === 'kwl') {
        canvas.add(new fabric.IText('KWL Chart', { left: 70, top: 46, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const top = 124;
        const width = PAPER_W - 140;
        const height = PAPER_H - 210;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + width / 3, top, left + width / 3, top + height], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + (width / 3) * 2, top, left + (width / 3) * 2, top + height], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.IText('K\nKnow', { left: left + 20, top: top + 12, fontFamily: 'Fredoka', fontSize: 28, fill: txColor }));
        canvas.add(new fabric.IText('W\nWant to know', { left: left + width / 3 + 20, top: top + 12, fontFamily: 'Fredoka', fontSize: 28, fill: txColor }));
        canvas.add(new fabric.IText('L\nLearned', { left: left + (width / 3) * 2 + 20, top: top + 12, fontFamily: 'Fredoka', fontSize: 28, fill: txColor }));
    }
    if (type === 'letterTracing') {
        canvas.add(new fabric.IText('Letter Tracing', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (let i = 0; i < letters.length; i++) {
            const y = 120 + i * 112;
            canvas.add(new fabric.Line([left, y + 72, left + width, y + 72], { stroke: '#64748b', strokeWidth: 1.8 }));
            canvas.add(new fabric.Line([left, y + 36, left + width, y + 36], { stroke: '#94a3b8', strokeWidth: 1.1, strokeDashArray: [4, 5] }));
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#64748b', strokeWidth: 1.8 }));
            canvas.add(new fabric.IText(`${letters[i]}  ${letters[i]}  ${letters[i]}  ${letters[i]}`, { left: left + 10, top: y + 8, fontFamily: 'Sarabun', fontSize: 28, fill: txColor, opacity: 0.55 }));
        }
    }
    if (type === 'storySequence') {
        canvas.add(new fabric.IText('Story Sequence', { left: 70, top: 42, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const stepW = (width - 24) / 3;
        const boxY = 130;
        const boxH = 350;
        ['Beginning', 'Middle', 'End'].forEach((label, idx) => {
            const x = left + idx * (stepW + 12);
            canvas.add(new fabric.Rect({ left: x, top: boxY, width: stepW, height: boxH, fill: '#fff', stroke: txColor, strokeWidth: 2, rx: 10, ry: 10 }));
            canvas.add(new fabric.IText(label, { left: x + 10, top: boxY + 10, fontFamily: 'Fredoka', fontSize: 22, fill: txColor }));
            canvas.add(new fabric.Rect({ left: x + 8, top: boxY + 50, width: stepW - 16, height: 180, fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.2, strokeDashArray: [6, 5], rx: 8, ry: 8 }));
            canvas.add(new fabric.Line([x + 10, boxY + 252, x + stepW - 10, boxY + 252], { stroke: '#94a3b8', strokeWidth: 1.2 }));
            canvas.add(new fabric.Line([x + 10, boxY + 288, x + stepW - 10, boxY + 288], { stroke: '#94a3b8', strokeWidth: 1.2 }));
            canvas.add(new fabric.Line([x + 10, boxY + 324, x + stepW - 10, boxY + 324], { stroke: '#94a3b8', strokeWidth: 1.2 }));
        });
    }
    if (type === 'cornellNotes') {
        canvas.add(new fabric.IText('Cornell Notes', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const top = 106;
        const width = PAPER_W - 140;
        const height = PAPER_H - 186;
        const cueWidth = Math.max(180, Math.round(width * 0.28));
        const summaryHeight = Math.max(120, Math.round(height * 0.2));
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + cueWidth, top, left + cueWidth, top + height - summaryHeight], { stroke: txColor, strokeWidth: 1.8 }));
        canvas.add(new fabric.Line([left, top + height - summaryHeight, left + width, top + height - summaryHeight], { stroke: txColor, strokeWidth: 1.8 }));
        canvas.add(new fabric.IText('Cue / Keywords', { left: left + 12, top: top + 10, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        canvas.add(new fabric.IText('Notes', { left: left + cueWidth + 12, top: top + 10, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        canvas.add(new fabric.IText('Summary', { left: left + 12, top: top + height - summaryHeight + 10, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
    }
    if (type === 'tchart') {
        canvas.add(new fabric.IText('T-Chart', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const top = 116;
        const width = PAPER_W - 140;
        const height = PAPER_H - 190;
        const headerHeight = 72;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + width / 2, top, left + width / 2, top + height], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left, top + headerHeight, left + width, top + headerHeight], { stroke: txColor, strokeWidth: 1.8 }));
        canvas.add(new fabric.IText('ด้านซ้าย', { left: left + 16, top: top + 18, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
        canvas.add(new fabric.IText('ด้านขวา', { left: left + width / 2 + 16, top: top + 18, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
    }
    if (type === 'causeEffect') {
        canvas.add(new fabric.IText('Cause-Effect Organizer', { left: 70, top: 42, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const centerX = PAPER_W / 2;
        const top = 160;
        const rowH = 180;
        for (let i = 0; i < 3; i++) {
            const y = top + i * rowH;
            canvas.add(new fabric.Rect({ left: 82, top: y, width: 260, height: 120, fill: '#fff', stroke: txColor, strokeWidth: 2, rx: 10, ry: 10 }));
            canvas.add(new fabric.Rect({ left: PAPER_W - 342, top: y, width: 260, height: 120, fill: '#fff', stroke: txColor, strokeWidth: 2, rx: 10, ry: 10 }));
            canvas.add(new fabric.Line([342, y + 60, PAPER_W - 342, y + 60], { stroke: txColor, strokeWidth: 2, strokeDashArray: [8, 6] }));
            canvas.add(new fabric.Triangle({ left: centerX, top: y + 60, width: 18, height: 14, angle: 90, originX: 'center', originY: 'center', fill: txColor, stroke: 'transparent' }));
            canvas.add(new fabric.IText(`Cause ${i + 1}`, { left: 96, top: y + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
            canvas.add(new fabric.IText(`Effect ${i + 1}`, { left: PAPER_W - 328, top: y + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        }
    }
    if (type === 'graphpaper') {
        canvas.add(new fabric.IText('Graph Paper', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 30, fill: txColor }));
        const left = 70;
        const top = 100;
        const width = PAPER_W - 140;
        const height = PAPER_H - 170;
        const step = 28;
        for (let x = left; x <= left + width; x += step) {
            canvas.add(new fabric.Line([x, top, x, top + height], { stroke: '#94a3b8', strokeWidth: x % (step * 5) === left % (step * 5) ? 1.4 : 0.8, selectable: false, evented: false }));
        }
        for (let y = top; y <= top + height; y += step) {
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#94a3b8', strokeWidth: y % (step * 5) === top % (step * 5) ? 1.4 : 0.8, selectable: false, evented: false }));
        }
    }
    if (type === 'numberline') {
        canvas.add(new fabric.IText('Number Line', { left: 70, top: 80, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const startX = 110;
        const endX = PAPER_W - 110;
        const y = PAPER_H / 2;
        canvas.add(new fabric.Line([startX, y, endX, y], { stroke: txColor, strokeWidth: 3 }));
        const ticks = 10;
        for (let i = 0; i <= ticks; i++) {
            const x = startX + ((endX - startX) / ticks) * i;
            canvas.add(new fabric.Line([x, y - 14, x, y + 14], { stroke: txColor, strokeWidth: 2 }));
            canvas.add(new fabric.IText(String(i), { left: x - 7, top: y + 18, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
        }
    }
    if (type === 'addSubPractice') {
        canvas.add(new fabric.IText('Add/Sub Practice', { left: 70, top: 48, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const columns = 2;
        const colW = (PAPER_W - 170) / columns;
        let n = 1;
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < columns; c++) {
                const x = 70 + c * (colW + 30);
                const y = 130 + r * 92;
                canvas.add(new fabric.IText(`${n++}.  ___ + ___ = ___`, { left: x, top: y, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
                canvas.add(new fabric.IText(`    ___ - ___ = ___`, { left: x, top: y + 36, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
            }
        }
    }
    if (type === 'fractionpies') {
        canvas.add(new fabric.IText('Fraction Pies', { left: 70, top: 54, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const centers = [
            { x: 200, y: 310, parts: 2 },
            { x: 420, y: 310, parts: 3 },
            { x: 620, y: 310, parts: 4 },
            { x: 260, y: 660, parts: 6 },
            { x: 540, y: 660, parts: 8 },
        ];
        centers.forEach(item => {
            canvas.add(new fabric.Circle({ left: item.x - 90, top: item.y - 90, radius: 90, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
            for (let i = 0; i < item.parts; i++) {
                const angle = (Math.PI * 2 * i) / item.parts;
                const x2 = item.x + Math.cos(angle) * 90;
                const y2 = item.y + Math.sin(angle) * 90;
                canvas.add(new fabric.Line([item.x, item.y, x2, y2], { stroke: txColor, strokeWidth: 1.6 }));
            }
            canvas.add(new fabric.IText(`/${item.parts}`, { left: item.x - 16, top: item.y + 104, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        });
    }
    if (type === 'ratioFraction') {
        canvas.add(new fabric.IText('Ratio & Fraction Practice', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const rows = 8;
        const rowH = 102;
        canvas.add(new fabric.Rect({ left, top: 116, width, height: rows * rowH, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + width * 0.5, 116, left + width * 0.5, 116 + rows * rowH], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.IText('Ratio Form', { left: left + 14, top: 124, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        canvas.add(new fabric.IText('Equivalent Fraction', { left: left + width * 0.5 + 14, top: 124, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        for (let i = 1; i < rows; i++) {
            const y = 116 + i * rowH;
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#94a3b8', strokeWidth: 1.2 }));
            canvas.add(new fabric.IText(`${i}.  ___ : ___`, { left: left + 16, top: y + 30, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
            canvas.add(new fabric.IText(`___ / ___`, { left: left + width * 0.5 + 16, top: y + 30, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
        }
    }
    if (type === 'quiz') {
        canvas.add(new fabric.IText('Quiz', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        for (let i = 0; i < 10; i++) {
            const y = 120 + i * 90;
            canvas.add(new fabric.IText(`${i + 1}. ___________________________________`, { left: 70, top: y, fontFamily: 'Sarabun', fontSize: 21, fill: txColor }));
            canvas.add(new fabric.IText('ก ○   ข ○   ค ○   ง ○', { left: 100, top: y + 34, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        }
    }
    if (type === 'rubric4') {
        canvas.add(new fabric.IText('Rubric (4-Level)', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 64;
        const top = 112;
        const width = PAPER_W - 128;
        const height = PAPER_H - 182;
        const headerHeight = 72;
        const rows = 5;
        const criteriaW = Math.round(width * 0.34);
        const levelW = (width - criteriaW) / 4;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left, top + headerHeight, left + width, top + headerHeight], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + criteriaW, top, left + criteriaW, top + height], { stroke: txColor, strokeWidth: 2 }));
        for (let c = 1; c < 4; c++) {
            const x = left + criteriaW + levelW * c;
            canvas.add(new fabric.Line([x, top, x, top + height], { stroke: txColor, strokeWidth: 1.6 }));
        }
        for (let r = 1; r <= rows; r++) {
            const y = top + headerHeight + ((height - headerHeight) / rows) * r;
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#94a3b8', strokeWidth: 1.2 }));
        }
        canvas.add(new fabric.IText('Criteria', { left: left + 10, top: top + 20, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        ['4', '3', '2', '1'].forEach((level, idx) => {
            const x = left + criteriaW + idx * levelW + 10;
            canvas.add(new fabric.IText(`Level ${level}`, { left: x, top: top + 20, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        });
        for (let i = 0; i < rows; i++) {
            const y = top + headerHeight + ((height - headerHeight) / rows) * i + 10;
            canvas.add(new fabric.IText(`Criterion ${i + 1}`, { left: left + 10, top: y, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
        }
    }
    if (type === 'matchingColumns') {
        canvas.add(new fabric.IText('Matching Columns', { left: 70, top: 46, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        for (let i = 0; i < 10; i++) {
            const y = 130 + i * 82;
            canvas.add(new fabric.IText(`${i + 1}. __________________`, { left: 90, top: y, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
            canvas.add(new fabric.IText(`${String.fromCharCode(65 + (i % 10))}. __________________`, { left: PAPER_W / 2 + 20, top: y, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        }
    }
    if (type === 'handwriting') {
        canvas.add(new fabric.IText('Handwriting Practice', { left: 70, top: 46, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const marginX = 70;
        const width = PAPER_W - marginX * 2;
        const rowHeight = 64;
        for (let i = 0; i < 12; i++) {
            const y = 130 + i * rowHeight;
            canvas.add(new fabric.Line([marginX, y, marginX + width, y], { stroke: '#64748b', strokeWidth: 1.8 }));
            canvas.add(new fabric.Line([marginX, y + rowHeight / 2, marginX + width, y + rowHeight / 2], { stroke: '#94a3b8', strokeWidth: 1.1, strokeDashArray: [4, 5] }));
            canvas.add(new fabric.Line([marginX, y + rowHeight, marginX + width, y + rowHeight], { stroke: '#64748b', strokeWidth: 1.8 }));
        }
    }
    if (type === 'comicstrip') {
        canvas.add(new fabric.IText('Comic Strip', { left: 70, top: 46, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const margin = 70;
        const gap = 16;
        const panelW = (PAPER_W - margin * 2 - gap) / 2;
        const panelH = 240;
        for (let i = 0; i < 4; i++) {
            const c = i % 2;
            const r = Math.floor(i / 2);
            const left = margin + c * (panelW + gap);
            const top = 120 + r * (panelH + 90);
            canvas.add(new fabric.Rect({ left, top, width: panelW, height: panelH, fill: '#fff', stroke: txColor, strokeWidth: 2, rx: 8, ry: 8 }));
            canvas.add(new fabric.Rect({ left, top: top + panelH + 12, width: panelW, height: 64, fill: '#fff', stroke: txColor, strokeWidth: 1.6, rx: 6, ry: 6 }));
        }
    }
    if (type === 'foldable') {
        canvas.add(new fabric.IText('Foldable / Flipbook', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const left = 70;
        const top = 120;
        const width = PAPER_W - 140;
        const height = PAPER_H - 180;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        const parts = 4;
        for (let i = 1; i < parts; i++) {
            const x = left + (width / parts) * i;
            canvas.add(new fabric.Line([x, top, x, top + height], { stroke: txColor, strokeWidth: 1.6, strokeDashArray: [8, 6] }));
        }
        canvas.add(new fabric.IText('Cut solid border | Fold dashed lines', { left: left + 10, top: top + height + 12, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
    }
    if (type === 'bingo3') {
        canvas.add(new fabric.IText('BINGO 3x3', { left: PAPER_W / 2 - 120, top: 60, fontFamily: 'Fredoka', fontSize: 40, fill: txColor }));
        addTableAt(170, 180, 3, 3);
    }
    if (type === 'wordsearch10') {
        canvas.add(new fabric.IText('Word Search 10x10', { left: 70, top: 54, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        addTableAt(100, 140, 10, 10);
    }
    if (type === 'boardgame') {
        canvas.add(new fabric.IText('Board Game Path', { left: 70, top: 52, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const cols = 6;
        const rows = 6;
        const size = 95;
        let n = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const col = r % 2 === 0 ? c : cols - 1 - c;
                const left = 100 + col * size;
                const top = 130 + r * size;
                canvas.add(new fabric.Rect({ left, top, width: size - 8, height: size - 8, fill: '#fff', stroke: txColor, strokeWidth: 2, rx: 10, ry: 10 }));
                canvas.add(new fabric.IText(String(n++), { left: left + 10, top: top + 8, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
            }
        }
    }
    if (type === 'exitticket') {
        canvas.add(new fabric.IText('Exit Tickets', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const top = 120;
        const width = PAPER_W - 140;
        const sectionH = 220;
        for (let i = 0; i < 4; i++) {
            const y = top + i * (sectionH + 14);
            canvas.add(new fabric.Rect({ left, top: y, width, height: sectionH, fill: '#fff', stroke: txColor, strokeWidth: 2, strokeDashArray: [10, 7], rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(`Ticket ${i + 1}`, { left: left + 12, top: y + 10, fontFamily: 'Fredoka', fontSize: 24, fill: txColor }));
        }
    }
    if (type === 'mindmap') {
        canvas.add(new fabric.IText('Mind Map', { left: 70, top: 48, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const centerX = PAPER_W / 2;
        const centerY = PAPER_H / 2;
        canvas.add(new fabric.Circle({ left: centerX - 90, top: centerY - 60, radius: 90, fill: 'rgba(59,130,246,0.18)', stroke: txColor, strokeWidth: 2 }));
        const branch = [
            { x: centerX - 250, y: centerY - 230 },
            { x: centerX + 160, y: centerY - 240 },
            { x: centerX - 280, y: centerY + 120 },
            { x: centerX + 180, y: centerY + 150 },
        ];
        branch.forEach((b, i) => {
            canvas.add(new fabric.Line([centerX, centerY, b.x + 80, b.y + 40], { stroke: txColor, strokeWidth: 2 }));
            canvas.add(new fabric.Rect({ left: b.x, top: b.y, width: 180, height: 90, fill: '#fff', stroke: txColor, strokeWidth: 2, rx: 10, ry: 10 }));
            canvas.add(new fabric.IText(`Topic ${i + 1}`, { left: b.x + 12, top: b.y + 10, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));
        });
    }
    if (type === 'certificate') {
        canvas.add(new fabric.Rect({ left: 50, top: 50, width: PAPER_W - 100, height: PAPER_H - 100, fill: '#fff', stroke: txColor, strokeWidth: 4 }));
        canvas.add(new fabric.Rect({ left: 72, top: 72, width: PAPER_W - 144, height: PAPER_H - 144, fill: 'transparent', stroke: txColor, strokeWidth: 1.6, strokeDashArray: [10, 7] }));
        canvas.add(new fabric.IText('Certificate of Achievement', { left: 130, top: 180, fontFamily: 'Fredoka', fontSize: 48, fill: txColor }));
        canvas.add(new fabric.IText('Presented to', { left: PAPER_W / 2 - 80, top: 340, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
        canvas.add(new fabric.Line([180, 430, PAPER_W - 180, 430], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.IText('for outstanding effort and learning', { left: 170, top: 500, fontFamily: 'Sarabun', fontSize: 26, fill: txColor }));
    }
    if (type === 'teacherplanner') {
        canvas.add(new fabric.IText('Weekly Teacher Planner', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const left = 70;
        const top = 120;
        const width = PAPER_W - 140;
        const colW = width / 5;
        const totalH = PAPER_H - 210;
        canvas.add(new fabric.Rect({ left, top, width, height: totalH, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        for (let i = 1; i < 5; i++) {
            const x = left + i * colW;
            canvas.add(new fabric.Line([x, top, x, top + totalH], { stroke: txColor, strokeWidth: 1.6 }));
        }
        for (let r = 1; r < 7; r++) {
            const y = top + r * (totalH / 7);
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#94a3b8', strokeWidth: 1.1 }));
        }
        days.forEach((d, i) => {
            canvas.add(new fabric.IText(d, { left: left + i * colW + 12, top: top + 8, fontFamily: 'Fredoka', fontSize: 22, fill: txColor }));
        });
    }
    if (type === 'lessonPlan') {
        canvas.add(new fabric.IText('Lesson Plan', { left: 70, top: 36, fontFamily: 'Fredoka', fontSize: 36, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        let y = 96;
        const sections = [
            { label: 'Objective', h: 92 },
            { label: 'Materials', h: 94 },
            { label: 'Procedure', h: 210 },
            { label: 'Assessment', h: 152 },
            { label: 'Reflection', h: 140 },
        ];
        sections.forEach((section) => {
            canvas.add(new fabric.Rect({ left, top: y, width, height: section.h, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(section.label, { left: left + 12, top: y + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
            y += section.h + 10;
        });
    }
    if (type === 'readingComprehension') {
        canvas.add(new fabric.IText('Reading Comprehension', { left: 70, top: 36, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const passageH = Math.round((PAPER_H - 170) * 0.36);
        const vocabH = Math.round((PAPER_H - 170) * 0.16);
        const questionsH = Math.round((PAPER_H - 170) * 0.30);
        const summaryH = Math.round((PAPER_H - 170) * 0.14);
        const top = 96;

        canvas.add(new fabric.Rect({ left, top, width, height: passageH, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Passage', { left: left + 12, top: top + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));

        const vocabTop = top + passageH + 10;
        canvas.add(new fabric.Rect({ left, top: vocabTop, width, height: vocabH, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Vocabulary', { left: left + 12, top: vocabTop + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));

        const qTop = vocabTop + vocabH + 10;
        canvas.add(new fabric.Rect({ left, top: qTop, width, height: questionsH, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Questions', { left: left + 12, top: qTop + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));

        const summaryTop = qTop + questionsH + 10;
        canvas.add(new fabric.Rect({ left, top: summaryTop, width, height: summaryH, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Summary', { left: left + 12, top: summaryTop + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
    }
    if (type === 'phonicsMatch') {
        canvas.add(new fabric.IText('Phonics Match', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        for (let i = 0; i < 8; i++) {
            const y = 126 + i * 96;
            canvas.add(new fabric.IText(`${i + 1}.  □  /${String.fromCharCode(97 + i)}/`, { left: 86, top: y + 10, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));
            canvas.add(new fabric.Rect({ left: 330, top: y, width: 360, height: 70, fill: '#fff', stroke: txColor, strokeWidth: 1.6, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText('word / picture clue', { left: 346, top: y + 18, fontFamily: 'Sarabun', fontSize: 20, fill: '#94a3b8' }));
        }
    }
    if (type === 'pictureVocabulary') {
        canvas.add(new fabric.IText('Picture Vocabulary', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const cols = 2;
        const rows = 4;
        const cardW = (PAPER_W - 170) / cols;
        const cardH = 205;
        let n = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = 70 + c * (cardW + 30);
                const y = 120 + r * (cardH + 14);
                canvas.add(new fabric.Rect({ left: x, top: y, width: cardW, height: cardH, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 10, ry: 10 }));
                canvas.add(new fabric.Rect({ left: x + 10, top: y + 10, width: cardW - 20, height: 128, fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.2, strokeDashArray: [6, 5], rx: 8, ry: 8 }));
                canvas.add(new fabric.IText(`${n++}. ___________________`, { left: x + 12, top: y + 154, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
            }
        }
    }
    if (type === 'contextClues') {
        canvas.add(new fabric.IText('Context Clues Vocabulary', { left: 70, top: 42, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const rowH = 150;
        for (let i = 0; i < 6; i++) {
            const y = 112 + i * (rowH + 10);
            canvas.add(new fabric.Rect({ left, top: y, width, height: rowH, fill: '#fff', stroke: txColor, strokeWidth: 1.6, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(`${i + 1}. Target Word: ____________`, { left: left + 12, top: y + 10, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
            canvas.add(new fabric.Line([left + 12, y + 54, left + width - 12, y + 54], { stroke: '#94a3b8', strokeWidth: 1.2 }));
            canvas.add(new fabric.IText('Sentence Context: __________________________________________', { left: left + 12, top: y + 62, fontFamily: 'Sarabun', fontSize: 18, fill: '#94a3b8' }));
            canvas.add(new fabric.IText('Meaning from context: _________________________', { left: left + 12, top: y + 102, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
        }
    }
    if (type === 'reflectionJournal') {
        canvas.add(new fabric.IText('Reflection Journal', { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const sections = ['What I learned today', 'What was challenging', 'How I can improve next time'];
        const left = 70;
        const width = PAPER_W - 140;
        let y = 106;
        sections.forEach((label) => {
            const h = 250;
            canvas.add(new fabric.Rect({ left, top: y, width, height: h, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(label, { left: left + 12, top: y + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
            for (let i = 0; i < 5; i++) {
                const lineY = y + 58 + i * 34;
                canvas.add(new fabric.Line([left + 12, lineY, left + width - 12, lineY], { stroke: '#94a3b8', strokeWidth: 1.1 }));
            }
            y += h + 12;
        });
    }
    if (type === 'projectPlanning') {
        canvas.add(new fabric.IText('Project Planning Sheet', { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const top = 106;
        canvas.add(new fabric.Rect({ left, top, width, height: 108, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Project Goal', { left: left + 12, top: top + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));

        const timelineTop = top + 122;
        canvas.add(new fabric.Rect({ left, top: timelineTop, width, height: 330, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Timeline / Milestones', { left: left + 12, top: timelineTop + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        for (let i = 0; i < 4; i++) {
            const y = timelineTop + 58 + i * 66;
            canvas.add(new fabric.Line([left + 12, y, left + width - 12, y], { stroke: '#94a3b8', strokeWidth: 1.1 }));
        }

        const roleTop = timelineTop + 344;
        canvas.add(new fabric.Rect({ left, top: roleTop, width, height: 250, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Roles / Task Owners', { left: left + 12, top: roleTop + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        canvas.add(new fabric.Line([left + width * 0.55, roleTop + 44, left + width * 0.55, roleTop + 234], { stroke: txColor, strokeWidth: 1.5 }));
        for (let i = 0; i < 4; i++) {
            const y = roleTop + 44 + i * 47;
            canvas.add(new fabric.Line([left + 12, y, left + width - 12, y], { stroke: '#94a3b8', strokeWidth: 1.1 }));
        }
    }
    if (type === 'criticalReadingEvidence') {
        canvas.add(new fabric.IText('Critical Reading + Evidence', { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        canvas.add(new fabric.Rect({ left, top: 102, width, height: 260, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Passage / Excerpt', { left: left + 12, top: 114, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        canvas.add(new fabric.Rect({ left, top: 376, width, height: 390, fill: '#fff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Claim - Evidence - Reasoning', { left: left + 12, top: 388, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
    }
    if (type === 'argumentEssayPlanner') {
        canvas.add(new fabric.IText('Argument Essay Planner', { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const sections = ['Thesis Statement', 'Reason 1 + Evidence', 'Reason 2 + Evidence', 'Counterargument + Rebuttal', 'Conclusion'];
        const left = 70;
        const width = PAPER_W - 140;
        let y = 102;
        sections.forEach((label, idx) => {
            const h = idx === 0 ? 110 : 150;
            canvas.add(new fabric.Rect({ left, top: y, width, height: h, fill: '#fff', stroke: txColor, strokeWidth: 1.7, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(label, { left: left + 12, top: y + 10, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
            y += h + 10;
        });
    }
    if (type === 'algebraWorkspace' || type === 'dataInterpretation' || type === 'practicalNumeracy') {
        const titleMap = {
            algebraWorkspace: 'Algebra Workspace',
            dataInterpretation: 'Data Interpretation',
            practicalNumeracy: 'Practical Numeracy',
        };
        canvas.add(new fabric.IText(titleMap[type], { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        for (let i = 0; i < 7; i++) {
            const y = 108 + i * 96;
            canvas.add(new fabric.Rect({ left, top: y, width, height: 82, fill: '#fff', stroke: txColor, strokeWidth: 1.5, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(`${i + 1}. _________________________________`, { left: left + 10, top: y + 24, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        }
    }
    if (type === 'cerFramework' || type === 'sourceAnalysis') {
        const titleMap = {
            cerFramework: 'CER Framework',
            sourceAnalysis: 'Source Analysis Sheet',
        };
        canvas.add(new fabric.IText(titleMap[type], { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const labels = type === 'cerFramework'
            ? ['Claim', 'Evidence', 'Reasoning']
            : ['Source Details', 'Main Claim', 'Bias/Perspective', 'Reliability Notes'];
        let y = 108;
        labels.forEach((label) => {
            const h = 160;
            canvas.add(new fabric.Rect({ left, top: y, width, height: h, fill: '#fff', stroke: txColor, strokeWidth: 1.7, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(label, { left: left + 12, top: y + 12, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
            y += h + 10;
        });
    }
    if (type === 'advancedTimeline') {
        canvas.add(new fabric.IText('Advanced Timeline', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 90;
        const right = PAPER_W - 90;
        const centerY = PAPER_H * 0.5;
        const points = 8;
        canvas.add(new fabric.Line([left, centerY, right, centerY], { stroke: txColor, strokeWidth: 3 }));
        for (let i = 0; i < points; i++) {
            const x = left + ((right - left) / (points - 1)) * i;
            const up = i % 2 === 0;
            const boxTop = up ? centerY - 160 : centerY + 64;
            canvas.add(new fabric.Circle({ left: x - 7, top: centerY - 7, radius: 7, fill: '#fff', stroke: txColor, strokeWidth: 2 }));
            canvas.add(new fabric.Line([x, centerY, x, up ? boxTop + 94 : boxTop], { stroke: txColor, strokeWidth: 1.4, strokeDashArray: [6, 5] }));
            canvas.add(new fabric.Rect({ left: x - 68, top: boxTop, width: 136, height: 94, fill: '#fff', stroke: txColor, strokeWidth: 1.6, rx: 8, ry: 8 }));
        }
    }
    if (type === 'debatePrep' || type === 'communicationRoleplay' || type === 'workplaceReading') {
        const titleMap = {
            debatePrep: 'Debate Prep Sheet',
            communicationRoleplay: 'Communication Role-play',
            workplaceReading: 'Workplace Reading Worksheet',
        };
        canvas.add(new fabric.IText(titleMap[type], { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 32, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        canvas.add(new fabric.Rect({ left, top: 108, width, height: 140, fill: '#fff', stroke: txColor, strokeWidth: 1.7, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Scenario / Prompt', { left: left + 12, top: 120, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
        for (let i = 0; i < 5; i++) {
            const y = 262 + i * 106;
            canvas.add(new fabric.Rect({ left, top: y, width, height: 92, fill: '#fff', stroke: txColor, strokeWidth: 1.4, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(`${i + 1}. ________________________________`, { left: left + 10, top: y + 30, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
        }
    }
    if (type === 'analyticRubric' || type === 'competencyRubric' || type === 'skillsSelfAssessment') {
        const titleMap = {
            analyticRubric: 'Analytic Rubric',
            competencyRubric: 'Competency Rubric',
            skillsSelfAssessment: 'Skills Self-assessment',
        };
        canvas.add(new fabric.IText(titleMap[type], { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 64;
        const top = 112;
        const width = PAPER_W - 128;
        const height = PAPER_H - 182;
        const headerHeight = 72;
        const rows = 6;
        const criteriaW = Math.round(width * 0.35);
        const levelW = (width - criteriaW) / 4;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left, top + headerHeight, left + width, top + headerHeight], { stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + criteriaW, top, left + criteriaW, top + height], { stroke: txColor, strokeWidth: 2 }));
        for (let c = 1; c < 4; c++) {
            const x = left + criteriaW + levelW * c;
            canvas.add(new fabric.Line([x, top, x, top + height], { stroke: txColor, strokeWidth: 1.6 }));
        }
        for (let r = 1; r <= rows; r++) {
            const y = top + headerHeight + ((height - headerHeight) / rows) * r;
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#94a3b8', strokeWidth: 1.2 }));
        }
    }
    if (type === 'examReviewTracker' || type === 'goalActionTracker' || type === 'procedureChecklist' || type === 'jobTaskWorksheet') {
        const titleMap = {
            examReviewTracker: 'Exam Review Tracker',
            goalActionTracker: 'Goal-Action Tracker',
            procedureChecklist: 'Procedure Checklist',
            jobTaskWorksheet: 'Job Task Worksheet',
        };
        canvas.add(new fabric.IText(titleMap[type], { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const top = 112;
        const height = PAPER_H - 182;
        canvas.add(new fabric.Rect({ left, top, width, height, fill: '#fff', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.Line([left + width * 0.4, top, left + width * 0.4, top + height], { stroke: txColor, strokeWidth: 1.4 }));
        canvas.add(new fabric.Line([left + width * 0.7, top, left + width * 0.7, top + height], { stroke: txColor, strokeWidth: 1.4 }));
        for (let i = 1; i <= 11; i++) {
            const y = top + i * (height / 12);
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#94a3b8', strokeWidth: 1.1 }));
        }
    }
    if (type === 'researchNotes' || type === 'problemSolvingCanvas' || type === 'portfolioEvidence' || type === 'reflectionLog') {
        const titleMap = {
            researchNotes: 'Research Notes Organizer',
            problemSolvingCanvas: 'Problem-solving Canvas',
            portfolioEvidence: 'Portfolio Evidence Sheet',
            reflectionLog: 'Reflection Log',
        };
        canvas.add(new fabric.IText(titleMap[type], { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 33, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        let y = 106;
        for (let i = 0; i < 5; i++) {
            const h = i === 0 ? 98 : 128;
            canvas.add(new fabric.Rect({ left, top: y, width, height: h, fill: '#fff', stroke: txColor, strokeWidth: 1.7, rx: 8, ry: 8 }));
            y += h + 10;
        }
    }
    if (type === 'timeline') {
        canvas.add(new fabric.IText('Timeline', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 90;
        const right = PAPER_W - 90;
        const centerY = PAPER_H * 0.52;
        const points = 6;
        canvas.add(new fabric.Line([left, centerY, right, centerY], { stroke: txColor, strokeWidth: 3 }));
        for (let i = 0; i < points; i++) {
            const x = left + ((right - left) / (points - 1)) * i;
            const boxW = Math.min(180, (right - left) / points - 12);
            const boxH = 92;
            const up = i % 2 === 0;
            const boxTop = up ? centerY - 170 : centerY + 70;
            const lineY = up ? boxTop + boxH : boxTop;
            canvas.add(new fabric.Circle({ left: x - 8, top: centerY - 8, radius: 8, fill: '#ffffff', stroke: txColor, strokeWidth: 2 }));
            canvas.add(new fabric.Line([x, centerY, x, lineY], { stroke: txColor, strokeWidth: 1.6, strokeDashArray: [6, 5] }));
            canvas.add(new fabric.Rect({ left: x - boxW / 2, top: boxTop, width: boxW, height: boxH, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 8, ry: 8 }));
            canvas.add(new fabric.IText(`เหตุการณ์ ${i + 1}`, { left: x - boxW / 2 + 10, top: boxTop + 10, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
        }
    }
    if (type === 'fishbone') {
        canvas.add(new fabric.IText('Fishbone Diagram', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const startX = 120;
        const endX = PAPER_W - 220;
        const centerY = PAPER_H * 0.53;
        canvas.add(new fabric.Line([startX, centerY, endX, centerY], { stroke: txColor, strokeWidth: 3.2 }));
        canvas.add(new fabric.Triangle({ left: endX + 18, top: centerY, width: 64, height: 56, angle: 90, originX: 'center', originY: 'center', fill: '#ffffff', stroke: txColor, strokeWidth: 2 }));
        canvas.add(new fabric.IText('ปัญหาหลัก', { left: endX + 54, top: centerY - 18, fontFamily: 'Sarabun', fontSize: 22, fill: txColor }));

        const bones = 4;
        const span = endX - startX - 100;
        for (let i = 0; i < bones; i++) {
            const x = startX + 60 + (span / (bones - 1)) * i;
            const upY = centerY - 95;
            const downY = centerY + 95;
            canvas.add(new fabric.Line([x, centerY, x - 70, upY], { stroke: txColor, strokeWidth: 2 }));
            canvas.add(new fabric.Line([x, centerY, x - 70, downY], { stroke: txColor, strokeWidth: 2 }));
            canvas.add(new fabric.IText(`สาเหตุ ${i + 1}`, { left: x - 170, top: upY - 28, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
            canvas.add(new fabric.IText(`สาเหตุ ${i + 5}`, { left: x - 170, top: downY + 6, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
        }
    }
    if (type === 'labreport') {
        canvas.add(new fabric.IText('Science Lab Report', { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 70;
        const width = PAPER_W - 140;
        const sectionTop = 108;
        const heights = [66, 72, 72, 92, 154, 156, 120];
        const labels = ['Title', 'Objective', 'Hypothesis', 'Materials', 'Procedure', 'Data / Observation', 'Conclusion'];
        let y = sectionTop;
        for (let i = 0; i < labels.length; i++) {
            const h = heights[i];
            canvas.add(new fabric.Rect({ left, top: y, width, height: h, fill: '#ffffff', stroke: txColor, strokeWidth: 1.8, rx: 6, ry: 6 }));
            canvas.add(new fabric.IText(labels[i], { left: left + 10, top: y + 8, fontFamily: 'Fredoka', fontSize: 20, fill: txColor }));
            y += h + 10;
        }
    }
    if (type === 'musicsheet') {
        canvas.add(new fabric.IText('Music Sheet', { left: 70, top: 42, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const left = 80;
        const right = PAPER_W - 80;
        const firstY = 130;
        const staffs = Math.max(5, Math.floor((PAPER_H - 170) / 120));
        const lineGap = 12;
        for (let s = 0; s < staffs; s++) {
            const baseY = firstY + s * 120;
            for (let line = 0; line < 5; line++) {
                const y = baseY + line * lineGap;
                canvas.add(new fabric.Line([left, y, right, y], { stroke: txColor, strokeWidth: 1.6 }));
            }
            canvas.add(new fabric.IText('𝄞', { left: left + 8, top: baseY - 14, fontFamily: 'Georgia', fontSize: 42, fill: txColor }));
            canvas.add(new fabric.Line([left + 36, baseY, left + 36, baseY + lineGap * 4], { stroke: txColor, strokeWidth: 1.6 }));
        }
    }
    if (type === 'flashcards') {
        canvas.add(new fabric.IText('Flashcards', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const marginX = 66;
        const marginY = 112;
        const cols = 2;
        const rows = 4;
        const gapX = 18;
        const gapY = 18;
        const cardW = (PAPER_W - marginX * 2 - gapX) / cols;
        const cardH = (PAPER_H - marginY * 2 - gapY * (rows - 1)) / rows;
        let n = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const left = marginX + c * (cardW + gapX);
                const top = marginY + r * (cardH + gapY);
                canvas.add(new fabric.Rect({ left, top, width: cardW, height: cardH, fill: '#ffffff', stroke: txColor, strokeWidth: 2, rx: 8, ry: 8 }));
                canvas.add(new fabric.IText(`Card ${n++}`, { left: left + 10, top: top + 8, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
            }
        }
        const cutX = PAPER_W / 2;
        canvas.add(new fabric.Line([cutX, marginY - 16, cutX, PAPER_H - marginY + 16], { stroke: txColor, strokeWidth: 1.2, strokeDashArray: [8, 7] }));
    }
    if (type === 'sudoku') {
        canvas.add(new fabric.IText('Sudoku 9x9', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const size = Math.min(PAPER_W - 160, PAPER_H - 220);
        const left = (PAPER_W - size) / 2;
        const top = 120;
        const cell = size / 9;
        canvas.add(new fabric.Rect({ left, top, width: size, height: size, fill: '#ffffff', stroke: txColor, strokeWidth: 2.8 }));
        for (let i = 1; i < 9; i++) {
            const thick = i % 3 === 0;
            const strokeWidth = thick ? 2.6 : 1.1;
            const offset = i * cell;
            canvas.add(new fabric.Line([left + offset, top, left + offset, top + size], { stroke: txColor, strokeWidth }));
            canvas.add(new fabric.Line([left, top + offset, left + size, top + offset], { stroke: txColor, strokeWidth }));
        }
    }
    if (type === 'maze') {
        canvas.add(new fabric.IText('Maze', { left: 70, top: 40, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        const size = Math.min(PAPER_W - 180, PAPER_H - 230);
        const left = (PAPER_W - size) / 2;
        const top = 120;
        const cols = 12;
        const rows = 12;
        const cellW = size / cols;
        const cellH = size / rows;

        canvas.add(new fabric.Rect({ left, top, width: size, height: size, fill: '#ffffff', stroke: txColor, strokeWidth: 2.4 }));

        for (let c = 1; c < cols; c++) {
            const x = left + c * cellW;
            if (c % 3 !== 0) {
                canvas.add(new fabric.Line([x, top, x, top + size], { stroke: txColor, strokeWidth: 1.2 }));
            }
        }
        for (let r = 1; r < rows; r++) {
            const y = top + r * cellH;
            if (r % 3 !== 0) {
                canvas.add(new fabric.Line([left, y, left + size, y], { stroke: txColor, strokeWidth: 1.2 }));
            }
        }

        const blockers = [
            [1, 0, 1, 4], [1, 5, 1, 10],
            [3, 2, 3, 7], [4, 8, 4, 11],
            [6, 0, 6, 3], [6, 4, 6, 9],
            [8, 1, 8, 6], [9, 7, 9, 11],
            [0, 2, 4, 2], [5, 2, 10, 2],
            [2, 5, 7, 5], [8, 5, 11, 5],
            [0, 8, 3, 8], [4, 8, 9, 8],
            [2, 10, 6, 10], [7, 10, 11, 10],
        ];
        blockers.forEach(([x1, y1, x2, y2]) => {
            canvas.add(new fabric.Line([
                left + x1 * cellW,
                top + y1 * cellH,
                left + x2 * cellW,
                top + y2 * cellH,
            ], { stroke: txColor, strokeWidth: 2.6 }));
        });

        canvas.add(new fabric.Circle({ left: left + 8, top: top + 8, radius: 10, fill: '#22c55e', stroke: txColor, strokeWidth: 1.2 }));
        canvas.add(new fabric.IText('Start', { left: left + 26, top: top + 4, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
        canvas.add(new fabric.Circle({ left: left + size - 22, top: top + size - 22, radius: 10, fill: '#ef4444', stroke: txColor, strokeWidth: 1.2 }));
        canvas.add(new fabric.IText('Finish', { left: left + size - 82, top: top + size - 42, fontFamily: 'Sarabun', fontSize: 18, fill: txColor }));
    }
    if (type === 'presTitle') {
        canvas.add(new fabric.Rect({ left: 0, top: 0, width: PAPER_W, height: PAPER_H, fill: '#ffffff', stroke: 'transparent' }));
        canvas.add(new fabric.Rect({ left: 56, top: 56, width: PAPER_W - 112, height: PAPER_H - 112, fill: 'transparent', stroke: txColor, strokeWidth: 2.2, rx: 12, ry: 12 }));
        canvas.add(new fabric.IText('Presentation Title', { left: 90, top: PAPER_H * 0.28, fontFamily: 'Fredoka', fontSize: Math.max(44, Math.floor(PAPER_W * 0.05)), fill: txColor }));
        canvas.add(new fabric.IText('Subtitle / Topic', { left: 92, top: PAPER_H * 0.43, fontFamily: 'Sarabun', fontSize: Math.max(24, Math.floor(PAPER_W * 0.024)), fill: txColor }));
        canvas.add(new fabric.Line([92, PAPER_H * 0.55, PAPER_W - 92, PAPER_H * 0.55], { stroke: txColor, strokeWidth: 2, strokeDashArray: [10, 7] }));
        canvas.add(new fabric.IText('Presenter • Date', { left: 92, top: PAPER_H * 0.60, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
    }
    if (type === 'presTwoCol') {
        canvas.add(new fabric.IText('Two-Column Slide', { left: 70, top: 38, fontFamily: 'Fredoka', fontSize: 42, fill: txColor }));
        const margin = 70;
        const top = 110;
        const gap = 22;
        const titleBandH = 74;
        const bodyH = PAPER_H - top - 54;
        const bodyY = top + titleBandH;
        const colW = (PAPER_W - margin * 2 - gap) / 2;

        canvas.add(new fabric.Rect({ left: margin, top, width: PAPER_W - margin * 2, height: titleBandH - 10, fill: '#ffffff', stroke: txColor, strokeWidth: 2, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Section Title', { left: margin + 14, top: top + 14, fontFamily: 'Sarabun', fontSize: 24, fill: txColor }));

        canvas.add(new fabric.Rect({ left: margin, top: bodyY, width: colW, height: bodyH - titleBandH, fill: '#ffffff', stroke: txColor, strokeWidth: 2, rx: 8, ry: 8 }));
        canvas.add(new fabric.Rect({ left: margin + colW + gap, top: bodyY, width: colW, height: bodyH - titleBandH, fill: '#ffffff', stroke: txColor, strokeWidth: 2, rx: 8, ry: 8 }));
        canvas.add(new fabric.IText('Left Column', { left: margin + 12, top: bodyY + 10, fontFamily: 'Fredoka', fontSize: 24, fill: txColor }));
        canvas.add(new fabric.IText('Right Column', { left: margin + colW + gap + 12, top: bodyY + 10, fontFamily: 'Fredoka', fontSize: 24, fill: txColor }));
    }
    canvas.renderAll();
    saveHistory();
    trackTelemetry('template_apply_success', { template: type, objectCount: canvas.getObjects().length });
    showToast('📄 ใส่เทมเพลตแล้ว');
}

function applyTemplate(type) {
    if (typeof TEMPLATE_FACTORY.applyTemplate === 'function') {
        return TEMPLATE_FACTORY.applyTemplate(getTemplateFactoryContext(), type);
    }
    return applyTemplateImpl(type);
}

function applyCuratedTemplateById(templateId, options = {}) {
    if (typeof TEMPLATE_FACTORY.applyCuratedTemplateById === 'function') {
        return TEMPLATE_FACTORY.applyCuratedTemplateById(getTemplateFactoryContext(), templateId, options);
    }
    return false;
}

function getBoundsForSnap(obj) {
    const b = obj.getBoundingRect(true, true);
    return {
        left: b.left,
        top: b.top,
        right: b.left + b.width,
        bottom: b.top + b.height,
        centerX: b.left + b.width / 2,
        centerY: b.top + b.height / 2,
        width: b.width,
        height: b.height,
    };
}

function snapMovingObject(obj) {
    if (!obj) return;
    if (obj.data?.curatedTemplateObject) return;
    const bounds = getBoundsForSnap(obj);
    let nextLeft = obj.left;
    let nextTop = obj.top;

    const targetCenterX = PAPER_W / 2;
    const targetCenterY = PAPER_H / 2;
    if (Math.abs(bounds.centerX - targetCenterX) <= SNAP_TOLERANCE) {
        nextLeft += targetCenterX - bounds.centerX;
    }
    if (Math.abs(bounds.centerY - targetCenterY) <= SNAP_TOLERANCE) {
        nextTop += targetCenterY - bounds.centerY;
    }

    const gridX = Math.round(nextLeft / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.round(nextTop / GRID_SIZE) * GRID_SIZE;
    if (Math.abs(nextLeft - gridX) <= SNAP_TOLERANCE) nextLeft = gridX;
    if (Math.abs(nextTop - gridY) <= SNAP_TOLERANCE) nextTop = gridY;

    const others = canvas.getObjects().filter(o => o !== obj && o.visible !== false);
    others.forEach(other => {
        const ob = getBoundsForSnap(other);
        const deltaL = Math.abs(bounds.left - ob.left);
        const deltaR = Math.abs(bounds.right - ob.right);
        const deltaT = Math.abs(bounds.top - ob.top);
        const deltaB = Math.abs(bounds.bottom - ob.bottom);

        if (deltaL <= SNAP_TOLERANCE) {
            nextLeft += ob.left - bounds.left;
        }
        if (deltaR <= SNAP_TOLERANCE) {
            nextLeft += ob.right - bounds.right;
        }
        if (deltaT <= SNAP_TOLERANCE) {
            nextTop += ob.top - bounds.top;
        }
        if (deltaB <= SNAP_TOLERANCE) {
            nextTop += ob.bottom - bounds.bottom;
        }
    });

    obj.set({ left: nextLeft, top: nextTop });
}

function getLineSettingsFromPanel() {
    const typeEl = document.getElementById('propLineType');
    const patternEl = document.getElementById('propLinePattern');
    const widthEl = document.getElementById('propLineWidth');

    return {
        type: typeEl?.value || lineSettings.type || 'line',
        pattern: patternEl?.value || lineSettings.pattern || 'solid',
        width: Math.max(1, Number(widthEl?.value || lineSettings.width || 2)),
    };
}

function getDashArray(pattern, width) {
    if (pattern === 'dashed') return [Math.max(8, width * 3), Math.max(4, width * 1.8)];
    if (pattern === 'dotted') return [1, Math.max(5, width * 2.2)];
    return null;
}

function createArrowHead(endX, endY, angleDeg, stroke, width) {
    const size = Math.max(8, width * 4.4);
    const head = new fabric.Triangle({
        left: endX,
        top: endY,
        width: size,
        height: size,
        originX: 'center',
        originY: 'center',
        angle: angleDeg + 90,
        fill: stroke,
        stroke: stroke,
        strokeWidth: 1,
        selectable: false,
        evented: false,
    });
    return head;
}

function makeLineLikeShape(x1, y1, x2, y2, opts) {
    const stroke = getStroke();
    const width = Math.max(1, Number(opts.width || 2));
    const pattern = opts.pattern || 'solid';
    const dash = getDashArray(pattern, width);

    if (opts.type === 'line') {
        const line = new fabric.Line([x1, y1, x2, y2], {
            stroke,
            strokeWidth: width,
            strokeLineCap: 'round',
            strokeDashArray: dash,
            fill: 'transparent',
        });
        line.data = { type: 'lineShape', lineMode: 'line', pattern, lineWidth: width, isLineTool: true };
        return line;
    }

    const base = new fabric.Line([x1, y1, x2, y2], {
        stroke,
        strokeWidth: width,
        strokeLineCap: 'round',
        strokeDashArray: dash,
        fill: 'transparent',
        selectable: false,
        evented: false,
    });

    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const heads = [createArrowHead(x2, y2, angle, stroke, width)];
    if (opts.type === 'doubleArrow') heads.push(createArrowHead(x1, y1, angle + 180, stroke, width));

    const group = new fabric.Group([base, ...heads], {
        objectCaching: false,
    });
    group.data = { type: 'lineShape', lineMode: opts.type, pattern, lineWidth: width, isLineTool: true };
    return group;
}

function makeCurveShape(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const cx = x1 + dx / 2;
    const cy = y1 + dy / 2 - Math.max(30, Math.abs(dx) * 0.25);
    const path = new fabric.Path(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, {
        fill: 'transparent',
        stroke: getStroke(),
        strokeWidth: Math.max(1, Number(lineSettings.width || 2)),
        strokeLineCap: 'round',
        strokeDashArray: getDashArray(lineSettings.pattern || 'solid', Math.max(1, Number(lineSettings.width || 2))),
    });
    path.data = { type: 'lineShape', lineMode: 'curve', pattern: lineSettings.pattern || 'solid', lineWidth: Math.max(1, Number(lineSettings.width || 2)), isLineTool: true };
    return path;
}

function normalizeTableCells(cells, rows, cols) {
    const output = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(String(cells?.[r]?.[c] || ''));
        }
        output.push(row);
    }
    return output;
}

function createSmartTableGroup({ x, y, rows = 4, cols = 4, cellW = 96, cellH = 52, cells = null }) {
    const stroke = getStroke();
    const width = Math.max(1, Number(lineSettings.width || 2));
    const pattern = lineSettings.pattern || 'solid';
    const dash = getDashArray(pattern, width);
    const textColor = document.getElementById('colorText')?.value || '#1e293b';
    const normalized = normalizeTableCells(cells, rows, cols);

    const objects = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const left = c * cellW;
            const top = r * cellH;
            objects.push(new fabric.Rect({
                left,
                top,
                width: cellW,
                height: cellH,
                fill: '#ffffff',
                stroke,
                strokeWidth: width,
                strokeDashArray: dash,
                selectable: false,
                evented: false,
                name: `tableCell_${r}_${c}`,
            }));
            objects.push(new fabric.IText(normalized[r][c], {
                left: left + 8,
                top: top + Math.max(6, (cellH - 24) / 2),
                fontFamily: 'Sarabun',
                fontSize: 18,
                fill: textColor,
                selectable: false,
                evented: false,
                name: `tableText_${r}_${c}`,
            }));
        }
    }

    const group = new fabric.Group(objects, {
        left: x,
        top: y,
        subTargetCheck: true,
        objectCaching: false,
    });
    group.data = {
        type: 'table',
        rows,
        cols,
        cellW,
        cellH,
        cells: normalized,
        lineMode: 'line',
        pattern,
        lineWidth: width,
        isLineTool: true,
    };
    return group;
}

function rebuildSmartTable(tableGroup, nextRows, nextCols) {
    if (!tableGroup?.data || tableGroup.data.type !== 'table') return null;
    const rows = Math.max(1, Number(nextRows) || 1);
    const cols = Math.max(1, Number(nextCols) || 1);
    const replacement = createSmartTableGroup({
        x: tableGroup.left,
        y: tableGroup.top,
        rows,
        cols,
        cellW: Number(tableGroup.data.cellW || 96),
        cellH: Number(tableGroup.data.cellH || 52),
        cells: tableGroup.data.cells || [],
    });
    replacement.set({ angle: tableGroup.angle || 0, scaleX: tableGroup.scaleX || 1, scaleY: tableGroup.scaleY || 1 });
    canvas.remove(tableGroup);
    canvas.add(replacement);
    canvas.setActiveObject(replacement);
    canvas.requestRenderAll();
    return replacement;
}

function editSmartTableCellAtPointer(group, pointer) {
    if (!group?.data || group.data.type !== 'table') return false;
    const rows = Number(group.data.rows || 0);
    const cols = Number(group.data.cols || 0);
    const cellW = Number(group.data.cellW || 96);
    const cellH = Number(group.data.cellH || 52);
    if (!rows || !cols) return false;

    const localX = (pointer.x - group.left) / (group.scaleX || 1);
    const localY = (pointer.y - group.top) / (group.scaleY || 1);
    const col = Math.floor(localX / cellW);
    const row = Math.floor(localY / cellH);
    if (row < 0 || col < 0 || row >= rows || col >= cols) return false;

    const oldValue = String(group.data.cells?.[row]?.[col] || '');
    const nextValue = window.prompt(`แก้ไขเซลล์ R${row + 1}C${col + 1}`, oldValue);
    if (nextValue === null) return false;

    group.data.cells[row][col] = String(nextValue);
    const next = rebuildSmartTable(group, rows, cols);
    if (next) showToast(`อัปเดตตาราง R${row + 1}C${col + 1} แล้ว`);
    return !!next;
}

function addTableAt(x, y, rows = 4, cols = 4) {
    const group = createSmartTableGroup({ x, y, rows, cols, cellW: 96, cellH: 52 });
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
}

function addTableRowCol(rowDelta = 0, colDelta = 0) {
    const active = canvas.getActiveObject();
    if (!active?.data || active.data.type !== 'table') {
        showToast('เลือกตารางก่อน');
        return false;
    }
    const nextRows = Math.max(1, Number(active.data.rows || 1) + Number(rowDelta || 0));
    const nextCols = Math.max(1, Number(active.data.cols || 1) + Number(colDelta || 0));
    const rebuilt = rebuildSmartTable(active, nextRows, nextCols);
    if (rebuilt) {
        showToast(`ตาราง ${nextRows}x${nextCols}`);
        return true;
    }
    return false;
}

function askTableSize() {
    const rawRows = window.prompt('จำนวนแถว (Rows):', '4');
    if (rawRows === null) return null;
    const rawCols = window.prompt('จำนวนคอลัมน์ (Columns):', '4');
    if (rawCols === null) return null;

    const rows = Math.min(20, Math.max(1, Number(rawRows) || 4));
    const cols = Math.min(20, Math.max(1, Number(rawCols) || 4));
    return { rows, cols };
}

function addCalloutAt(x, y) {
    const stroke = getStroke();
    const fill = getFill();
    const boxW = 190;
    const boxH = 84;

    const bubble = new fabric.Rect({
        left: x,
        top: y,
        width: boxW,
        height: boxH,
        rx: 10,
        ry: 10,
        fill,
        stroke,
        strokeWidth: 2,
        originX: 'left',
        originY: 'top',
    });

    const tip = new fabric.Triangle({
        left: x + 22,
        top: y + boxH + 10,
        width: 24,
        height: 20,
        angle: 180,
        fill,
        stroke,
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
    });

    const text = new fabric.IText('', {
        left: x + 12,
        top: y + 10,
        width: boxW - 24,
        fontFamily: 'Sarabun',
        fontSize: 18,
        fill: document.getElementById('colorText')?.value || '#1e293b',
        name: 'calloutText',
    });

    const callout = new fabric.Group([bubble, tip, text], {
        subTargetCheck: true,
        interactive: true,
    });
    callout.data = { type: 'callout' };
    canvas.add(callout);
    canvas.setActiveObject(callout);

    // Auto-edit internal text on double-click
    callout.on('mousedblclick', (opt) => {
        if (opt.subTargets && opt.subTargets[0] && opt.subTargets[0].type === 'i-text') {
            const innerText = opt.subTargets[0];
            innerText.enterEditing();
            canvas.setActiveObject(innerText);
            canvas.renderAll();
        }
    });

    canvas.renderAll();
}

function setActiveTool(tool) {
    window.activeTool = tool;
    canvas.isDrawingMode = false;
    canvas.defaultCursor = 'default';
    canvas.selection = true;

    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === tool);
    });

    if (tool === 'select') {
        canvas.getObjects().forEach(o => {
            const locked = !!o.data?.locked;
            o.set({ selectable: !locked, evented: !locked, hasControls: !locked });
        });
    } else {
        canvas.discardActiveObject();
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';

        // Show properties for the selected tool immediately
        if (tool.includes('line') || tool === 'curve') {
            showLinePropsForTool(tool);
        }
    }
}

function showLinePropsForTool(tool) {
    const objectProps = document.getElementById('objectProps');
    const lineProps = document.getElementById('lineProps');
    const propsContent = document.getElementById('propsContent');
    const textProps = document.getElementById('textProps');

    if (propsContent) propsContent.style.display = 'none';
    if (objectProps) objectProps.style.display = '';
    if (lineProps) lineProps.style.display = '';
    if (textProps) textProps.style.display = 'none';

    // Sync line type dropdown
    const typeEl = document.getElementById('propLineType');
    const patternEl = document.getElementById('propLinePattern');
    if (typeEl) {
        if (tool === 'line') typeEl.value = 'line';
        else if (tool === 'lineArrow') typeEl.value = 'arrow';
        else if (tool === 'lineDoubleArrow') typeEl.value = 'doubleArrow';
        else if (tool === 'curve') typeEl.value = 'line'; // or curve if we had it
    }
    if (patternEl) patternEl.value = lineSettings.pattern || 'solid';
}

/* ── 4. AUTO-SAVE HISTORY ON MODIFICATION ─────────────────── */
canvas.on('object:added', saveHistory);
canvas.on('object:removed', saveHistory);
canvas.on('object:modified', saveHistory);
canvas.on('object:moving', (opt) => {
    if (isReplaying) return;
    snapMovingObject(opt.target);
});

/* ── 5. SHAPE DRAWING (Rect, Line) ─────────────────────────── */
const getFill = () => document.getElementById('colorFill')?.value || '#ffffff';
const getStroke = () => document.getElementById('colorStroke')?.value || '#1e293b';

canvas.on('mouse:down', (opt) => {
    if (window.activeTool === 'select') return;
    lineSettings = getLineSettingsFromPanel();

    if (window.activeTool === 'text') {
        const ptr = canvas.getPointer(opt.e);
        const text = new fabric.IText('พิมพ์ข้อความที่นี่', {
            left: ptr.x, top: ptr.y,
            fontFamily: 'Sarabun',
            fontSize: 20,
            fill: document.getElementById('colorText')?.value || '#1e293b',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        setActiveTool('select');
        return;
    }

    if (window.activeTool === 'callout') {
        const ptr = canvas.getPointer(opt.e);
        addCalloutAt(ptr.x, ptr.y);
        setActiveTool('select');
        return;
    }

    if (window.activeTool === 'table') {
        const ptr = canvas.getPointer(opt.e);
        const tableSize = askTableSize();
        if (!tableSize) {
            setActiveTool('select');
            return;
        }
        addTableAt(ptr.x, ptr.y, tableSize.rows, tableSize.cols);
        setActiveTool('select');
        return;
    }

    if (window.activeTool === 'writingLines') {
        const ptr = canvas.getPointer(opt.e);
        const group = makeWritingLinesAt(
            ptr.x,
            ptr.y,
            writingLineSettings.width,
            writingLineSettings.rows,
            writingLineSettings.style,
            writingLineSettings.spacing,
        );
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        setActiveTool('select');
        return;
    }

    isDrawing = true;
    const ptr = canvas.getPointer(opt.e);
    shapeStart = { x: ptr.x, y: ptr.y };

    if (window.activeTool === 'rect') {
        tempShape = new fabric.Rect({
            left: ptr.x, top: ptr.y, width: 1, height: 1,
            fill: getFill(), stroke: getStroke(), strokeWidth: 2,
            rx: 4, ry: 4,
        });
    } else if (['line', 'lineArrow', 'lineDoubleArrow'].includes(window.activeTool)) {
        const requested = { ...lineSettings };
        if (window.activeTool === 'lineArrow') requested.type = 'arrow';
        else if (window.activeTool === 'lineDoubleArrow') requested.type = 'doubleArrow';
        else if (window.activeTool === 'line') requested.type = 'line';

        tempShape = makeLineLikeShape(ptr.x, ptr.y, ptr.x, ptr.y, requested);
    } else if (window.activeTool === 'curve') {
        tempShape = makeCurveShape(ptr.x, ptr.y, ptr.x, ptr.y);
    }

    if (tempShape) canvas.add(tempShape);
});

canvas.on('mouse:move', (opt) => {
    if (!isDrawing || !tempShape || !shapeStart) return;
    const ptr = canvas.getPointer(opt.e);
    if (window.activeTool === 'rect') {
        const w = Math.abs(ptr.x - shapeStart.x);
        const h = Math.abs(ptr.y - shapeStart.y);
        tempShape.set({
            left: Math.min(ptr.x, shapeStart.x),
            top: Math.min(ptr.y, shapeStart.y),
            width: w, height: h,
        });
    } else if (['line', 'lineArrow', 'lineDoubleArrow'].includes(window.activeTool)) {
        canvas.remove(tempShape);
        const requested = { ...lineSettings };
        if (window.activeTool === 'lineArrow') requested.type = 'arrow';
        else if (window.activeTool === 'lineDoubleArrow') requested.type = 'doubleArrow';
        else if (window.activeTool === 'line') requested.type = 'line';

        tempShape = makeLineLikeShape(shapeStart.x, shapeStart.y, ptr.x, ptr.y, requested);
        canvas.add(tempShape);
    } else if (window.activeTool === 'curve') {
        canvas.remove(tempShape);
        tempShape = makeCurveShape(shapeStart.x, shapeStart.y, ptr.x, ptr.y);
        canvas.add(tempShape);
    }
    canvas.renderAll();
});

canvas.on('mouse:up', () => {
    if (!isDrawing) return;
    isDrawing = false;
    tempShape = null;
    shapeStart = null;
    setActiveTool('select');
});

canvas.on('mouse:dblclick', (opt) => {
    const target = opt?.target;
    if (!target?.data || target.data.type !== 'table') return;
    const pointer = canvas.getPointer(opt.e);
    const edited = editSmartTableCellAtPointer(target, pointer);
    if (edited) saveHistory();
});

/* ── 6. SELECTION CHANGE → update properties panel ────────── */
canvas.on('selection:created', updatePropsPanel);
canvas.on('selection:updated', updatePropsPanel);
canvas.on('selection:cleared', clearPropsPanel);

function updatePropsPanel() {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    const propsContent = document.getElementById('propsContent');
    const textProps = document.getElementById('textProps');
    const objectProps = document.getElementById('objectProps');
    const lineProps = document.getElementById('lineProps');
    if (propsContent) propsContent.style.display = 'none';
    if (objectProps) objectProps.style.display = '';

    if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
        if (textProps) textProps.style.display = '';
        const fsEl = document.getElementById('propFontSize');
        if (fsEl) fsEl.value = obj.fontSize || 20;
        const ffEl = document.getElementById('propFontFamily');
        if (ffEl) ffEl.value = obj.fontFamily || 'Sarabun';
    } else if (obj.data?.type === 'equation') {
        if (textProps) textProps.style.display = '';
        const fsEl = document.getElementById('propFontSize');
        if (fsEl) fsEl.value = obj.data.fontSize || 22;
    } else {
        if (textProps) textProps.style.display = 'none';
    }

    const isLineLike = obj.type === 'line' || obj.type === 'path' || obj.data?.isLineTool;
    if (lineProps) lineProps.style.display = isLineLike ? '' : 'none';
    if (isLineLike) {
        const typeEl = document.getElementById('propLineType');
        const patternEl = document.getElementById('propLinePattern');
        const widthEl = document.getElementById('propLineWidth');
        const widthValEl = document.getElementById('propLineWidthVal');
        const lineMode = obj.data?.lineMode || (obj.type === 'path' ? 'curve' : 'line');
        const lineWidth = Number(obj.data?.lineWidth || obj.strokeWidth || 2);
        const pattern = obj.data?.pattern || (obj.strokeDashArray?.length ? 'dashed' : 'solid');

        if (typeEl) typeEl.value = lineMode === 'doubleArrow' ? 'doubleArrow' : (lineMode === 'arrow' ? 'arrow' : 'line');
        if (patternEl) patternEl.value = pattern;
        if (widthEl) widthEl.value = String(lineWidth);
        if (widthValEl) widthValEl.textContent = `${lineWidth}px`;
    }

    const opEl = document.getElementById('propOpacity');
    const opValEl = document.getElementById('propOpacityVal');
    const answerOnlyEl = document.getElementById('propAnswerOnly');
    if (opEl) {
        opEl.value = Math.round((obj.opacity || 1) * 100);
        if (opValEl) opValEl.textContent = opEl.value + '%';
    }
    if (answerOnlyEl) answerOnlyEl.checked = !!obj.data?.answerOnly;
}

function clearPropsPanel() {
    const propsContent = document.getElementById('propsContent');
    const textProps = document.getElementById('textProps');
    const objectProps = document.getElementById('objectProps');
    const lineProps = document.getElementById('lineProps');
    if (propsContent) propsContent.style.display = '';
    if (textProps) textProps.style.display = 'none';
    if (objectProps) objectProps.style.display = 'none';
    if (lineProps) lineProps.style.display = 'none';
}

/* ── 7. KEYBOARD SHORTCUTS ─────────────────────────────────── */
document.addEventListener('keydown', (e) => {
    if (canvas.getActiveObject()?.isEditing) return;

    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (e.ctrlKey && (e.key === 'y' || e.key === 'Z')) { e.preventDefault(); redo(); return; }

    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'v' || e.key === 'V') setActiveTool('select');
        if (e.key === 't' || e.key === 'T') setActiveTool('text');
        if (e.key === 'r' || e.key === 'R') setActiveTool('rect');
        if (e.key === 'g' || e.key === 'G') setActiveTool('table');
        if (e.key === 'l' || e.key === 'L') setActiveTool('line');
        if (e.key === 'c' || e.key === 'C') setActiveTool('curve');
        if (e.key === 'w' || e.key === 'W') setActiveTool('writingLines');
    }

    if (e.ctrlKey && e.shiftKey && (e.key === 'N' || e.key === 'n')) {
        e.preventDefault();
        addAutoNumberAt(72, 96 + (getNextAutoNumber() - 1) * 52);
        return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObjects();
        if (active.length) {
            active.forEach(o => canvas.remove(o));
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    }

    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        const obj = canvas.getActiveObject();
        if (!obj) return;
        obj.clone((cloned) => {
            cloned.set({ left: obj.left + 20, top: obj.top + 20 });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
        });
    }
});

/* ── 8. CANVAS DRAG-OVER for SVG drop ─────────────────────── */
window.fabricAddSvgAtCenter = function (svgStr) {
    fabric.loadSVGFromString(svgStr, (objects, options) => {
        const group = fabric.util.groupSVGElements(objects, options);
        const scale = 120 / (group.height || 1);
        group.set({
            left: PAPER_W / 2 - (group.width * scale) / 2,
            top: PAPER_H / 2 - (group.height * scale) / 2,
            scaleX: scale, scaleY: scale,
        });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
    });
};

window.fabricAddSvgAt = function (svgStr, x, y) {
    fabric.loadSVGFromString(svgStr, (objects, options) => {
        const group = fabric.util.groupSVGElements(objects, options);
        const scale = 100 / (Math.max(group.width, group.height) || 1);
        group.set({
            left: x - (group.width * scale) / 2,
            top: y - (group.height * scale) / 2,
            scaleX: scale, scaleY: scale,
        });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
    });
};

/* ── 9. CANVAS DROP ZONE for SVG files ─────────────────────── */
const canvasEl = document.getElementById('worksheetCanvas');
canvasEl.addEventListener('dragover', e => e.preventDefault());
canvasEl.addEventListener('drop', e => {
    e.preventDefault();
    const svgStr = e.dataTransfer?.getData('text/svg');
    if (!svgStr) return;
    const rect = canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    window.fabricAddSvgAt(svgStr, x, y);
});

/* ── 10. PAGE NAV BUTTONS ──────────────────────────────────── */
document.getElementById('btnAddPage')?.addEventListener('click', addPageAndGo);
document.getElementById('btnDuplicatePage')?.addEventListener('click', duplicateCurrentPage);
document.getElementById('btnDeletePage')?.addEventListener('click', () => {
    if (window.confirm('ลบหน้าปัจจุบันใช่หรือไม่?')) deleteCurrentPage();
});
document.getElementById('btnClearPage')?.addEventListener('click', () => {
    if (window.confirm('ล้างวัตถุทั้งหมดในหน้านี้ใช่หรือไม่?')) clearCurrentPage();
});
document.getElementById('btnPrevPage')?.addEventListener('click', () => goToPage(activePageIndex - 1));
document.getElementById('btnNextPage')?.addEventListener('click', () => goToPage(activePageIndex + 1));
document.getElementById('btnJumpPage')?.addEventListener('click', () => {
    jumpToPageFromInput();
});
document.getElementById('jumpPageInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        jumpToPageFromInput();
    }
});
document.getElementById('pageSizeSelect')?.addEventListener('change', (e) => {
    applyPaperLayout(e.target.value || 'a4');
    showToast(`📄 เปลี่ยนกระดาษเป็น ${getPaperConfig().label}`);
});
document.getElementById('btnToggleGrid')?.addEventListener('click', () => {
    gridEnabled = !gridEnabled;
    syncUiToggles();
});
document.getElementById('btnDuplicateAnswer')?.addEventListener('click', duplicateAsAnswerKey);
document.getElementById('btnToggleAnswerMode')?.addEventListener('click', () => {
    worksheetMode = worksheetMode === 'student' ? 'answer' : 'student';
    syncUiToggles();
    applyWorksheetVisibilityMode();
});
document.getElementById('toolAutoNumber')?.addEventListener('click', () => {
    addAutoNumberAt(72, 96 + (getNextAutoNumber() - 1) * 52);
});
document.getElementById('btnApplyTemplate')?.addEventListener('click', () => {
    const value = document.getElementById('templateSelect')?.value || '';
    trackTelemetry('template_apply_requested', { source: 'template_select_button', template: value || 'none' });
    if (String(value).startsWith('curated_')) {
        const curatedId = String(value).replace(/^curated_/, '');
        applyCuratedTemplateById(curatedId, { mode: 'replace', skipConfirm: false });
        return;
    }
    applyTemplate(value);
});
document.getElementById('propAnswerOnly')?.addEventListener('change', (e) => {
    markAnswerOnlyForSelection(!!e.target.checked);
});

/* ── 11. TOAST HELPER ──────────────────────────────────────── */
let _toastTimer = null;
function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function applyTheme(theme) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('smartws_theme', nextTheme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
}

function initThemeToggle() {
    const saved = localStorage.getItem('smartws_theme') || 'dark';
    applyTheme(saved);
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

/* ── 12. EXPOSE API FOR OTHER MODULES ─────────────────────── */
window.showToast = showToast;
window.wbCanvas = canvas;
window.wbPersistCurrentPage = persistCurrentPage;
window.wbGetPageCount = () => workbook.pages.length;
window.wbGetActivePageIndex = () => activePageIndex;
window.wbGoToPage = goToPage;
window.wbAddPage = addPageAndGo;
window.wbDuplicatePage = duplicateCurrentPage;
window.wbDeletePage = deleteCurrentPage;
window.wbClearPage = clearCurrentPage;
window.wbMovePage = movePage;
window.wbGetPageThumbnails = getPageThumbnails;
window.wbSetLineSettings = (nextSettings) => {
    lineSettings = { ...lineSettings, ...(nextSettings || {}) };
};
window.wbGetLineSettings = () => ({ ...lineSettings });
window.wbGetPaperConfig = () => ({ ...getPaperConfig() });
window.wbSetPaperSize = (size) => applyPaperLayout(size);
window.wbApplyTemplate = applyTemplate;
window.wbApplyCuratedTemplate = applyCuratedTemplateById;
window.wbTrackTelemetry = trackTelemetry;
window.wbGetTelemetrySnapshot = getTelemetrySnapshot;
window.wbClearTelemetry = clearTelemetryState;
window.wbToggleWorksheetMode = () => {
    worksheetMode = worksheetMode === 'student' ? 'answer' : 'student';
    syncUiToggles();
    applyWorksheetVisibilityMode();
    return worksheetMode;
};
window.wbGetWorksheetMode = () => worksheetMode;
window.wbSetAnswerOnlyForSelection = markAnswerOnlyForSelection;
window.wbDuplicateAsAnswerKey = duplicateAsAnswerKey;
window.wbGenerateAnswerKeyPage = generateAnswerKeyPage;
window.wbAddAutoNumber = addAutoNumberAt;
window.wbAddTableRow = () => addTableRowCol(1, 0);
window.wbRemoveTableRow = () => addTableRowCol(-1, 0);
window.wbAddTableCol = () => addTableRowCol(0, 1);
window.wbRemoveTableCol = () => addTableRowCol(0, -1);
window.wbSetWritingLinesConfig = (cfg) => {
    writingLineSettings = {
        ...writingLineSettings,
        ...(cfg || {}),
    };
    writingLineSettings.spacing = Math.max(24, Number(writingLineSettings.spacing) || 46);
    writingLineSettings.rows = Math.max(1, Number(writingLineSettings.rows) || 4);
    writingLineSettings.width = Math.max(120, Number(writingLineSettings.width) || 520);
    if (!['primary', 'dotted', 'grid'].includes(writingLineSettings.style)) writingLineSettings.style = 'primary';
};
window.wbGetWritingLinesConfig = () => ({ ...writingLineSettings });
window.wbGetWorkbookData = () => {
    persistCurrentPage();
    return {
        version: 2,
        paperSize,
        worksheetMode,
        activePageIndex,
        pages: workbook.pages.map(p => p.json),
    };
};
window.wbLoadWorkbookData = async (payload) => {
    if (payload?.paperSize) applyPaperLayout(payload.paperSize);
    worksheetMode = payload?.worksheetMode === 'answer' ? 'answer' : 'student';
    syncUiToggles();

    if (!payload?.pages?.length) {
        workbook.pages = [createPageState(BLANK_PAGE_JSON)];
        activePageIndex = 0;
        await loadCanvasJson(BLANK_PAGE_JSON);
        updatePageIndicator();
        clearPropsPanel();
        return;
    }

    workbook.pages = payload.pages
        .map((p) => sanitizeImportedData(p || BLANK_PAGE_JSON))
        .map((sanitizedPage) => createPageState(JSON.stringify(sanitizedPage)));
    activePageIndex = Math.min(Math.max(payload.activePageIndex || 0, 0), workbook.pages.length - 1);
    await loadCanvasJson(workbook.pages[activePageIndex].json);
    updatePageIndicator();
    clearPropsPanel();
};

if (typeof TELEMETRY_UTILS.initGlobalErrorTelemetry === 'function') {
    TELEMETRY_UTILS.initGlobalErrorTelemetry({
        scope: window,
        notify: (message) => showToast(message),
    });
}

initThemeToggle();
applyPaperLayout(paperSize);
syncUiToggles();
updatePageIndicator();
