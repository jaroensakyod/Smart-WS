/* ================================================================
   equation.js — Editable Text+Math blocks
   ================================================================
   • Double-click equation → re-open modal pre-filled for editing
   • Properties panel (right side) controls font size & color → re-render
   • All equations store source text in obj.data for re-editing
   • Render: KaTeX HTML → data:image/svg+xml → offscreen canvas → PNG → Fabric.Image
   ================================================================ */

/* ── 1. Preload KaTeX CSS ────────────────────────────────────── */
let _cssReady = null, _cssText = '';
function loadKatexCss() {
    if (_cssReady) return _cssReady;
    _cssReady = (async () => {
        try {
            const base = (typeof chrome !== 'undefined' && chrome.runtime?.getURL)
                ? chrome.runtime.getURL('') : location.href.replace(/[^/]+$/, '');
            let css = await fetch(base + 'vendor/katex/katex.min.css').then(r => r.text());
            css = css.replace(/url\(fonts\//g, `url(${base}vendor/katex/fonts/`);
            _cssText = css;
        } catch (_) { _cssText = ''; }
    })();
    return _cssReady;
}
loadKatexCss();

/* ── 2. Parse mixed text → HTML ─────────────────────────────── */
function mixedTextToHtml(text) {
    const parts = [];
    const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
    let last = 0, m;
    while ((m = regex.exec(text)) !== null) {
        if (m.index > last) parts.push({ t: 'txt', s: text.slice(last, m.index) });
        const raw = m[0], isD = raw.startsWith('$$');
        parts.push({ t: 'math', latex: isD ? raw.slice(2, -2).trim() : raw.slice(1, -1).trim(), isD });
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push({ t: 'txt', s: text.slice(last) });
    return parts.map(p => {
        if (p.t === 'txt') return esc(p.s).replace(/\n/g, '<br/>');
        try { return katex.renderToString(p.latex, { displayMode: p.isD, throwOnError: false }); }
        catch (_) { return `<code>${esc(p.latex)}</code>`; }
    }).join('');
}
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ── 3. Render HTML → PNG data URL (auto-fit size) ────────── */
async function htmlToPng(bodyHtml, opts = {}) {
    await _cssReady;
    const maxW = opts.W || 760, fs = opts.fontSize || 22, clr = opts.color || '#1e293b';

    // Measure ACTUAL content size (width+height) using a hidden probe
    const probe = document.createElement('div');
    probe.style.cssText = [
        'position:fixed', 'left:-9999px', 'visibility:hidden',
        'display:inline-block',     // ← shrink-to-fit width
        `max-width:${maxW - 32}px`, // cap max width
        `font-size:${fs}px`, 'line-height:1.7',
        "font-family:'Sarabun','Noto Sans Thai',sans-serif",
        'padding:12px 16px', 'white-space:pre-wrap',
    ].join(';');
    probe.innerHTML = bodyHtml;
    document.body.appendChild(probe);
    const W = Math.min(Math.ceil(probe.offsetWidth) + 8, maxW);   // tight fit
    const H = Math.max(Math.ceil(probe.offsetHeight) + 8, 40);
    document.body.removeChild(probe);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<foreignObject x="0" y="0" width="${W}" height="${H}">
<html xmlns="http://www.w3.org/1999/xhtml"><head><style>
html,body{margin:0;padding:0;background:transparent;overflow:hidden}
body{padding:12px 16px;font-size:${fs}px;line-height:1.7;
  font-family:'Sarabun','Noto Sans Thai','Segoe UI',sans-serif;
  color:${clr};word-wrap:break-word;white-space:pre-wrap}
${_cssText}
.katex{font-size:1em;color:${clr}}
.katex .mord,.katex .mbin,.katex .mrel,.katex .mopen,.katex .mclose,.katex .mpunct,.katex .mop{color:${clr}}
.katex-display{display:block;text-align:center;margin:0.3em 0}
</style></head>
<body>${bodyHtml}</body>
</html>
</foreignObject>
</svg>`;

    const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => reject(new Error('timeout')), 5000);
        img.onload = () => {
            clearTimeout(timer);
            const c = document.createElement('canvas');
            c.width = W * 2; c.height = H * 2;
            const ctx = c.getContext('2d');
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0, W, H);
            resolve({ dataUrl: c.toDataURL('image/png'), W, H });
        };
        img.onerror = () => { clearTimeout(timer); reject(new Error('svg load error')); };
        img.src = dataUri;
    });
}

/* ── 4. Add / Replace equation on canvas ─────────────────────── */
async function renderAndPlace(source, opts = {}) {
    const clr = opts.color || '#1e293b';
    const fs = opts.fontSize || 22;
    let scale = (opts.scale || 1.5) * 0.5;
    const isPure = opts.pureLatex;

    let bodyHtml;
    if (isPure) {
        const dm = opts.displayMode ?? true;
        bodyHtml = katex.renderToString(source, { displayMode: dm, throwOnError: false });
    } else {
        bodyHtml = mixedTextToHtml(source);
    }

    const { dataUrl } = await htmlToPng(bodyHtml, { fontSize: fs, color: clr, W: 560 });

    return new Promise((resolve) => {
        fabric.Image.fromURL(dataUrl, (img) => {
            const canvas = window.wbCanvas;
            const maxObjW = canvas.width * 0.62;
            const maxObjH = canvas.height * 0.28;
            const widthAtScale = img.width * scale;
            const heightAtScale = img.height * scale;
            if (widthAtScale > maxObjW) scale = maxObjW / img.width;
            if (heightAtScale > maxObjH) scale = Math.min(scale, maxObjH / img.height);

            img.set({
                left: opts.left ?? (canvas.width / 2 - img.width * scale / 2),
                top: opts.top ?? (canvas.height / 2 - img.height * scale / 2),
                scaleX: scale, scaleY: scale,
                lockUniScaling: true,   // ★ prevent squeeze — uniform scale only
                lockSkewingX: true,
                lockSkewingY: true,
                // ★ Store editable metadata
                data: {
                    type: 'equation',
                    source,
                    pureLatex: !!isPure,
                    displayMode: opts.displayMode ?? true,
                    fontSize: fs,
                    color: clr,
                    scale: opts.scale || 1.5,
                },
            });

            // If replacing an existing object, remove old one
            if (opts.replaceObj) {
                const idx = canvas.getObjects().indexOf(opts.replaceObj);
                canvas.remove(opts.replaceObj);
                if (idx >= 0) canvas.insertAt(img, idx);
                else canvas.add(img);
            } else {
                canvas.add(img);
            }
            canvas.setActiveObject(img);
            canvas.renderAll();
            resolve(img);
        });
    });
}

// Exposed globally for clipboard.js
window.addMathTextToCanvas = async function (rawText, opts = {}) {
    try {
        await renderAndPlace(rawText, opts);
        return true;
    } catch (err) {
        console.warn('[eq] render failed, fallback:', err.message);
        _fallbackText(rawText);
        return false;
    }
};

function _fallbackText(raw) {
    const c = window.wbCanvas;
    const t = new fabric.Textbox(raw, {
        left: 80, top: c.height / 2 - 30, width: 600,
        fontFamily: 'serif', fontSize: 20, fill: '#1e293b', lineHeight: 1.5,
    });
    c.add(t); c.setActiveObject(t); c.renderAll();
    showToast?.('⚠️ ใช้ข้อความแทน (render ไม่สำเร็จ)');
}

/* ════════════════════════════════════════════════════════════
   EQUATION MODAL  (two tabs:  pure LaTeX  /  text + $math$)
   ════════════════════════════════════════════════════════════ */
const eqModal = document.getElementById('equationModal');
const eqInput = document.getElementById('eqInput');
const eqPreview = document.getElementById('eqPreview');
const eqError = document.getElementById('eqError');
const eqDisplayChk = document.getElementById('eqDisplayMode');
const eqScaleEl = document.getElementById('eqScale');
const eqScaleVal = document.getElementById('eqScaleVal');
const modeTabEq = document.getElementById('modeTabEq');
const modeTabMix = document.getElementById('modeTabMix');

let currentMode = 'mix';
let _editingObj = null;   // ★ set when double-clicking to re-edit

function setMode(mode) {
    currentMode = mode;
    modeTabEq?.classList.toggle('tab-active', mode === 'eq');
    modeTabMix?.classList.toggle('tab-active', mode === 'mix');
    const dr = document.getElementById('displayModeRow');
    if (dr) dr.style.display = mode === 'eq' ? '' : 'none';
    if (eqInput) {
        eqInput.placeholder = mode === 'eq'
            ? 'LaTeX เช่น: \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}'
            : 'ข้อความ + สมการ เช่น: กฎของนิวตัน $F=ma$ เมื่อ $m$ คือมวล';
    }
    renderPreview();
}
modeTabEq?.addEventListener('click', () => setMode('eq'));
modeTabMix?.addEventListener('click', () => setMode('mix'));

/* ── Open / Close ──────────────────────────────────────────── */
function openEqModal(mode, editObj) {
    _editingObj = editObj || null;
    eqModal.style.display = 'flex';

    // Pre-fill from existing equation data
    if (editObj?.data?.source != null) {
        eqInput.value = editObj.data.source;
        if (eqScaleEl) eqScaleEl.value = editObj.data.scale || 1.5;
        if (eqScaleVal) eqScaleVal.textContent = (+eqScaleEl.value).toFixed(1) + '×';
        if (eqDisplayChk) eqDisplayChk.checked = editObj.data.displayMode ?? true;
        setMode(editObj.data.pureLatex ? 'eq' : 'mix');
    } else {
        setMode(mode || currentMode);
    }
    setTimeout(() => eqInput?.focus(), 50);
    renderPreview();
}
function closeEqModal() { eqModal.style.display = 'none'; _editingObj = null; }

document.getElementById('toolEquation')?.addEventListener('click', () => openEqModal('mix'));
document.getElementById('eqModalClose')?.addEventListener('click', closeEqModal);
document.getElementById('eqCancel')?.addEventListener('click', closeEqModal);
eqModal?.addEventListener('click', e => { if (e.target === eqModal) closeEqModal(); });

/* Keyboard: E to open, Esc to close */
document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (window.wbCanvas?.getActiveObject()?.isEditing) return;
    if (e.key === 'e' || e.key === 'E') { e.preventDefault(); openEqModal('mix'); }
    if (e.key === 'Escape' && eqModal?.style.display !== 'none') closeEqModal();
});

/* ★ Double-click on equation → re-open modal for editing ───── */
window.wbCanvas?.on('mouse:dblclick', (opt) => {
    const obj = opt.target;
    if (!obj?.data?.type || obj.data.type !== 'equation') return;
    openEqModal(null, obj);
});

/* ── Live Preview ──────────────────────────────────────────── */
function renderPreview() {
    const raw = eqInput?.value?.trim() || '';
    if (!eqPreview) return;
    if (!raw) {
        eqPreview.innerHTML = `<span style="color:#94a3b8;font-size:12px">
      ${currentMode === 'eq' ? 'พิมพ์ LaTeX' : 'พิมพ์ข้อความ + $สมการ$'} เพื่อดูตัวอย่าง</span>`;
        if (eqError) eqError.style.display = 'none';
        return;
    }
    try {
        if (currentMode === 'eq')
            katex.render(raw, eqPreview, { displayMode: eqDisplayChk?.checked ?? true, throwOnError: true });
        else
            eqPreview.innerHTML = mixedTextToHtml(raw);
        if (eqError) eqError.style.display = 'none';
    } catch (err) {
        eqPreview.innerHTML = '';
        if (eqError) { eqError.textContent = '❌ ' + err.message; eqError.style.display = ''; }
    }
}
let _pt;
eqInput?.addEventListener('input', () => { clearTimeout(_pt); _pt = setTimeout(renderPreview, 150); });
eqDisplayChk?.addEventListener('change', renderPreview);
eqScaleEl?.addEventListener('input', function () {
    if (eqScaleVal) eqScaleVal.textContent = (+this.value).toFixed(1) + '×';
});

/* Quick chips */
document.querySelectorAll('.eq-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        if (!eqInput) return;
        const pos = eqInput.selectionStart ?? eqInput.value.length;
        const latex = chip.dataset.latex || '';
        const insert = currentMode === 'mix' ? `$${latex}$` : latex;
        eqInput.value = eqInput.value.slice(0, pos) + insert + eqInput.value.slice(pos);
        eqInput.selectionStart = eqInput.selectionEnd = pos + insert.length;
        eqInput.focus();
        renderPreview();
    });
});

/* ── Insert / Update → Canvas ──────────────────────────────── */
document.getElementById('eqInsert')?.addEventListener('click', doInsert);
eqInput?.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) doInsert(); });

async function doInsert() {
    const raw = eqInput?.value?.trim();
    if (!raw) { showToast?.('กรุณาพิมพ์เนื้อหาก่อน'); return; }

    const btn = document.getElementById('eqInsert');
    if (btn) btn.textContent = '⏳ Rendering...';

    const uiScale = parseFloat(eqScaleEl?.value || '1.5');
    const isPureLatex = currentMode === 'eq';
    const displayMode = eqDisplayChk?.checked ?? true;

    // Get color from toolbar text color picker
    const textColor = document.getElementById('colorText')?.value || '#1e293b';

    // Validate pure LaTeX
    if (isPureLatex) {
        try { katex.renderToString(raw, { throwOnError: true }); }
        catch (err) {
            if (btn) btn.textContent = '✨ แทรกลง Canvas';
            if (eqError) { eqError.textContent = '❌ ' + err.message; eqError.style.display = ''; }
            showToast?.('LaTeX ไม่ถูกต้อง'); return;
        }
    }

    const opts = {
        scale: uiScale,
        pureLatex: isPureLatex,
        displayMode,
        color: textColor,
        fontSize: 22,
        replaceObj: _editingObj,  // ★ if editing, replace in-place
    };

    // Keep position if re-editing
    if (_editingObj) {
        opts.left = _editingObj.left;
        opts.top = _editingObj.top;
    }

    try {
        await renderAndPlace(raw, opts);
        closeEqModal();
        showToast?.(_editingObj ? '✅ อัปเดตสมการแล้ว' : '✅ เพิ่มสมการแล้ว');
    } catch (_) {
        _fallbackText(raw);
        closeEqModal();
    }
    if (btn) btn.textContent = '✨ แทรกลง Canvas';
}

/* ════════════════════════════════════════════════════════════
   PROPERTIES PANEL — update equation font size & color
   ════════════════════════════════════════════════════════════ */

/* Listen for changes on the Text color picker → live re-render equation */
document.getElementById('colorText')?.addEventListener('change', async function () {
    const obj = window.wbCanvas?.getActiveObject();
    if (!obj?.data?.type || obj.data.type !== 'equation') return;
    const d = obj.data;
    d.color = this.value;
    showToast?.('⏳ กำลังเปลี่ยนสี...');
    try {
        await renderAndPlace(d.source, {
            ...d,
            replaceObj: obj,
            left: obj.left, top: obj.top,
        });
        showToast?.('🎨 เปลี่ยนสีแล้ว');
    } catch (_) { showToast?.('❌ เปลี่ยนสีไม่สำเร็จ'); }
});

/* Listen for font size change from props panel → re-render equation */
document.getElementById('propFontSize')?.addEventListener('change', async function () {
    const obj = window.wbCanvas?.getActiveObject();
    if (!obj?.data?.type || obj.data.type !== 'equation') return;
    const d = obj.data;
    d.fontSize = +this.value || 22;
    showToast?.('⏳ กำลังปรับขนาด...');
    try {
        await renderAndPlace(d.source, {
            ...d,
            replaceObj: obj,
            left: obj.left, top: obj.top,
        });
        showToast?.('📐 ปรับขนาดแล้ว');
    } catch (_) { showToast?.('❌ ปรับขนาดไม่สำเร็จ'); }
});

/* ── Show font size in props panel when equation is selected ── */
window.wbCanvas?.on('selection:created', showEqProps);
window.wbCanvas?.on('selection:updated', showEqProps);

function showEqProps() {
    const obj = window.wbCanvas?.getActiveObject();
    if (!obj?.data?.type || obj.data.type !== 'equation') return;
    // Show text props section so user sees font size & color
    const textProps = document.getElementById('textProps');
    if (textProps) textProps.style.display = '';
    const fsEl = document.getElementById('propFontSize');
    if (fsEl) fsEl.value = obj.data.fontSize || 22;
}
