/* ================================================================
   app.js  — Worksheet Builder Core
   Fabric.js canvas init, workbook pages, undo/redo, tools, shortcuts
   ================================================================ */

/* ── 1. CANVAS INIT ─────────────────────────────────────────── */
const PAPER_W = 794;   // A4 at 96dpi
const PAPER_H = 1123;
const SERIALIZE_PROPS = ['id', 'data', 'lockUniScaling', 'lockSkewingX', 'lockSkewingY'];

const canvas = new fabric.Canvas('worksheetCanvas', {
    width: PAPER_W,
    height: PAPER_H,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
});

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
window.activeTool = 'select'; // 'select' | 'text' | 'rect' | 'table' | 'line' | 'lineDoubleArrow' | 'curve' | 'callout'
let isDrawing = false;
let shapeStart = null;
let tempShape = null;
let lineSettings = {
    type: 'line',
    pattern: 'solid',
    width: 2,
};

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
        canvas.getObjects().forEach(o => o.set({ selectable: true, evented: true }));
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
    if (opEl) {
        opEl.value = Math.round((obj.opacity || 1) * 100);
        if (opValEl) opValEl.textContent = opEl.value + '%';
    }
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

    if (e.key === 'v' || e.key === 'V') setActiveTool('select');
    if (e.key === 't' || e.key === 'T') setActiveTool('text');
    if (e.key === 'r' || e.key === 'R') setActiveTool('rect');
    if (e.key === 'g' || e.key === 'G') setActiveTool('table');
    if (e.key === 'l' || e.key === 'L') setActiveTool('line');
    if (e.key === 'c' || e.key === 'C') setActiveTool('curve');

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
document.getElementById('btnPrevPage')?.addEventListener('click', () => goToPage(activePageIndex - 1));
document.getElementById('btnNextPage')?.addEventListener('click', () => goToPage(activePageIndex + 1));

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
window.wbSetLineSettings = (nextSettings) => {
    lineSettings = { ...lineSettings, ...(nextSettings || {}) };
};
window.wbGetLineSettings = () => ({ ...lineSettings });
window.wbGetWorkbookData = () => {
    persistCurrentPage();
    return {
        version: 2,
        activePageIndex,
        pages: workbook.pages.map(p => p.json),
    };
};
window.wbLoadWorkbookData = async (payload) => {
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
updatePageIndicator();
