(function (root) {
    const TEMPLATE_TAXONOMY = [
        { key: 'early_learning_games', label: 'Early Learning & Games', targetCount: 35 },
        { key: 'math_visuals', label: 'Math Visuals', targetCount: 30 },
        { key: 'classroom_management_decor', label: 'Classroom Management & Decor', targetCount: 25 },
        { key: 'ela_graphic_organizers', label: 'ELA & Graphic Organizers', targetCount: 30 },
    ];

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { TEMPLATE_TAXONOMY };
        return;
    }

    root.SMARTWS_TEMPLATE_TAXONOMY = TEMPLATE_TAXONOMY;
})(typeof globalThis !== 'undefined' ? globalThis : this);
