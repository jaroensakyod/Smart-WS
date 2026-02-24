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
window.activeTool = 'select'; // 'select' | 'text' | 'rect' | 'line'
let isDrawing = false;
let shapeStart = null;
let tempShape = null;

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
    }
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
    isDrawing = true;
    const ptr = canvas.getPointer(opt.e);
    shapeStart = { x: ptr.x, y: ptr.y };

    if (window.activeTool === 'rect') {
        tempShape = new fabric.Rect({
            left: ptr.x, top: ptr.y, width: 1, height: 1,
            fill: getFill(), stroke: getStroke(), strokeWidth: 2,
            rx: 4, ry: 4,
        });
    } else if (window.activeTool === 'line') {
        tempShape = new fabric.Line([ptr.x, ptr.y, ptr.x, ptr.y], {
            stroke: getStroke(), strokeWidth: 2, strokeLineCap: 'round',
        });
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
    } else if (window.activeTool === 'line') {
        tempShape.set({ x2: ptr.x, y2: ptr.y });
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
    if (propsContent) propsContent.style.display = '';
    if (textProps) textProps.style.display = 'none';
    if (objectProps) objectProps.style.display = 'none';
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
    if (e.key === 'l' || e.key === 'L') setActiveTool('line');

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

/* ── 12. EXPOSE API FOR OTHER MODULES ─────────────────────── */
window.showToast = showToast;
window.wbCanvas = canvas;
window.wbPersistCurrentPage = persistCurrentPage;
window.wbGetPageCount = () => workbook.pages.length;
window.wbGetActivePageIndex = () => activePageIndex;
window.wbGoToPage = goToPage;
window.wbAddPage = addPageAndGo;
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

updatePageIndicator();
