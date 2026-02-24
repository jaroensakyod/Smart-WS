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

    /* Category quick buttons */
    const CATS = [
        { label: '🎨 ระบายสี', q: 'coloring page line art black white clipart' },
        { label: '🎓 การศึกษา', q: 'education school student clipart' },
        { label: '🔬 วิทยาศาสตร์', q: 'science laboratory experiment clipart' },
        { label: '🧮 คณิตศาสตร์', q: 'mathematics geometry shapes clipart' },
        { label: '🌿 ธรรมชาติ', q: 'nature plant flower vector' },
        { label: '🐾 สัตว์', q: 'animal cute cartoon clipart' },
        { label: '🍎 ผลไม้', q: 'fruit illustration vector' },
        { label: '🏃 กีฬา', q: 'sport exercise clipart' },
        { label: '🖼️ กรอบ', q: 'frame border ornament decorative clipart' },
        { label: '⭐ ไอคอน', q: 'icon symbol simple vector clipart' },
    ];

    const chipBox = document.getElementById('imgCategoryChips');
    if (chipBox) {
        CATS.forEach(cat => {
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

    async function doSearch(query) {
        if (!query || !imgGrid) return;
        imgGrid.innerHTML = '';
        if (imgLoading) imgLoading.style.display = '';
        if (imgError) imgError.style.display = 'none';

        try {
            const params = new URLSearchParams({
                action: 'query',
                generator: 'search',
                gsrsearch: query + ' filetype:bitmap',
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
            const items = Object.values(pages)
                .filter(p => {
                    const info = p.imageinfo?.[0];
                    if (!info) return false;
                    const mime = info.mime || '';
                    return mime.startsWith('image/') && !mime.includes('svg');
                })
                .sort((a, b) => (a.index || 0) - (b.index || 0));

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

    function renderResults(items) {
        if (!imgGrid) return;
        imgGrid.innerHTML = '';
        items.forEach(page => {
            const info = page.imageinfo[0];
            const thumb = info.thumburl || info.url;
            const fullUrl = info.url;
            const title = page.title?.replace('File:', '') || 'image';

            const card = document.createElement('div');
            card.className = 'img-card';
            card.title = title + '\n' + info.width + '×' + info.height;
            card.innerHTML =
                '<img src="' + thumb + '" alt="' + title.replace(/"/g, '') + '" loading="lazy"/>' +
                '<div class="img-card-info">' + title.substring(0, 30) + '</div>';
            card.addEventListener('click', () => addToCanvas(fullUrl, thumb));
            imgGrid.appendChild(card);
        });
    }

    function addToCanvas(fullUrl, thumbUrl) {
        window.showToast?.('⏳ กำลังโหลดรูป...');

        fabric.Image.fromURL(fullUrl, function (img) {
            if (!img || !img.width) {
                // Fallback to thumbnail if full image fails (CORS)
                fabric.Image.fromURL(thumbUrl, function (img2) {
                    if (!img2 || !img2.width) { window.showToast?.('❌ โหลดรูปไม่สำเร็จ'); return; }
                    placeImage(img2);
                }, { crossOrigin: 'anonymous' });
                return;
            }
            placeImage(img);
        }, { crossOrigin: 'anonymous' });
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
