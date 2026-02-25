/* ================================================================
   proFeatures.js — Smart WS Pro UX, assets, templates, interactions
   ================================================================ */

(function () {
    'use strict';

    const canvas = window.wbCanvas;
    if (!canvas) return;

    const STORAGE_UPLOADS = 'smartws_upload_assets_v1';
    const STORAGE_COLORS = 'smartws_doc_colors_v1';
    const SAVED_DB = 'smartws_saved_elements_v1';
    const SAVED_STORE = 'elements';

    const templateCards = [
        { key: 'taskcards4', title: 'Task Cards 4', desc: 'การ์ดงาน 4 ช่องพร้อมเส้นตัด' },
        { key: 'taskcards8', title: 'Task Cards 8', desc: 'การ์ดงาน 8 ช่องสำหรับกิจกรรมเร็ว' },
        { key: 'frayer', title: 'Frayer Model', desc: 'Definition / Characteristics / Examples / Non-examples' },
        { key: 'kwl', title: 'KWL Chart', desc: 'Know / Want to know / Learned' },
        { key: 'venn', title: 'Venn Diagram', desc: 'วงเวนน์ 2 วงสำหรับเปรียบเทียบ' },
        { key: 'graphpaper', title: 'Graph Paper', desc: 'กระดาษกราฟคณิตศาสตร์' },
        { key: 'numberline', title: 'Number Line', desc: 'เส้นจำนวนพร้อมตำแหน่งหลัก' },
        { key: 'fractionpies', title: 'Fraction Pies', desc: 'วงกลมเศษส่วน 2,3,4,6,8 ส่วน' },
        { key: 'quiz', title: 'Quiz MCQ', desc: 'ข้อสอบปรนัยพร้อมคำตอบ ก ข ค ง' },
        { key: 'matchingColumns', title: 'Matching Columns', desc: 'จับคู่คอลัมน์ซ้ายและขวา' },
        { key: 'handwriting', title: 'Handwriting Lines', desc: 'เส้นคัดลายมือแบบทึบ-ประ-ทึบ' },
        { key: 'comicstrip', title: 'Comic Strip', desc: 'ช่องวาดการ์ตูนพร้อมบรรยาย' },
        { key: 'foldable', title: 'Foldable', desc: 'แม่แบบใบงานพับได้พร้อมเส้นพับ' },
        { key: 'bingo3', title: 'Bingo 3x3', desc: 'บิงโกขนาดเล็กสำหรับกิจกรรมเร็ว' },
        { key: 'wordsearch10', title: 'Word Search', desc: 'ตารางหาคำศัพท์ขนาด 10x10' },
        { key: 'boardgame', title: 'Board Game Path', desc: 'ทางเดินเกมแบบซิกแซกบนกระดาษ' },
        { key: 'exitticket', title: 'Exit Tickets', desc: 'แบบประเมินท้ายคาบ 4 ส่วน' },
        { key: 'mindmap', title: 'Mind Map', desc: 'แผนผังความคิดแตกแขนง 4 ทิศ' },
        { key: 'certificate', title: 'Certificate', desc: 'เทมเพลตเกียรติบัตรพร้อมกรอบ' },
        { key: 'teacherplanner', title: 'Teacher Planner', desc: 'ตารางวางแผนการสอนรายสัปดาห์' },
    ];

    const borderCards = [
        { key: 'simple', title: 'Simple Border', desc: 'กรอบเส้นเดี่ยวเรียบง่าย' },
        { key: 'double', title: 'Double Border', desc: 'กรอบเส้นคู่ยอดนิยม' },
        { key: 'dashed', title: 'Dashed Border', desc: 'กรอบเส้นประแบบ Worksheet' },
        { key: 'dotted', title: 'Dotted Border', desc: 'กรอบจุดสไตล์น่ารัก' },
        { key: 'geo', title: 'Geometric Border', desc: 'กรอบลายเรขาคณิต' },
        { key: 'doodle', title: 'Doodle Border', desc: 'กรอบวาดมือ (hand-drawn)' },
        { key: 'corners', title: 'Corner Accent', desc: 'ตกแต่งเฉพาะมุมกระดาษ' },
    ];

    function setupTabs() {
        const tabs = Array.from(document.querySelectorAll('.sidebar-tab'));
        const panels = Array.from(document.querySelectorAll('.sidebar-tab-content'));
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.tab || '');
                if (target) target.classList.add('active');
            });
        });
    }

    function buildCardGallery(rootId, cards, onClick) {
        const root = document.getElementById(rootId);
        if (!root) return;
        root.innerHTML = '';
        cards.forEach(item => {
            const el = document.createElement('div');
            el.className = 'template-card';
            el.innerHTML = `<div class="template-card-title">${item.title}</div><div class="template-card-desc">${item.desc}</div>`;
            el.addEventListener('click', () => onClick(item));
            root.appendChild(el);
        });
    }

    function addShape(type) {
        const stroke = document.getElementById('colorStroke')?.value || '#1e293b';
        const fill = document.getElementById('colorFill')?.value || '#ffffff';
        const left = 120;
        const top = 120;
        let obj = null;

        if (type === 'square') {
            obj = new fabric.Rect({ left, top, width: 140, height: 140, fill, stroke, strokeWidth: 2, rx: 6, ry: 6 });
        }
        if (type === 'circle') {
            obj = new fabric.Circle({ left, top, radius: 70, fill, stroke, strokeWidth: 2 });
        }
        if (type === 'triangle') {
            obj = new fabric.Triangle({ left, top, width: 160, height: 140, fill, stroke, strokeWidth: 2 });
        }
        if (type === 'arrow') {
            const shaft = new fabric.Rect({ left, top: top + 44, width: 170, height: 24, fill, stroke, strokeWidth: 2, originX: 'left', originY: 'top' });
            const head = new fabric.Triangle({ left: left + 188, top: top + 56, width: 56, height: 56, angle: 90, fill, stroke, strokeWidth: 2, originX: 'center', originY: 'center' });
            obj = new fabric.Group([shaft, head], { objectCaching: false });
        }

        if (!obj) return;
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
        markSaving();
    }

    function addBorder(kind) {
        const paper = window.wbGetPaperConfig?.() || { width: canvas.width, height: canvas.height };
        const margin = Math.round((paper.marginIn || 0.5) * 96);
        const left = margin;
        const top = margin;
        const width = (paper.width || canvas.width) - margin * 2;
        const height = (paper.height || canvas.height) - margin * 2;
        const stroke = document.getElementById('colorStroke')?.value || '#1e293b';

        let border;
        if (kind === 'double') {
            const outer = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2, selectable: false, evented: false });
            const inner = new fabric.Rect({ left: left + 10, top: top + 10, width: width - 20, height: height - 20, fill: 'transparent', stroke, strokeWidth: 1.4, selectable: false, evented: false });
            border = new fabric.Group([outer, inner], { objectCaching: false });
        } else if (kind === 'dashed') {
            border = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2, strokeDashArray: [12, 8] });
        } else if (kind === 'dotted') {
            border = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2, strokeDashArray: [2, 8] });
        } else if (kind === 'geo') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2 });
            const deco = [];
            for (let i = 0; i < 12; i++) {
                deco.push(new fabric.Circle({
                    left: left + 8 + i * ((width - 20) / 11),
                    top: top - 6,
                    radius: 3,
                    fill: stroke,
                    selectable: false,
                    evented: false,
                }));
            }
            border = new fabric.Group([base, ...deco], { objectCaching: false });
        } else if (kind === 'doodle') {
            const p = `M ${left} ${top} Q ${left + width / 4} ${top - 6} ${left + width / 2} ${top} T ${left + width} ${top} L ${left + width} ${top + height} Q ${left + width + 8} ${top + height / 2} ${left + width} ${top} M ${left + width} ${top + height} Q ${left + width / 2} ${top + height + 8} ${left} ${top + height} L ${left} ${top}`;
            border = new fabric.Path(p, { fill: 'transparent', stroke, strokeWidth: 2 });
        } else if (kind === 'corners') {
            const len = 58;
            const corners = [
                new fabric.Path(`M ${left} ${top + len} L ${left} ${top} L ${left + len} ${top}`, { fill: 'transparent', stroke, strokeWidth: 4 }),
                new fabric.Path(`M ${left + width - len} ${top} L ${left + width} ${top} L ${left + width} ${top + len}`, { fill: 'transparent', stroke, strokeWidth: 4 }),
                new fabric.Path(`M ${left + width} ${top + height - len} L ${left + width} ${top + height} L ${left + width - len} ${top + height}`, { fill: 'transparent', stroke, strokeWidth: 4 }),
                new fabric.Path(`M ${left + len} ${top + height} L ${left} ${top + height} L ${left} ${top + height - len}`, { fill: 'transparent', stroke, strokeWidth: 4 }),
            ];
            border = new fabric.Group(corners, { objectCaching: false });
        } else {
            border = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2 });
        }

        border.data = { ...(border.data || {}), type: 'pageBorder', lockRecommended: true };
        canvas.add(border);
        canvas.setActiveObject(border);
        lockObject(border, true);
        canvas.requestRenderAll();
        window.showToast?.('เพิ่มกรอบกระดาษแล้ว (ล็อกไว้ให้)');
        markSaving();
    }

    function lockObject(obj, locked) {
        if (!obj) return;
        obj.set({
            selectable: !locked,
            evented: !locked,
            lockMovementX: !!locked,
            lockMovementY: !!locked,
            lockRotation: !!locked,
            lockScalingX: !!locked,
            lockScalingY: !!locked,
            hasControls: !locked,
        });
        obj.data = { ...(obj.data || {}), locked: !!locked };
    }

    function lockSelection(locked) {
        const active = canvas.getActiveObject();
        if (!active) {
            if (!locked) {
                canvas.getObjects().forEach(obj => {
                    if (obj.data?.locked) lockObject(obj, false);
                });
                canvas.requestRenderAll();
                markSaving();
            }
            return;
        }
        if (active.type === 'activeSelection') {
            active.getObjects().forEach(obj => lockObject(obj, locked));
            canvas.discardActiveObject();
        } else {
            lockObject(active, locked);
        }
        canvas.requestRenderAll();
        markSaving();
    }

    function groupSelection() {
        const active = canvas.getActiveObject();
        if (!active || active.type !== 'activeSelection') return;
        active.toGroup();
        canvas.requestRenderAll();
        markSaving();
    }

    function ungroupSelection() {
        const active = canvas.getActiveObject();
        if (!active || active.type !== 'group') return;
        active.toActiveSelection();
        canvas.requestRenderAll();
        markSaving();
    }

    function bringFront() {
        const active = canvas.getActiveObject();
        if (!active) return;
        canvas.bringToFront(active);
        canvas.requestRenderAll();
        markSaving();
    }

    function sendBack() {
        const active = canvas.getActiveObject();
        if (!active) return;
        canvas.sendToBack(active);
        canvas.requestRenderAll();
        markSaving();
    }

    let zoom = 1;
    window.wbGetZoom = () => zoom;
    window.wbSetZoom = setZoom;
    
    function setZoom(nextZoom) {
        zoom = Math.min(3, Math.max(0.25, nextZoom));
        
        const paper = window.wbGetPaperConfig?.() || { width: 794, height: 1123 };
        
        canvas.setWidth(paper.width * zoom);
        canvas.setHeight(paper.height * zoom);
        canvas.setZoom(zoom);
        canvas.calcOffset();
        
        const root = document.documentElement;
        root.style.setProperty('--paper-w', `${paper.width * zoom}px`);
        root.style.setProperty('--paper-h', `${paper.height * zoom}px`);
        root.style.setProperty('--grid-size', `${24 * zoom}px`);
        root.style.setProperty('--safe-margin', `${Math.round((paper.marginIn || 0.5) * 96) * zoom}px`);
        
        canvas.requestRenderAll();
        const el = document.getElementById('zoomIndicator');
        if (el) el.textContent = `${Math.round(zoom * 100)}%`;
    }

    function zoomToFit() {
        const pageShadow = document.querySelector('.page-shadow');
        const canvasArea = document.querySelector('.canvas-area');
        if (!pageShadow || !canvasArea) return;
        
        const paper = window.wbGetPaperConfig?.() || { width: 794, height: 1123 };
        const areaRect = canvasArea.getBoundingClientRect();
        
        const scaleW = (areaRect.width - 60) / paper.width;
        const scaleH = (areaRect.height - 60) / paper.height;
        setZoom(Math.min(scaleW, scaleH, 1));
    }

    let spacePressed = false;
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;

    function setupPan() {
        const area = document.querySelector('.canvas-area');
        const wrapper = document.querySelector('.canvas-wrapper');
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                if (!spacePressed) {
                    spacePressed = true;
                    document.body.classList.add('panning');
                    if (wrapper) wrapper.style.pointerEvents = 'none';
                }
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                spacePressed = false;
                isPanning = false;
                document.body.classList.remove('panning');
                if (wrapper) wrapper.style.pointerEvents = 'auto';
            }
        });

        if (!area) return;

        area.addEventListener('mousedown', (e) => {
            if (!spacePressed) return;
            isPanning = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            area.scrollLeft -= dx;
            area.scrollTop -= dy;
        });

        window.addEventListener('mouseup', () => {
            isPanning = false;
        });
    }

    function addTextPreset(kind) {
        const presets = {
            heading: { text: 'Worksheet Title', fontSize: 40, fontFamily: 'Fredoka' },
            subheading: { text: 'Directions: ...', fontSize: 28, fontFamily: 'Sarabun' },
            body: { text: 'Type your instruction here', fontSize: 20, fontFamily: 'Sarabun' },
        };
        const p = presets[kind] || presets.body;
        const obj = new fabric.IText(p.text, {
            left: 80,
            top: kind === 'heading' ? 60 : (kind === 'subheading' ? 120 : 180),
            fill: document.getElementById('colorText')?.value || '#1e293b',
            fontSize: p.fontSize,
            fontFamily: p.fontFamily,
            fontWeight: kind === 'heading' ? '700' : '400',
        });
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
        markSaving();
    }

    function getActiveTextObject() {
        const active = canvas.getActiveObject();
        if (!active) return null;
        if (active.type === 'i-text' || active.type === 'text' || active.type === 'textbox') return active;
        return null;
    }

    function toggleTextOutline() {
        const text = getActiveTextObject();
        if (!text) {
            window.showToast?.('เลือกข้อความก่อนใช้งาน Text Outline');
            return;
        }
        const strokeColor = document.getElementById('colorStroke')?.value || '#1e293b';
        const hasOutline = Number(text.strokeWidth || 0) > 0;
        text.set({
            stroke: hasOutline ? null : strokeColor,
            strokeWidth: hasOutline ? 0 : 1.5,
            paintFirst: 'stroke',
        });
        canvas.requestRenderAll();
        markSaving();
    }

    function toggleTextShadow() {
        const text = getActiveTextObject();
        if (!text) {
            window.showToast?.('เลือกข้อความก่อนใช้งาน Drop Shadow');
            return;
        }
        const hasShadow = !!text.shadow;
        if (hasShadow) {
            text.set({ shadow: null });
        } else {
            text.set({
                shadow: new fabric.Shadow({
                    color: 'rgba(0,0,0,0.32)',
                    blur: 6,
                    offsetX: 4,
                    offsetY: 4,
                }),
            });
        }
        canvas.requestRenderAll();
        markSaving();
    }

    function convertTextToCurve() {
        const text = getActiveTextObject();
        if (!text) {
            window.showToast?.('เลือกข้อความก่อนใช้งาน Curved Text');
            return;
        }
        const pathWidth = Math.max(180, Math.min(420, (text.width || 260) + 100));
        const path = new fabric.Path(`M 0 0 Q ${pathWidth / 2} -80 ${pathWidth} 0`, {
            visible: false,
            selectable: false,
            evented: false,
        });
        const curved = new fabric.Text(String(text.text || ''), {
            left: text.left,
            top: text.top,
            fill: text.fill,
            fontFamily: text.fontFamily,
            fontSize: text.fontSize,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            underline: text.underline,
            path,
            pathSide: 'left',
            pathAlign: 'center',
        });
        curved.data = { ...(text.data || {}), curvedText: true };
        canvas.remove(text);
        canvas.add(curved);
        canvas.setActiveObject(curved);
        canvas.requestRenderAll();
        markSaving();
    }

    function applyMask(kind) {
        const active = canvas.getActiveObject();
        if (!active || active.type !== 'image') {
            window.showToast?.('เลือกภาพก่อนใช้งาน Mask');
            return;
        }
        const w = active.getScaledWidth();
        const h = active.getScaledHeight();
        if (kind === 'circle') {
            const radius = Math.min(w, h) / 2;
            active.clipPath = new fabric.Circle({
                radius,
                originX: 'center',
                originY: 'center',
            });
        } else if (kind === 'rounded') {
            active.clipPath = new fabric.Rect({
                width: w,
                height: h,
                rx: 24,
                ry: 24,
                originX: 'center',
                originY: 'center',
            });
        } else {
            active.clipPath = null;
        }
        canvas.requestRenderAll();
        markSaving();
    }

    function cropActiveImage() {
        const active = canvas.getActiveObject();
        if (!active || active.type !== 'image') {
            window.showToast?.('เลือกภาพก่อนใช้งาน Crop');
            return;
        }
        const cropPercent = Math.min(45, Math.max(5, Number(window.prompt('Crop ออกด้านละกี่เปอร์เซ็นต์? (5-45)', '12')) || 12));
        const ratio = cropPercent / 100;
        const baseW = active.width || 0;
        const baseH = active.height || 0;
        const cropX = Math.round(baseW * ratio);
        const cropY = Math.round(baseH * ratio);
        const width = Math.max(20, Math.round(baseW * (1 - ratio * 2)));
        const height = Math.max(20, Math.round(baseH * (1 - ratio * 2)));

        active.set({
            cropX,
            cropY,
            width,
            height,
        });
        canvas.requestRenderAll();
        markSaving();
    }

    function addQrCode() {
        const input = document.getElementById('qrUrlInput');
        const url = String(input?.value || '').trim();
        if (!url) {
            window.showToast?.('กรอก URL ก่อนสร้าง QR Code');
            return;
        }
        const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`;
        fabric.Image.fromURL(qrSrc, (img) => {
            if (!img) {
                window.showToast?.('สร้าง QR ไม่สำเร็จ');
                return;
            }
            const scale = Math.min((canvas.width * 0.25) / img.width, (canvas.height * 0.25) / img.height, 1);
            img.set({
                left: canvas.width / 2 - (img.width * scale) / 2,
                top: canvas.height / 2 - (img.height * scale) / 2,
                scaleX: scale,
                scaleY: scale,
            });
            img.data = { ...(img.data || {}), type: 'qrCode', sourceUrl: url };
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
            markSaving();
            window.showToast?.('เพิ่ม QR Code แล้ว');
        }, { crossOrigin: 'anonymous' });
    }

    function showPageManager(open) {
        const modal = document.getElementById('pageManagerModal');
        if (!modal) return;
        modal.style.display = open ? 'flex' : 'none';
    }

    function getLayerLabel(obj, idx) {
        const base = obj.data?.type || obj.type || 'object';
        return `${idx + 1}. ${base}`;
    }

    function renderLayersPanel() {
        const root = document.getElementById('layersPanelList');
        if (!root) return;
        const active = canvas.getActiveObject();
        const objects = [...canvas.getObjects()].reverse();
        root.innerHTML = '';

        if (!objects.length) {
            root.innerHTML = '<div class="template-card"><div class="template-card-title">ยังไม่มี Layer</div><div class="template-card-desc">เพิ่มวัตถุลง Canvas ก่อน</div></div>';
            return;
        }

        objects.forEach((obj, i) => {
            const item = document.createElement('div');
            item.className = `layer-item${active === obj ? ' active' : ''}`;
            const locked = !!obj.data?.locked;
            const hidden = obj.visible === false;
            item.innerHTML = `
                <div class="layer-title">${getLayerLabel(obj, objects.length - 1 - i)}</div>
                <div class="layer-actions">
                    <button class="layer-btn" data-action="toggleLock" title="Lock/Unlock">${locked ? '🔒' : '🔓'}</button>
                    <button class="layer-btn" data-action="toggleVisible" title="Show/Hide">${hidden ? '🙈' : '👁'}</button>
                    <button class="layer-btn" data-action="up" title="Bring Forward">▲</button>
                    <button class="layer-btn" data-action="down" title="Send Backward">▼</button>
                </div>`;

            item.addEventListener('click', (e) => {
                if (e.target?.classList?.contains('layer-btn')) return;
                canvas.setActiveObject(obj);
                canvas.requestRenderAll();
                renderLayersPanel();
            });

            item.querySelector('[data-action="toggleLock"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const nextLocked = !obj.data?.locked;
                obj.set({
                    selectable: !nextLocked,
                    evented: !nextLocked,
                    lockMovementX: nextLocked,
                    lockMovementY: nextLocked,
                    lockRotation: nextLocked,
                    lockScalingX: nextLocked,
                    lockScalingY: nextLocked,
                    hasControls: !nextLocked,
                });
                obj.data = { ...(obj.data || {}), locked: nextLocked };
                canvas.requestRenderAll();
                markSaving();
                renderLayersPanel();
            });

            item.querySelector('[data-action="toggleVisible"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                obj.visible = obj.visible === false;
                canvas.requestRenderAll();
                markSaving();
                renderLayersPanel();
            });

            item.querySelector('[data-action="up"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                canvas.bringForward(obj);
                canvas.requestRenderAll();
                markSaving();
                renderLayersPanel();
            });

            item.querySelector('[data-action="down"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                canvas.sendBackwards(obj);
                canvas.requestRenderAll();
                markSaving();
                renderLayersPanel();
            });

            root.appendChild(item);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addMathProblems() {
        const type = (window.prompt('ประเภทโจทย์: +, -, *, /', '+') || '+').trim();
        const digits = Math.min(3, Math.max(1, Number(window.prompt('จำนวนหลัก (1-3)', '2')) || 2));
        const count = Math.min(40, Math.max(4, Number(window.prompt('จำนวนข้อ', '12')) || 12));
        const max = Number(`1${'0'.repeat(digits)}`) - 1;
        const min = digits === 1 ? 1 : Number(`1${'0'.repeat(digits - 1)}`);

        const col = 3;
        const gapX = 220;
        const gapY = 68;
        for (let i = 0; i < count; i++) {
            const a = getRandomInt(min, max);
            let b = getRandomInt(min, max);
            if (type === '/') b = Math.max(1, b);
            let expr = `${a} ${type} ${b} = _____`;
            if (type === '/') {
                const ans = getRandomInt(2, 9);
                const div = getRandomInt(2, 12);
                expr = `${ans * div} ÷ ${div} = [${ans}]`;
            }
            const x = 80 + (i % col) * gapX;
            const y = 120 + Math.floor(i / col) * gapY;
            const t = new fabric.IText(`${i + 1}) ${expr}`, {
                left: x,
                top: y,
                fontFamily: 'Sarabun',
                fontSize: 22,
                fill: document.getElementById('colorText')?.value || '#1e293b',
            });
            canvas.add(t);
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('สร้างโจทย์คณิตศาสตร์แล้ว');
    }

    function generateWordSearchGrid(words, size = 10) {
        const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
        const dirs = [
            [1, 0],
            [0, 1],
            [1, 1],
            [-1, 1],
        ];

        words.forEach(word => {
            const clean = String(word || '').toUpperCase().replace(/[^A-Z]/g, '');
            if (!clean) return;
            let placed = false;
            for (let attempt = 0; attempt < 60 && !placed; attempt++) {
                const [dx, dy] = dirs[getRandomInt(0, dirs.length - 1)];
                const sx = getRandomInt(0, size - 1);
                const sy = getRandomInt(0, size - 1);
                const ex = sx + dx * (clean.length - 1);
                const ey = sy + dy * (clean.length - 1);
                if (ex < 0 || ey < 0 || ex >= size || ey >= size) continue;
                let can = true;
                for (let i = 0; i < clean.length; i++) {
                    const x = sx + dx * i;
                    const y = sy + dy * i;
                    const existing = grid[y][x];
                    if (existing && existing !== clean[i]) {
                        can = false;
                        break;
                    }
                }
                if (!can) continue;
                for (let i = 0; i < clean.length; i++) {
                    const x = sx + dx * i;
                    const y = sy + dy * i;
                    grid[y][x] = clean[i];
                }
                placed = true;
            }
        });

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (!grid[y][x]) grid[y][x] = String.fromCharCode(65 + getRandomInt(0, 25));
            }
        }
        return grid;
    }

    function addWordSearch() {
        const raw = window.prompt('ใส่คำศัพท์ (คั่นด้วย comma) เช่น CAT,DOG,BIRD', 'CAT,DOG,BIRD,SCHOOL,MATH');
        if (!raw) return;
        const words = raw.split(',').map(w => w.trim()).filter(Boolean).slice(0, 12);
        const size = Math.min(14, Math.max(8, Number(window.prompt('ขนาดตาราง (8-14)', '10')) || 10));
        const grid = generateWordSearchGrid(words, size);

        const startX = 90;
        const startY = 160;
        const cell = 42;
        canvas.add(new fabric.IText('Word Search', { left: startX, top: 84, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let r = 0; r <= size; r++) {
            const y = startY + r * cell;
            canvas.add(new fabric.Line([startX, y, startX + size * cell, y], { stroke: '#334155', strokeWidth: 1.6, selectable: false, evented: false }));
        }
        for (let c = 0; c <= size; c++) {
            const x = startX + c * cell;
            canvas.add(new fabric.Line([x, startY, x, startY + size * cell], { stroke: '#334155', strokeWidth: 1.6, selectable: false, evented: false }));
        }
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                canvas.add(new fabric.IText(grid[r][c], {
                    left: startX + c * cell + 13,
                    top: startY + r * cell + 8,
                    fontFamily: 'Fredoka',
                    fontSize: 20,
                    fill: '#0f172a',
                }));
            }
        }
        canvas.add(new fabric.IText(`Find: ${words.join(', ')}`, { left: startX, top: startY + size * cell + 20, fontFamily: 'Sarabun', fontSize: 18, fill: '#334155' }));
        canvas.requestRenderAll();
        markSaving();
    }

    function addCrossword() {
        const raw = window.prompt('ใส่คำศัพท์ crossword (comma) เช่น CAT,DOG,SUN,MAP', 'CAT,DOG,SUN,MAP,TREE,BOOK');
        if (!raw) return;
        const words = raw.split(',').map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, '')).filter(Boolean).slice(0, 8);
        if (!words.length) return;

        const startX = 90;
        const startY = 160;
        const cell = 44;
        const maxWord = Math.max(...words.map(w => w.length));
        const rows = Math.max(8, words.length + 2);
        const cols = Math.max(10, maxWord + 4);

        canvas.add(new fabric.IText('Crossword', { left: startX, top: 84, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let r = 0; r <= rows; r++) {
            canvas.add(new fabric.Line([startX, startY + r * cell, startX + cols * cell, startY + r * cell], { stroke: '#334155', strokeWidth: 1.4, selectable: false, evented: false }));
        }
        for (let c = 0; c <= cols; c++) {
            canvas.add(new fabric.Line([startX + c * cell, startY, startX + c * cell, startY + rows * cell], { stroke: '#334155', strokeWidth: 1.4, selectable: false, evented: false }));
        }

        words.forEach((word, i) => {
            const horizontal = i % 2 === 0;
            const row = 1 + i;
            const col = horizontal ? 1 : 2 + Math.floor(cols / 2);
            for (let j = 0; j < word.length; j++) {
                const x = horizontal ? col + j : col;
                const y = horizontal ? row : row + j;
                if (x >= cols || y >= rows) break;
                canvas.add(new fabric.IText('[ ]', {
                    left: startX + x * cell + 10,
                    top: startY + y * cell + 10,
                    fontFamily: 'Sarabun',
                    fontSize: 18,
                    fill: '#0f172a',
                }));
            }
            canvas.add(new fabric.IText(`${i + 1}. ${word}`, {
                left: startX + cols * cell + 20,
                top: startY + i * 34,
                fontFamily: 'Sarabun',
                fontSize: 18,
                fill: '#334155',
            }));
        });
        canvas.requestRenderAll();
        markSaving();
    }

    function openSavedDb() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(SAVED_DB, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(SAVED_STORE)) {
                    db.createObjectStore(SAVED_STORE, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function saveCurrentSelectionAsElement() {
        const active = canvas.getActiveObject();
        if (!active) {
            window.showToast?.('เลือกวัตถุก่อนบันทึก');
            return;
        }

        const name = window.prompt('ชื่อ element ที่จะบันทึก', `element-${Date.now()}`);
        if (!name) return;

        const json = JSON.stringify(active.toObject(['data', 'id', 'name']));
        const preview = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.2 });
        const db = await openSavedDb();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(SAVED_STORE, 'readwrite');
            tx.objectStore(SAVED_STORE).add({ name, json, preview, createdAt: Date.now() });
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });
        db.close();
        renderSavedElements();
        markSaving();
        window.showToast?.('บันทึก element แล้ว');
    }

    async function getSavedElements() {
        const db = await openSavedDb();
        const items = await new Promise((resolve, reject) => {
            const tx = db.transaction(SAVED_STORE, 'readonly');
            const req = tx.objectStore(SAVED_STORE).getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
        db.close();
        return (items || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    async function deleteSavedElement(id) {
        const db = await openSavedDb();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(SAVED_STORE, 'readwrite');
            tx.objectStore(SAVED_STORE).delete(id);
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });
        db.close();
    }

    function reviveObjectFromJson(raw) {
        return new Promise((resolve) => {
            const parsed = JSON.parse(raw || '{}');
            fabric.util.enlivenObjects([parsed], (objects) => {
                resolve(objects?.[0] || null);
            });
        });
    }

    async function renderSavedElements() {
        const root = document.getElementById('savedElementsGrid');
        if (!root) return;
        let items = [];
        try {
            items = await getSavedElements();
        } catch {
            root.innerHTML = '<div class="template-card"><div class="template-card-title">IndexedDB ใช้งานไม่ได้</div></div>';
            return;
        }

        root.innerHTML = '';
        if (!items.length) {
            root.innerHTML = '<div class="template-card"><div class="template-card-title">ยังไม่มี Saved Element</div><div class="template-card-desc">เลือกวัตถุแล้วกด Save Selection</div></div>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'upload-thumb';
            card.innerHTML = `<img src="${item.preview}" alt="${item.name}"><div class="template-card-desc">${item.name}</div>`;

            card.addEventListener('click', async () => {
                const obj = await reviveObjectFromJson(item.json);
                if (!obj) return;
                obj.set({ left: canvas.width * 0.5 - 80, top: canvas.height * 0.5 - 80 });
                canvas.add(obj);
                canvas.setActiveObject(obj);
                canvas.requestRenderAll();
                markSaving();
            });

            card.addEventListener('contextmenu', async (e) => {
                e.preventDefault();
                if (!window.confirm(`ลบ ${item.name} ?`)) return;
                await deleteSavedElement(item.id);
                await renderSavedElements();
            });

            root.appendChild(card);
        });
    }

    async function renderPageManager() {
        const grid = document.getElementById('pageThumbGrid');
        if (!grid || !window.wbGetPageThumbnails) return;
        grid.innerHTML = '<div class="img-loading">⏳ กำลังสร้างตัวอย่างหน้า...</div>';
        const thumbs = await window.wbGetPageThumbnails();
        const active = window.wbGetActivePageIndex?.() || 0;
        grid.innerHTML = '';

        thumbs.forEach((item) => {
            const card = document.createElement('button');
            card.className = `page-thumb-card${item.index === active ? ' active' : ''}`;
            card.draggable = true;
            card.dataset.index = String(item.index);
            card.innerHTML = `<img src="${item.preview}" alt="page ${item.index + 1}"><div class="page-thumb-label">Page ${item.index + 1}</div>`;

            card.addEventListener('click', async () => {
                await window.wbGoToPage?.(item.index);
                showPageManager(false);
            });
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer?.setData('text/plain', String(item.index));
            });
            card.addEventListener('dragover', (e) => e.preventDefault());
            card.addEventListener('drop', async (e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer?.getData('text/plain'));
                const to = Number(card.dataset.index);
                if (Number.isFinite(from) && Number.isFinite(to) && window.wbMovePage) {
                    await window.wbMovePage(from, to);
                    await renderPageManager();
                    markSaving();
                }
            });

            grid.appendChild(card);
        });
    }

    function readUploads() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_UPLOADS) || '[]');
        } catch {
            return [];
        }
    }

    function writeUploads(items) {
        localStorage.setItem(STORAGE_UPLOADS, JSON.stringify(items || []));
    }

    function addUploadToCanvas(item) {
        if (!item) return;
        if (item.type === 'image/svg+xml' || String(item.name || '').toLowerCase().endsWith('.svg')) {
            window.fabricAddSvgAtCenter?.(item.data);
            return;
        }
        fabric.Image.fromURL(item.data, (img) => {
            if (!img) return;
            const scale = Math.min((canvas.width * 0.45) / img.width, (canvas.height * 0.35) / img.height, 1);
            img.set({ left: canvas.width / 2 - (img.width * scale) / 2, top: canvas.height / 2 - (img.height * scale) / 2, scaleX: scale, scaleY: scale });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
        });
    }

    function renderUploadGallery() {
        const root = document.getElementById('uploadGallery');
        if (!root) return;
        const items = readUploads();
        root.innerHTML = '';
        if (!items.length) {
            root.innerHTML = '<div class="template-card"><div class="template-card-title">ยังไม่มีไฟล์อัปโหลด</div><div class="template-card-desc">เพิ่มไฟล์ภาพจากเครื่องเพื่อใช้งานซ้ำ</div></div>';
            return;
        }
        items.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'upload-thumb';
            const src = item.type === 'image/svg+xml' ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.data)}` : item.data;
            el.innerHTML = `<img src="${src}" alt="${item.name}"><div class="template-card-desc">${item.name}</div>`;
            el.addEventListener('click', () => addUploadToCanvas(item));
            root.appendChild(el);
        });
    }

    function setupUploads() {
        const input = document.getElementById('assetUploadInput');
        if (!input) return;
        input.addEventListener('change', async () => {
            const files = Array.from(input.files || []);
            if (!files.length) return;
            const current = readUploads();
            for (const file of files.slice(0, 20)) {
                if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
                    const data = await file.text();
                    current.unshift({ name: file.name, type: 'image/svg+xml', data });
                } else if (file.type.startsWith('image/')) {
                    const data = await new Promise((resolve) => {
                        const fr = new FileReader();
                        fr.onload = (e) => resolve(e.target.result);
                        fr.readAsDataURL(file);
                    });
                    current.unshift({ name: file.name, type: file.type, data });
                }
            }
            writeUploads(current.slice(0, 60));
            renderUploadGallery();
            markSaving();
            input.value = '';
            window.showToast?.('เพิ่มไฟล์เข้า My Uploads แล้ว');
        });
    }

    function readDocColors() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_COLORS) || '[]');
        } catch {
            return [];
        }
    }

    function writeDocColors(colors) {
        localStorage.setItem(STORAGE_COLORS, JSON.stringify(colors || []));
    }

    function pushDocColor(color) {
        const c = String(color || '').trim();
        if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return;
        const list = readDocColors().filter(x => x.toLowerCase() !== c.toLowerCase());
        list.unshift(c);
        writeDocColors(list.slice(0, 18));
        renderDocColors();
    }

    function renderDocColors() {
        const root = document.getElementById('documentColors');
        if (!root) return;
        const colors = readDocColors();
        root.innerHTML = colors.map(c => `<button class="doc-color-chip" title="${c}" data-color="${c}" style="background:${c}"></button>`).join('');
        root.querySelectorAll('.doc-color-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                const fill = document.getElementById('colorFill');
                if (fill) fill.value = color;
                fill?.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }

    function setSaveIndicator(state) {
        const el = document.getElementById('autosaveStatus');
        if (!el) return;
        el.classList.remove('saving', 'saved');
        if (state === 'saving') {
            el.textContent = 'Saving...';
            el.classList.add('saving');
        } else {
            el.textContent = 'Saved';
            el.classList.add('saved');
        }
    }

    let saveTimer = null;
    function markSaving() {
        setSaveIndicator('saving');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => setSaveIndicator('saved'), 500);
    }

    function setupEvents() {
        document.getElementById('btnAddSquare')?.addEventListener('click', () => addShape('square'));
        document.getElementById('btnAddCircle')?.addEventListener('click', () => addShape('circle'));
        document.getElementById('btnAddTriangle')?.addEventListener('click', () => addShape('triangle'));
        document.getElementById('btnAddArrowShape')?.addEventListener('click', () => addShape('arrow'));

        document.getElementById('btnInsertHeading')?.addEventListener('click', () => addTextPreset('heading'));
        document.getElementById('btnInsertSubheading')?.addEventListener('click', () => addTextPreset('subheading'));
        document.getElementById('btnInsertBody')?.addEventListener('click', () => addTextPreset('body'));
        document.getElementById('btnTextOutline')?.addEventListener('click', toggleTextOutline);
        document.getElementById('btnTextShadow')?.addEventListener('click', toggleTextShadow);
        document.getElementById('btnTextCurve')?.addEventListener('click', convertTextToCurve);
        document.getElementById('btnCropImage')?.addEventListener('click', cropActiveImage);
        document.getElementById('btnMaskCircle')?.addEventListener('click', () => applyMask('circle'));
        document.getElementById('btnMaskRounded')?.addEventListener('click', () => applyMask('rounded'));
        document.getElementById('btnResetMask')?.addEventListener('click', () => applyMask('reset'));
        document.getElementById('btnAddQR')?.addEventListener('click', addQrCode);
        document.getElementById('btnTableAddRow')?.addEventListener('click', () => window.wbAddTableRow?.());
        document.getElementById('btnTableRemoveRow')?.addEventListener('click', () => window.wbRemoveTableRow?.());
        document.getElementById('btnTableAddCol')?.addEventListener('click', () => window.wbAddTableCol?.());
        document.getElementById('btnTableRemoveCol')?.addEventListener('click', () => window.wbRemoveTableCol?.());
        document.getElementById('btnApplyWritingPreset')?.addEventListener('click', () => {
            const style = document.getElementById('writingLineStyle')?.value || 'primary';
            const spacing = Number(document.getElementById('writingLineSpacing')?.value || 46);
            window.wbSetWritingLinesConfig?.({ style, spacing });
            window.showToast?.('อัปเดต Writing preset แล้ว');
        });

        document.getElementById('btnGenMath')?.addEventListener('click', addMathProblems);
        document.getElementById('btnGenWordSearch')?.addEventListener('click', addWordSearch);
        document.getElementById('btnGenCrossword')?.addEventListener('click', addCrossword);
        document.getElementById('btnGenerateAnswerKey')?.addEventListener('click', () => window.wbGenerateAnswerKeyPage?.());

        document.getElementById('btnRefreshLayers')?.addEventListener('click', renderLayersPanel);
        document.getElementById('btnSaveElement')?.addEventListener('click', saveCurrentSelectionAsElement);

        document.getElementById('btnPageManager')?.addEventListener('click', async () => {
            showPageManager(true);
            await renderPageManager();
        });
        document.getElementById('pageManagerClose')?.addEventListener('click', () => showPageManager(false));
        document.getElementById('pageManagerDone')?.addEventListener('click', () => showPageManager(false));
        document.getElementById('pageManagerModal')?.addEventListener('click', (e) => {
            if (e.target?.id === 'pageManagerModal') showPageManager(false);
        });

        document.getElementById('propBringFront')?.addEventListener('click', bringFront);
        document.getElementById('propSendBack')?.addEventListener('click', sendBack);
        document.getElementById('propLock')?.addEventListener('click', () => lockSelection(true));
        document.getElementById('propUnlock')?.addEventListener('click', () => lockSelection(false));
        document.getElementById('propGroup')?.addEventListener('click', groupSelection);
        document.getElementById('propUngroup')?.addEventListener('click', ungroupSelection);

        document.getElementById('btnZoomIn')?.addEventListener('click', () => setZoom(zoom + 0.1));
        document.getElementById('btnZoomOut')?.addEventListener('click', () => setZoom(zoom - 0.1));
        document.getElementById('btnZoomFit')?.addEventListener('click', zoomToFit);

        ['colorFill', 'colorStroke', 'colorText'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', (e) => pushDocColor(e.target.value));
        });

        canvas.on('object:added', () => {
            markSaving();
            renderLayersPanel();
        });
        canvas.on('object:modified', () => {
            markSaving();
            renderLayersPanel();
        });
        canvas.on('object:removed', () => {
            markSaving();
            renderLayersPanel();
        });
        canvas.on('selection:created', renderLayersPanel);
        canvas.on('selection:updated', renderLayersPanel);
        canvas.on('selection:cleared', renderLayersPanel);

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && !e.shiftKey && (e.key === 'g' || e.key === 'G')) {
                e.preventDefault();
                groupSelection();
                return;
            }
            if (e.ctrlKey && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
                e.preventDefault();
                ungroupSelection();
                return;
            }
            if (e.ctrlKey && (e.key === ']' || e.key === 'PageUp')) {
                e.preventDefault();
                bringFront();
                return;
            }
            if (e.ctrlKey && (e.key === '[' || e.key === 'PageDown')) {
                e.preventDefault();
                sendBack();
                return;
            }
            if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                setZoom(zoom + 0.1);
                return;
            }
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                setZoom(zoom - 0.1);
            }
        });

        document.getElementById('btnSave')?.addEventListener('click', () => setSaveIndicator('saved'));
    }

    function setupTemplateGallery() {
        buildCardGallery('templateGallery', templateCards, (item) => {
            const select = document.getElementById('templateSelect');
            if (select) select.value = item.key;
            window.wbApplyTemplate?.(item.key);
            markSaving();
        });
        buildCardGallery('borderGallery', borderCards, (item) => addBorder(item.key));
    }

    window.wbSetSaveIndicator = setSaveIndicator;

    setupTabs();
    setupTemplateGallery();
    setupUploads();
    renderUploadGallery();
    renderDocColors();
    renderLayersPanel();
    renderSavedElements();
    setupEvents();
    setupPan();
    setSaveIndicator('saved');
    zoomToFit();
    window.addEventListener('resize', () => {
        if (Math.abs(zoom - 1) < 0.001) zoomToFit();
    });
})();
