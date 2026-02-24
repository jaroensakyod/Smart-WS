/* ================================================================
   app.js  — Worksheet Builder Core
   Fabric.js canvas init, undo/redo, tool state, keyboard shortcuts
   ================================================================ */

/* ── 1. CANVAS INIT ─────────────────────────────────────────── */
const PAPER_W = 794;   // A4 at 96dpi
const PAPER_H = 1123;

const canvas = new fabric.Canvas('worksheetCanvas', {
    width: PAPER_W,
    height: PAPER_H,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
});

/* ── 2. ACTIVE TOOL STATE ───────────────────────────────────── */
window.activeTool = 'select'; // 'select' | 'text' | 'rect' | 'line'
let isDrawing = false;
let shapeStart = null;
let tempShape = null;

function setActiveTool(tool) {
    window.activeTool = tool;
    canvas.isDrawingMode = false;
    canvas.defaultCursor = 'default';
    canvas.selection = true;

    // Update toolbar button highlights
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === tool);
    });

    if (tool === 'select') {
        canvas.getObjects().forEach(o => o.set({ selectable: true, evented: true }));
    } else {
        // Disable selection while drawing
        canvas.discardActiveObject();
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
    }
}

/* ── 3. UNDO / REDO ─────────────────────────────────────────── */
const HISTORY_MAX = 30;
let undoStack = [];
let redoStack = [];
let isReplaying = false;

function saveHistory() {
    if (isReplaying) return;
    redoStack = [];
    undoStack.push(JSON.stringify(canvas.toJSON(['id', 'data', 'lockUniScaling', 'lockSkewingX', 'lockSkewingY'])));
    if (undoStack.length > HISTORY_MAX) undoStack.shift();
}

function undo() {
    if (undoStack.length <= 1) { showToast('ไม่มีอะไรให้ย้อนกลับ'); return; }
    isReplaying = true;
    redoStack.push(undoStack.pop());
    const state = undoStack[undoStack.length - 1];
    canvas.loadFromJSON(state, () => { canvas.renderAll(); isReplaying = false; });
}

function redo() {
    if (!redoStack.length) { showToast('ไม่มีอะไรให้ทำซ้ำ'); return; }
    isReplaying = true;
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.loadFromJSON(state, () => { canvas.renderAll(); isReplaying = false; });
}

// Save initial (empty) state
saveHistory();

// Auto-save on every modification
canvas.on('object:added', saveHistory);
canvas.on('object:removed', saveHistory);
canvas.on('object:modified', saveHistory);

/* ── 4. SHAPE DRAWING (Rect, Line) ─────────────────────────── */
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

/* ── 5. SELECTION CHANGE → update properties panel ────────── */
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
        // Equations also show size & color controls
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

/* ── 6. KEYBOARD SHORTCUTS ──────────────────────────────────── */
document.addEventListener('keydown', (e) => {
    // Don't intercept when editing text on canvas
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

    // Duplicate (Ctrl+D)
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

/* ── 7. CANVAS DRAG-OVER for SVG drop ──────────────────────── */
// (drag from panel, handled in panel.js via fabricAddSvg)
window.fabricAddSvgAtCenter = function (svgStr) {
    fabric.loadSVGFromString(svgStr, (objects, options) => {
        const group = fabric.util.groupSVGElements(objects, options);
        // Scale to ~120px tall
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

/* ── 8. CANVAS DROP ZONE for SVG files ─────────────────────── */
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

/* ── 9. TOAST HELPER ────────────────────────────────────────── */
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
window.showToast = showToast;

/* Expose canvas globally for other modules */
window.wbCanvas = canvas;
