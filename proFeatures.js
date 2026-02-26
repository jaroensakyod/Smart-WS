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

    const baseTemplateCards = [
        { key: 'taskcards4', title: 'Task Cards 4 (การ์ดงาน 4)', desc: 'การ์ดงาน 4 ช่องพร้อมเส้นตัด' },
        { key: 'taskcards8', title: 'Task Cards 8 (การ์ดงาน 8)', desc: 'การ์ดงาน 8 ช่องสำหรับกิจกรรมเร็ว' },
        { key: 'frayer', title: 'Frayer Model (โมเดลเฟรเยอร์)', desc: 'Definition / Characteristics / Examples / Non-examples' },
        { key: 'kwl', title: 'KWL Chart (ตาราง KWL)', desc: 'Know / Want to know / Learned' },
        { key: 'cornellNotes', title: 'Cornell Notes (โน้ตคอร์เนลล์)', desc: 'ช่องคำใบ้, ช่องจดโน้ต และสรุปท้ายหน้า' },
        { key: 'tchart', title: 'T-Chart (ตารางเปรียบเทียบ 2 ฝั่ง)', desc: 'ตารางเปรียบเทียบสองคอลัมน์พร้อมหัวข้อ' },
        { key: 'venn', title: 'Venn Diagram (แผนภาพเวนน์)', desc: 'วงเวนน์ 2 วงสำหรับเปรียบเทียบ' },
        { key: 'graphpaper', title: 'Graph Paper (กระดาษกราฟ)', desc: 'กระดาษกราฟคณิตศาสตร์' },
        { key: 'numberline', title: 'Number Line (เส้นจำนวน)', desc: 'เส้นจำนวนพร้อมตำแหน่งหลัก' },
        { key: 'fractionpies', title: 'Fraction Pies (วงกลมเศษส่วน)', desc: 'วงกลมเศษส่วน 2,3,4,6,8 ส่วน' },
        { key: 'quiz', title: 'Quiz MCQ (แบบทดสอบปรนัย)', desc: 'ข้อสอบปรนัยพร้อมคำตอบ ก ข ค ง' },
        { key: 'rubric4', title: 'Rubric 4-Level (ตารางประเมิน 4 ระดับ)', desc: 'เกณฑ์ประเมิน 4 ระดับพร้อมช่องให้คะแนน' },
        { key: 'matchingColumns', title: 'Matching Columns (จับคู่คอลัมน์)', desc: 'จับคู่คอลัมน์ซ้ายและขวา' },
        { key: 'handwriting', title: 'Handwriting Lines (เส้นคัดลายมือ)', desc: 'เส้นคัดลายมือแบบทึบ-ประ-ทึบ' },
        { key: 'comicstrip', title: 'Comic Strip (คอมิกสตริป)', desc: 'ช่องวาดการ์ตูนพร้อมบรรยาย' },
        { key: 'foldable', title: 'Foldable (ใบงานพับ)', desc: 'แม่แบบใบงานพับได้พร้อมเส้นพับ' },
        { key: 'bingo3', title: 'Bingo 3x3 (บิงโก 3x3)', desc: 'บิงโกขนาดเล็กสำหรับกิจกรรมเร็ว' },
        { key: 'wordsearch10', title: 'Word Search (ค้นหาคำ)', desc: 'ตารางหาคำศัพท์ขนาด 10x10' },
        { key: 'boardgame', title: 'Board Game Path (เส้นทางบอร์ดเกม)', desc: 'ทางเดินเกมแบบซิกแซกบนกระดาษ' },
        { key: 'exitticket', title: 'Exit Tickets (บัตรท้ายคาบ)', desc: 'แบบประเมินท้ายคาบ 4 ส่วน' },
        { key: 'mindmap', title: 'Mind Map (แผนผังความคิด)', desc: 'แผนผังความคิดแตกแขนง 4 ทิศ' },
        { key: 'certificate', title: 'Certificate (เกียรติบัตร)', desc: 'เทมเพลตเกียรติบัตรพร้อมกรอบ' },
        { key: 'teacherplanner', title: 'Teacher Planner (แผนสอนครู)', desc: 'ตารางวางแผนการสอนรายสัปดาห์' },
        { key: 'timeline', title: 'Timeline (ไทม์ไลน์)', desc: 'เส้นเวลาพร้อมกล่องเหตุการณ์สลับบนล่าง' },
        { key: 'fishbone', title: 'Fishbone (ก้างปลา)', desc: 'แผนผังก้างปลาเพื่อวิเคราะห์สาเหตุ' },
        { key: 'labreport', title: 'Lab Report (รายงานทดลอง)', desc: 'ใบงานทดลองวิทย์พร้อมหัวข้อครบ' },
        { key: 'musicsheet', title: 'Music Sheet (กระดาษโน้ต)', desc: 'บรรทัด 5 เส้นพร้อมกุญแจซอล' },
        { key: 'flashcards', title: 'Flashcards (แฟลชการ์ด)', desc: 'การ์ดคำศัพท์พร้อมเส้นตัด' },
        { key: 'sudoku', title: 'Sudoku (ซูโดกุ)', desc: 'ตารางซูโดกุ 9x9 พร้อมเส้นหนา/บาง' },
        { key: 'maze', title: 'Maze (เขาวงกต)', desc: 'เทมเพลตเขาวงกตสำหรับตรรกะ' },
        { key: 'presTitle', title: 'Presentation Title (สไลด์หน้าปก)', desc: 'สไลด์หน้าปก 16:9' },
        { key: 'presTwoCol', title: 'Presentation Two-Column (สไลด์สองคอลัมน์)', desc: 'สไลด์ 2 คอลัมน์สำหรับเนื้อหา' },
        { key: 'lessonPlan', title: 'Lesson Plan (แผนการสอน)', desc: 'แผนการสอนพร้อมส่วน Objective/Procedure/Assessment' },
        { key: 'readingComprehension', title: 'Reading Comprehension (อ่านจับใจความ)', desc: 'บทอ่าน คำศัพท์ คำถาม และสรุปท้ายเรื่อง' },
    ];

    const SUBJECTS = [
        { key: 'language', label: 'Language' },
        { key: 'math', label: 'Math' },
        { key: 'science', label: 'Science' },
        { key: 'social', label: 'Social' },
        { key: 'assessment', label: 'Assessment' },
        { key: 'planning', label: 'Planning' },
        { key: 'project', label: 'Project' },
    ];

    const SKILLS = [
        { key: 'reading', label: 'Reading' },
        { key: 'writing', label: 'Writing' },
        { key: 'vocabulary', label: 'Vocabulary' },
        { key: 'computation', label: 'Computation' },
        { key: 'reasoning', label: 'Reasoning' },
        { key: 'analysis', label: 'Analysis' },
        { key: 'communication', label: 'Communication' },
        { key: 'reflection', label: 'Reflection' },
    ];

    const GRADES_BY_BAND = {
        all: [
            { value: 'preschool', label: 'Preschool' },
            { value: 'kindergarten', label: 'Kindergarten' },
            { value: 'g1', label: '1st Grade' },
            { value: 'g2', label: '2nd Grade' },
            { value: 'g3', label: '3rd Grade' },
            { value: 'g4', label: '4th Grade' },
            { value: 'g5', label: '5th Grade' },
            { value: 'g6', label: '6th Grade' },
            { value: 'g7', label: '7th Grade' },
            { value: 'g8', label: '8th Grade' },
            { value: 'g9', label: '9th Grade' },
            { value: 'g10', label: '10th Grade' },
            { value: 'g11', label: '11th Grade' },
            { value: 'g12', label: '12th Grade' },
            { value: 'adult', label: 'Adult Education' },
        ],
        elementary: [
            { value: 'preschool', label: 'Preschool' },
            { value: 'kindergarten', label: 'Kindergarten' },
            { value: 'g1', label: '1st Grade' },
            { value: 'g2', label: '2nd Grade' },
            { value: 'g3', label: '3rd Grade' },
            { value: 'g4', label: '4th Grade' },
            { value: 'g5', label: '5th Grade' },
        ],
        middle: [
            { value: 'g6', label: '6th Grade' },
            { value: 'g7', label: '7th Grade' },
            { value: 'g8', label: '8th Grade' },
        ],
        high: [
            { value: 'g9', label: '9th Grade' },
            { value: 'g10', label: '10th Grade' },
            { value: 'g11', label: '11th Grade' },
            { value: 'g12', label: '12th Grade' },
        ],
        adult: [
            { value: 'adult', label: 'Adult Education' },
        ],
    };

    const templateMetaMap = {
        taskcards4: { gradeBands: ['elementary', 'middle'], grades: ['g2', 'g3', 'g4', 'g5', 'g6', 'g7'], subjects: ['assessment'], skills: ['reasoning'], difficulty: 'beginner', format: 'assessment', isFeatured: true, popularityScore: 84 },
        taskcards8: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10'], subjects: ['assessment'], skills: ['reasoning'], difficulty: 'intermediate', format: 'assessment', popularityScore: 74 },
        frayer: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['language'], skills: ['vocabulary', 'analysis'], difficulty: 'intermediate', format: 'organizer', isFeatured: true, popularityScore: 76 },
        kwl: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8'], subjects: ['language', 'science'], skills: ['reading', 'reflection'], difficulty: 'beginner', format: 'organizer', popularityScore: 80 },
        cornellNotes: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['language', 'social'], skills: ['reading', 'writing'], difficulty: 'intermediate', format: 'organizer', popularityScore: 70 },
        tchart: { gradeBands: ['elementary', 'middle', 'high'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'], subjects: ['language', 'social'], skills: ['analysis'], difficulty: 'beginner', format: 'organizer', popularityScore: 72 },
        venn: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8'], subjects: ['science'], skills: ['analysis'], difficulty: 'beginner', format: 'organizer', popularityScore: 69 },
        graphpaper: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8'], subjects: ['math'], skills: ['computation'], difficulty: 'beginner', format: 'worksheet', popularityScore: 77 },
        numberline: { gradeBands: ['elementary'], grades: ['g1', 'g2', 'g3', 'g4'], subjects: ['math'], skills: ['computation'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, popularityScore: 88 },
        fractionpies: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6'], subjects: ['math'], skills: ['computation', 'reasoning'], difficulty: 'beginner', format: 'worksheet', popularityScore: 71 },
        quiz: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['assessment'], skills: ['analysis'], difficulty: 'intermediate', format: 'assessment', popularityScore: 79 },
        rubric4: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['assessment'], skills: ['analysis', 'reflection'], difficulty: 'intermediate', format: 'assessment', isFeatured: true, popularityScore: 86 },
        handwriting: { gradeBands: ['elementary'], grades: ['preschool', 'kindergarten', 'g1', 'g2'], subjects: ['language'], skills: ['writing'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, popularityScore: 93 },
        comicstrip: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7'], subjects: ['project'], skills: ['writing', 'communication'], difficulty: 'beginner', format: 'activity', popularityScore: 66 },
        foldable: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7'], subjects: ['project'], skills: ['communication'], difficulty: 'beginner', format: 'activity', popularityScore: 63 },
        bingo3: { gradeBands: ['elementary'], grades: ['preschool', 'kindergarten', 'g1', 'g2', 'g3'], subjects: ['activity'], skills: ['vocabulary'], difficulty: 'beginner', format: 'activity', popularityScore: 81 },
        wordsearch10: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7'], subjects: ['language'], skills: ['vocabulary', 'reading'], difficulty: 'beginner', format: 'activity', popularityScore: 83 },
        boardgame: { gradeBands: ['elementary', 'middle'], grades: ['g2', 'g3', 'g4', 'g5', 'g6'], subjects: ['project'], skills: ['reasoning'], difficulty: 'beginner', format: 'activity', popularityScore: 62 },
        exitticket: { gradeBands: ['elementary', 'middle', 'high'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['assessment'], skills: ['reflection'], difficulty: 'beginner', format: 'assessment', popularityScore: 85 },
        mindmap: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11'], subjects: ['project'], skills: ['analysis'], difficulty: 'intermediate', format: 'organizer', popularityScore: 78 },
        certificate: { gradeBands: ['elementary', 'middle', 'high', 'adult'], grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['planning'], skills: ['communication'], difficulty: 'beginner', format: 'activity', popularityScore: 59 },
        teacherplanner: { gradeBands: ['elementary', 'middle', 'high'], grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['planning'], skills: ['reflection'], difficulty: 'intermediate', format: 'planner', popularityScore: 73 },
        timeline: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['social'], skills: ['analysis'], difficulty: 'intermediate', format: 'organizer', popularityScore: 75 },
        fishbone: { gradeBands: ['middle', 'high', 'adult'], grades: ['g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['science', 'project'], skills: ['analysis'], difficulty: 'advanced', format: 'organizer', popularityScore: 64 },
        labreport: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['science'], skills: ['analysis', 'writing'], difficulty: 'intermediate', format: 'worksheet', isFeatured: true, popularityScore: 82 },
        musicsheet: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8'], subjects: ['project'], skills: ['reading'], difficulty: 'beginner', format: 'worksheet', popularityScore: 52 },
        flashcards: { gradeBands: ['elementary', 'middle'], grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'], subjects: ['language'], skills: ['vocabulary'], difficulty: 'beginner', format: 'activity', popularityScore: 90 },
        sudoku: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10'], subjects: ['math'], skills: ['reasoning'], difficulty: 'intermediate', format: 'activity', popularityScore: 60 },
        maze: { gradeBands: ['elementary'], grades: ['g1', 'g2', 'g3', 'g4'], subjects: ['math'], skills: ['reasoning'], difficulty: 'beginner', format: 'activity', popularityScore: 68 },
        presTitle: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['project'], skills: ['communication'], difficulty: 'intermediate', format: 'organizer', popularityScore: 51 },
        presTwoCol: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['project'], skills: ['communication'], difficulty: 'intermediate', format: 'organizer', popularityScore: 55 },
        lessonPlan: { gradeBands: ['elementary', 'middle', 'high', 'adult'], grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['planning'], skills: ['reflection', 'communication'], difficulty: 'intermediate', format: 'planner', isFeatured: true, isNew: true, popularityScore: 92 },
        readingComprehension: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['language'], skills: ['reading', 'analysis', 'vocabulary'], difficulty: 'intermediate', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 94 },
    };

    function normalizeTemplateMeta(item) {
        const meta = templateMetaMap[item.key] || {};
        const normalized = {
            ...item,
            gradeBands: Array.isArray(meta.gradeBands) && meta.gradeBands.length ? meta.gradeBands : ['elementary', 'middle', 'high', 'adult'],
            grades: Array.isArray(meta.grades) && meta.grades.length ? meta.grades : ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'],
            subjects: Array.isArray(meta.subjects) && meta.subjects.length ? meta.subjects : ['project'],
            skills: Array.isArray(meta.skills) && meta.skills.length ? meta.skills : ['communication'],
            difficulty: meta.difficulty || 'beginner',
            format: meta.format || 'worksheet',
            isFeatured: !!meta.isFeatured,
            isNew: !!meta.isNew,
            popularityScore: Number.isFinite(meta.popularityScore) ? meta.popularityScore : 50,
        };
        normalized.searchText = `${normalized.title} ${normalized.desc} ${normalized.subjects.join(' ')} ${normalized.skills.join(' ')} ${normalized.gradeBands.join(' ')} ${normalized.grades.join(' ')}`.toLowerCase();
        return normalized;
    }

    const templateCards = baseTemplateCards.map(normalizeTemplateMeta);

    const templateFilterState = {
        segment: 'all',
        subjects: new Set(),
        skills: new Set(),
    };

    const borderCards = [
        { key: 'simple', title: 'Simple Border', desc: 'กรอบเส้นเดี่ยวเรียบง่าย', group: 'Basic' },
        { key: 'double', title: 'Double Border', desc: 'กรอบเส้นคู่ยอดนิยม', group: 'Basic' },
        { key: 'triple', title: 'Triple Border', desc: 'กรอบเส้นสามชั้น', group: 'Basic' },
        { key: 'dashed', title: 'Dashed Border', desc: 'กรอบเส้นประแบบ Worksheet', group: 'Basic' },
        { key: 'dotted', title: 'Dotted Border', desc: 'กรอบจุดสไตล์น่ารัก', group: 'Basic' },
        { key: 'wavy', title: 'Wavy Border', desc: 'กรอบเส้นคลื่น', group: 'Basic' },
        { key: 'zigzag', title: 'Zigzag Border', desc: 'กรอบซิกแซกแบบกิจกรรม', group: 'Basic' },
        { key: 'stitch', title: 'Stitch Border', desc: 'กรอบเย็บผ้าแบบเส้นสั้น', group: 'Basic' },
        { key: 'geo', title: 'Geometric Border', desc: 'กรอบลายเรขาคณิต', group: 'Decorative' },
        { key: 'doodle', title: 'Doodle Border', desc: 'กรอบวาดมือ (hand-drawn)', group: 'Decorative' },
        { key: 'stars', title: 'Star Border', desc: 'กรอบประดับดาว', group: 'Decorative' },
        { key: 'ribbon', title: 'Ribbon Border', desc: 'กรอบริบบิ้นสองชั้น', group: 'Decorative' },
        { key: 'scallop', title: 'Scallop Border', desc: 'กรอบโค้งลูกไม้', group: 'Decorative' },
        { key: 'corners', title: 'Corner Accent', desc: 'ตกแต่งเฉพาะมุมกระดาษ', group: 'Corner' },
        { key: 'cornerDots', title: 'Corner Dots', desc: 'จุดมุมกระดาษ', group: 'Corner' },
        { key: 'cornerBrackets', title: 'Corner Brackets', desc: 'วงเล็บมุมเอกสาร', group: 'Corner' },
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
        if (!cards.length) {
            const empty = document.createElement('div');
            empty.className = 'template-empty';
            empty.textContent = 'ไม่พบเทมเพลตที่ตรงกับตัวกรอง ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น';
            root.appendChild(empty);
            return;
        }
        cards.forEach(item => {
            const el = document.createElement('div');
            el.className = 'template-card';
            el.innerHTML = `<div class="template-card-title">${item.title}</div><div class="template-card-desc">${item.desc}</div>`;
            el.addEventListener('click', () => onClick(item));
            root.appendChild(el);
        });
    }

    function createChipButtons(rootId, options, stateSet, onChange) {
        const root = document.getElementById(rootId);
        if (!root) return;
        root.innerHTML = '';
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'template-chip';
            btn.textContent = option.label;
            if (stateSet.has(option.key)) btn.classList.add('active');
            btn.addEventListener('click', () => {
                if (stateSet.has(option.key)) stateSet.delete(option.key);
                else stateSet.add(option.key);
                createChipButtons(rootId, options, stateSet, onChange);
                onChange();
            });
            root.appendChild(btn);
        });
    }

    function syncGradeOptions() {
        const bandSelect = document.getElementById('templateGradeBand');
        const gradeSelect = document.getElementById('templateGrade');
        if (!bandSelect || !gradeSelect) return;
        const band = bandSelect.value || 'all';
        const options = GRADES_BY_BAND[band] || GRADES_BY_BAND.all;
        const previous = gradeSelect.value;
        gradeSelect.innerHTML = '<option value="all">All Grades (ทุกชั้น)</option>';
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.label;
            gradeSelect.appendChild(el);
        });
        const stillExists = Array.from(gradeSelect.options).some(o => o.value === previous);
        gradeSelect.value = stillExists ? previous : 'all';
    }

    function buildTemplateFilterState() {
        return {
            search: (document.getElementById('templateSearch')?.value || '').trim().toLowerCase(),
            segment: templateFilterState.segment,
            gradeBand: document.getElementById('templateGradeBand')?.value || 'all',
            grade: document.getElementById('templateGrade')?.value || 'all',
            difficulty: document.getElementById('templateDifficulty')?.value || 'all',
            format: document.getElementById('templateFormat')?.value || 'all',
            subjects: new Set(templateFilterState.subjects),
            skills: new Set(templateFilterState.skills),
        };
    }

    function includesAny(itemValues, selectedSet) {
        if (!selectedSet.size) return true;
        return itemValues.some(value => selectedSet.has(value));
    }

    function computeTemplateRank(item, state) {
        if (state.gradeBand !== 'all' && !item.gradeBands.includes(state.gradeBand)) return -1;
        if (state.grade !== 'all' && !item.grades.includes(state.grade)) return -1;
        if (state.difficulty !== 'all' && item.difficulty !== state.difficulty) return -1;
        if (state.format !== 'all' && item.format !== state.format) return -1;
        if (!includesAny(item.subjects, state.subjects)) return -1;
        if (!includesAny(item.skills, state.skills)) return -1;
        if (state.search && !item.searchText.includes(state.search)) return -1;
        if (state.segment === 'featured' && !item.isFeatured) return -1;
        if (state.segment === 'new' && !item.isNew) return -1;

        let score = 0;
        score += state.gradeBand !== 'all' && item.gradeBands.includes(state.gradeBand) ? 40 : 0;
        score += state.grade !== 'all' && item.grades.includes(state.grade) ? 25 : 0;
        score += state.subjects.size ? 20 : 0;
        score += state.skills.size ? 15 : 0;
        score += item.isFeatured ? 10 : 0;
        score += item.isNew ? 6 : 0;
        score += Math.min(10, Math.round(item.popularityScore / 10));
        return score;
    }

    function filterAndSortTemplates(state) {
        const ranked = templateCards
            .map(item => ({ item, score: computeTemplateRank(item, state) }))
            .filter(entry => entry.score >= 0);

        if (state.segment === 'popular') {
            ranked.sort((a, b) => b.item.popularityScore - a.item.popularityScore || b.score - a.score);
        } else {
            ranked.sort((a, b) => b.score - a.score || b.item.popularityScore - a.item.popularityScore);
        }
        return ranked.map(entry => entry.item);
    }

    function updateTemplateSummary(total, shown, state) {
        const summary = document.getElementById('templateResultSummary');
        if (!summary) return;
        summary.textContent = `แสดง ${shown}/${total} เทมเพลต • Segment: ${state.segment}`;
    }

    function refreshTemplateGallery() {
        const state = buildTemplateFilterState();
        const list = filterAndSortTemplates(state);
        buildCardGallery('templateGallery', list, (item) => {
            const select = document.getElementById('templateSelect');
            if (select) select.value = item.key;
            window.wbApplyTemplate?.(item.key);
            markSaving();
        });
        updateTemplateSummary(templateCards.length, list.length, state);
    }

    function resetTemplateFilters() {
        const search = document.getElementById('templateSearch');
        const band = document.getElementById('templateGradeBand');
        const grade = document.getElementById('templateGrade');
        const difficulty = document.getElementById('templateDifficulty');
        const format = document.getElementById('templateFormat');
        if (search) search.value = '';
        if (band) band.value = 'all';
        syncGradeOptions();
        if (grade) grade.value = 'all';
        if (difficulty) difficulty.value = 'all';
        if (format) format.value = 'all';
        templateFilterState.segment = 'all';
        templateFilterState.subjects.clear();
        templateFilterState.skills.clear();
        document.querySelectorAll('#templateSegments .template-segment').forEach(el => {
            el.classList.toggle('active', el.dataset.segment === 'all');
        });
        createChipButtons('templateSubjectChips', SUBJECTS, templateFilterState.subjects, refreshTemplateGallery);
        createChipButtons('templateSkillChips', SKILLS, templateFilterState.skills, refreshTemplateGallery);
    }

    function buildBorderGallery(rootId, cards, onClick) {
        const root = document.getElementById(rootId);
        if (!root) return;
        root.innerHTML = '';
        const grouped = cards.reduce((acc, item) => {
            const key = item.group || 'Other';
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        Object.entries(grouped).forEach(([group, items]) => {
            const heading = document.createElement('div');
            heading.className = 'template-card';
            heading.style.cursor = 'default';
            heading.style.fontWeight = '700';
            heading.style.background = 'var(--surface)';
            heading.textContent = `หมวด: ${group}`;
            root.appendChild(heading);

            items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'template-card';
                el.innerHTML = `<div class="template-card-title">${item.title}</div><div class="template-card-desc">${item.desc}</div>`;
                el.addEventListener('click', () => onClick(item));
                root.appendChild(el);
            });
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
        } else if (kind === 'triple') {
            const outer = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2.4, selectable: false, evented: false });
            const mid = new fabric.Rect({ left: left + 8, top: top + 8, width: width - 16, height: height - 16, fill: 'transparent', stroke, strokeWidth: 1.2, selectable: false, evented: false });
            const inner = new fabric.Rect({ left: left + 16, top: top + 16, width: width - 32, height: height - 32, fill: 'transparent', stroke, strokeWidth: 2, selectable: false, evented: false });
            border = new fabric.Group([outer, mid, inner], { objectCaching: false });
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
        } else if (kind === 'stars') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const starPath = 'M 0 -5 L 1.6 -1.6 L 5 -1.6 L 2.5 0.8 L 3.4 4.9 L 0 2.9 L -3.4 4.9 L -2.5 0.8 L -5 -1.6 L -1.6 -1.6 Z';
            const deco = [];
            const topCount = Math.max(8, Math.floor(width / 80));
            const sideCount = Math.max(6, Math.floor(height / 80));
            for (let i = 0; i <= topCount; i++) {
                const x = left + (width * i) / topCount;
                deco.push(new fabric.Path(starPath, { left: x - 5, top: top - 7, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
                deco.push(new fabric.Path(starPath, { left: x - 5, top: top + height - 7, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
            }
            for (let i = 1; i < sideCount; i++) {
                const y = top + (height * i) / sideCount;
                deco.push(new fabric.Path(starPath, { left: left - 7, top: y - 5, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
                deco.push(new fabric.Path(starPath, { left: left + width - 7, top: y - 5, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
            }
            border = new fabric.Group([base, ...deco], { objectCaching: false });
        } else if (kind === 'wavy') {
            const waveTop = [];
            const waveBottom = [];
            const waveLeft = [];
            const waveRight = [];
            const stepsX = Math.max(12, Math.floor(width / 40));
            const stepsY = Math.max(10, Math.floor(height / 40));
            const amp = 8;
            for (let i = 0; i <= stepsX; i++) {
                const x = left + (width * i) / stepsX;
                const yOffset = (i % 2 === 0) ? -amp : amp;
                waveTop.push(`${i === 0 ? 'M' : 'L'} ${x} ${top + yOffset}`);
                waveBottom.push(`${i === 0 ? 'M' : 'L'} ${x} ${top + height - yOffset}`);
            }
            for (let i = 0; i <= stepsY; i++) {
                const y = top + (height * i) / stepsY;
                const xOffset = (i % 2 === 0) ? -amp : amp;
                waveLeft.push(`${i === 0 ? 'M' : 'L'} ${left + xOffset} ${y}`);
                waveRight.push(`${i === 0 ? 'M' : 'L'} ${left + width - xOffset} ${y}`);
            }
            border = new fabric.Group([
                new fabric.Path(waveTop.join(' '), { fill: 'transparent', stroke, strokeWidth: 2 }),
                new fabric.Path(waveBottom.join(' '), { fill: 'transparent', stroke, strokeWidth: 2 }),
                new fabric.Path(waveLeft.join(' '), { fill: 'transparent', stroke, strokeWidth: 2 }),
                new fabric.Path(waveRight.join(' '), { fill: 'transparent', stroke, strokeWidth: 2 }),
            ], { objectCaching: false });
        } else if (kind === 'zigzag') {
            const mkZig = (x1, y1, x2, y2, steps = 18, amp = 7, vertical = false) => {
                const segments = [];
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const x = x1 + (x2 - x1) * t + (vertical ? ((i % 2 === 0) ? -amp : amp) : 0);
                    const y = y1 + (y2 - y1) * t + (!vertical ? ((i % 2 === 0) ? -amp : amp) : 0);
                    segments.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
                }
                return new fabric.Path(segments.join(' '), { fill: 'transparent', stroke, strokeWidth: 2 });
            };
            border = new fabric.Group([
                mkZig(left, top, left + width, top),
                mkZig(left, top + height, left + width, top + height),
                mkZig(left, top, left, top + height, 18, 7, true),
                mkZig(left + width, top, left + width, top + height, 18, 7, true),
            ], { objectCaching: false });
        } else if (kind === 'stitch') {
            border = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2, strokeDashArray: [7, 7] });
        } else if (kind === 'ribbon') {
            const outer = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 2.2 });
            const inner = new fabric.Rect({ left: left + 14, top: top + 14, width: width - 28, height: height - 28, fill: 'transparent', stroke, strokeWidth: 1.4, strokeDashArray: [10, 8] });
            border = new fabric.Group([outer, inner], { objectCaching: false });
        } else if (kind === 'scallop') {
            const circles = [];
            const radius = 6;
            const step = 16;
            for (let x = left; x <= left + width; x += step) {
                circles.push(new fabric.Circle({ left: x - radius, top: top - radius, radius, fill: 'transparent', stroke, strokeWidth: 1.5 }));
                circles.push(new fabric.Circle({ left: x - radius, top: top + height - radius, radius, fill: 'transparent', stroke, strokeWidth: 1.5 }));
            }
            for (let y = top + step; y < top + height; y += step) {
                circles.push(new fabric.Circle({ left: left - radius, top: y - radius, radius, fill: 'transparent', stroke, strokeWidth: 1.5 }));
                circles.push(new fabric.Circle({ left: left + width - radius, top: y - radius, radius, fill: 'transparent', stroke, strokeWidth: 1.5 }));
            }
            border = new fabric.Group(circles, { objectCaching: false });
        } else if (kind === 'cornerDots') {
            const makeDots = (cx, cy) => {
                const dots = [];
                for (let i = 0; i < 4; i++) {
                    dots.push(new fabric.Circle({ left: cx + i * 10, top: cy, radius: 2.5, fill: stroke, stroke: 'transparent' }));
                    dots.push(new fabric.Circle({ left: cx, top: cy + i * 10, radius: 2.5, fill: stroke, stroke: 'transparent' }));
                }
                return dots;
            };
            border = new fabric.Group([
                ...makeDots(left, top),
                ...makeDots(left + width - 30, top),
                ...makeDots(left, top + height - 30),
                ...makeDots(left + width - 30, top + height - 30),
            ], { objectCaching: false });
        } else if (kind === 'cornerBrackets') {
            const len = 56;
            border = new fabric.Group([
                new fabric.Path(`M ${left} ${top + len} L ${left} ${top} L ${left + len} ${top}`, { fill: 'transparent', stroke, strokeWidth: 3 }),
                new fabric.Path(`M ${left + width - len} ${top} L ${left + width} ${top} L ${left + width} ${top + len}`, { fill: 'transparent', stroke, strokeWidth: 3 }),
                new fabric.Path(`M ${left + width} ${top + height - len} L ${left + width} ${top + height} L ${left + width - len} ${top + height}`, { fill: 'transparent', stroke, strokeWidth: 3 }),
                new fabric.Path(`M ${left + len} ${top + height} L ${left} ${top + height} L ${left} ${top + height - len}`, { fill: 'transparent', stroke, strokeWidth: 3 }),
            ], { objectCaching: false });
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

    async function addAdvancedMathProblems() {
        const modeRaw = (window.prompt('โหมด: quadratic, cubic, exponent, decimal, negative, mixed', 'mixed') || 'mixed').trim().toLowerCase();
        const mode = ['quadratic', 'cubic', 'exponent', 'decimal', 'negative', 'mixed'].includes(modeRaw) ? modeRaw : 'mixed';
        const count = Math.min(24, Math.max(4, Number(window.prompt('จำนวนข้อ', '10')) || 10));
        const fill = document.getElementById('colorText')?.value || '#1e293b';
        const col = 2;
        const gapX = 390;
        const gapY = 70;
        const types = ['quadratic', 'cubic', 'exponent', 'decimal', 'negative'];

        for (let i = 0; i < count; i++) {
            const type = mode === 'mixed' ? types[i % types.length] : mode;
            let latex = '';
            if (type === 'quadratic') {
                const a = getRandomInt(1, 5) * (Math.random() < 0.25 ? -1 : 1);
                const b = getRandomInt(-12, 12);
                const c = getRandomInt(-20, 20);
                const aTerm = a === 1 ? 'x^{2}' : a === -1 ? '-x^{2}' : `${a}x^{2}`;
                const bTerm = b === 0 ? '' : b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
                const cTerm = c === 0 ? '' : c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
                latex = `${aTerm} ${bTerm} ${cTerm} = 0`;
            } else if (type === 'cubic') {
                const a = getRandomInt(1, 3);
                const b = getRandomInt(-8, 8);
                const c = getRandomInt(-12, 12);
                const d = getRandomInt(-15, 15);
                const aTerm = a === 1 ? 'x^{3}' : `${a}x^{3}`;
                const bTerm = b === 0 ? '' : b > 0 ? `+ ${b}x^{2}` : `- ${Math.abs(b)}x^{2}`;
                const cTerm = c === 0 ? '' : c > 0 ? `+ ${c}x` : `- ${Math.abs(c)}x`;
                const dTerm = d === 0 ? '' : d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
                latex = `${aTerm} ${bTerm} ${cTerm} ${dTerm} = 0`;
            } else if (type === 'exponent') {
                const base = getRandomInt(2, 9);
                const p = getRandomInt(2, 6);
                const q = getRandomInt(2, 6);
                const op = Math.random() < 0.5 ? '\\times' : '\\div';
                latex = `${base}^{${p}} ${op} ${base}^{${q}} = \\underline{\\phantom{000}}`;
            } else if (type === 'decimal') {
                const a = (Math.random() * 100).toFixed(2);
                const b = (Math.random() * 100).toFixed(2);
                const ops = ['+', '-', '\\times', '\\div'];
                latex = `${a} ${ops[getRandomInt(0, ops.length - 1)]} ${b} = \\underline{\\phantom{000}}`;
            } else {
                const a = getRandomInt(-30, 30);
                const b = getRandomInt(-30, 30);
                const ops = ['+', '-', '\\times', '\\div'];
                const op = ops[getRandomInt(0, ops.length - 1)];
                const leftA = a < 0 ? `(${a})` : `${a}`;
                const leftB = b < 0 ? `(${b})` : `${b}`;
                latex = `${leftA} ${op} ${leftB} = \\underline{\\phantom{000}}`;
            }

            const left = 80 + (i % col) * gapX;
            const top = 120 + Math.floor(i / col) * gapY;
            if (typeof window.addMathTextToCanvas === 'function') {
                const expr = `${i + 1}) $${latex}$`;
                await window.addMathTextToCanvas(expr, {
                    left,
                    top,
                    pureLatex: false,
                    fontSize: 22,
                    scale: 1.03,
                    color: fill,
                });
            } else {
                canvas.add(new fabric.IText(`${i + 1}) ${latex}`, {
                    left,
                    top,
                    fontFamily: 'Sarabun',
                    fontSize: 22,
                    fill,
                }));
            }
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('สร้างโจทย์ Advanced Math แล้ว');
    }

    async function addFractionProblems() {
        const count = Math.min(24, Math.max(4, Number(window.prompt('จำนวนข้อเศษส่วน', '12')) || 12));
        const ops = [
            { sign: '+', latex: '+' },
            { sign: '-', latex: '-' },
            { sign: '×', latex: '\\times' },
            { sign: '÷', latex: '\\div' },
        ];
        const col = 2;
        const gapX = 380;
        const gapY = 56;
        for (let i = 0; i < count; i++) {
            const a = getRandomInt(1, 9);
            const b = getRandomInt(2, 12);
            const c = getRandomInt(1, 9);
            const d = getRandomInt(2, 12);
            const op = ops[getRandomInt(0, ops.length - 1)];
            const expr = `${i + 1}) $\\frac{${a}}{${b}}$ ${op.sign} $\\frac{${c}}{${d}}$ = ____`;
            const left = 80 + (i % col) * gapX;
            const top = 120 + Math.floor(i / col) * gapY;
            if (typeof window.addMathTextToCanvas === 'function') {
                await window.addMathTextToCanvas(expr, {
                    left,
                    top,
                    pureLatex: false,
                    fontSize: 22,
                    scale: 1.05,
                    color: document.getElementById('colorText')?.value || '#1e293b',
                });
            } else {
                canvas.add(new fabric.IText(`${i + 1}) ${a}/${b} ${op.sign} ${c}/${d} = ____`, {
                    left,
                    top,
                    fontFamily: 'Sarabun',
                    fontSize: 24,
                    fill: document.getElementById('colorText')?.value || '#1e293b',
                }));
            }
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Fraction generator แล้ว');
    }

    function addAlgebraProblems() {
        const count = Math.min(24, Math.max(4, Number(window.prompt('จำนวนข้อสมการ', '10')) || 10));
        const col = 2;
        const gapX = 380;
        const gapY = 56;
        for (let i = 0; i < count; i++) {
            const xVal = getRandomInt(1, 12);
            const a = getRandomInt(1, 9);
            const b = getRandomInt(-12, 12);
            const c = a * xVal + b;
            const sign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            const expr = `${i + 1}) ${a}x ${sign} = ${c}    x = [ ]`;
            canvas.add(new fabric.IText(expr, {
                left: 80 + (i % col) * gapX,
                top: 120 + Math.floor(i / col) * gapY,
                fontFamily: 'Sarabun',
                fontSize: 24,
                fill: document.getElementById('colorText')?.value || '#1e293b',
                data: { generator: 'algebra', answerOnly: false, answer: xVal },
            }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Algebra generator แล้ว');
    }

    function addGeometryProblems() {
        const count = Math.min(8, Math.max(2, Number(window.prompt('จำนวนโจทย์เรขาคณิต', '4')) || 4));
        const modeRaw = (window.prompt('ชนิดรูป: rectangle, triangle, circle, cube, cylinder, sphere, mixed', 'mixed') || 'mixed').trim().toLowerCase();
        const mode = ['rectangle', 'triangle', 'circle', 'cube', 'cylinder', 'sphere', 'mixed'].includes(modeRaw) ? modeRaw : 'mixed';
        const modes = ['rectangle', 'triangle', 'circle', 'cube', 'cylinder', 'sphere'];
        const col = 2;
        const gapX = 430;
        const gapY = 200;
        for (let i = 0; i < count; i++) {
            const x = 90 + (i % col) * gapX;
            const y = 120 + Math.floor(i / col) * gapY;
            const shapeType = mode === 'mixed' ? modes[i % modes.length] : mode;

            if (shapeType === 'rectangle') {
                const w = getRandomInt(80, 160);
                const h = getRandomInt(70, 140);
                canvas.add(new fabric.Rect({ left: x, top: y + 20, width: w, height: h, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.IText(`${w} cm`, { left: x + w / 2 - 20, top: y + h + 30, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`${h} cm`, { left: x + w + 10, top: y + h / 2, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`A = ____ cm²`, { left: x + 4, top: y - 6, fontFamily: 'Sarabun', fontSize: 20, fill: '#1e293b' }));
            }

            if (shapeType === 'triangle') {
                const base = getRandomInt(90, 170);
                const height = getRandomInt(70, 140);
                const tri = new fabric.Triangle({ left: x + 10, top: y + 24, width: base, height: height, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 });
                canvas.add(tri);
                canvas.add(new fabric.IText(`b = ${base} cm`, { left: x + 8, top: y + height + 34, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`h = ${height} cm`, { left: x + base + 24, top: y + height / 2, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`A = ____ cm²`, { left: x + 4, top: y - 6, fontFamily: 'Sarabun', fontSize: 20, fill: '#1e293b' }));
            }

            if (shapeType === 'circle') {
                const r = getRandomInt(40, 78);
                canvas.add(new fabric.Circle({ left: x + 18, top: y + 18, radius: r, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 18 + r, y + 18 + r, x + 18 + r * 2, y + 18 + r], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.IText(`r = ${r} cm`, { left: x + r * 2 + 30, top: y + r + 6, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`A = ____ cm²`, { left: x + 4, top: y - 6, fontFamily: 'Sarabun', fontSize: 20, fill: '#1e293b' }));
            }

            if (shapeType === 'cube') {
                const s = getRandomInt(56, 92);
                const d = Math.round(s * 0.36);
                canvas.add(new fabric.Rect({ left: x + 10, top: y + 26, width: s, height: s, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Rect({ left: x + 10 + d, top: y + 26 - d, width: s, height: s, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 10, y + 26, x + 10 + d, y + 26 - d], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 10 + s, y + 26, x + 10 + s + d, y + 26 - d], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 10, y + 26 + s, x + 10 + d, y + 26 + s - d], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 10 + s, y + 26 + s, x + 10 + s + d, y + 26 + s - d], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.IText(`s = ${s} cm`, { left: x + 16, top: y + s + 40, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`SA = ____ cm²`, { left: x + 4, top: y - 22, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`V = ____ cm³`, { left: x + 130, top: y - 22, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
            }

            if (shapeType === 'cylinder') {
                const r = getRandomInt(26, 42);
                const h = getRandomInt(76, 120);
                const eTop = y + 26;
                canvas.add(new fabric.Ellipse({ left: x + 20, top: eTop, rx: r, ry: r * 0.35, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Ellipse({ left: x + 20, top: eTop + h, rx: r, ry: r * 0.35, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 20, eTop + r * 0.35, x + 20, eTop + h + r * 0.35], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Line([x + 20 + r * 2, eTop + r * 0.35, x + 20 + r * 2, eTop + h + r * 0.35], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.IText(`r = ${r} cm`, { left: x + r * 2 + 44, top: y + 36, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`h = ${h} cm`, { left: x + r * 2 + 44, top: y + 80, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`SA = ____ cm²`, { left: x + 4, top: y - 22, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`V = ____ cm³`, { left: x + 130, top: y - 22, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
            }

            if (shapeType === 'sphere') {
                const r = getRandomInt(40, 66);
                const cx = x + 26;
                const cy = y + 26;
                canvas.add(new fabric.Circle({ left: cx, top: cy, radius: r, fill: 'transparent', stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.Ellipse({ left: cx, top: cy + r - r * 0.34, rx: r, ry: r * 0.34, fill: 'transparent', stroke: '#1e293b', strokeWidth: 1.8, strokeDashArray: [6, 5] }));
                canvas.add(new fabric.Line([cx + r, cy + r, cx + r * 2, cy + r], { stroke: '#1e293b', strokeWidth: 2 }));
                canvas.add(new fabric.IText(`r = ${r} cm`, { left: cx + r * 2 + 12, top: cy + r + 6, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`SA = ____ cm²`, { left: x + 4, top: y - 22, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
                canvas.add(new fabric.IText(`V = ____ cm³`, { left: x + 130, top: y - 22, fontFamily: 'Sarabun', fontSize: 18, fill: '#1e293b' }));
            }
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Geometry generator แล้ว');
    }

    function addNumberLineGenerator() {
        const min = Number(window.prompt('ค่าเริ่มต้นเส้นจำนวน', '-10'));
        const max = Number(window.prompt('ค่าสูงสุดเส้นจำนวน', '10'));
        const step = Math.max(1, Number(window.prompt('ระยะห่าง step', '1')) || 1);
        const paper = window.wbGetPaperConfig?.() || { width: canvas.width || 900 };
        const left = 120;
        const right = Math.max(left + 260, (paper.width || 900) - 120);
        const y = 220;
        canvas.add(new fabric.IText('Number Line', { left, top: y - 70, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        canvas.add(new fabric.Line([left, y, right, y], { stroke: '#1e293b', strokeWidth: 3 }));
        const total = Math.max(1, Math.floor((max - min) / step));
        for (let i = 0; i <= total; i++) {
            const x = left + ((right - left) * i) / total;
            canvas.add(new fabric.Line([x, y - 12, x, y + 12], { stroke: '#1e293b', strokeWidth: 2 }));
            canvas.add(new fabric.IText(String(min + i * step), { left: x - 14, top: y + 16, fontFamily: 'Sarabun', fontSize: 16, fill: '#1e293b' }));
        }
        canvas.requestRenderAll();
        markSaving();
    }

    function computeLineSegmentInBounds(m, c, minX, maxX, minY, maxY) {
        const points = [];
        const addPoint = (x, y) => {
            if (!Number.isFinite(x) || !Number.isFinite(y)) return;
            const exists = points.some(p => Math.abs(p.x - x) < 1e-6 && Math.abs(p.y - y) < 1e-6);
            if (!exists) points.push({ x, y });
        };
        const yAtMinX = m * minX + c;
        if (yAtMinX >= minY && yAtMinX <= maxY) addPoint(minX, yAtMinX);
        const yAtMaxX = m * maxX + c;
        if (yAtMaxX >= minY && yAtMaxX <= maxY) addPoint(maxX, yAtMaxX);
        if (Math.abs(m) > 1e-9) {
            const xAtMinY = (minY - c) / m;
            if (xAtMinY >= minX && xAtMinY <= maxX) addPoint(xAtMinY, minY);
            const xAtMaxY = (maxY - c) / m;
            if (xAtMaxY >= minX && xAtMaxY <= maxX) addPoint(xAtMaxY, maxY);
        }
        if (points.length < 2) return null;
        return [points[0], points[1]];
    }

    function addGraphGenerator() {
        const raw = (window.prompt('กรอกสมการเส้นตรงรูปแบบ m,c เช่น 2,1 สำหรับ y = 2x + 1', '2,1') || '').trim();
        if (!raw) return;
        const [mStr, cStr] = raw.split(',').map(v => v?.trim());
        const m = Number(mStr);
        const c = Number(cStr);
        if (!Number.isFinite(m) || !Number.isFinite(c)) {
            window.showToast?.('รูปแบบไม่ถูกต้อง ใช้ m,c เช่น 2,1');
            return;
        }

        const size = 420;
        const left = 120;
        const top = 120;
        const center = size / 2;
        const step = size / 20;

        const parts = [];
        for (let i = 0; i <= 20; i++) {
            const p = i * step;
            parts.push(new fabric.Line([p, 0, p, size], { stroke: '#cbd5e1', strokeWidth: 1, selectable: false, evented: false }));
            parts.push(new fabric.Line([0, p, size, p], { stroke: '#cbd5e1', strokeWidth: 1, selectable: false, evented: false }));
        }
        parts.push(new fabric.Line([center, 0, center, size], { stroke: '#0f172a', strokeWidth: 2, selectable: false, evented: false }));
        parts.push(new fabric.Line([0, center, size, center], { stroke: '#0f172a', strokeWidth: 2, selectable: false, evented: false }));

        const segment = computeLineSegmentInBounds(m, c, -10, 10, -10, 10);
        if (!segment) {
            window.showToast?.('เส้นไม่ตัดพื้นที่กราฟในช่วงที่กำหนด');
            return;
        }
        const [p1, p2] = segment;
        const px1 = center + p1.x * step;
        const py1 = center - p1.y * step;
        const px2 = center + p2.x * step;
        const py2 = center - p2.y * step;
        parts.push(new fabric.Line([px1, py1, px2, py2], { stroke: '#dc2626', strokeWidth: 3, selectable: false, evented: false }));

        const eqText = `y = ${m === 1 ? '' : m === -1 ? '-' : m}x ${c > 0 ? '+ ' + c : c < 0 ? '- ' + Math.abs(c) : ''}`.trim();
        parts.push(new fabric.IText(eqText, { left: 14, top: 12, fontFamily: 'Sarabun', fontSize: 20, fill: '#dc2626', selectable: false, evented: false }));
        parts.push(new fabric.IText('x', { left: size - 18, top: center + 6, fontFamily: 'Sarabun', fontSize: 16, fill: '#0f172a', selectable: false, evented: false }));
        parts.push(new fabric.IText('y', { left: center + 8, top: 6, fontFamily: 'Sarabun', fontSize: 16, fill: '#0f172a', selectable: false, evented: false }));

        const group = new fabric.Group(parts, { left, top, objectCaching: false });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่มกราฟเส้นแล้ว');
    }

    function addParabolaGenerator() {
        const raw = (window.prompt('กรอกพาราโบลาแบบ a,b,c เช่น 1,0,0 สำหรับ y = x^2', '1,0,0') || '').trim();
        if (!raw) return;
        const [aStr, bStr, cStr] = raw.split(',').map(v => v?.trim());
        const a = Number(aStr);
        const b = Number(bStr);
        const c = Number(cStr);
        if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c) || Math.abs(a) < 1e-9) {
            window.showToast?.('รูปแบบไม่ถูกต้อง ใช้ a,b,c และ a ต้องไม่เป็น 0');
            return;
        }

        const size = 420;
        const left = 120;
        const top = 120;
        const center = size / 2;
        const step = size / 20;

        const parts = [];
        for (let i = 0; i <= 20; i++) {
            const p = i * step;
            parts.push(new fabric.Line([p, 0, p, size], { stroke: '#cbd5e1', strokeWidth: 1, selectable: false, evented: false }));
            parts.push(new fabric.Line([0, p, size, p], { stroke: '#cbd5e1', strokeWidth: 1, selectable: false, evented: false }));
        }
        parts.push(new fabric.Line([center, 0, center, size], { stroke: '#0f172a', strokeWidth: 2, selectable: false, evented: false }));
        parts.push(new fabric.Line([0, center, size, center], { stroke: '#0f172a', strokeWidth: 2, selectable: false, evented: false }));

        const pts = [];
        for (let x = -10; x <= 10; x += 0.2) {
            const y = a * x * x + b * x + c;
            if (y < -10 || y > 10) continue;
            const px = center + x * step;
            const py = center - y * step;
            pts.push(`${pts.length === 0 ? 'M' : 'L'} ${px} ${py}`);
        }
        if (pts.length < 2) {
            window.showToast?.('กราฟอยู่นอกช่วงแสดงผล ลองปรับค่าสมการ');
            return;
        }
        parts.push(new fabric.Path(pts.join(' '), { fill: 'transparent', stroke: '#ea580c', strokeWidth: 3, selectable: false, evented: false }));

        const eqText = `y = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${b > 0 ? '+ ' + b + 'x' : b < 0 ? '- ' + Math.abs(b) + 'x' : ''} ${c > 0 ? '+ ' + c : c < 0 ? '- ' + Math.abs(c) : ''}`.replace(/\s+/g, ' ').trim();
        parts.push(new fabric.IText(eqText, { left: 14, top: 12, fontFamily: 'Sarabun', fontSize: 20, fill: '#ea580c', selectable: false, evented: false }));
        parts.push(new fabric.IText('x', { left: size - 18, top: center + 6, fontFamily: 'Sarabun', fontSize: 16, fill: '#0f172a', selectable: false, evented: false }));
        parts.push(new fabric.IText('y', { left: center + 8, top: 6, fontFamily: 'Sarabun', fontSize: 16, fill: '#0f172a', selectable: false, evented: false }));

        const group = new fabric.Group(parts, { left, top, objectCaching: false });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่มกราฟพาราโบลาแล้ว');
    }

    function addCoordinatePlaneGenerator() {
        const left = 120;
        const top = 120;
        const size = Math.min(520, Math.max(360, Math.floor((canvas.width || 900) * 0.5)));
        const centerX = left + size / 2;
        const centerY = top + size / 2;
        const step = size / 10;
        canvas.add(new fabric.IText('Coordinate Plane', { left, top: 64, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let i = 0; i <= 10; i++) {
            const x = left + i * step;
            const y = top + i * step;
            canvas.add(new fabric.Line([x, top, x, top + size], { stroke: '#94a3b8', strokeWidth: 1 }));
            canvas.add(new fabric.Line([left, y, left + size, y], { stroke: '#94a3b8', strokeWidth: 1 }));
        }
        canvas.add(new fabric.Line([left, centerY, left + size, centerY], { stroke: '#1e293b', strokeWidth: 2.4 }));
        canvas.add(new fabric.Line([centerX, top, centerX, top + size], { stroke: '#1e293b', strokeWidth: 2.4 }));
        canvas.add(new fabric.Circle({ left: centerX + step * 2 - 4, top: centerY - step * 3 - 4, radius: 4, fill: '#dc2626', stroke: '#dc2626', strokeWidth: 1 }));
        canvas.add(new fabric.IText('(2, 3)', { left: centerX + step * 2 + 8, top: centerY - step * 3 - 18, fontFamily: 'Sarabun', fontSize: 16, fill: '#dc2626' }));
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Coordinate plane แล้ว');
    }

    let slideshowActive = false;
    let slideshowHandler = null;
    let slideshowSnapshot = null;

    function setSlideshowUi(active) {
        document.body.classList.toggle('is-slideshow', !!active);
        const btn = document.getElementById('btnPlaySlideshow');
        if (btn) btn.textContent = active ? '⏹ Exit' : '▶ Play';
    }

    function exitSlideshow() {
        if (!slideshowActive) return;
        slideshowActive = false;
        if (slideshowHandler) {
            document.removeEventListener('keydown', slideshowHandler);
            slideshowHandler = null;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        setSlideshowUi(false);
        if (slideshowSnapshot) {
            window.wbGoToPage?.(slideshowSnapshot.pageIndex);
            window.wbSetZoom?.(slideshowSnapshot.zoom);
            slideshowSnapshot = null;
        }
    }

    function startSlideshow() {
        if (slideshowActive) {
            exitSlideshow();
            return;
        }
        slideshowActive = true;
        slideshowSnapshot = {
            pageIndex: window.wbGetActivePageIndex?.() || 0,
            zoom: window.wbGetZoom?.() || 1,
        };
        setSlideshowUi(true);
        const host = document.querySelector('.canvas-area') || document.documentElement;
        host.requestFullscreen?.().catch(() => { });
        window.wbSetZoom?.(1);
        slideshowHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                exitSlideshow();
                return;
            }
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const idx = window.wbGetActivePageIndex?.() || 0;
                window.wbGoToPage?.(idx + 1);
            }
            if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
                e.preventDefault();
                const idx = window.wbGetActivePageIndex?.() || 0;
                window.wbGoToPage?.(idx - 1);
            }
        };
        document.addEventListener('keydown', slideshowHandler);
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && slideshowActive) exitSlideshow();
        }, { once: true });
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
        const raw = window.prompt('ใส่คำศัพท์ crossword (comma) เช่น CAT,DOG,SUN,MAP', 'CAT,DOG,SUN,MAP,TREE,BOOK,PLANT,HOUSE');
        if (!raw) return;
        const sourceWords = raw
            .split(',')
            .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
            .filter(Boolean)
            .filter((w, i, arr) => arr.indexOf(w) === i)
            .slice(0, 12)
            .sort((a, b) => b.length - a.length);
        if (!sourceWords.length) return;

        const size = 15;
        const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
        const placements = [];

        const setWord = (word, row, col, dir) => {
            for (let i = 0; i < word.length; i++) {
                const r = dir === 'v' ? row + i : row;
                const c = dir === 'h' ? col + i : col;
                grid[r][c] = word[i];
            }
            placements.push({ word, row, col, dir });
        };

        const canPlaceWord = (word, row, col, dir) => {
            const dr = dir === 'v' ? 1 : 0;
            const dc = dir === 'h' ? 1 : 0;
            const endR = row + dr * (word.length - 1);
            const endC = col + dc * (word.length - 1);
            if (row < 0 || col < 0 || endR >= size || endC >= size) return false;

            for (let i = 0; i < word.length; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                const ch = grid[r][c];
                if (ch && ch !== word[i]) return false;

                if (!ch) {
                    const sideA = dir === 'h' ? [r - 1, c] : [r, c - 1];
                    const sideB = dir === 'h' ? [r + 1, c] : [r, c + 1];
                    const [aR, aC] = sideA;
                    const [bR, bC] = sideB;
                    if (grid[aR]?.[aC]) return false;
                    if (grid[bR]?.[bC]) return false;
                }
            }

            const beforeR = row - dr;
            const beforeC = col - dc;
            const afterR = endR + dr;
            const afterC = endC + dc;
            if (grid[beforeR]?.[beforeC]) return false;
            if (grid[afterR]?.[afterC]) return false;
            return true;
        };

        const first = sourceWords[0];
        const firstRow = Math.floor(size / 2);
        const firstCol = Math.max(0, Math.floor((size - first.length) / 2));
        if (!canPlaceWord(first, firstRow, firstCol, 'h')) {
            window.showToast?.('ไม่สามารถวาง Crossword ได้');
            return;
        }
        setWord(first, firstRow, firstCol, 'h');

        for (let wi = 1; wi < sourceWords.length; wi++) {
            const word = sourceWords[wi];
            let placed = false;

            for (let i = 0; i < word.length && !placed; i++) {
                const targetCh = word[i];
                for (const p of placements) {
                    for (let j = 0; j < p.word.length; j++) {
                        if (p.word[j] !== targetCh) continue;
                        const baseR = p.dir === 'v' ? p.row + j : p.row;
                        const baseC = p.dir === 'h' ? p.col + j : p.col;
                        const dir = p.dir === 'h' ? 'v' : 'h';
                        const row = dir === 'v' ? baseR - i : baseR;
                        const col = dir === 'h' ? baseC - i : baseC;
                        if (canPlaceWord(word, row, col, dir)) {
                            setWord(word, row, col, dir);
                            placed = true;
                            break;
                        }
                    }
                    if (placed) break;
                }
            }

            if (!placed) {
                for (let r = 0; r < size && !placed; r++) {
                    for (let c = 0; c < size && !placed; c++) {
                        if (canPlaceWord(word, r, c, 'h')) {
                            setWord(word, r, c, 'h');
                            placed = true;
                        } else if (canPlaceWord(word, r, c, 'v')) {
                            setWord(word, r, c, 'v');
                            placed = true;
                        }
                    }
                }
            }
        }

        if (!placements.length) {
            window.showToast?.('ไม่สามารถวาง Crossword ได้');
            return;
        }

        let minR = size, minC = size, maxR = 0, maxC = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!grid[r][c]) continue;
                minR = Math.min(minR, r);
                minC = Math.min(minC, c);
                maxR = Math.max(maxR, r);
                maxC = Math.max(maxC, c);
            }
        }

        const rows = maxR - minR + 1;
        const cols = maxC - minC + 1;
        const startX = 90;
        const startY = 160;
        const cell = 40;

        canvas.add(new fabric.IText('Crossword', { left: startX, top: 84, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const srcR = minR + r;
                const srcC = minC + c;
                if (!grid[srcR][srcC]) continue;
                const x = startX + c * cell;
                const y = startY + r * cell;
                canvas.add(new fabric.Rect({ left: x, top: y, width: cell, height: cell, fill: '#fff', stroke: '#334155', strokeWidth: 1.6 }));
            }
        }

        const clues = placements
            .sort((a, b) => a.row - b.row || a.col - b.col)
            .map((p, i) => `${i + 1}. ${p.dir === 'h' ? 'Across' : 'Down'} (${p.word.length} letters)`);
        const clueX = startX + cols * cell + 24;
        clues.forEach((line, i) => {
            canvas.add(new fabric.IText(line, {
                left: clueX,
                top: startY + i * 30,
                fontFamily: 'Sarabun',
                fontSize: 16,
                fill: '#334155',
            }));
        });

        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`สร้าง Crossword แล้ว (${placements.length} คำ)`);
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
        document.getElementById('templateSearch')?.addEventListener('input', refreshTemplateGallery);
        document.getElementById('templateGradeBand')?.addEventListener('change', () => {
            syncGradeOptions();
            refreshTemplateGallery();
        });
        document.getElementById('templateGrade')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('templateDifficulty')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('templateFormat')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('btnTemplateClearFilters')?.addEventListener('click', () => {
            resetTemplateFilters();
            refreshTemplateGallery();
        });
        document.querySelectorAll('#templateSegments .template-segment').forEach(btn => {
            btn.addEventListener('click', () => {
                templateFilterState.segment = btn.dataset.segment || 'all';
                document.querySelectorAll('#templateSegments .template-segment').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                refreshTemplateGallery();
            });
        });

        document.getElementById('btnAddBasicShape')?.addEventListener('click', () => {
            const type = document.getElementById('basicShapeSelect')?.value || 'square';
            addShape(type);
        });

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
        document.getElementById('btnGenAdvancedMath')?.addEventListener('click', addAdvancedMathProblems);
        document.getElementById('btnGenFractions')?.addEventListener('click', addFractionProblems);
        document.getElementById('btnGenAlgebra')?.addEventListener('click', addAlgebraProblems);
        document.getElementById('btnGenGeometry')?.addEventListener('click', addGeometryProblems);
        document.getElementById('btnGenGraph')?.addEventListener('click', addGraphGenerator);
        document.getElementById('btnGenParabola')?.addEventListener('click', addParabolaGenerator);
        document.getElementById('btnGenNumberLine')?.addEventListener('click', addNumberLineGenerator);
        document.getElementById('btnGenCoordinate')?.addEventListener('click', addCoordinatePlaneGenerator);
        document.getElementById('btnGenWordSearch')?.addEventListener('click', addWordSearch);
        document.getElementById('btnGenCrossword')?.addEventListener('click', addCrossword);
        document.getElementById('btnGenerateAnswerKey')?.addEventListener('click', () => window.wbGenerateAnswerKeyPage?.());
        document.getElementById('btnPlaySlideshow')?.addEventListener('click', startSlideshow);

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
        syncGradeOptions();
        createChipButtons('templateSubjectChips', SUBJECTS, templateFilterState.subjects, refreshTemplateGallery);
        createChipButtons('templateSkillChips', SKILLS, templateFilterState.skills, refreshTemplateGallery);
        refreshTemplateGallery();
        buildBorderGallery('borderGallery', borderCards, (item) => addBorder(item.key));
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
