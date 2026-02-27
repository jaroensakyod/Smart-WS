(function (root) {
    const TEMPLATE_PRESETS = {
        worksheet: {
            rows: 10,
            cols: 1,
            difficulty: 'beginner',
        },
        activity: {
            rows: 8,
            cols: 2,
            difficulty: 'intermediate',
        },
        organizer: {
            sections: 4,
            difficulty: 'intermediate',
        },
        assessment: {
            items: 10,
            hasAnswerKey: true,
            difficulty: 'intermediate',
        },
        planner: {
            blocks: 6,
            difficulty: 'beginner',
        },
    };

    function getPresetByFormat(format) {
        return TEMPLATE_PRESETS[String(format || '').trim()] || null;
    }

    function getTemplatePreset(template) {
        if (!template || typeof template !== 'object') return null;
        return getPresetByFormat(template.format);
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            TEMPLATE_PRESETS,
            getPresetByFormat,
            getTemplatePreset,
        };
        return;
    }

    root.SMARTWS_TEMPLATE_PRESETS = TEMPLATE_PRESETS;
})(typeof globalThis !== 'undefined' ? globalThis : this);
