/* ================================================================
   export.js — Export PNG / PDF, Save & Load Project
   ================================================================ */

/* ── 1. EXPORT PNG ──────────────────────────────────────────── */
document.getElementById('btnExportPNG')?.addEventListener('click', () => {
    const canvas = window.wbCanvas;
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `worksheet_${Date.now()}.png`;
    a.click();
    window.showToast?.('📥 ดาวน์โหลด PNG เรียบร้อย');
});

/* ── 2. EXPORT PDF (A4) ─────────────────────────────────────── */
document.getElementById('btnExportPDF')?.addEventListener('click', async () => {
    const canvas = window.wbCanvas;
    if (!canvas) return;
    if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        window.showToast?.('❌ jsPDF ยังโหลดไม่เสร็จ');
        return;
    }

    canvas.discardActiveObject();
    canvas.renderAll();

    const imgData = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });

    // A4 in mm: 210 x 297
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save(`worksheet_${Date.now()}.pdf`);
    window.showToast?.('📄 ดาวน์โหลด PDF เรียบร้อย');
});

/* ── 3. SAVE PROJECT (chrome.storage.local) ─────────────────── */
document.getElementById('btnSave')?.addEventListener('click', () => {
    const canvas = window.wbCanvas;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON(['id']));
    const key = 'wb_project_autosave';

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ [key]: json }, () => {
            window.showToast?.('💾 บันทึกแล้ว');
        });
    } else {
        // Fallback: download as JSON file (works in plain browser too)
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `worksheet_${Date.now()}.json`;
        a.click();
        window.showToast?.('💾 ดาวน์โหลด Project JSON แล้ว');
    }
});

/* ── 4. LOAD PROJECT ────────────────────────────────────────── */
document.getElementById('btnLoad')?.addEventListener('click', () => {
    const key = 'wb_project_autosave';

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get([key], (result) => {
            if (result[key]) {
                loadJson(result[key]);
            } else {
                // No saved project → open file picker
                openFilePicker();
            }
        });
    } else {
        openFilePicker();
    }
});

function loadJson(json) {
    const canvas = window.wbCanvas;
    if (!canvas) return;
    canvas.loadFromJSON(json, () => {
        canvas.renderAll();
        window.showToast?.('📂 โหลด Project แล้ว');
    });
}

function openFilePicker() {
    const fi = document.createElement('input');
    fi.type = 'file'; fi.accept = '.json';
    fi.onchange = () => {
        const file = fi.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => loadJson(e.target.result);
        reader.readAsText(file);
    };
    fi.click();
}

/* ── 5. AUTO-SAVE every 60 seconds ─────────────────────────── */
setInterval(() => {
    const canvas = window.wbCanvas;
    if (!canvas) return;
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        const json = JSON.stringify(canvas.toJSON(['id']));
        chrome.storage.local.set({ wb_project_autosave: json });
    }
}, 60_000);
