/* ================================================================
   clipboard.js — Paste (Ctrl+V) & Drag-Drop anything → Canvas
   ================================================================
   • Ctrl+V  image/png or image/jpeg  →  add as Fabric.Image
   • Ctrl+V  text/plain with $math$   →  render as Math Text block
   • Ctrl+V  text/html (from SimpleEq Box 3)  →  render via foreignObject
   • Drag image files from desktop → add as Fabric.Image
   • Drag image from web browser   → add as Fabric.Image
   ================================================================ */

/* ── Helper: add a data/object URL as Fabric.Image ─────────── */
function addImageToCanvas(url, opts = {}) {
    fabric.Image.fromURL(url, (img) => {
        if (!img || !img.width) { showToast?.('❌ โหลดรูปไม่ได้'); return; }
        const canvas = window.wbCanvas;
        const maxW = canvas.width * 0.7;
        const maxH = canvas.height * 0.7;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        img.set({
            left: opts.x ?? (canvas.width / 2 - (img.width * scale) / 2),
            top: opts.y ?? (canvas.height / 2 - (img.height * scale) / 2),
            scaleX: scale, scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
}

/* ════════════════════════════════════════════════════════════
   Ctrl+V  PASTE
   ════════════════════════════════════════════════════════════ */
document.addEventListener('paste', async (e) => {
    // Skip if user is editing text on canvas, or in an input element
    if (window.wbCanvas?.getActiveObject()?.isEditing) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    // Skip if Equation modal is open (textarea inside it handles paste)
    const modal = document.getElementById('equationModal');
    if (modal?.style.display !== 'none') return;

    const items = Array.from(e.clipboardData?.items || []);

    /* ① Image binary (screenshot, copied image from any app or SimpleEq) */
    const imgItem = items.find(i => i.type.startsWith('image/'));
    if (imgItem) {
        e.preventDefault();
        const blob = imgItem.getAsFile();
        const url = URL.createObjectURL(blob);
        addImageToCanvas(url);
        showToast?.('📋 วางรูปภาพแล้ว (Ctrl+V)');
        setTimeout(() => URL.revokeObjectURL(url), 8000);
        return;
    }

    /* ② Plain text — check for $math$ notation */
    const textItem = items.find(i => i.type === 'text/plain');
    if (textItem) {
        textItem.getAsString(async (txt) => {
            const t = txt.trim();
            // If it looks like an image URL, add as image
            if (/^https?:\/\/.+(\.png|\.jpe?g|\.gif|\.webp|\.svg)(\?.*)?$/i.test(t)) {
                e.preventDefault();
                addImageToCanvas(t);
                showToast?.('🌐 วาง URL รูปภาพแล้ว');
                return;
            }
            // If it contains $ signs (math), render as Math Text Block
            if (t.includes('$') && window.addMathTextToCanvas) {
                e.preventDefault();
                showToast?.('⏳ กำลัง render ข้อความ+สมการ...');
                const ok = await window.addMathTextToCanvas(t);
                if (ok) showToast?.('📋 วางข้อความ+สมการแล้ว');
                else showToast?.('❌ render ไม่สำเร็จ');
                return;
            }
            // Plain text → add as Textbox (reflows on resize, no squeeze)
            if (t.length > 0 && t.length < 2000) {
                e.preventDefault();
                const canvas = window.wbCanvas;
                // Auto-calculate a reasonable width based on text length
                const avgCharW = 10;  // approximate px per char at 20px font
                const lines = t.split('\n');
                const maxLineLen = Math.max(...lines.map(l => l.length));
                const autoW = Math.min(Math.max(maxLineLen * avgCharW, 120), 600);
                const txt2 = new fabric.Textbox(t, {
                    left: canvas.width / 2 - autoW / 2,
                    top: canvas.height / 2 - 20,
                    width: autoW,
                    fontFamily: 'Sarabun',
                    fontSize: 20,
                    fill: '#1e293b',
                    lineHeight: 1.4,
                });
                canvas.add(txt2);
                canvas.setActiveObject(txt2);
                canvas.renderAll();
                showToast?.('📋 วางข้อความแล้ว');
            }
        });
        return;
    }

    /* ③ HTML from clipboard (e.g., copied from SimpleEq Box 3 or Word) */
    const htmlItem = items.find(i => i.type === 'text/html');
    if (htmlItem) {
        e.preventDefault();
        htmlItem.getAsString(async (html) => {
            if (!html.trim()) return;
            showToast?.('⏳ แปลง HTML → รูป...');
            try {
                const W = 800, H = 300;
                const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<foreignObject x="0" y="0" width="${W}" height="${H}">
<html xmlns="http://www.w3.org/1999/xhtml"><head><style>
html,body{margin:0;padding:12px;background:#fff;
  font-family:'Sarabun',sans-serif;font-size:20px;color:#1e293b;overflow:hidden}
img{max-width:100%}
</style></head>
<body>${html}</body>
</html>
</foreignObject>
</svg>`;
                // Use data: URI — blob: hangs in Chrome Extension context
                const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
                const img = new Image();
                const timer = setTimeout(() => {
                    // Timeout fallback: paste as plain text instead
                    showToast?.('⚠️ วาง HTML เป็นข้อความ (render timeout)');
                }, 5000);
                img.onload = () => {
                    clearTimeout(timer);
                    const c = document.createElement('canvas');
                    c.width = W * 2; c.height = H * 2;
                    const ctx = c.getContext('2d');
                    ctx.scale(2, 2);
                    ctx.drawImage(img, 0, 0, W, H);
                    addImageToCanvas(c.toDataURL('image/png'));
                    showToast?.('📋 วาง HTML / สมการจาก SimpleEq แล้ว');
                };
                img.onerror = () => {
                    clearTimeout(timer);
                    showToast?.('❌ ไม่สามารถแปลง HTML ได้');
                };
                img.src = dataUri;
            } catch (_) { showToast?.('❌ ไม่สามารถแปลง HTML ได้'); }
        });
    }
});

/* ════════════════════════════════════════════════════════════
   DRAG & DROP — listen on the whole canvas area
   ════════════════════════════════════════════════════════════ */
const canvasArea = document.querySelector('.canvas-area') || document.body;

canvasArea.addEventListener('dragover', (e) => {
    // Only intercept if not an internal SVG-panel drag
    if (!e.dataTransfer?.getData('text/svg')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
});

canvasArea.addEventListener('drop', async (e) => {
    // Let app.js handle internal SVG panel drags
    if (e.dataTransfer?.types.includes('text/svg')) return;
    e.preventDefault();

    const canvas = window.wbCanvas;
    const canvasEl = document.getElementById('worksheetCanvas');
    const rect = canvasEl?.getBoundingClientRect();
    const dropX = rect ? e.clientX - rect.left : canvas.width / 2;
    const dropY = rect ? e.clientY - rect.top : canvas.height / 2;

    /* ① Files from desktop */
    const files = Array.from(e.dataTransfer?.files || []);
    for (const file of files) {
        const reader = new FileReader();
        if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
            reader.onload = ev => window.fabricAddSvgAt?.(ev.target.result, dropX, dropY);
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
            reader.onload = ev => addImageToCanvas(ev.target.result, { x: dropX - 150, y: dropY - 100 });
            reader.readAsDataURL(file);
        }
    }
    if (files.length) { showToast?.(`📂 วางไฟล์ ${files.length} ไฟล์`); return; }

    /* ② Image URL or src from web browser drag */
    const uriList = e.dataTransfer?.getData('text/uri-list');
    const htmlDrop = e.dataTransfer?.getData('text/html');
    const plainUrl = e.dataTransfer?.getData('text/plain');

    // Try: grab src from dragged <img> tag
    if (htmlDrop) {
        const match = htmlDrop.match(/src=["']([^"']+)["']/i);
        if (match) {
            addImageToCanvas(match[1], { x: dropX - 150, y: dropY - 100 });
            showToast?.('🖼 วางรูปจากเว็บแล้ว');
            return;
        }
    }

    // Try: url-list (multiple URLs, take first image URL)
    const candidates = (uriList || plainUrl || '').split('\n').map(s => s.trim()).filter(Boolean);
    for (const src of candidates) {
        if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(src) || src.startsWith('data:image/')) {
            addImageToCanvas(src, { x: dropX - 150, y: dropY - 100 });
            showToast?.('🌐 วาง URL รูปจากเว็บแล้ว');
            return;
        }
    }
});
