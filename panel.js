/* ================================================================
   panel.js — Left SVG Panel Logic
   Build category grid, search, click-to-add, drag-to-canvas
   ================================================================ */

const panelEl = document.getElementById('panelCategories');
const searchEl = document.getElementById('svgSearch');

/* Group SVGs by category */
const CATEGORIES = {
    math: { label: '📐 คณิตศาสตร์' },
    people: { label: '👥 ตัวละคร' },
    nature: { label: '🌿 ธรรมชาติ' },
    school: { label: '🏫 โรงเรียน' },
    frames: { label: '🖼️ กรอบ' },
};

function buildPanel(filter = '') {
    panelEl.innerHTML = '';
    const lc = filter.toLowerCase();

    Object.entries(CATEGORIES).forEach(([cat, { label }]) => {
        const items = (window.SVG_LIBRARY || []).filter(item =>
            item.category === cat &&
            (lc === '' || item.name.includes(lc) || item.id.includes(lc))
        );
        if (!items.length) return;

        const catDiv = document.createElement('div');
        catDiv.className = 'svg-category';
        catDiv.innerHTML = `<div class="svg-category-title">${label}</div>`;

        const grid = document.createElement('div');
        grid.className = 'svg-grid';

        items.forEach(item => {
            const thumb = document.createElement('div');
            thumb.className = 'svg-thumb';
            thumb.title = item.name;
            thumb.innerHTML = item.svg;
            thumb.draggable = true;

            // Click → add to center of canvas
            thumb.addEventListener('click', () => {
                window.fabricAddSvgAtCenter(item.svg);
                window.showToast?.(`เพิ่ม "${item.name}" แล้ว`);
            });

            // Drag → store SVG in dataTransfer
            thumb.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/svg', item.svg);
                // Clone thumb as drag image
                const ghost = thumb.cloneNode(true);
                ghost.className = 'dragging-svg';
                ghost.style.width = '64px'; ghost.style.height = '64px';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 32, 32);
                setTimeout(() => ghost.remove(), 0);
            });

            grid.appendChild(thumb);
        });

        catDiv.appendChild(grid);
        panelEl.appendChild(catDiv);
    });

    if (!panelEl.children.length) {
        panelEl.innerHTML = `<p style="color:var(--muted);font-size:11px;padding:8px 2px">ไม่พบรูป "${filter}"</p>`;
    }
}

buildPanel();

// Debounced search
let searchTimer;
searchEl?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => buildPanel(searchEl.value), 180);
});

/* ── Import SVG from local file ─────────────────────────────── */
const fileInput = document.getElementById('svgFileInput');
fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        window.fabricAddSvgAtCenter(e.target.result);
        window.showToast?.(`นำเข้า "${file.name}" แล้ว`);
    };
    reader.readAsText(file);
    fileInput.value = '';
});
