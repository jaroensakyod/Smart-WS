/* ================================================================
   panel.js — Left SVG Panel Logic
   Build category grid, search, click-to-add, drag-to-canvas
   ================================================================ */

const panelEl = document.getElementById('panelCategories');
const searchEl = document.getElementById('svgSearch');
const monoOnlyEl = document.getElementById('monoOnlyFilter');
const filterWrapEl = document.querySelector('.panel-filter-wrap');

/* Group SVGs by category */
const CATEGORIES = {
    math: { label: '📐 คณิตศาสตร์' },
    people: { label: '👥 ตัวละคร' },
    nature: { label: '🌿 ธรรมชาติ' },
    school: { label: '🏫 โรงเรียน' },
    frames: { label: '🖼️ กรอบ' },
    arrows: { label: '➡️ ลูกศร (Mono)' },
    symbols: { label: '🔘 สัญลักษณ์ (Mono)' },
    geometry: { label: '🧊 เรขาคณิต (Mono)' },
    animals: { label: '🐾 สัตว์ (Mono)' },
};

const MONO_CATEGORIES = new Set(['arrows', 'symbols', 'geometry', 'animals']);
const MONO_CHIPS = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'arrows', label: '➡️ ลายเส้น' },
    { key: 'symbols', label: '🔳 ไอคอน' },
    { key: 'geometry', label: '📏 เทคนิค' },
    { key: 'animals', label: '🐾 สัตว์' },
];

let activeMonoChip = 'all';
let monoChipWrap = null;

function createMonoChips() {
    if (!filterWrapEl || monoChipWrap) return;
    monoChipWrap = document.createElement('div');
    monoChipWrap.className = 'panel-mono-chips';

    MONO_CHIPS.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'eq-chip panel-mono-chip';
        btn.textContent = chip.label;
        btn.dataset.chip = chip.key;
        btn.addEventListener('click', () => {
            activeMonoChip = chip.key;
            syncMonoChipState();
            buildPanel(searchEl?.value || '');
        });
        monoChipWrap.appendChild(btn);
    });

    filterWrapEl.appendChild(monoChipWrap);
}

function syncMonoChipState() {
    if (!monoChipWrap) return;
    monoChipWrap.querySelectorAll('.panel-mono-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.chip === activeMonoChip);
    });
}

function updateMonoChipVisibility() {
    if (!monoChipWrap) return;
    const monoOnly = !!monoOnlyEl?.checked;
    monoChipWrap.style.display = monoOnly ? 'flex' : 'none';
    if (!monoOnly) activeMonoChip = 'all';
    syncMonoChipState();
}

createMonoChips();
updateMonoChipVisibility();

function buildPanel(filter = '') {
    panelEl.innerHTML = '';
    const lc = filter.toLowerCase();
    const monoOnly = !!monoOnlyEl?.checked;

    Object.entries(CATEGORIES).forEach(([cat, { label }]) => {
        const items = (window.SVG_LIBRARY || []).filter(item =>
            item.category === cat &&
            (!monoOnly || MONO_CATEGORIES.has(item.category)) &&
            (!monoOnly || activeMonoChip === 'all' || item.category === activeMonoChip) &&
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

monoOnlyEl?.addEventListener('change', () => {
    updateMonoChipVisibility();
    buildPanel(searchEl?.value || '');
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
