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
