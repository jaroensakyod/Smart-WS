(function (root) {
    function collectTextObjects(node, bucket) {
        if (!node) return;
        if (node.type === 'i-text' || node.type === 'text' || node.type === 'textbox') {
            bucket.push(node);
            return;
        }
        if (node.type === 'group' && typeof node.getObjects === 'function') {
            node.getObjects().forEach((item) => collectTextObjects(item, bucket));
        }
    }

    function markAnswerOnlyForSelection(context, enabled) {
        const canvas = context?.canvas;
        const applyWorksheetVisibilityMode = context?.applyWorksheetVisibilityMode;
        if (!canvas) return false;
        const obj = canvas.getActiveObject();
        if (!obj) return false;
        obj.data = { ...(obj.data || {}), answerOnly: !!enabled };
        if (typeof applyWorksheetVisibilityMode === 'function') applyWorksheetVisibilityMode();
        return true;
    }

    function duplicateAsAnswerKey(context) {
        const {
            canvas,
            fabric,
            workbook,
            persistCurrentPage,
            currentPage,
            createPageState,
            loadCanvasJson,
            syncUiToggles,
            updatePageIndicator,
            showToast,
            applyWorksheetVisibilityMode,
            setWorksheetMode,
            setActivePageIndex,
            getPaperWidth,
            BLANK_PAGE_JSON,
        } = context || {};

        if (!canvas || !fabric || !workbook || typeof setActivePageIndex !== 'function') return false;
        if (typeof persistCurrentPage === 'function') persistCurrentPage();

        const source = (typeof currentPage === 'function' ? currentPage()?.json : null) || BLANK_PAGE_JSON;
        workbook.pages.push(createPageState(source));
        setActivePageIndex(workbook.pages.length - 1);

        Promise.resolve(loadCanvasJson(source)).then(() => {
            if (typeof setWorksheetMode === 'function') setWorksheetMode('answer');
            if (typeof syncUiToggles === 'function') syncUiToggles();
            const width = typeof getPaperWidth === 'function' ? getPaperWidth() : 0;
            const title = new fabric.IText('Answer Key', {
                left: width - 170,
                top: 24,
                fontFamily: 'Fredoka',
                fontSize: 24,
                fill: '#dc2626',
            });
            title.data = { type: 'answerLabel', answerOnly: true };
            canvas.add(title);
            if (typeof applyWorksheetVisibilityMode === 'function') applyWorksheetVisibilityMode();
            if (typeof updatePageIndicator === 'function') updatePageIndicator();
            if (typeof showToast === 'function') showToast('🧪 สร้างหน้าเฉลยแล้ว');
        });

        return true;
    }

    function generateAnswerKeyPage(context) {
        const {
            canvas,
            fabric,
            workbook,
            persistCurrentPage,
            currentPage,
            createPageState,
            loadCanvasJson,
            syncUiToggles,
            updatePageIndicator,
            showToast,
            applyWorksheetVisibilityMode,
            setWorksheetMode,
            setActivePageIndex,
            getPaperWidth,
            getPaperHeight,
            BLANK_PAGE_JSON,
        } = context || {};

        if (!canvas || !fabric || !workbook || typeof setActivePageIndex !== 'function') return false;
        if (typeof persistCurrentPage === 'function') persistCurrentPage();

        const source = (typeof currentPage === 'function' ? currentPage()?.json : null) || BLANK_PAGE_JSON;
        workbook.pages.push(createPageState(source));
        setActivePageIndex(workbook.pages.length - 1);

        Promise.resolve(loadCanvasJson(source)).then(() => {
            if (typeof setWorksheetMode === 'function') setWorksheetMode('answer');
            if (typeof syncUiToggles === 'function') syncUiToggles();

            const allText = [];
            canvas.getObjects().forEach((obj) => collectTextObjects(obj, allText));
            allText.forEach((txt) => {
                const raw = String(txt.text || '');
                const matched = raw.match(/\[([^\]]+)\]/);
                if (!matched) return;
                txt.set({ text: raw.replace(/\[([^\]]+)\]/g, '$1'), fill: '#dc2626', fontWeight: '700' });
                txt.data = { ...(txt.data || {}), answerOnly: true, answerText: matched[1] };
            });

            const paperWidth = typeof getPaperWidth === 'function' ? getPaperWidth() : 0;
            const paperHeight = typeof getPaperHeight === 'function' ? getPaperHeight() : 0;
            const watermark = new fabric.Text('ANSWER KEY', {
                left: paperWidth / 2,
                top: paperHeight / 2,
                originX: 'center',
                originY: 'center',
                angle: -20,
                opacity: 0.14,
                fontFamily: 'Fredoka',
                fontSize: 96,
                fill: '#dc2626',
                selectable: false,
                evented: false,
            });
            watermark.data = { type: 'answerWatermark', answerOnly: true };
            canvas.add(watermark);

            if (typeof applyWorksheetVisibilityMode === 'function') applyWorksheetVisibilityMode();
            if (typeof updatePageIndicator === 'function') updatePageIndicator();
            if (typeof showToast === 'function') showToast('🧪 สร้างหน้าเฉลย (Answer Key) แล้ว');
        });

        return true;
    }

    function applyCuratedTemplateById(context, templateId, options = {}) {
        const {
            canvas,
            saveHistory,
            persistCurrentPage,
            updatePageIndicator,
            showToast,
            trackTelemetry,
            sanitizeTemplateCanvasData,
            loadCanvasJson,
            addPageAndGo,
        } = context || {};

        const api = root.SMARTWS_CURATED_TEMPLATES_API || {};
        const resolver = typeof api.getCuratedTemplateById === 'function' ? api.getCuratedTemplateById : null;
        if (!resolver) return false;

        const template = resolver(templateId);
        if (!template || !template.canvasData) {
            if (typeof showToast === 'function') showToast('ไม่พบ curated template ที่เลือก');
            if (typeof trackTelemetry === 'function') {
                trackTelemetry('curated_template_apply_missing', { templateId: templateId || 'unknown' });
            }
            return false;
        }

        const mode = String(options.mode || 'replace');
        const skipConfirm = !!options.skipConfirm;

        const loadTemplateData = () => {
            const normalizedData = typeof sanitizeTemplateCanvasData === 'function'
                ? sanitizeTemplateCanvasData(template.canvasData)
                : template.canvasData;

            return Promise.resolve(loadCanvasJson(JSON.stringify(normalizedData)))
                .then(() => {
                    if (typeof saveHistory === 'function') saveHistory();
                    if (typeof persistCurrentPage === 'function') persistCurrentPage();
                    if (typeof updatePageIndicator === 'function') updatePageIndicator();
                    if (typeof trackTelemetry === 'function') {
                        trackTelemetry('curated_template_apply_success', {
                            templateId: template.id,
                            mode,
                            objectCount: canvas?.getObjects?.().length || 0,
                        });
                    }
                    if (typeof showToast === 'function') showToast(`📄 เพิ่มเทมเพลต: ${template.title}`);
                    return true;
                })
                .catch((error) => {
                    if (typeof trackTelemetry === 'function') {
                        trackTelemetry('curated_template_apply_error', {
                            templateId: template.id,
                            mode,
                            message: String(error?.message || error || 'unknown-error'),
                        });
                    }
                    if (typeof showToast === 'function') showToast('ไม่สามารถเพิ่ม curated template ได้');
                    return false;
                });
        };

        if (mode === 'new-page') {
            Promise.resolve(typeof addPageAndGo === 'function' ? addPageAndGo() : false)
                .then(() => loadTemplateData())
                .catch((error) => {
                    if (typeof trackTelemetry === 'function') {
                        trackTelemetry('curated_template_apply_error', {
                            templateId: template.id,
                            mode,
                            message: String(error?.message || error || 'unknown-error'),
                        });
                    }
                    if (typeof showToast === 'function') showToast('ไม่สามารถสร้างหน้าใหม่สำหรับ template ได้');
                });
            return true;
        }

        if (!skipConfirm && !root.confirm('ใช้เทมเพลตนี้และล้างหน้าปัจจุบัน?')) {
            if (typeof trackTelemetry === 'function') {
                trackTelemetry('curated_template_apply_cancelled', { templateId: template.id });
            }
            return false;
        }

        loadTemplateData();
        return true;
    }

    function applyTemplate(context, type) {
        if (!type) return false;
        if (typeof context?.applyTemplateImpl === 'function') {
            context.applyTemplateImpl(type);
            return true;
        }
        return false;
    }

    const api = {
        applyTemplate,
        applyCuratedTemplateById,
        markAnswerOnlyForSelection,
        duplicateAsAnswerKey,
        generateAnswerKeyPage,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_TEMPLATE_FACTORY = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
