/* ================================================================
   toolbar.js — Top Toolbar Button Logic
   Tool switching, color picking, undo/redo, delete, properties
   ================================================================ */

/* ── Tool buttons ───────────────────────────────────────────── */
const toolDefs = [
    { id: 'toolSelect', tool: 'select' },
    { id: 'toolText', tool: 'text' },
    { id: 'toolRect', tool: 'rect' },
    { id: 'toolTable', tool: 'table' },
    { id: 'toolLine', tool: 'line' },
    { id: 'toolArrow', tool: 'lineArrow' },
    { id: 'toolArrowDouble', tool: 'lineDoubleArrow' },
    { id: 'toolCurve', tool: 'curve' },
    { id: 'toolCallout', tool: 'callout' },
    { id: 'toolWritingLines', tool: 'writingLines' },
];
toolDefs.forEach(({ id, tool }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.dataset.tool = tool;
    btn.addEventListener('click', () => setActiveTool(tool));
});

document.getElementById('toolUndo')?.addEventListener('click', undo);
document.getElementById('toolRedo')?.addEventListener('click', redo);
document.getElementById('toolDelete')?.addEventListener('click', () => {
    const active = window.wbCanvas.getActiveObjects();
    if (!active.length) { showToast('ไม่มี Object ที่เลือก'); return; }
    active.forEach(o => window.wbCanvas.remove(o));
    window.wbCanvas.discardActiveObject();
    window.wbCanvas.renderAll();
});

/* ── Properties Panel Listeners ────────────────────────────── */
function withActiveObj(fn) {
    const obj = window.wbCanvas?.getActiveObject();
    if (!obj) return;
    fn(obj);
    window.wbCanvas.renderAll();
}

function getSelectedObjects() {
    const canvas = window.wbCanvas;
    if (!canvas) return [];
    const active = canvas.getActiveObject();
    if (!active) return [];
    if (active.type === 'activeSelection' && typeof active.getObjects === 'function') return active.getObjects();
    return [active];
}

function isLineLike(obj) {
    return !!obj && (obj.type === 'line' || obj.type === 'path' || obj.data?.isLineTool);
}

function isTextLike(obj) {
    return !!obj && (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox');
}

function isBoxLike(obj) {
    if (!obj) return false;
    if (obj.data?.isLineTool) return false;
    return ['rect', 'circle', 'ellipse', 'triangle', 'polygon', 'path'].includes(obj.type);
}

function getDashArray(pattern, lineWidth) {
    if (pattern === 'dashed') return [Math.max(8, lineWidth * 3), Math.max(4, lineWidth * 1.8)];
    if (pattern === 'dotted') return [1, Math.max(5, lineWidth * 2.2)];
    return null;
}

function applyLineStyleToObject(obj, lineWidth, pattern) {
    const dashArray = getDashArray(pattern, lineWidth);

    if (obj.type === 'group' && typeof obj.getObjects === 'function') {
        obj.getObjects().forEach(item => {
            if (item.stroke !== undefined) item.set('strokeWidth', lineWidth);
            if (item.type === 'line' || item.type === 'path') {
                item.set('strokeDashArray', dashArray);
                item.set('strokeLineCap', pattern === 'dotted' ? 'round' : 'round');
            }
            if (item.type === 'triangle') {
                item.set({
                    width: Math.max(8, lineWidth * 4.4),
                    height: Math.max(8, lineWidth * 4.4),
                });
            }
        });
        obj.addWithUpdate?.();
    } else {
        if (obj.stroke !== undefined) obj.set('strokeWidth', lineWidth);
        if (obj.type === 'line' || obj.type === 'path') {
            obj.set('strokeDashArray', dashArray);
            obj.set('strokeLineCap', pattern === 'dotted' ? 'round' : 'round');
        }
    }

    obj.data = {
        ...(obj.data || {}),
        lineWidth,
        pattern,
        isLineTool: true,
    };
}

// Font Size
document.getElementById('propFontSize')?.addEventListener('change', function () {
    withActiveObj(o => { if (o.fontSize !== undefined) o.set('fontSize', +this.value); });
});

// Font Family
document.getElementById('propFontFamily')?.addEventListener('change', function () {
    withActiveObj(o => { if (o.fontFamily !== undefined) o.set('fontFamily', this.value); });
});

// Bold / Italic / Underline
document.getElementById('propBold')?.addEventListener('click', function () {
    withActiveObj(o => {
        if (o.fontWeight !== undefined) {
            const isBold = o.fontWeight === 'bold';
            o.set('fontWeight', isBold ? 'normal' : 'bold');
            this.classList.toggle('active', !isBold);
        }
    });
});
document.getElementById('propItalic')?.addEventListener('click', function () {
    withActiveObj(o => {
        if (o.fontStyle !== undefined) {
            const isItalic = o.fontStyle === 'italic';
            o.set('fontStyle', isItalic ? 'normal' : 'italic');
            this.classList.toggle('active', !isItalic);
        }
    });
});
document.getElementById('propUnderline')?.addEventListener('click', function () {
    withActiveObj(o => {
        if (o.underline !== undefined) {
            o.set('underline', !o.underline);
            this.classList.toggle('active', o.underline);
        }
    });
});
document.getElementById('propTracing')?.addEventListener('click', function () {
    withActiveObj(o => {
        if (!isTextLike(o)) return;
        const enable = !o.data?.traceStyle;
        if (enable) {
            o.set({
                fill: 'transparent',
                stroke: '#64748b',
                strokeWidth: 1,
                shadow: null,
            });
        } else {
            o.set({
                fill: document.getElementById('colorText')?.value || '#1e293b',
                stroke: null,
                strokeWidth: 0,
            });
        }
        o.data = { ...(o.data || {}), traceStyle: enable };
        this.classList.toggle('active', enable);
    });
});

// Text align
['Left', 'Center', 'Right'].forEach(align => {
    document.getElementById(`propAlign${align}`)?.addEventListener('click', function () {
        withActiveObj(o => { if (o.textAlign !== undefined) o.set('textAlign', align.toLowerCase()); });
    });
});

// Opacity
const opacityEl = document.getElementById('propOpacity');
const opacityValEl = document.getElementById('propOpacityVal');
opacityEl?.addEventListener('input', function () {
    if (opacityValEl) opacityValEl.textContent = this.value + '%';
    withActiveObj(o => o.set('opacity', +this.value / 100));
});

// Layer order
document.getElementById('propBringFwd')?.addEventListener('click', () => {
    withActiveObj(o => window.wbCanvas.bringForward(o));
});
document.getElementById('propSendBwd')?.addEventListener('click', () => {
    withActiveObj(o => window.wbCanvas.sendBackwards(o));
});

function alignSelection(mode) {
    const canvas = window.wbCanvas;
    const objs = getSelectedObjects();
    if (!canvas || !objs.length) return;
    const rects = objs.map(o => ({ o, b: o.getBoundingRect(true, true) }));

    if (mode === 'left') {
        const left = Math.min(...rects.map(r => r.b.left));
        rects.forEach(r => r.o.set({ left: r.o.left + (left - r.b.left) }));
    }
    if (mode === 'center') {
        const min = Math.min(...rects.map(r => r.b.left));
        const max = Math.max(...rects.map(r => r.b.left + r.b.width));
        const cx = (min + max) / 2;
        rects.forEach(r => r.o.set({ left: r.o.left + (cx - (r.b.left + r.b.width / 2)) }));
    }
    if (mode === 'right') {
        const right = Math.max(...rects.map(r => r.b.left + r.b.width));
        rects.forEach(r => r.o.set({ left: r.o.left + (right - (r.b.left + r.b.width)) }));
    }
    if (mode === 'top') {
        const top = Math.min(...rects.map(r => r.b.top));
        rects.forEach(r => r.o.set({ top: r.o.top + (top - r.b.top) }));
    }
    if (mode === 'middle') {
        const min = Math.min(...rects.map(r => r.b.top));
        const max = Math.max(...rects.map(r => r.b.top + r.b.height));
        const cy = (min + max) / 2;
        rects.forEach(r => r.o.set({ top: r.o.top + (cy - (r.b.top + r.b.height / 2)) }));
    }
    if (mode === 'bottom') {
        const bottom = Math.max(...rects.map(r => r.b.top + r.b.height));
        rects.forEach(r => r.o.set({ top: r.o.top + (bottom - (r.b.top + r.b.height)) }));
    }

    canvas.requestRenderAll();
}

function distributeSelection(axis = 'h') {
    const canvas = window.wbCanvas;
    const objs = getSelectedObjects();
    if (!canvas || objs.length < 3) {
        window.showToast?.('เลือกอย่างน้อย 3 ชิ้นเพื่อกระจายระยะ');
        return;
    }

    const entries = objs.map(o => ({ o, b: o.getBoundingRect(true, true) }));
    const sorted = axis === 'h'
        ? entries.sort((a, b) => a.b.left - b.b.left)
        : entries.sort((a, b) => a.b.top - b.b.top);

    const first = sorted[0].b;
    const last = sorted[sorted.length - 1].b;
    const span = axis === 'h' ? (last.left - first.left) : (last.top - first.top);
    const step = span / (sorted.length - 1);

    sorted.forEach((entry, index) => {
        if (index === 0 || index === sorted.length - 1) return;
        if (axis === 'h') entry.o.set({ left: entry.o.left + ((first.left + step * index) - entry.b.left) });
        else entry.o.set({ top: entry.o.top + ((first.top + step * index) - entry.b.top) });
    });
    canvas.requestRenderAll();
}

document.getElementById('propAlignObjLeft')?.addEventListener('click', () => alignSelection('left'));
document.getElementById('propAlignObjCenter')?.addEventListener('click', () => alignSelection('center'));
document.getElementById('propAlignObjRight')?.addEventListener('click', () => alignSelection('right'));
document.getElementById('propAlignObjTop')?.addEventListener('click', () => alignSelection('top'));
document.getElementById('propAlignObjMiddle')?.addEventListener('click', () => alignSelection('middle'));
document.getElementById('propAlignObjBottom')?.addEventListener('click', () => alignSelection('bottom'));
document.getElementById('propDistributeH')?.addEventListener('click', () => distributeSelection('h'));
document.getElementById('propDistributeV')?.addEventListener('click', () => distributeSelection('v'));

// Live color pickers for selected object
document.getElementById('colorFill')?.addEventListener('input', function () {
    withActiveObj(o => {
        if (isBoxLike(o) && o.fill !== undefined && !isTextLike(o)) {
            o.set('fill', this.value);
            return;
        }

        if (o.type === 'group' && typeof o.getObjects === 'function') {
            if (o.data?.isLineTool || o.data?.type === 'table') return;
            let changed = false;
            o.getObjects().forEach(item => {
                if (item.type === 'line' || item.type === 'path' || item.data?.isLineTool) return;
                if (item.type === 'triangle' && o.data?.isLineTool) return;
                if (isTextLike(item)) return;
                if (item.fill !== undefined) {
                    item.set('fill', this.value);
                    changed = true;
                }
            });
            if (changed) o.addWithUpdate?.();
        }
    });
});
document.getElementById('colorStroke')?.addEventListener('input', function () {
    withActiveObj(o => {
        if (isLineLike(o) && o.type !== 'group' && o.stroke !== undefined) {
            o.set('stroke', this.value);
            return;
        }

        if (o.type === 'group' && typeof o.getObjects === 'function' && (o.data?.isLineTool || o.data?.type === 'table')) {
            o.getObjects().forEach(item => {
                if (item.type === 'line' || item.type === 'path') {
                    item.set('stroke', this.value);
                }
                if (item.type === 'triangle' && o.data?.isLineTool) {
                    item.set('stroke', this.value);
                    item.set('fill', this.value);
                }
            });
            o.addWithUpdate?.();
        }
    });
});
document.getElementById('colorText')?.addEventListener('input', function () {
    withActiveObj(o => {
        if (isTextLike(o)) {
            o.set('fill', this.value);
            return;
        }

        if (o.type === 'group' && typeof o.getObjects === 'function') {
            o.getObjects().forEach(item => {
                if (isTextLike(item)) {
                    item.set('fill', this.value);
                }
            });
            o.addWithUpdate?.();
        }
    });
});

const lineTypeEl = document.getElementById('propLineType');
const lineWidthEl = document.getElementById('propLineWidth');
const lineWidthValEl = document.getElementById('propLineWidthVal');
const linePatternEl = document.getElementById('propLinePattern');

function syncLineSettingsFromControls() {
    const next = {
        type: lineTypeEl?.value || 'line',
        width: Math.max(1, Number(lineWidthEl?.value || 2)),
        pattern: linePatternEl?.value || 'solid',
    };
    if (lineWidthValEl) lineWidthValEl.textContent = `${next.width}px`;
    window.wbSetLineSettings?.(next);

    const obj = window.wbCanvas?.getActiveObject();
    if (!isLineLike(obj)) return;

    applyLineStyleToObject(obj, next.width, next.pattern);
    obj.data = { ...(obj.data || {}), lineMode: next.type };
    window.wbCanvas.renderAll();
}

lineTypeEl?.addEventListener('change', syncLineSettingsFromControls);
lineWidthEl?.addEventListener('input', syncLineSettingsFromControls);
linePatternEl?.addEventListener('change', syncLineSettingsFromControls);

document.getElementById('btnUploadFont')?.addEventListener('click', () => {
    document.getElementById('customFontInput')?.click();
});

document.getElementById('customFontInput')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const family = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        const fontFace = new FontFace(family, `url(${URL.createObjectURL(file)})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        const select = document.getElementById('propFontFamily');
        if (select && !Array.from(select.options).some(o => o.value === family)) {
            const option = document.createElement('option');
            option.value = family;
            option.textContent = `${family} (Custom)`;
            select.appendChild(option);
        }
        if (select) select.value = family;

        withActiveObj(o => {
            if (o.fontFamily !== undefined) o.set('fontFamily', family);
        });
        window.showToast?.(`เพิ่มฟอนต์ ${family} แล้ว`);
    } catch (err) {
        console.error('[font.upload]', err);
        window.showToast?.('❌ โหลดฟอนต์ไม่สำเร็จ');
    } finally {
        e.target.value = '';
    }
});
