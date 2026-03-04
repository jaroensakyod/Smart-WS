/* ================================================================
    webImages.js — Free Image Search
     Sources: Wikimedia / Iconify / Flickr
    ================================================================ */

(function () {
    'use strict';

    const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php';
    const PAGE_SIZE = 24;
    const FETCH_TIMEOUT = 12000;

    const imgModal = document.getElementById('imageSearchModal');
    const imgSearch = document.getElementById('imgSearchInput');
    const imgSearchBtn = document.getElementById('imgSearchBtn');
    const imgGrid = document.getElementById('imgSearchGrid');
    const imgLoading = document.getElementById('imgSearchLoading');
    const imgError = document.getElementById('imgSearchError');
    const imgSvgOnly = document.getElementById('imgSvgOnly');
    const imgVectorOnly = document.getElementById('imgVectorOnly');
    const imgSourceSelect = document.getElementById('imgSourceSelect');
    const imgHint = document.querySelector('.img-search-hint');

    let currentQuery = '';
    let currentSource = 'wikimedia';
    let currentOffset = 0;
    let hasMore = true;
    let isLoading = false;
    let seenResultKeys = new Set();

    let observer = null;
    const sentinel = document.createElement('div');
    sentinel.id = 'imgScrollSentinel';
    sentinel.style.height = '8px';

    const MONO_QUERY_MAP = [
        { re: /แมว|cat/i, q: 'cat' },
        { re: /สุนัข|dog/i, q: 'dog outline line art' },
        { re: /ปลา|fish/i, q: 'fish outline' },
        { re: /นก|bird/i, q: 'bird outline' },
        { re: /รถ|car/i, q: 'car outline technical drawing' },
        { re: /บ้าน|house/i, q: 'house outline coloring page' },
        { re: /ต้นไม้|tree/i, q: 'tree outline coloring page' },
        { re: /ดอกไม้|flower/i, q: 'flower line art coloring page' },
        { re: /คณิต|math|mathematics|geometry/i, q: 'geometry diagram line art' },
    ];

    const RANDOM_KEYWORDS = ['cat', 'dog', 'bird', 'flower', 'forest', 'mountain', 'school', 'science', 'math', 'book', 'teacher', 'planet'];
    const ICONIFY_TRENDING = [
        'mdi:home', 'mdi:school', 'mdi:book-open-page-variant', 'mdi:calculator', 'mdi:triangle-outline',
        'mdi:circle-outline', 'mdi:square-outline', 'mdi:star-outline', 'mdi:leaf', 'mdi:weather-sunny',
        'mdi:account', 'mdi:human-male', 'mdi:human-female', 'mdi:fruit-cherries', 'mdi:fish',
        'tabler:math-function', 'tabler:atom-2', 'tabler:microscope', 'tabler:world', 'tabler:flask',
        'tabler:abc', 'tabler:numbers', 'tabler:school', 'tabler:bookmark', 'tabler:ruler-2',
        'tabler:clock-hour-3', 'tabler:calendar-event', 'tabler:mail', 'tabler:device-laptop', 'tabler:device-mobile'
    ];

    function mapMonolineQuery(rawQuery) {
        const q = String(rawQuery || '').trim();
        if (!q) return q;
        const mapped = MONO_QUERY_MAP.find(entry => entry.re.test(q));
        return mapped ? mapped.q : q;
    }

    function cleanText(value) {
        return String(value || '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
    }

    function setError(message) {
        if (!imgError) return;
        imgError.textContent = '❌ ' + message;
        imgError.style.display = '';
    }

    function clearError() {
        if (!imgError) return;
        imgError.style.display = 'none';
    }

    function setLoading(loading) {
        isLoading = loading;
        if (imgLoading) imgLoading.style.display = loading ? '' : 'none';
    }

    function openImgModal() {
        if (!imgModal) return;
        imgModal.style.display = 'flex';
        clearError();
        setLoading(false);
        setTimeout(() => imgSearch?.focus(), 0);
        startSearch(imgSearch?.value.trim() || '');
    }

    function closeImgModal() {
        if (!imgModal) return;
        imgModal.style.display = 'none';
    }

    function getSearchHintBySource(source) {
        if (source === 'iconify') {
            return 'Iconify: ค้นหาเป็นอังกฤษ เช่น home, school, calculator หรือระบุชื่อไอคอนตรงๆ เช่น mdi:home, tabler:math-function';
        }
        if (source === 'flickr') {
            return 'Flickr: เหมาะกับภาพจริง/ภาพถ่าย ใช้คำทั่วไป เช่น classroom, forest, mountains';
        }
        return 'Wikimedia: พิมพ์คำอังกฤษตรงๆ เช่น cat, school, flower (ถ้าช่องค้นหาว่างระบบจะสุ่มรูปให้อัตโนมัติ)';
    }

    function updateSearchHint() {
        if (!imgHint) return;
        const source = imgSourceSelect?.value || 'wikimedia';
        imgHint.textContent = getSearchHintBySource(source);
    }

    async function safeFetch(url, options = {}) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            return res;
        } catch (err) {
            if (err?.name === 'AbortError') {
                throw new Error('เชื่อมต่อช้าเกินไป (timeout)');
            }
            throw new Error('Failed to fetch');
        } finally {
            clearTimeout(timer);
        }
    }

    function buildWikimediaQuery(rawQuery) {
        const svgOnly = !!imgSvgOnly?.checked;
        const vectorOnly = !!imgVectorOnly?.checked;
        const normalized = String(rawQuery || '').trim();
        if (!normalized) return '';

        if (!(svgOnly || vectorOnly)) {
            return normalized;
        }

        const mapped = mapMonolineQuery(normalized);
        let query = `${mapped} filetype:svg`;
        return query;
    }

    function tokenizeQuery(query) {
        return String(query || '')
            .toLowerCase()
            .split(/[^\p{L}\p{N}]+/u)
            .map(token => token.trim())
            .filter(token => token.length >= 2);
    }

    function rankAndFilterByTitle(items, query) {
        const tokens = tokenizeQuery(query);
        if (!tokens.length) return items;

        return (items || [])
            .map(item => {
                const title = String(item?.title || '').toLowerCase();
                let score = 0;
                tokens.forEach(token => {
                    if (title === token) score += 120;
                    else if (title.includes(` ${token} `)) score += 80;
                    else if (title.includes(token)) score += 40;
                });
                return { item, score };
            })
            .filter(row => row.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(row => row.item);
    }

    function mediaPassesFilters(page) {
        const info = page.imageinfo?.[0];
        if (!info) return false;
        const mime = info.mime || '';
        const isImage = mime.startsWith('image/');
        const isSvg = mime === 'image/svg+xml';
        const svgOnly = !!imgSvgOnly?.checked;
        const vectorOnly = !!imgVectorOnly?.checked;

        if (!isImage) return false;
        if (svgOnly && !isSvg) return false;
        if (vectorOnly && !isSvg) return false;
        return true;
    }

    function normalizeWikiItems(pages) {
        return Object.values(pages || {})
            .filter(mediaPassesFilters)
            .sort((a, b) => (a.index || 0) - (b.index || 0))
            .map(page => {
                const info = page.imageinfo?.[0] || {};
                return {
                    source: 'wikimedia',
                    title: page.title?.replace('File:', '') || 'image',
                    thumbUrl: info.thumburl || info.url,
                    fullUrl: info.url,
                    mime: info.mime || 'image/png',
                    width: info.width || 0,
                    height: info.height || 0,
                };
            });
    }

    function normalizeIconifyItems(iconNames) {
        const names = iconNames || [];
        return names.map(name => ({
            source: 'iconify',
            id: name,
            title: name,
            thumbUrl: `https://api.iconify.design/${name}.svg?width=320&height=320`,
            fullUrl: `https://api.iconify.design/${name}.svg`,
            mime: 'image/svg+xml',
            width: 320,
            height: 320,
        }));
    }

    function normalizeFlickrItems(items) {
        const svgOnly = !!imgSvgOnly?.checked;
        const vectorOnly = !!imgVectorOnly?.checked;
        return (items || [])
            .map(item => {
                const thumb = item?.media?.m || '';
                const full = thumb.replace('_m.', '_b.');
                return {
                    source: 'flickr',
                    id: item?.link || full || thumb,
                    title: cleanText(item?.title || 'flickr image'),
                    thumbUrl: thumb,
                    fullUrl: full,
                    mime: 'image/jpeg',
                    width: 0,
                    height: 0,
                };
            })
            .filter(item => !!item.thumbUrl && !!item.fullUrl)
            .filter(item => {
                if (svgOnly || vectorOnly) return false;
                return true;
            });
    }

    function normalizeOpenverseItems(items) {
        const svgOnly = !!imgSvgOnly?.checked;
        const vectorOnly = !!imgVectorOnly?.checked;

        return (items || []).map(item => ({
            source: 'openverse',
            title: cleanText(item?.title || item?.id || 'openverse image'),
            thumbUrl: item?.thumbnail || item?.url,
            fullUrl: item?.url,
            mime: item?.mimetype || '',
            width: item?.width || 0,
            height: item?.height || 0,
        })).filter(item => {
            if (!item.thumbUrl || !item.fullUrl) return false;
            if (!(item.mime || '').startsWith('image/')) return false;
            const isSvg = item.mime === 'image/svg+xml' || String(item.fullUrl).toLowerCase().endsWith('.svg');
            if (svgOnly && !isSvg) return false;
            if (vectorOnly && !isSvg) return false;
            return true;
        });
    }

    async function fetchWikimediaItems(query, offset, relevanceQuery = query) {
        const params = new URLSearchParams({
            action: 'query',
            generator: 'search',
            gsrsearch: buildWikimediaQuery(query),
            gsrnamespace: '6',
            gsrlimit: String(PAGE_SIZE),
            gsroffset: String(offset),
            prop: 'imageinfo',
            iiprop: 'url|size|mime|extmetadata',
            iiurlwidth: '460',
            format: 'json',
            origin: '*',
        });

        const res = await safeFetch(WIKIMEDIA_API + '?' + params);
        if (!res.ok) throw new Error('Wikimedia API Error ' + res.status);
        const data = await res.json();

        let items = normalizeWikiItems(data.query?.pages);
        items = rankAndFilterByTitle(items, relevanceQuery);

        return {
            items,
            nextOffset: data.continue?.gsroffset ?? null,
        };
    }

    async function fetchWikimediaRandomItems() {
        const params = new URLSearchParams({
            action: 'query',
            generator: 'random',
            grnnamespace: '6',
            grnlimit: String(PAGE_SIZE),
            prop: 'imageinfo',
            iiprop: 'url|size|mime|extmetadata',
            iiurlwidth: '460',
            format: 'json',
            origin: '*',
        });

        const res = await safeFetch(WIKIMEDIA_API + '?' + params);
        if (!res.ok) throw new Error('Wikimedia API Error ' + res.status);
        const data = await res.json();
        const items = normalizeWikiItems(data.query?.pages);
        return { items };
    }

    function getItemKey(item) {
        return item?.id || item?.fullUrl || item?.thumbUrl || item?.title || '';
    }

    function dedupeAgainstSeen(items) {
        const out = [];
        for (const item of (items || [])) {
            const key = getItemKey(item);
            if (!key) continue;
            if (seenResultKeys.has(key)) continue;
            seenResultKeys.add(key);
            out.push(item);
        }
        return out;
    }

    async function doSearch({ append = false } = {}) {
        if (!imgGrid || isLoading) return;
        if (append && !hasMore) return;

        setLoading(true);
        clearError();

        if (!append) {
            imgGrid.innerHTML = '';
            currentOffset = 0;
            hasMore = true;
            seenResultKeys = new Set();
        }

        try {
            let items = [];
            const q = String(currentQuery || '').trim();

            if (currentSource === 'iconify') {
                if (q) {
                    let iconifyPageTries = 0;
                    let rawIcons = [];
                    let total = 0;

                    while (iconifyPageTries < 3) {
                        const params = new URLSearchParams({
                            query: q,
                            limit: String(PAGE_SIZE),
                            start: String(currentOffset),
                        });
                        const res = await safeFetch('https://api.iconify.design/search?' + params);
                        if (!res.ok) throw new Error('Iconify API Error ' + res.status);
                        const data = await res.json();

                        rawIcons = data?.icons || [];
                        total = Number(data?.total || 0);
                        currentOffset += rawIcons.length || PAGE_SIZE;

                        items = rankAndFilterByTitle(normalizeIconifyItems(rawIcons), q);
                        items = dedupeAgainstSeen(items);
                        hasMore = currentOffset < total;

                        if (items.length > 0 || !hasMore) break;
                        iconifyPageTries += 1;
                    }
                } else {
                    const slice = ICONIFY_TRENDING.slice(currentOffset, currentOffset + PAGE_SIZE);
                    items = dedupeAgainstSeen(normalizeIconifyItems(slice));
                    currentOffset += items.length;
                    hasMore = currentOffset < ICONIFY_TRENDING.length;
                }
            } else if (currentSource === 'flickr') {
                const page = currentOffset + 1;
                const params = new URLSearchParams({
                    format: 'json',
                    nojsoncallback: '1',
                    page: String(page),
                });
                if (q) params.set('tags', q);
                const res = await safeFetch('https://www.flickr.com/services/feeds/photos_public.gne?' + params);
                if (!res.ok) throw new Error('Flickr API Error ' + res.status);
                const data = await res.json();
                items = rankAndFilterByTitle(normalizeFlickrItems(data?.items), q).slice(0, PAGE_SIZE);
                items = dedupeAgainstSeen(items);

                currentOffset = page;
                hasMore = currentOffset < 20;

                if (append && !items.length && hasMore) {
                    const retryPage = currentOffset + 1;
                    const retryParams = new URLSearchParams({
                        format: 'json',
                        nojsoncallback: '1',
                        page: String(retryPage),
                    });
                    if (q) retryParams.set('tags', q);
                    const retryRes = await safeFetch('https://www.flickr.com/services/feeds/photos_public.gne?' + retryParams);
                    if (retryRes.ok) {
                        const retryData = await retryRes.json();
                        const retryItems = rankAndFilterByTitle(normalizeFlickrItems(retryData?.items), q).slice(0, PAGE_SIZE);
                        items = dedupeAgainstSeen(retryItems);
                        currentOffset = retryPage;
                        hasMore = currentOffset < 20;
                    }
                }
            } else {
                if (q) {
                    let result = await fetchWikimediaItems(q, currentOffset, q);

                    if (!result.items.length && !append) {
                        const fallbackQuery = `${q} image`;
                        result = await fetchWikimediaItems(fallbackQuery, 0, q);
                    }

                    items = dedupeAgainstSeen(result.items);
                    currentOffset = result.nextOffset ?? currentOffset;
                    hasMore = result.nextOffset != null;
                } else {
                    const result = await fetchWikimediaRandomItems();
                    items = dedupeAgainstSeen(result.items);
                    currentOffset += 1;
                    hasMore = true;
                }
            }

            if (!items.length && !append) {
                imgGrid.innerHTML = '<div class="img-no-result">ไม่พบรูป — ลองคำค้นเป็นอังกฤษสั้นๆ เช่น cat, school, flower หรือเว้นว่างเพื่อสุ่มรูป</div>';
                hasMore = false;
                return;
            }

            if (!items.length && append) {
                hasMore = false;
                return;
            }

            renderResults(items, append);
            ensureGridFilled();
        } catch (err) {
            if (String(err?.message || '').includes('Failed to fetch')) {
                setError('เชื่อมต่อไม่สำเร็จ (Failed to fetch) — ตรวจสอบอินเทอร์เน็ต/สิทธิ์ host permissions แล้วลองใหม่');
            } else {
                setError('ค้นหาไม่สำเร็จ: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    function startSearch(query) {
        currentQuery = String(query || '').trim();
        currentOffset = 0;
        currentSource = imgSourceSelect?.value || 'wikimedia';
        if (!['wikimedia', 'flickr', 'iconify'].includes(currentSource)) {
            currentSource = 'wikimedia';
            if (imgSourceSelect) imgSourceSelect.value = 'wikimedia';
        }
        hasMore = true;
        doSearch({ append: false });
    }

    function renderResults(items, append) {
        if (!imgGrid) return;
        if (!append) imgGrid.innerHTML = '';

        items.forEach(item => {
            const thumb = item.thumbUrl;
            const fullUrl = item.fullUrl;
            const title = item.title || 'image';
            const isSvg = item.mime === 'image/svg+xml' || String(fullUrl).toLowerCase().endsWith('.svg');

            const card = document.createElement('div');
            card.className = 'img-card';
            card.title = title + '\n' + (item.width || 0) + '×' + (item.height || 0);
            card.innerHTML =
                '<img src="' + thumb + '" alt="' + title.replace(/"/g, '') + '" loading="lazy"/>' +
                '<div class="img-card-media-tags">' +
                (isSvg ? '<span class="img-media-badge">SVG</span><span class="img-media-badge">Vector</span>' : '') +
                (item.source === 'flickr' ? '<span class="img-media-badge">FL</span>' : '') +
                (item.source === 'iconify' ? '<span class="img-media-badge">IC</span>' : '') +
                '</div>' +
                '<div class="img-card-info">' + title.substring(0, 54) + '</div>';

            card.addEventListener('click', () => addToCanvas({ fullUrl, thumbUrl: thumb, mime: item.mime, title }));
            imgGrid.appendChild(card);
        });

        if (imgGrid.lastChild?.id === 'imgScrollSentinel') imgGrid.lastChild.remove();
        imgGrid.appendChild(sentinel);
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
            const data = img.data && typeof img.data === 'object' ? img.data : {};
            img.set('crossOrigin', 'anonymous');
            img.set('data', {
                ...data,
                imageSourceUrl: item.fullUrl || item.thumbUrl || '',
                crossOrigin: 'anonymous',
            });
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
        } catch (err) {
            console.warn('[webImages] SVG load failed', err);
            loadRasterFallback(item.thumbUrl);
        }
    }

    function loadRasterFallback(thumbUrl) {
        fabric.Image.fromURL(thumbUrl, function (img2) {
            if (!img2 || !img2.width) {
                window.showToast?.('❌ โหลดรูปไม่สำเร็จ');
                return;
            }
            const data = img2.data && typeof img2.data === 'object' ? img2.data : {};
            img2.set('crossOrigin', 'anonymous');
            img2.set('data', {
                ...data,
                imageSourceUrl: thumbUrl || '',
                crossOrigin: 'anonymous',
            });
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
        if (!canvas || !img) return;

        const maxW = canvas.width * 0.5;
        const maxH = canvas.height * 0.4;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);

        img.set({
            left: canvas.width / 2 - (img.width * scale) / 2,
            top: canvas.height / 2 - (img.height * scale) / 2,
            scaleX: scale,
            scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        closeImgModal();
        window.showToast?.('✅ เพิ่มรูปแล้ว');
    }

    function ensureGridFilled() {
        if (!imgGrid || isLoading || !hasMore) return;
        const notScrollableYet = imgGrid.scrollHeight <= imgGrid.clientHeight + 24;
        if (notScrollableYet) {
            doSearch({ append: true });
        }
    }

    function setupInfiniteScrollObserver() {
        if (!imgGrid) return;
        if (observer) observer.disconnect();

        observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (!entry?.isIntersecting) return;
            if (isLoading || !hasMore) return;
            doSearch({ append: true });
        }, {
            root: imgGrid,
            threshold: 0.1,
        });

        observer.observe(sentinel);
    }

    imgSearch?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            startSearch(imgSearch.value.trim());
        }
    });

    imgSearchBtn?.addEventListener('click', () => {
        startSearch(imgSearch?.value.trim() || '');
    });

    imgSourceSelect?.addEventListener('change', () => {
        updateSearchHint();
    });

    imgGrid?.addEventListener('scroll', () => {
        if (!imgGrid || isLoading || !hasMore) return;
        const nearBottom = imgGrid.scrollTop + imgGrid.clientHeight >= imgGrid.scrollHeight - 160;
        if (nearBottom) doSearch({ append: true });
    });

    document.getElementById('toolImageSearch')?.addEventListener('click', openImgModal);
    document.getElementById('imgModalClose')?.addEventListener('click', closeImgModal);
    document.getElementById('imgCancel')?.addEventListener('click', closeImgModal);
    imgModal?.addEventListener('click', e => {
        if (e.target === imgModal) closeImgModal();
    });

    if (imgSourceSelect) imgSourceSelect.value = 'wikimedia';
    updateSearchHint();
    setupInfiniteScrollObserver();
})();
