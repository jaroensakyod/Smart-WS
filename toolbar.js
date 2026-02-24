/* ================================================================
   toolbar.js — Top Toolbar Button Logic
   Tool switching, color picking, undo/redo, delete, properties
   ================================================================ */

/* ── Tool buttons ───────────────────────────────────────────── */
const toolDefs = [
    { id: 'toolSelect', tool: 'select' },
    { id: 'toolText', tool: 'text' },
    { id: 'toolRect', tool: 'rect' },
    { id: 'toolLine', tool: 'line' },
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
        if (o.fill !== undefined && o.type !== 'i-text') o.set('fill', this.value);
    });
});
document.getElementById('colorStroke')?.addEventListener('input', function () {
    withActiveObj(o => {
        if (o.stroke !== undefined) o.set('stroke', this.value);
    });
});
document.getElementById('colorText')?.addEventListener('input', function () {
    withActiveObj(o => {
        if (o.type === 'i-text' || o.type === 'text') o.set('fill', this.value);
    });
});
