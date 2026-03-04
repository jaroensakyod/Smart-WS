(function (root) {
    const TEMPLATE_REQUIRED_FIELDS = [
        'id',
        'title',
        'category',
        'gradeBand',
        'format',
        'tags',
        'hasAnswerKey',
    ];

    const TEMPLATE_METADATA_FIELDS = [
        'visualDensity',
        'iconifyTags',
        'difficulty',
        'isDynamic',
    ];

    const TEMPLATE_SINGLE_DOD = [
        'generate_ok',
        'layout_within_page',
        'save_export_ok',
        'no_console_error',
        'related_test_pass',
    ];

    const THEME_PACKS = ['animals', 'space', 'food', 'nature', 'school', 'transport', 'weather', 'community'];
    const GRADE_BANDS = ['Pre-K', 'K-1', 'G1-G2', 'G3-G5'];
    const DIFFICULTIES = ['basic', 'standard', 'challenge'];

    const LEGACY_FAMILIES = [
        { category: 'ela_reading', name: 'Reading Response', format: 'worksheet', tags: ['reading', 'comprehension', 'evidence'] },
        { category: 'ela_writing', name: 'Writing Builder', format: 'organizer', tags: ['writing', 'paragraph', 'revision'] },
        { category: 'vocabulary_phonics', name: 'Phonics Station', format: 'activity', tags: ['phonics', 'vocabulary', 'sound'] },
        { category: 'math_basic', name: 'Math Drill', format: 'worksheet', tags: ['math', 'numbers', 'practice'] },
        { category: 'math_middle', name: 'Math Problem Set', format: 'worksheet', tags: ['math', 'middle', 'reasoning'] },
        { category: 'math_high_algebra', name: 'Algebra Workspace', format: 'worksheet', tags: ['algebra', 'equations', 'graph'] },
        { category: 'science_reading_lab', name: 'Science Lab Sheet', format: 'worksheet', tags: ['science', 'lab', 'inquiry'] },
        { category: 'social_studies_history', name: 'History Source Analysis', format: 'organizer', tags: ['history', 'source', 'evidence'] },
        { category: 'sel_reflection', name: 'SEL Reflection Journal', format: 'planner', tags: ['sel', 'reflection', 'mindset'] },
        { category: 'games_word_crossword_maze_bingo', name: 'Word Game Grid', format: 'activity', tags: ['game', 'word', 'bingo'] },
        { category: 'taskcards_flashcards', name: 'Task Cards Pack', format: 'activity', tags: ['task-cards', 'flashcards', 'practice'] },
        { category: 'graphic_organizers', name: 'Graphic Organizer', format: 'organizer', tags: ['organizer', 'thinking', 'structure'] },
        { category: 'assessment_quiz_rubric', name: 'Assessment Pack', format: 'assessment', tags: ['assessment', 'quiz', 'rubric'] },
    ];

    const NEW_TEMPLATE_BLUEPRINTS = [
        {
            category: 'early_learning_games',
            prefix: 'ELG',
            families: [
                { key: 'picture-bingo', name: 'Picture Bingo', format: 'activity', variants: 4, tags: ['bingo', 'matching', 'visual'] },
                { key: 'shadow-matching', name: 'Shadow Matching', format: 'worksheet', variants: 4, tags: ['shadow', 'silhouette', 'matching'] },
                { key: 'cut-paste-sorting', name: 'Cut & Paste Sorting', format: 'activity', variants: 4, tags: ['cut-and-paste', 'sorting', 'classification'] },
                { key: 'story-sequencing', name: 'Story Sequencing', format: 'organizer', variants: 4, tags: ['sequence', 'story', 'narrative'] },
                { key: 'i-spy-find-count', name: 'I Spy (Find & Count)', format: 'worksheet', variants: 4, tags: ['i-spy', 'counting', 'observation'] },
                { key: 'flashcards-picture-word', name: 'Flashcards (Picture + Word)', format: 'activity', variants: 3, tags: ['flashcards', 'picture-word', 'vocabulary'] },
                { key: 'printable-board-game', name: 'Printable Board Game', format: 'activity', variants: 3, tags: ['board-game', 'path', 'dice'] },
                { key: 'memory-match-cards', name: 'Memory Match Cards', format: 'activity', variants: 3, tags: ['memory', 'pairs', 'cards'] },
                { key: 'alphabet-picture-match', name: 'Alphabet + Picture Match', format: 'worksheet', variants: 3, tags: ['alphabet', 'letters', 'matching'] },
                { key: 'same-different-cards', name: 'Same/Different Visual Cards', format: 'worksheet', variants: 3, tags: ['same-different', 'visual-discrimination', 'logic'] },
            ],
        },
        {
            category: 'math_visuals',
            prefix: 'MTH',
            families: [
                { key: 'pictographs', name: 'Pictographs', format: 'worksheet', variants: 3, tags: ['pictograph', 'data', 'icons'] },
                { key: 'counting-1-10', name: 'Counting Objects (1-10)', format: 'worksheet', variants: 3, tags: ['counting', '1-10', 'objects'] },
                { key: 'counting-1-20', name: 'Counting Objects (1-20)', format: 'worksheet', variants: 3, tags: ['counting', '1-20', 'objects'] },
                { key: 'visual-add-sub', name: 'Visual Addition/Subtraction', format: 'worksheet', variants: 3, tags: ['addition', 'subtraction', 'visual'] },
                { key: 'pattern-completion', name: 'Pattern Completion', format: 'activity', variants: 3, tags: ['patterns', 'sequence', 'logic'] },
                { key: 'fraction-visual-sets', name: 'Fraction Visual Sets', format: 'worksheet', variants: 3, tags: ['fraction', 'parts', 'equivalent'] },
                { key: 'ten-frames-icons', name: 'Ten Frames with Icons', format: 'worksheet', variants: 3, tags: ['ten-frame', 'number-sense', 'icons'] },
                { key: 'compare-quantities', name: 'Compare Quantities (>, <, =)', format: 'worksheet', variants: 3, tags: ['comparison', 'symbols', 'quantities'] },
                { key: 'number-bonds-images', name: 'Number Bonds with Images', format: 'worksheet', variants: 3, tags: ['number-bonds', 'part-whole', 'visual'] },
                { key: 'skip-counting-icons', name: 'Skip Counting Icons', format: 'worksheet', variants: 3, tags: ['skip-counting', 'multiples', 'icons'] },
            ],
        },
        {
            category: 'classroom_management_decor',
            prefix: 'CLM',
            families: [
                { key: 'visual-daily-schedule', name: 'Visual Daily Schedule', format: 'planner', variants: 3, tags: ['schedule', 'routine', 'visual'] },
                { key: 'reward-sticker-charts', name: 'Reward Sticker Charts', format: 'planner', variants: 3, tags: ['reward', 'sticker', 'motivation'] },
                { key: 'classroom-supply-labels', name: 'Classroom Supply Labels', format: 'activity', variants: 3, tags: ['labels', 'supplies', 'organization'] },
                { key: 'student-name-tags', name: 'Student Name Tags', format: 'activity', variants: 3, tags: ['name-tags', 'desk', 'identity'] },
                { key: 'classroom-jobs-chart', name: 'Classroom Jobs Chart', format: 'planner', variants: 3, tags: ['jobs', 'roles', 'rotation'] },
                { key: 'hall-passes', name: 'Hall Passes', format: 'activity', variants: 2, tags: ['hall-pass', 'permission', 'management'] },
                { key: 'behavior-cue-cards', name: 'Behavior Cue Cards', format: 'activity', variants: 2, tags: ['behavior', 'cues', 'reminders'] },
                { key: 'transition-cards', name: 'Transition Cards', format: 'activity', variants: 2, tags: ['transition', 'signals', 'flow'] },
                { key: 'center-rotation-cards', name: 'Center Rotation Cards', format: 'planner', variants: 2, tags: ['centers', 'rotation', 'stations'] },
                { key: 'calendar-weather-board', name: 'Calendar & Weather Cards', format: 'planner', variants: 2, tags: ['calendar', 'weather', 'routine'] },
            ],
        },
        {
            category: 'ela_graphic_organizers',
            prefix: 'ELA',
            families: [
                { key: 'frayer-model', name: 'Frayer Model', format: 'organizer', variants: 3, tags: ['frayer', 'vocabulary', 'concept'] },
                { key: 'beginning-sounds-match', name: 'Beginning Sounds Matching', format: 'worksheet', variants: 3, tags: ['phonics', 'sounds', 'matching'] },
                { key: 'cvc-word-builder', name: 'CVC Word Builder', format: 'activity', variants: 3, tags: ['cvc', 'blending', 'phonics'] },
                { key: 'reading-visual-support', name: 'Reading Comprehension (Visual)', format: 'worksheet', variants: 3, tags: ['reading', 'comprehension', 'visual-support'] },
                { key: 'mind-map-icon-based', name: 'Mind Map (Icon-based)', format: 'organizer', variants: 3, tags: ['mind-map', 'ideas', 'connections'] },
                { key: 'venn-diagram', name: 'Venn Diagram', format: 'organizer', variants: 3, tags: ['venn', 'compare', 'contrast'] },
                { key: 'story-map', name: 'Story Map', format: 'organizer', variants: 3, tags: ['story-map', 'plot', 'characters'] },
                { key: 'sequence-chain', name: 'Sequence Chain', format: 'organizer', variants: 3, tags: ['sequence', 'order', 'timeline'] },
                { key: 'cause-effect-map', name: 'Cause-Effect Organizer', format: 'organizer', variants: 3, tags: ['cause-effect', 'reasoning', 'analysis'] },
                { key: 'main-idea-details', name: 'Main Idea + Details Map', format: 'organizer', variants: 3, tags: ['main-idea', 'details', 'reading'] },
            ],
        },
    ];

    function pad3(n) {
        return String(n).padStart(3, '0');
    }

    function pick(list, index) {
        return list[index % list.length];
    }

    function slug(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function buildLegacyCatalog() {
        const list = [];
        let seq = 0;
        LEGACY_FAMILIES.forEach((family, familyIndex) => {
            for (let variant = 0; variant < 5; variant++) {
                seq += 1;
                const gradeBand = pick(GRADE_BANDS, familyIndex + variant);
                const difficulty = pick(DIFFICULTIES, seq);
                const theme = pick(THEME_PACKS, seq + familyIndex);
                list.push({
                    id: `LEG-${pad3(seq)}`,
                    title: `${family.name} — Legacy ${variant + 1}`,
                    category: family.category,
                    familyKey: slug(family.name),
                    variantIndex: variant,
                    gradeBand,
                    format: family.format,
                    tags: [
                        'legacy-core',
                        'cohort-legacy',
                        `family-${slug(family.name)}`,
                        `difficulty-${difficulty}`,
                        `theme-${theme}`,
                        ...family.tags,
                    ],
                    hasAnswerKey: family.format === 'assessment',
                    visualDensity: 'medium',
                    iconifyTags: family.tags.slice(0, 3),
                    difficulty,
                    isDynamic: false,
                });
            }
        });
        return list;
    }

    function buildNewVisualCatalog() {
        const list = [];
        NEW_TEMPLATE_BLUEPRINTS.forEach((group, groupIndex) => {
            let seq = 0;
            group.families.forEach((family, familyIndex) => {
                const familySlug = slug(family.key || family.name);
                const variants = Math.max(1, Number(family.variants) || 1);
                for (let variant = 0; variant < variants; variant++) {
                    seq += 1;
                    const gradeBand = pick(GRADE_BANDS, familyIndex + groupIndex + variant);
                    const difficulty = pick(DIFFICULTIES, seq + groupIndex);
                    const theme = pick(THEME_PACKS, seq + familyIndex + groupIndex + variant);
                    list.push({
                        id: `${group.prefix}-${pad3(seq)}`,
                        title: variants > 1 ? `${family.name} — Visual ${variant + 1}` : family.name,
                        category: group.category,
                        familyKey: familySlug,
                        variantIndex: variant,
                        gradeBand,
                        format: family.format,
                        tags: [
                            'iconify-visual',
                            'cohort-new',
                            'quality-curated',
                            group.prefix.toLowerCase(),
                            familySlug,
                            `family-${familyIndex + 1}`,
                            `difficulty-${difficulty}`,
                            `theme-${theme}`,
                            ...family.tags,
                        ],
                        hasAnswerKey: family.format === 'assessment',
                        visualDensity: 'high',
                        iconifyTags: [...family.tags, theme].slice(0, 5),
                        difficulty,
                        isDynamic: true,
                    });
                }
            });
        });
        return list;
    }

    function buildSmartWsCatalog() {
        return [
            ...buildLegacyCatalog(),
            ...buildNewVisualCatalog(),
        ];
    }

    const TEMPLATE_CATALOG = buildSmartWsCatalog();

    function validateTemplateSchema(template) {
        const missing = TEMPLATE_REQUIRED_FIELDS.filter((field) => !(field in (template || {})));
        return {
            ok: missing.length === 0,
            missing,
        };
    }

    function validateCatalogUniqueness(catalog) {
        const seen = new Set();
        const duplicateIds = [];
        (catalog || []).forEach((item) => {
            const id = String(item?.id || '').trim();
            if (!id) return;
            if (seen.has(id)) duplicateIds.push(id);
            seen.add(id);
        });
        return {
            ok: duplicateIds.length === 0,
            duplicateIds,
        };
    }

    function validateCategoryCoverage(catalog, taxonomy) {
        const list = Array.isArray(catalog) ? catalog : [];
        const groups = Array.isArray(taxonomy) ? taxonomy : [];
        const byCategory = list.reduce((acc, item) => {
            const key = String(item?.category || '').trim();
            if (!key) return acc;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const missing = groups
            .map((group) => String(group?.key || '').trim())
            .filter((key) => key && !byCategory[key]);
        return {
            ok: missing.length === 0,
            missing,
            byCategory,
        };
    }

    function getCatalogStats(catalog) {
        const list = Array.isArray(catalog) ? catalog : [];
        const byCategory = list.reduce((acc, item) => {
            const key = String(item?.category || '').trim();
            if (!key) return acc;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const byFormat = list.reduce((acc, item) => {
            const key = String(item?.format || '').trim();
            if (!key) return acc;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return {
            total: list.length,
            byCategory,
            byFormat,
        };
    }

    const api = {
        TEMPLATE_REQUIRED_FIELDS,
        TEMPLATE_METADATA_FIELDS,
        TEMPLATE_SINGLE_DOD,
        TEMPLATE_CATALOG,
        validateTemplateSchema,
        validateCatalogUniqueness,
        validateCategoryCoverage,
        getCatalogStats,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_TEMPLATE_CATALOG = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
