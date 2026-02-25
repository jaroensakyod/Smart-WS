/* ================================================================
   app.js  — Worksheet Builder Core
   Fabric.js canvas init, workbook pages, undo/redo, tools, shortcuts
   ================================================================ */

/* ── 1. CANVAS INIT ─────────────────────────────────────────── */
const PAPER_PRESETS = {
    a4: { key: 'a4', label: 'A4', width: 794, height: 1123, mmW: 210, mmH: 297, marginIn: 0.5 },
    letter: { key: 'letter', label: 'US Letter', width: 816, height: 1056, mmW: 215.9, mmH: 279.4, marginIn: 0.5 },
};
let paperSize = 'a4';
let gridEnabled = false;
let snapEnabled = true;
let worksheetMode = 'student'; // student | answer
const GRID_SIZE = 24;
const SNAP_TOLERANCE = 8;

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
    const snapBtn = document.getElementById('btnToggleSnap');
    const gridBtn = document.getElementById('btnToggleGrid');
    const modeBtn = document.getElementById('btnToggleAnswerMode');
    if (snapBtn) snapBtn.classList.toggle('active', snapEnabled);
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

    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');
    if (prevBtn) prevBtn.disabled = activePageIndex <= 0;
    if (nextBtn) nextBtn.disabled = activePageIndex >= workbook.pages.length - 1;
}

function serializeCanvasNow() {
    return JSON.stringify(canvas.toJSON(SERIALIZE_PROPS));
}

function persistCurrentPage() {
    const page = currentPage();
    if (!page) return;
    page.json = serializeCanvasNow();
    if (!page.undoStack.length) page.undoStack = [page.json];
}

function loadCanvasJson(json) {
    return new Promise((resolve) => {
        isReplaying = true;
        canvas.loadFromJSON(json || BLANK_PAGE_JSON, () => {
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
    persistCurrentPage();
    activePageIndex = index;
    await loadCanvasJson(currentPage().json);
    clearPropsPanel();
    updatePageIndicator();
    return true;
}

async function addPageAndGo() {
    persistCurrentPage();
    workbook.pages.push(createPageState());
    activePageIndex = workbook.pages.length - 1;
    await loadCanvasJson(currentPage().json);
    clearPropsPanel();
    updatePageIndicator();
    showToast('➕ เพิ่มหน้าใหม่แล้ว');
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
    const snapshot = serializeCanvasNow();
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
let activeGuideLines = [];

function makeWritingLinesAt(x, y, width = 520, rows = 4) {
    const lines = [];
    const rowHeight = 46;
    for (let i = 0; i < rows; i++) {
        const baseY = y + i * rowHeight;
        lines.push(new fabric.Line([x, baseY, x + width, baseY], {
            stroke: '#1e293b',
            strokeWidth: 1.6,
            selectable: false,
            evented: false,
        }));
        lines.push(new fabric.Line([x, baseY + rowHeight / 2, x + width, baseY + rowHeight / 2], {
            stroke: '#64748b',
            strokeWidth: 1.2,
            strokeDashArray: [3, 5],
            selectable: false,
            evented: false,
        }));
    }
    const g = new fabric.Group(lines, { objectCaching: false });
    g.data = { type: 'writingLines' };
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

function markAnswerOnlyForSelection(enabled) {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.data = { ...(obj.data || {}), answerOnly: !!enabled };
    applyWorksheetVisibilityMode();
}

function duplicateAsAnswerKey() {
    persistCurrentPage();
    const source = currentPage()?.json || BLANK_PAGE_JSON;
    workbook.pages.push(createPageState(source));
    activePageIndex = workbook.pages.length - 1;
    loadCanvasJson(source).then(() => {
        worksheetMode = 'answer';
        syncUiToggles();
        const title = new fabric.IText('Answer Key', {
            left: PAPER_W - 170,
            top: 24,
            fontFamily: 'Fredoka',
            fontSize: 24,
            fill: '#dc2626',
        });
        title.data = { type: 'answerLabel', answerOnly: true };
        canvas.add(title);
        applyWorksheetVisibilityMode();
        updatePageIndicator();
        showToast('🧪 สร้างหน้าเฉลยแล้ว');
    });
}

function applyTemplate(type) {
    if (!type) return;
    if (!window.confirm('ใช้เทมเพลตนี้และล้างหน้าปัจจุบัน?')) return;
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
    if (type === 'quiz') {
        canvas.add(new fabric.IText('Quiz', { left: 70, top: 44, fontFamily: 'Fredoka', fontSize: 34, fill: txColor }));
        for (let i = 0; i < 10; i++) {
            const y = 120 + i * 90;
            canvas.add(new fabric.IText(`${i + 1}. ___________________________________`, { left: 70, top: y, fontFamily: 'Sarabun', fontSize: 21, fill: txColor }));
            canvas.add(new fabric.IText('ก ○   ข ○   ค ○   ง ○', { left: 100, top: y + 34, fontFamily: 'Sarabun', fontSize: 20, fill: txColor }));
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
    canvas.renderAll();
    saveHistory();
    showToast('📄 ใส่เทมเพลตแล้ว');
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
    if (!snapEnabled || !obj) return;
    const bounds = getBoundsForSnap(obj);
    let nextLeft = obj.left;
    let nextTop = obj.top;
    activeGuideLines = [];

    const targetCenterX = PAPER_W / 2;
    const targetCenterY = PAPER_H / 2;
    if (Math.abs(bounds.centerX - targetCenterX) <= SNAP_TOLERANCE) {
        nextLeft += targetCenterX - bounds.centerX;
        activeGuideLines.push({ x1: targetCenterX, y1: 0, x2: targetCenterX, y2: PAPER_H });
    }
    if (Math.abs(bounds.centerY - targetCenterY) <= SNAP_TOLERANCE) {
        nextTop += targetCenterY - bounds.centerY;
        activeGuideLines.push({ x1: 0, y1: targetCenterY, x2: PAPER_W, y2: targetCenterY });
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
            activeGuideLines.push({ x1: ob.left, y1: 0, x2: ob.left, y2: PAPER_H });
        }
        if (deltaR <= SNAP_TOLERANCE) {
            nextLeft += ob.right - bounds.right;
            activeGuideLines.push({ x1: ob.right, y1: 0, x2: ob.right, y2: PAPER_H });
        }
        if (deltaT <= SNAP_TOLERANCE) {
            nextTop += ob.top - bounds.top;
            activeGuideLines.push({ x1: 0, y1: ob.top, x2: PAPER_W, y2: ob.top });
        }
        if (deltaB <= SNAP_TOLERANCE) {
            nextTop += ob.bottom - bounds.bottom;
            activeGuideLines.push({ x1: 0, y1: ob.bottom, x2: PAPER_W, y2: ob.bottom });
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

function addTableAt(x, y, rows = 4, cols = 4) {
    const stroke = getStroke();
    const width = Math.max(1, Number(lineSettings.width || 2));
    const pattern = lineSettings.pattern || 'solid';
    const dash = getDashArray(pattern, width);
    const cellW = 96;
    const cellH = 52;
    const totalW = cols * cellW;
    const totalH = rows * cellH;
    const lines = [];

    for (let r = 0; r <= rows; r++) {
        const yPos = y + r * cellH;
        lines.push(new fabric.Line([x, yPos, x + totalW, yPos], {
            stroke,
            strokeWidth: width,
            strokeDashArray: dash,
            strokeLineCap: 'round',
            selectable: false,
            evented: false,
        }));
    }

    for (let c = 0; c <= cols; c++) {
        const xPos = x + c * cellW;
        lines.push(new fabric.Line([xPos, y, xPos, y + totalH], {
            stroke,
            strokeWidth: width,
            strokeDashArray: dash,
            strokeLineCap: 'round',
            selectable: false,
            evented: false,
        }));
    }

    const group = new fabric.Group(lines, {
        objectCaching: false,
    });
    group.data = {
        type: 'table',
        rows,
        cols,
        lineMode: 'line',
        pattern,
        lineWidth: width,
        isLineTool: true,
    };
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
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
canvas.on('mouse:up', () => {
    activeGuideLines = [];
    canvas.requestRenderAll();
});
canvas.on('after:render', () => {
    if (!activeGuideLines.length) return;
    const ctx = canvas.getSelectionContext();
    ctx.save();
    ctx.strokeStyle = 'rgba(220,38,38,0.78)';
    ctx.lineWidth = 1;
    activeGuideLines.forEach(g => {
        ctx.beginPath();
        ctx.moveTo(g.x1, g.y1);
        ctx.lineTo(g.x2, g.y2);
        ctx.stroke();
    });
    ctx.restore();
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
        const group = makeWritingLinesAt(ptr.x, ptr.y);
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
document.getElementById('pageSizeSelect')?.addEventListener('change', (e) => {
    applyPaperLayout(e.target.value || 'a4');
    showToast(`📄 เปลี่ยนกระดาษเป็น ${getPaperConfig().label}`);
});
document.getElementById('btnToggleGrid')?.addEventListener('click', () => {
    gridEnabled = !gridEnabled;
    syncUiToggles();
});
document.getElementById('btnToggleSnap')?.addEventListener('click', () => {
    snapEnabled = !snapEnabled;
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
window.wbToggleWorksheetMode = () => {
    worksheetMode = worksheetMode === 'student' ? 'answer' : 'student';
    syncUiToggles();
    applyWorksheetVisibilityMode();
    return worksheetMode;
};
window.wbGetWorksheetMode = () => worksheetMode;
window.wbSetAnswerOnlyForSelection = markAnswerOnlyForSelection;
window.wbDuplicateAsAnswerKey = duplicateAsAnswerKey;
window.wbAddAutoNumber = addAutoNumberAt;
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

    workbook.pages = payload.pages.map(p => createPageState(p || BLANK_PAGE_JSON));
    activePageIndex = Math.min(Math.max(payload.activePageIndex || 0, 0), workbook.pages.length - 1);
    await loadCanvasJson(workbook.pages[activePageIndex].json);
    updatePageIndicator();
    clearPropsPanel();
};

initThemeToggle();
applyPaperLayout(paperSize);
syncUiToggles();
updatePageIndicator();
