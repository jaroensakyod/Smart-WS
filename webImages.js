/* ================================================================
   webImages.js — Free Image Search (Wikimedia Commons API)
   Truly free, no API key, no OAuth. Public domain / CC images.
   ================================================================ */

(function () {
    'use strict';

    const API = 'https://commons.wikimedia.org/w/api.php';

    const imgModal = document.getElementById('imageSearchModal');
    const imgSearch = document.getElementById('imgSearchInput');
    const imgGrid = document.getElementById('imgSearchGrid');
    const imgLoading = document.getElementById('imgSearchLoading');
    const imgError = document.getElementById('imgSearchError');
    const imgMonolineOnly = document.getElementById('imgMonolineOnly');

    const BASE_CATS = [
        { label: '🎓 การศึกษา', q: 'education school student clipart' },
        { label: '🔬 วิทยาศาสตร์', q: 'science laboratory experiment clipart' },
        { label: '🧮 คณิตศาสตร์', q: 'mathematics geometry shapes clipart' },
        { label: '🌿 ธรรมชาติ', q: 'nature plant flower vector' },
        { label: '🐾 สัตว์', q: 'animal cute cartoon clipart' },
        { label: '🖼️ กรอบ', q: 'frame border ornament decorative clipart' },
    ];

    const MONO_CATS = [
        { label: '🎨 ระบายสี', q: 'coloring page' },
        { label: '🖊️ ลายเส้น', q: 'outline drawing' },
        { label: '🔳 ไอคอน', q: 'simple icon symbol' },
        { label: '📏 รูปวาดเทคนิค', q: 'technical diagram schematic' },
    ];

    const MONO_QUERY_MAP = [
        { re: /แมว|cat/i, q: 'cat outline incategory:"Line art of cats"' },
        { re: /สุนัข|dog/i, q: 'dog outline incategory:"Line art of dogs"' },
        { re: /ปลา|fish/i, q: 'fish outline' },
        { re: /นก|bird/i, q: 'bird outline' },
        { re: /รถ|car/i, q: 'car outline technical drawing' },
        { re: /บ้าน|house/i, q: 'house outline coloring page' },
        { re: /ต้นไม้|tree/i, q: 'tree outline coloring page' },
        { re: /ดอกไม้|flower/i, q: 'flower line art coloring page' },
        { re: /คณิต|math|mathematics|geometry/i, q: 'geometry diagram line art' },
    ];

    const MONO_INCLUDE_TERMS = /line art|coloring pages?|coloring book|black and white|black & white|outline|ink drawing|technical drawing|diagram|engraving|monochrome|silhouette/i;
    const MONO_EXCLUDE_TERMS = /color photograph|landscape|portrait|full color|colorful|wallpaper|oil painting|photo of/i;

    const chipBox = document.getElementById('imgCategoryChips');
    function renderQuickChips() {
        if (!chipBox) return;
        const monoOnly = !!imgMonolineOnly?.checked;
        const chips = monoOnly ? MONO_CATS : BASE_CATS;
        chipBox.innerHTML = '';
        chips.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'eq-chip';
            btn.textContent = cat.label;
            btn.addEventListener('click', () => {
                if (imgSearch) imgSearch.value = cat.q;
                doSearch(cat.q);
            });
            chipBox.appendChild(btn);
        });
    }
    renderQuickChips();

    /* Open / Close */
    function openImgModal() {
        if (!imgModal) return;
        imgModal.style.display = 'flex';
        imgSearch?.focus();
    }
    function closeImgModal() {
        if (imgModal) imgModal.style.display = 'none';
    }

    document.getElementById('toolImageSearch')?.addEventListener('click', openImgModal);
    document.getElementById('imgModalClose')?.addEventListener('click', closeImgModal);
    document.getElementById('imgCancel')?.addEventListener('click', closeImgModal);
    imgModal?.addEventListener('click', e => { if (e.target === imgModal) closeImgModal(); });

    /* Search */
    let _timer;
    imgSearch?.addEventListener('input', () => {
        clearTimeout(_timer);
        _timer = setTimeout(() => doSearch(imgSearch.value.trim()), 500);
    });
    imgSearch?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { clearTimeout(_timer); doSearch(imgSearch.value.trim()); }
    });

    function cleanText(value) {
        return String(value || '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
    }

    function metadataBlob(ext) {
        return cleanText([
            ext?.ImageDescription?.value,
            ext?.ObjectName?.value,
            ext?.Categories?.value,
            ext?.Credit?.value,
            ext?.LicenseShortName?.value,
            ext?.Artist?.value,
        ].join(' '));
    }

    function mapMonolineQuery(rawQuery) {
        const q = String(rawQuery || '').trim();
        if (!q) return q;
        const mapped = MONO_QUERY_MAP.find(entry => entry.re.test(q));
        if (mapped) return mapped.q;
        return q;
    }

    function scoreMonolineCandidate(page) {
        const info = page.imageinfo?.[0];
        if (!info) return -999;

        const mime = info.mime || '';
        const ext = info.extmetadata || {};
        const blob = metadataBlob(ext);
        const title = cleanText(page.title || '').replace(/^File:/i, '');
        const text = (blob + ' ' + title).toLowerCase();

        let score = 0;
        if (mime === 'image/svg+xml') score += 90;
        else if (mime === 'image/png') score += 40;
        else if (mime === 'image/jpeg') score += 15;

        if (MONO_INCLUDE_TERMS.test(text)) score += 45;
        if (MONO_EXCLUDE_TERMS.test(text)) score -= 80;

        if (/outline|line art|coloring|diagram|icon|schematic/.test(title.toLowerCase())) score += 20;
        return score;
    }

    async function doSearch(query) {
        if (!query || !imgGrid) return;
        imgGrid.innerHTML = '';
        if (imgLoading) imgLoading.style.display = '';
        if (imgError) imgError.style.display = 'none';
        const monoOnly = !!imgMonolineOnly?.checked;
        const normalizedQuery = monoOnly ? mapMonolineQuery(query) : query;
        const boostedQuery = monoOnly
            ? `${normalizedQuery} (incategory:"Line art" OR incategory:"Coloring pages") (intitle:"outline" OR intitle:"line art")`
            : `${normalizedQuery} clipart`;

        try {
            const params = new URLSearchParams({
                action: 'query',
                generator: 'search',
                gsrsearch: boostedQuery,
                gsrnamespace: '6',       // File namespace
                gsrlimit: '30',
                prop: 'imageinfo',
                iiprop: 'url|size|mime|extmetadata',
                iiurlwidth: '300',       // Get 300px thumbnail
                format: 'json',
                origin: '*',             // Enable CORS
            });

            const res = await fetch(API + '?' + params);
            if (!res.ok) throw new Error('API Error ' + res.status);
            const data = await res.json();

            const pages = data.query?.pages;
            if (!pages) {
                imgGrid.innerHTML = '<div class="img-no-result">ไม่พบรูป — ลองคำค้นภาษาอังกฤษ เช่น cat, school, math</div>';
                return;
            }

            // Convert to array & filter to valid images
            let items = Object.values(pages)
                .filter(p => {
                    const info = p.imageinfo?.[0];
                    if (!info) return false;
                    const mime = info.mime || '';
                    return mime.startsWith('image/');
                })
                .sort((a, b) => (a.index || 0) - (b.index || 0));

            if (monoOnly) {
                items = items
                    .map(page => ({ page, score: scoreMonolineCandidate(page) }))
                    .filter(item => item.score >= 10)
                    .sort((a, b) => b.score - a.score)
                    .map(item => item.page);
            }

            if (items.length) {
                renderResults(items);
            } else {
                imgGrid.innerHTML = '<div class="img-no-result">ไม่พบรูป — ลองคำค้นอื่น</div>';
            }
        } catch (err) {
            console.error('[webImages]', err);
            if (imgError) {
                imgError.textContent = '❌ ค้นหาไม่สำเร็จ: ' + err.message;
                imgError.style.display = '';
            }
        } finally {
            if (imgLoading) imgLoading.style.display = 'none';
        }
    }

    imgMonolineOnly?.addEventListener('change', () => {
        renderQuickChips();
        const q = imgSearch?.value.trim();
        if (q) doSearch(q);
    });

    function renderResults(items) {
        if (!imgGrid) return;
        imgGrid.innerHTML = '';
        items.forEach(page => {
            const info = page.imageinfo[0];
            const thumb = info.thumburl || info.url;
            const fullUrl = info.url;
            const title = page.title?.replace('File:', '') || 'image';
            const isSvg = info.mime === 'image/svg+xml';

            const card = document.createElement('div');
            card.className = 'img-card';
            card.title = title + '\n' + info.width + '×' + info.height;
            card.innerHTML =
                '<img src="' + thumb + '" alt="' + title.replace(/"/g, '') + '" loading="lazy"/>' +
                '<div class="img-card-media-tags">' +
                (isSvg ? '<span class="img-media-badge">SVG</span><span class="img-media-badge">Vector</span>' : '') +
                '</div>' +
                '<div class="img-card-info">' + title.substring(0, 30) + '</div>';
            card.addEventListener('click', () => addToCanvas({ fullUrl, thumbUrl: thumb, mime: info.mime, title }));
            imgGrid.appendChild(card);
        });
    }

    function addToCanvas(item) {
        if (item.mime === 'image/svg+xml') {
            addSvgToCanvas(item);
            return;
        }
        window.showToast?.('⏳ กำลังโหลดรูป...');

        fabric.Image.fromURL(item.fullUrl, function (img) {
            if (!img || !img.width) {
                loadRasterFallback(item.thumbUrl);
                return;
            }
            placeImage(img);
        }, { crossOrigin: 'anonymous' });
    }

    function addSvgToCanvas(item) {
        window.showToast?.('⏳ กำลังเตรียมไฟล์เวกเตอร์...');
        try {
            fabric.loadSVGFromURL(item.fullUrl, (objects, options) => {
                if (!objects || !objects.length) {
                    loadRasterFallback(item.thumbUrl);
                    return;
                }
                const group = fabric.util.groupSVGElements(objects, options || {});
                if (!group) {
                    loadRasterFallback(item.thumbUrl);
                    return;
                }
                placeFabricObject(group);
            });
        } catch (e) {
            console.warn('[webImages] SVG load failed', e);
            loadRasterFallback(item.thumbUrl);
        }
    }

    function loadRasterFallback(thumbUrl) {
        fabric.Image.fromURL(thumbUrl, function (img2) {
            if (!img2 || !img2.width) { window.showToast?.('❌ โหลดรูปไม่สำเร็จ'); return; }
            placeImage(img2);
        }, { crossOrigin: 'anonymous' });
    }

    function placeFabricObject(obj) {
        const canvas = window.wbCanvas;
        if (!canvas || !obj) return;
        const baseW = obj.width || 1;
        const baseH = obj.height || 1;
        const maxW = canvas.width * 0.5;
        const maxH = canvas.height * 0.4;
        const scale = Math.min(maxW / baseW, maxH / baseH, 1);

        obj.set({
            left: canvas.width / 2 - (baseW * scale) / 2,
            top: canvas.height / 2 - (baseH * scale) / 2,
            scaleX: scale,
            scaleY: scale,
        });
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
        closeImgModal();
        window.showToast?.('✅ เพิ่มรูปแล้ว');
    }

    function placeImage(img) {
        const canvas = window.wbCanvas;
        const maxW = canvas.width * 0.5, maxH = canvas.height * 0.4;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        img.set({
            left: canvas.width / 2 - (img.width * scale) / 2,
            top: canvas.height / 2 - (img.height * scale) / 2,
            scaleX: scale, scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        closeImgModal();
        window.showToast?.('✅ เพิ่มรูปแล้ว');
    }

})();
