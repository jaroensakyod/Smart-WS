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
    const templateCatalogApi = window.SMARTWS_TEMPLATE_CATALOG || {};
    const templateHandlersApi = window.SMARTWS_TEMPLATE_HANDLERS || {};
    const curatedTemplatesApi = window.SMARTWS_CURATED_TEMPLATES_API || {};
    const iconifyApi = window.SMARTWS_ICONIFY_UTILS || {};
    const fullCatalog = Array.isArray(templateCatalogApi.TEMPLATE_CATALOG)
        ? templateCatalogApi.TEMPLATE_CATALOG
        : [];
    const legacyCatalog = fullCatalog.filter(item => (item.tags || []).includes('cohort-legacy'));
    const newVisualCatalog = fullCatalog.filter(item => (item.tags || []).includes('cohort-new'));
    const waveACatalog = legacyCatalog.slice(0, 50);
    const waveAHandlerMap = typeof templateHandlersApi.buildWaveAHandlerMap === 'function'
        ? templateHandlersApi.buildWaveAHandlerMap(fullCatalog)
        : {};
    const waveBCatalog = legacyCatalog.slice(50);
    const waveBHandlerMap = typeof templateHandlersApi.buildWaveBHandlerMap === 'function'
        ? templateHandlersApi.buildWaveBHandlerMap(fullCatalog)
        : {};
    const waveCCatalog = newVisualCatalog;
    const waveCHandlerMap = typeof templateHandlersApi.buildWaveCHandlerMap === 'function'
        ? templateHandlersApi.buildWaveCHandlerMap(fullCatalog)
        : {};
    const curatedTemplateCatalog = Array.isArray(curatedTemplatesApi.CURATED_TEMPLATES)
        ? curatedTemplatesApi.CURATED_TEMPLATES
        : [];

    const baseTemplateCards = [
        { key: 'taskcards4', title: 'Task Cards 4 (การ์ดงาน 4)', desc: 'การ์ดงาน 4 ช่องพร้อมเส้นตัด' },
        { key: 'taskcards8', title: 'Task Cards 8 (การ์ดงาน 8)', desc: 'การ์ดงาน 8 ช่องสำหรับกิจกรรมเร็ว' },
        { key: 'frayer', title: 'Frayer Model (โมเดลเฟรเยอร์)', desc: 'Definition / Characteristics / Examples / Non-examples' },
        { key: 'kwl', title: 'KWL Chart (ตาราง KWL)', desc: 'Know / Want to know / Learned' },
        { key: 'letterTracing', title: 'Letter Tracing (ลากเส้นตัวอักษร)', desc: 'ฝึกลากเส้นตามตัวอักษรพร้อมบรรทัดนำสายตา' },
        { key: 'storySequence', title: 'Story Sequence (ลำดับเรื่อง 3 ขั้น)', desc: 'เรียงลำดับเหตุการณ์ต้น-กลาง-จบ' },
        { key: 'cornellNotes', title: 'Cornell Notes (โน้ตคอร์เนลล์)', desc: 'ช่องคำใบ้, ช่องจดโน้ต และสรุปท้ายหน้า' },
        { key: 'tchart', title: 'T-Chart (ตารางเปรียบเทียบ 2 ฝั่ง)', desc: 'ตารางเปรียบเทียบสองคอลัมน์พร้อมหัวข้อ' },
        { key: 'advancedTimeline', title: 'Advanced Timeline (ไทม์ไลน์เชิงวิเคราะห์)', desc: 'เส้นเวลาหลายมิติพร้อมช่วงวิเคราะห์เหตุการณ์' },
        { key: 'causeEffect', title: 'Cause-Effect Organizer (เหตุและผล)', desc: 'แผนผังเชื่อมสาเหตุและผลลัพธ์' },
        { key: 'venn', title: 'Venn Diagram (แผนภาพเวนน์)', desc: 'วงเวนน์ 2 วงสำหรับเปรียบเทียบ' },
        { key: 'graphpaper', title: 'Graph Paper (กระดาษกราฟ)', desc: 'กระดาษกราฟคณิตศาสตร์' },
        { key: 'numberline', title: 'Number Line (เส้นจำนวน)', desc: 'เส้นจำนวนพร้อมตำแหน่งหลัก' },
        { key: 'addSubPractice', title: 'Add/Sub Practice (บวก-ลบพื้นฐาน)', desc: 'โจทย์บวก-ลบพร้อมช่องคำตอบเป็นระเบียบ' },
        { key: 'fractionpies', title: 'Fraction Pies (วงกลมเศษส่วน)', desc: 'วงกลมเศษส่วน 2,3,4,6,8 ส่วน' },
        { key: 'ratioFraction', title: 'Ratio & Fraction Practice (อัตราส่วนและเศษส่วน)', desc: 'แบบฝึกอัตราส่วนเทียบกับเศษส่วน' },
        { key: 'algebraWorkspace', title: 'Algebra Workspace (พื้นที่ทำโจทย์พีชคณิต)', desc: 'พื้นที่จัดระเบียบวิธีทำโจทย์พีชคณิตทีละขั้น' },
        { key: 'dataInterpretation', title: 'Data Interpretation (ตีความข้อมูล)', desc: 'แบบฝึกอ่านตาราง/กราฟและสรุปข้อค้นพบ' },
        { key: 'practicalNumeracy', title: 'Practical Numeracy (คณิตศาสตร์ใช้งานจริง)', desc: 'คำนวณสถานการณ์จริง เช่น งบประมาณ เวลา หน่วยวัด' },
        { key: 'quiz', title: 'Quiz MCQ (แบบทดสอบปรนัย)', desc: 'ข้อสอบปรนัยพร้อมคำตอบ ก ข ค ง' },
        { key: 'rubric4', title: 'Rubric 4-Level (ตารางประเมิน 4 ระดับ)', desc: 'เกณฑ์ประเมิน 4 ระดับพร้อมช่องให้คะแนน' },
        { key: 'analyticRubric', title: 'Analytic Rubric (ตารางประเมินเชิงวิเคราะห์)', desc: 'ประเมินรายเกณฑ์พร้อม descriptors ชัดเจน' },
        { key: 'competencyRubric', title: 'Competency Rubric (สมรรถนะผู้เรียน)', desc: 'ประเมินสมรรถนะตามระดับความชำนาญ' },
        { key: 'phonicsMatch', title: 'Phonics Match (จับคู่เสียง-ตัวอักษร)', desc: 'จับคู่เสียงกับตัวอักษรและคำพื้นฐาน' },
        { key: 'pictureVocabulary', title: 'Picture Vocabulary (ศัพท์จากภาพ)', desc: 'ฝึกศัพท์จากภาพพร้อมช่องเขียนคำตอบ' },
        { key: 'contextClues', title: 'Context Clues Vocabulary (คำศัพท์จากบริบท)', desc: 'หาความหมายคำจากประโยคตัวอย่าง' },
        { key: 'criticalReadingEvidence', title: 'Critical Reading + Evidence (อ่านเชิงวิจารณ์)', desc: 'วิเคราะห์ใจความหลักและยกหลักฐานสนับสนุน' },
        { key: 'argumentEssayPlanner', title: 'Argument Essay Planner (วางแผนเรียงความโต้แย้ง)', desc: 'กำหนดข้ออ้าง เหตุผล หลักฐาน และข้อโต้แย้ง' },
        { key: 'sourceAnalysis', title: 'Source Analysis Sheet (วิเคราะห์แหล่งข้อมูล)', desc: 'ประเมินความน่าเชื่อถือและอคติของแหล่งข้อมูล' },
        { key: 'workplaceReading', title: 'Workplace Reading (อ่านเอกสารในงาน)', desc: 'อ่านประกาศ/คู่มือ/อีเมลงานและตอบคำถามสำคัญ' },
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
        { key: 'debatePrep', title: 'Debate Prep Sheet (เตรียมดีเบต)', desc: 'เตรียมประเด็น สนับสนุน และตอบโต้สำหรับการโต้วาที' },
        { key: 'communicationRoleplay', title: 'Communication Role-play (สถานการณ์สื่อสาร)', desc: 'จำลองบทสนทนาเพื่อฝึกสื่อสารในงานจริง' },
        { key: 'presTitle', title: 'Presentation Title (สไลด์หน้าปก)', desc: 'สไลด์หน้าปก 16:9' },
        { key: 'presTwoCol', title: 'Presentation Two-Column (สไลด์สองคอลัมน์)', desc: 'สไลด์ 2 คอลัมน์สำหรับเนื้อหา' },
        { key: 'lessonPlan', title: 'Lesson Plan (แผนการสอน)', desc: 'แผนการสอนพร้อมส่วน Objective/Procedure/Assessment' },
        { key: 'readingComprehension', title: 'Reading Comprehension (อ่านจับใจความ)', desc: 'บทอ่าน คำศัพท์ คำถาม และสรุปท้ายเรื่อง' },
        { key: 'reflectionJournal', title: 'Reflection Journal (บันทึกสะท้อนคิด)', desc: 'บันทึกสิ่งที่เรียนรู้ ความท้าทาย และเป้าหมายต่อไป' },
        { key: 'reflectionLog', title: 'Reflection Log (บันทึกสะท้อนผลผู้ใหญ่)', desc: 'ทบทวนสิ่งที่ทำได้ สิ่งที่ต้องพัฒนา และแผนถัดไป' },
        { key: 'projectPlanning', title: 'Project Planning Sheet (แผนงานโครงงาน)', desc: 'วางแผนเป้าหมาย ขั้นตอน กำหนดเวลา และบทบาททีม' },
        { key: 'examReviewTracker', title: 'Exam Review Tracker (แผนทบทวนสอบ)', desc: 'ติดตามหัวข้อทบทวน สถานะ และคะแนนตนเอง' },
        { key: 'researchNotes', title: 'Research Notes Organizer (บันทึกงานวิจัย)', desc: 'จัดโน้ตงานวิจัย แหล่งอ้างอิง และข้อสรุปสำคัญ' },
        { key: 'procedureChecklist', title: 'Procedure Checklist (เช็กลิสต์ขั้นตอนงาน)', desc: 'เช็กลิสต์ทีละขั้นสำหรับงานกระบวนการ' },
        { key: 'goalActionTracker', title: 'Goal-Action Tracker (ติดตามเป้าหมาย)', desc: 'ตั้งเป้าหมาย แผนปฏิบัติ และตัวชี้วัดความคืบหน้า' },
        { key: 'skillsSelfAssessment', title: 'Skills Self-assessment (ประเมินทักษะตนเอง)', desc: 'ประเมินระดับทักษะตนเองและวางแผนพัฒนา' },
        { key: 'jobTaskWorksheet', title: 'Job Task Worksheet (ใบงานภารกิจงาน)', desc: 'วิเคราะห์งานย่อย ผู้รับผิดชอบ และกำหนดส่ง' },
        { key: 'problemSolvingCanvas', title: 'Problem-solving Canvas (ผืนผ้าแก้ปัญหา)', desc: 'นิยามปัญหา สาเหตุ แนวทาง และการทดลองแก้ไข' },
        { key: 'portfolioEvidence', title: 'Portfolio Evidence Sheet (หลักฐานแฟ้มสะสมงาน)', desc: 'บันทึกผลงาน หลักฐาน และตัวชี้วัดผลลัพธ์' },
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
        letterTracing: { gradeBands: ['elementary'], grades: ['preschool', 'kindergarten', 'g1'], subjects: ['language'], skills: ['writing'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 95 },
        storySequence: { gradeBands: ['elementary'], grades: ['g2', 'g3', 'g4', 'g5'], subjects: ['language'], skills: ['reading', 'analysis'], difficulty: 'beginner', format: 'organizer', isNew: true, popularityScore: 78 },
        cornellNotes: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['language', 'social'], skills: ['reading', 'writing'], difficulty: 'intermediate', format: 'organizer', popularityScore: 70 },
        tchart: { gradeBands: ['elementary', 'middle', 'high'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'], subjects: ['language', 'social'], skills: ['analysis'], difficulty: 'beginner', format: 'organizer', popularityScore: 72 },
        advancedTimeline: { gradeBands: ['high', 'adult'], grades: ['g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['social', 'project'], skills: ['analysis'], difficulty: 'advanced', format: 'organizer', isNew: true, popularityScore: 83 },
        causeEffect: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10'], subjects: ['language', 'science'], skills: ['analysis', 'reasoning'], difficulty: 'intermediate', format: 'organizer', isNew: true, popularityScore: 81 },
        venn: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8'], subjects: ['science'], skills: ['analysis'], difficulty: 'beginner', format: 'organizer', popularityScore: 69 },
        graphpaper: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8'], subjects: ['math'], skills: ['computation'], difficulty: 'beginner', format: 'worksheet', popularityScore: 77 },
        numberline: { gradeBands: ['elementary'], grades: ['g1', 'g2', 'g3', 'g4'], subjects: ['math'], skills: ['computation'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, popularityScore: 88 },
        addSubPractice: { gradeBands: ['elementary'], grades: ['g1', 'g2', 'g3', 'g4'], subjects: ['math'], skills: ['computation'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 91 },
        fractionpies: { gradeBands: ['elementary', 'middle'], grades: ['g3', 'g4', 'g5', 'g6'], subjects: ['math'], skills: ['computation', 'reasoning'], difficulty: 'beginner', format: 'worksheet', popularityScore: 71 },
        ratioFraction: { gradeBands: ['middle'], grades: ['g6', 'g7', 'g8'], subjects: ['math'], skills: ['computation', 'reasoning'], difficulty: 'intermediate', format: 'worksheet', isNew: true, popularityScore: 84 },
        algebraWorkspace: { gradeBands: ['high'], grades: ['g9', 'g10', 'g11'], subjects: ['math'], skills: ['reasoning', 'analysis'], difficulty: 'advanced', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 92 },
        dataInterpretation: { gradeBands: ['high', 'adult'], grades: ['g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['math', 'science'], skills: ['analysis'], difficulty: 'advanced', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 90 },
        practicalNumeracy: { gradeBands: ['adult'], grades: ['adult'], subjects: ['math'], skills: ['computation', 'reasoning'], difficulty: 'intermediate', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 91 },
        quiz: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['assessment'], skills: ['analysis'], difficulty: 'intermediate', format: 'assessment', popularityScore: 79 },
        rubric4: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['assessment'], skills: ['analysis', 'reflection'], difficulty: 'intermediate', format: 'assessment', isFeatured: true, popularityScore: 86 },
        analyticRubric: { gradeBands: ['high'], grades: ['g9', 'g10', 'g11', 'g12'], subjects: ['assessment'], skills: ['analysis', 'reflection'], difficulty: 'advanced', format: 'assessment', isFeatured: true, isNew: true, popularityScore: 88 },
        competencyRubric: { gradeBands: ['adult'], grades: ['adult'], subjects: ['assessment'], skills: ['analysis', 'reflection'], difficulty: 'intermediate', format: 'assessment', isFeatured: true, isNew: true, popularityScore: 87 },
        phonicsMatch: { gradeBands: ['elementary'], grades: ['kindergarten', 'g1', 'g2'], subjects: ['language'], skills: ['vocabulary', 'reading'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 93 },
        pictureVocabulary: { gradeBands: ['elementary'], grades: ['g1', 'g2', 'g3', 'g4'], subjects: ['language'], skills: ['vocabulary'], difficulty: 'beginner', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 90 },
        contextClues: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9'], subjects: ['language'], skills: ['vocabulary', 'analysis', 'reading'], difficulty: 'intermediate', format: 'worksheet', isNew: true, popularityScore: 87 },
        criticalReadingEvidence: { gradeBands: ['high'], grades: ['g9', 'g10', 'g11', 'g12'], subjects: ['language'], skills: ['reading', 'analysis'], difficulty: 'advanced', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 93 },
        argumentEssayPlanner: { gradeBands: ['high'], grades: ['g9', 'g10', 'g11', 'g12'], subjects: ['language'], skills: ['writing', 'reasoning'], difficulty: 'advanced', format: 'organizer', isFeatured: true, isNew: true, popularityScore: 89 },
        sourceAnalysis: { gradeBands: ['high', 'adult'], grades: ['g10', 'g11', 'g12', 'adult'], subjects: ['language', 'social'], skills: ['analysis'], difficulty: 'advanced', format: 'worksheet', isNew: true, popularityScore: 86 },
        workplaceReading: { gradeBands: ['adult'], grades: ['adult'], subjects: ['language'], skills: ['reading', 'analysis'], difficulty: 'intermediate', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 92 },
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
        debatePrep: { gradeBands: ['high'], grades: ['g9', 'g10', 'g11', 'g12'], subjects: ['language', 'social'], skills: ['communication', 'reasoning'], difficulty: 'advanced', format: 'activity', isNew: true, popularityScore: 84 },
        communicationRoleplay: { gradeBands: ['adult'], grades: ['adult'], subjects: ['project'], skills: ['communication'], difficulty: 'intermediate', format: 'activity', isFeatured: true, isNew: true, popularityScore: 88 },
        presTitle: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['project'], skills: ['communication'], difficulty: 'intermediate', format: 'organizer', popularityScore: 51 },
        presTwoCol: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['project'], skills: ['communication'], difficulty: 'intermediate', format: 'organizer', popularityScore: 55 },
        lessonPlan: { gradeBands: ['elementary', 'middle', 'high', 'adult'], grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['planning'], skills: ['reflection', 'communication'], difficulty: 'intermediate', format: 'planner', isFeatured: true, isNew: true, popularityScore: 92 },
        readingComprehension: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['language'], skills: ['reading', 'analysis', 'vocabulary'], difficulty: 'intermediate', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 94 },
        reflectionJournal: { gradeBands: ['middle', 'high'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'], subjects: ['planning'], skills: ['reflection', 'writing'], difficulty: 'intermediate', format: 'planner', isNew: true, popularityScore: 79 },
        reflectionLog: { gradeBands: ['adult'], grades: ['adult'], subjects: ['planning'], skills: ['reflection'], difficulty: 'intermediate', format: 'planner', isFeatured: true, isNew: true, popularityScore: 85 },
        projectPlanning: { gradeBands: ['middle', 'high', 'adult'], grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'], subjects: ['project', 'planning'], skills: ['analysis', 'communication', 'reflection'], difficulty: 'intermediate', format: 'planner', isNew: true, popularityScore: 82 },
        examReviewTracker: { gradeBands: ['high'], grades: ['g9', 'g10', 'g11', 'g12'], subjects: ['planning'], skills: ['reflection', 'analysis'], difficulty: 'advanced', format: 'planner', isFeatured: true, isNew: true, popularityScore: 86 },
        researchNotes: { gradeBands: ['high'], grades: ['g10', 'g11', 'g12'], subjects: ['project', 'language'], skills: ['analysis', 'writing'], difficulty: 'advanced', format: 'organizer', isNew: true, popularityScore: 88 },
        procedureChecklist: { gradeBands: ['adult'], grades: ['adult'], subjects: ['planning'], skills: ['reflection', 'reasoning'], difficulty: 'beginner', format: 'planner', isFeatured: true, isNew: true, popularityScore: 89 },
        goalActionTracker: { gradeBands: ['adult'], grades: ['adult'], subjects: ['planning'], skills: ['reflection'], difficulty: 'intermediate', format: 'planner', isFeatured: true, isNew: true, popularityScore: 90 },
        skillsSelfAssessment: { gradeBands: ['adult'], grades: ['adult'], subjects: ['assessment'], skills: ['reflection', 'analysis'], difficulty: 'intermediate', format: 'assessment', isFeatured: true, isNew: true, popularityScore: 91 },
        jobTaskWorksheet: { gradeBands: ['adult'], grades: ['adult'], subjects: ['project'], skills: ['analysis', 'communication'], difficulty: 'intermediate', format: 'worksheet', isFeatured: true, isNew: true, popularityScore: 87 },
        problemSolvingCanvas: { gradeBands: ['adult'], grades: ['adult'], subjects: ['project'], skills: ['analysis', 'reasoning'], difficulty: 'advanced', format: 'organizer', isFeatured: true, isNew: true, popularityScore: 89 },
        portfolioEvidence: { gradeBands: ['adult', 'high'], grades: ['adult', 'g11', 'g12'], subjects: ['project', 'assessment'], skills: ['reflection', 'communication'], difficulty: 'intermediate', format: 'organizer', isNew: true, popularityScore: 85 },
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

    function mapGradeBandToFilters(gradeBand) {
        const key = String(gradeBand || '').trim().toLowerCase();
        if (key === 'pre-k') {
            return {
                gradeBands: ['elementary'],
                grades: ['preschool', 'kindergarten'],
            };
        }
        if (key === 'k-1') {
            return {
                gradeBands: ['elementary'],
                grades: ['kindergarten', 'g1'],
            };
        }
        if (key === 'g1-g2') {
            return {
                gradeBands: ['elementary'],
                grades: ['g1', 'g2'],
            };
        }
        if (key === 'g3-g5') {
            return {
                gradeBands: ['elementary'],
                grades: ['g3', 'g4', 'g5'],
            };
        }
        return {
            gradeBands: ['elementary', 'middle', 'high', 'adult'],
            grades: ['preschool', 'kindergarten', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'],
        };
    }

    function mapCategoryToSubjectsSkills(category) {
        const c = String(category || '').trim();
        if (c === 'early_learning_games') return { subjects: ['language'], skills: ['vocabulary', 'reasoning'] };
        if (c === 'math_visuals') return { subjects: ['math'], skills: ['computation', 'reasoning'] };
        if (c === 'classroom_management_decor') return { subjects: ['planning'], skills: ['communication', 'reflection'] };
        if (c === 'ela_graphic_organizers') return { subjects: ['language'], skills: ['reading', 'writing', 'analysis'] };
        return { subjects: ['project'], skills: ['communication'] };
    }

    function buildTemplateCardsFromCatalog(catalog) {
        const list = Array.isArray(catalog) ? catalog : [];
        const seenFamily = new Set();
        return list
            .filter((tpl) => {
                const key = `${tpl.category || ''}::${tpl.familyKey || tpl.id || ''}`;
                if (seenFamily.has(key)) return false;
                seenFamily.add(key);
                return true;
            })
            .map((tpl, index) => {
                const mappedGrade = mapGradeBandToFilters(tpl.gradeBand);
                const mappedCategory = mapCategoryToSubjectsSkills(tpl.category);
                const title = String(tpl.title || 'Template').trim();
                const desc = `${tpl.id || ''} • ${tpl.category || '-'} • ${tpl.format || 'worksheet'}`;
                const item = {
                    key: `catalog_${tpl.id}`,
                    title,
                    desc,
                    category: tpl.category || '',
                    familyKey: tpl.familyKey || '',
                    variantIndex: Number.isFinite(tpl.variantIndex) ? tpl.variantIndex : 0,
                    gradeBands: mappedGrade.gradeBands,
                    grades: mappedGrade.grades,
                    subjects: mappedCategory.subjects,
                    skills: mappedCategory.skills,
                    difficulty: (tpl.tags || []).find(tag => String(tag).startsWith('difficulty-'))
                        ? String((tpl.tags || []).find(tag => String(tag).startsWith('difficulty-'))).replace('difficulty-', '')
                        : 'beginner',
                    format: tpl.format || 'worksheet',
                    isFeatured: index < 24,
                    isNew: (tpl.tags || []).includes('cohort-new'),
                    popularityScore: 60 + ((index * 7) % 36),
                    catalogTemplate: tpl,
                };
                item.searchText = `${item.title} ${item.desc} ${(tpl.tags || []).join(' ')} ${item.subjects.join(' ')} ${item.skills.join(' ')}`.toLowerCase();
                return item;
            });
    }

    function buildTemplateCardsFromCurated(catalog) {
        const list = Array.isArray(catalog) ? catalog : [];
        return list.map((tpl, index) => {
            const item = {
                key: `curated_${tpl.id}`,
                title: String(tpl.title || 'Curated Template').trim(),
                desc: String(tpl.desc || `${tpl.id || ''} • curated`).trim(),
                category: String(tpl.category || 'curated_worksheet').trim(),
                subCategory: String(tpl.subCategory || '').trim(),
                gradeBands: Array.isArray(tpl.gradeBands) && tpl.gradeBands.length ? tpl.gradeBands : ['elementary', 'middle', 'high', 'adult'],
                grades: Array.isArray(tpl.grades) && tpl.grades.length ? tpl.grades : ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'],
                subjects: Array.isArray(tpl.subjects) && tpl.subjects.length ? tpl.subjects : ['project'],
                skills: Array.isArray(tpl.skills) && tpl.skills.length ? tpl.skills : ['communication'],
                difficulty: tpl.difficulty || 'beginner',
                format: tpl.format || 'worksheet',
                isFeatured: index < 6,
                isNew: true,
                popularityScore: 88 - Math.min(24, index * 2),
                thumbnail: tpl.thumbnail || '',
                curatedTemplate: tpl,
            };
            item.searchText = `${item.title} ${item.desc} ${(tpl.tags || []).join(' ')} ${item.category} ${item.subCategory} ${item.subjects.join(' ')} ${item.skills.join(' ')}`.toLowerCase();
            return item;
        });
    }

    const templateCards = [
        ...baseTemplateCards.map(normalizeTemplateMeta),
        ...buildTemplateCardsFromCatalog(newVisualCatalog),
        ...buildTemplateCardsFromCurated(curatedTemplateCatalog),
    ];

    const templateFilterState = {
        segment: 'all',
        subjects: new Set(),
        skills: new Set(),
    };
    let lastGeneratedCatalogTemplateId = '';
    let lastTemplateViewSignature = '';

    function emitTelemetry(eventName, payload = {}) {
        window.wbTrackTelemetry?.(eventName, payload);
    }

    function downloadTelemetrySnapshot(snapshot) {
        const payload = {
            exportedAt: Date.now(),
            templateTelemetry: snapshot || { counts: {}, events: [], lastUpdatedAt: 0 },
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartws-telemetry-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function updateTelemetryPanel() {
        const meta = document.getElementById('templateTelemetryMeta');
        const top = document.getElementById('templateTelemetryTop');
        if (!meta || !top) return;
        const snapshot = window.wbGetTelemetrySnapshot?.() || { counts: {}, events: [], lastUpdatedAt: 0 };
        const total = Array.isArray(snapshot.events) ? snapshot.events.length : 0;
        const last = snapshot.lastUpdatedAt
            ? new Date(snapshot.lastUpdatedAt).toLocaleString('th-TH')
            : '-';
        const topEvents = Object.entries(snapshot.counts || {})
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .slice(0, 3)
            .map(([name, count]) => `${name}:${count}`)
            .join(' • ');
        meta.textContent = `events: ${total} • last: ${last}`;
        top.textContent = `top events: ${topEvents || '-'}`;
    }

    const borderCards = [
        { key: 'simple', title: 'Simple Border', desc: 'กรอบเส้นเดี่ยวเรียบง่าย', group: 'Basic' },
        { key: 'double', title: 'Double Border', desc: 'กรอบเส้นคู่ยอดนิยม', group: 'Basic' },
        { key: 'triple', title: 'Triple Border', desc: 'กรอบเส้นสามชั้น', group: 'Basic' },
        { key: 'inkSaver', title: 'Ink Saver Border', desc: 'กรอบประหยัดหมึกแบบบาง', group: 'Basic' },
        { key: 'dashed', title: 'Dashed Border', desc: 'กรอบเส้นประแบบ Worksheet', group: 'Basic' },
        { key: 'dotted', title: 'Dotted Border', desc: 'กรอบจุดสไตล์น่ารัก', group: 'Basic' },
        { key: 'wavy', title: 'Wavy Border', desc: 'กรอบเส้นคลื่น', group: 'Basic' },
        { key: 'zigzag', title: 'Zigzag Border', desc: 'กรอบซิกแซกแบบกิจกรรม', group: 'Basic' },
        { key: 'stitch', title: 'Stitch Border', desc: 'กรอบเย็บผ้าแบบเส้นสั้น', group: 'Basic' },
        { key: 'geo', title: 'Geometric Border', desc: 'กรอบลายเรขาคณิต', group: 'Decorative' },
        { key: 'doodle', title: 'Doodle Border', desc: 'กรอบวาดมือ (hand-drawn)', group: 'Decorative' },
        { key: 'school', title: 'School Theme Border', desc: 'ธีมโรงเรียน ดินสอ/ดาว', group: 'Decorative' },
        { key: 'polka', title: 'Polka Dot Border', desc: 'กรอบลายจุด', group: 'Decorative' },
        { key: 'chevron', title: 'Chevron Border', desc: 'กรอบลายเชฟรอน', group: 'Decorative' },
        { key: 'stars', title: 'Star Border', desc: 'กรอบประดับดาว', group: 'Decorative' },
        { key: 'ribbon', title: 'Ribbon Border', desc: 'กรอบริบบิ้นสองชั้น', group: 'Decorative' },
        { key: 'scallop', title: 'Scallop Border', desc: 'กรอบโค้งลูกไม้', group: 'Decorative' },
        { key: 'corners', title: 'Corner Accent', desc: 'ตกแต่งเฉพาะมุมกระดาษ', group: 'Corner' },
        { key: 'cornerDots', title: 'Corner Dots', desc: 'จุดมุมกระดาษ', group: 'Corner' },
        { key: 'cornerBrackets', title: 'Corner Brackets', desc: 'วงเล็บมุมเอกสาร', group: 'Corner' },
    ];

    const premiumBorderCards = Array.isArray(window.SMARTWS_PREMIUM_BORDERS)
        ? window.SMARTWS_PREMIUM_BORDERS
        : [];
    const allBorderCards = [...borderCards, ...premiumBorderCards];

    function activateSidebarTab(tabId) {
        const tabs = Array.from(document.querySelectorAll('.sidebar-tab'));
        const panels = Array.from(document.querySelectorAll('.sidebar-tab-content'));
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        panels.forEach(p => p.classList.toggle('active', p.id === tabId));
    }

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
            const actionLabel = item.curatedTemplate ? 'เพิ่มเทมเพลต' : 'ใช้เทมเพลต';
            el.innerHTML = `${item.thumbnail ? `<img class="template-card-thumb" src="${item.thumbnail}" alt="${item.title}" />` : ''}<div class="template-card-title">${item.title}</div><div class="template-card-desc">${item.desc}</div><button class="template-card-action" type="button">${actionLabel}</button>`;
            const actionBtn = el.querySelector('.template-card-action');
            actionBtn?.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                onClick(item);
            });
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
            category: document.getElementById('templateCategoryFilter')?.value || 'all',
            themeKeyword: (document.getElementById('templateThemeKeyword')?.value || '').trim().toLowerCase(),
            iconMode: document.getElementById('templateIconMode')?.value || 'random',
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
        if (state.category !== 'all' && String(item.category || '') !== state.category) return -1;
        if (state.gradeBand !== 'all' && !item.gradeBands.includes(state.gradeBand)) return -1;
        if (state.grade !== 'all' && !item.grades.includes(state.grade)) return -1;
        if (state.difficulty !== 'all' && item.difficulty !== state.difficulty) return -1;
        if (state.format !== 'all' && item.format !== state.format) return -1;
        if (!includesAny(item.subjects, state.subjects)) return -1;
        if (!includesAny(item.skills, state.skills)) return -1;
        if (state.search && !item.searchText.includes(state.search)) return -1;
        if (state.themeKeyword && !item.searchText.includes(state.themeKeyword)) return -1;
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

        const curatedGroupOrder = {
            handwriting: 1,
            fillblank: 2,
            matching: 3,
            reading: 4,
            math: 5,
            science: 6,
            organizer: 7,
            assessment: 8,
            planner: 9,
            activity: 10,
            mindmap: 11,
        };
        const curatedRank = (entry) => {
            if (!entry?.item?.curatedTemplate) return 99;
            const key = String(entry.item.subCategory || '').trim().toLowerCase();
            return curatedGroupOrder[key] || 50;
        };
        const blockRank = (entry) => (entry?.item?.curatedTemplate ? 0 : 1);

        if (state.segment === 'popular') {
            ranked.sort((a, b) => {
                if (state.category === 'all') {
                    const blockDiff = blockRank(a) - blockRank(b);
                    if (blockDiff !== 0) return blockDiff;
                }
                const curatedDiff = curatedRank(a) - curatedRank(b);
                if (curatedDiff !== 0) return curatedDiff;
                return b.item.popularityScore - a.item.popularityScore || b.score - a.score;
            });
        } else {
            ranked.sort((a, b) => {
                if (state.category === 'all') {
                    const blockDiff = blockRank(a) - blockRank(b);
                    if (blockDiff !== 0) return blockDiff;
                }
                const curatedDiff = curatedRank(a) - curatedRank(b);
                if (curatedDiff !== 0) return curatedDiff;
                return b.score - a.score || b.item.popularityScore - a.item.popularityScore;
            });
        }
        return ranked.map(entry => entry.item);
    }

    function pickPrimaryCatalogTemplate(state) {
        const list = filterAndSortTemplates(state)
            .filter(item => !!item.catalogTemplate)
            .map(item => item.catalogTemplate);
        if (!list.length) return null;
        const topPool = list.slice(0, Math.min(12, list.length));
        let candidates = topPool.filter(item => item.id !== lastGeneratedCatalogTemplateId);
        if (!candidates.length) candidates = topPool;
        const picked = candidates[Math.floor(Math.random() * candidates.length)] || topPool[0];
        lastGeneratedCatalogTemplateId = picked?.id || '';
        return picked || null;
    }

    function updateTemplateSummary(total, shown, state) {
        const summary = document.getElementById('templateResultSummary');
        if (!summary) return;
        summary.textContent = `แสดง ${shown}/${total} เทมเพลต • Segment: ${state.segment}`;
    }

    function refreshTemplateGallery() {
        const state = buildTemplateFilterState();
        const list = filterAndSortTemplates(state);
        const signature = [
            state.segment,
            state.category,
            state.gradeBand,
            state.grade,
            state.difficulty,
            state.format,
            state.search,
            state.themeKeyword,
            state.iconMode,
            [...state.subjects].sort().join(','),
            [...state.skills].sort().join(','),
            list.length,
        ].join('|');
        if (signature !== lastTemplateViewSignature) {
            lastTemplateViewSignature = signature;
            emitTelemetry('template_gallery_view', {
                shown: list.length,
                total: templateCards.length,
                segment: state.segment,
                category: state.category,
                gradeBand: state.gradeBand,
                grade: state.grade,
                difficulty: state.difficulty,
                format: state.format,
                hasSearch: !!state.search,
                hasThemeKeyword: !!state.themeKeyword,
                subjectCount: state.subjects.size,
                skillCount: state.skills.size,
            });
        }
        buildCardGallery('templateGallery', list, (item) => {
            const select = document.getElementById('templateSelect');
            if (select && !item.catalogTemplate && !item.curatedTemplate) select.value = item.key;
            emitTelemetry('template_apply_requested', {
                source: 'template_gallery',
                template: item.curatedTemplate?.id || item.catalogTemplate?.id || item.key,
            });
            if (item.curatedTemplate) {
                const currentObjects = canvas.getObjects().length;
                let mode = 'replace';
                if (currentObjects > 0) {
                    const shouldAddPage = window.confirm('ต้องการเพิ่มเทมเพลตนี้เป็นหน้าใหม่หรือไม่?\nกด "ตกลง" = หน้าใหม่\nกด "ยกเลิก" = แทนที่หน้าปัจจุบัน');
                    if (shouldAddPage) {
                        mode = 'new-page';
                    } else {
                        const confirmReplace = window.confirm('แทนที่หน้าปัจจุบันด้วยเทมเพลตนี้ใช่หรือไม่?');
                        if (!confirmReplace) return;
                    }
                }
                window.wbApplyCuratedTemplate?.(item.curatedTemplate.id, {
                    mode,
                    skipConfirm: true,
                });
            } else if (item.catalogTemplate) {
                addWaveATemplateFromCatalog(item.catalogTemplate, getTemplateGenerationOptions());
            } else {
                window.wbApplyTemplate?.(item.key);
            }
            markSaving();
            updateTelemetryPanel();
        });
        updateTemplateSummary(templateCards.length, list.length, state);
        updateTelemetryPanel();
    }

    function resetTemplateFilters() {
        const search = document.getElementById('templateSearch');
        const band = document.getElementById('templateGradeBand');
        const category = document.getElementById('templateCategoryFilter');
        const grade = document.getElementById('templateGrade');
        const difficulty = document.getElementById('templateDifficulty');
        const format = document.getElementById('templateFormat');
        const themeKeyword = document.getElementById('templateThemeKeyword');
        const iconMode = document.getElementById('templateIconMode');
        if (search) search.value = '';
        if (category) category.value = 'all';
        if (band) band.value = 'all';
        syncGradeOptions();
        if (grade) grade.value = 'all';
        if (difficulty) difficulty.value = 'all';
        if (format) format.value = 'all';
        if (themeKeyword) themeKeyword.value = '';
        if (iconMode) iconMode.value = 'random';
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
        } else if (kind === 'inkSaver') {
            const outer = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const inner = new fabric.Rect({ left: left + 12, top: top + 12, width: width - 24, height: height - 24, fill: 'transparent', stroke, strokeWidth: 0.8 });
            border = new fabric.Group([outer, inner], { objectCaching: false });
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
        } else if (kind === 'school') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.4 });
            const starPath = 'M 0 -4 L 1.3 -1.3 L 4 -1.3 L 2 0.6 L 2.7 3.8 L 0 2.2 L -2.7 3.8 L -2 0.6 L -4 -1.3 L -1.3 -1.3 Z';
            const deco = [];
            for (let i = 0; i < 10; i++) {
                const x = left + 20 + i * ((width - 40) / 9);
                deco.push(new fabric.Path(starPath, { left: x, top: top + 6, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
                deco.push(new fabric.Path(starPath, { left: x, top: top + height - 10, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
            }
            border = new fabric.Group([base, ...deco], { objectCaching: false });
        } else if (kind === 'polka') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const dots = [];
            for (let x = left + 12; x <= left + width - 12; x += 24) {
                dots.push(new fabric.Circle({ left: x, top: top + 4, radius: 2.2, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
                dots.push(new fabric.Circle({ left: x, top: top + height - 8, radius: 2.2, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
            }
            for (let y = top + 20; y <= top + height - 20; y += 24) {
                dots.push(new fabric.Circle({ left: left + 4, top: y, radius: 2.2, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
                dots.push(new fabric.Circle({ left: left + width - 8, top: y, radius: 2.2, fill: stroke, stroke: 'transparent', selectable: false, evented: false }));
            }
            border = new fabric.Group([base, ...dots], { objectCaching: false });
        } else if (kind === 'chevron') {
            const mkChevron = (x1, x2, y, depth = 7, size = 18) => {
                const seg = [];
                let x = x1;
                let idx = 0;
                while (x <= x2) {
                    const yOffset = idx % 2 === 0 ? -depth : depth;
                    seg.push(`${idx === 0 ? 'M' : 'L'} ${x} ${y + yOffset}`);
                    x += size;
                    idx += 1;
                }
                return new fabric.Path(seg.join(' '), { fill: 'transparent', stroke, strokeWidth: 1.8 });
            };
            border = new fabric.Group([
                mkChevron(left, left + width, top + 6),
                mkChevron(left, left + width, top + height - 6),
                new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 }),
            ], { objectCaching: false });
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
        } else if (kind === 'floral') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.4 });
            const flowers = [];
            const count = Math.max(8, Math.floor(width / 90));
            for (let i = 0; i <= count; i++) {
                const x = left + (width * i) / count;
                flowers.push(new fabric.Circle({ left: x - 3, top: top - 3, radius: 3, fill: stroke, stroke: 'transparent' }));
                flowers.push(new fabric.Circle({ left: x - 3, top: top + height - 3, radius: 3, fill: stroke, stroke: 'transparent' }));
            }
            border = new fabric.Group([base, ...flowers], { objectCaching: false });
        } else if (kind === 'leafy') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.4 });
            const leaves = [];
            const step = 42;
            for (let x = left + 18; x < left + width - 18; x += step) {
                leaves.push(new fabric.Path(`M ${x} ${top + 2} Q ${x + 8} ${top + 10} ${x} ${top + 18} Q ${x - 8} ${top + 10} ${x} ${top + 2}`, { fill: 'transparent', stroke, strokeWidth: 1.2 }));
                leaves.push(new fabric.Path(`M ${x} ${top + height - 2} Q ${x + 8} ${top + height - 10} ${x} ${top + height - 18} Q ${x - 8} ${top + height - 10} ${x} ${top + height - 2}`, { fill: 'transparent', stroke, strokeWidth: 1.2 }));
            }
            border = new fabric.Group([base, ...leaves], { objectCaching: false });
        } else if (kind === 'hearts') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const hearts = [];
            const path = 'M 0 2 C 0 -3 7 -3 7 2 C 7 5 4 8 0 11 C -4 8 -7 5 -7 2 C -7 -3 0 -3 0 2 Z';
            for (let x = left + 16; x < left + width - 10; x += 34) {
                hearts.push(new fabric.Path(path, { left: x, top: top + 2, fill: 'transparent', stroke, strokeWidth: 1.2 }));
                hearts.push(new fabric.Path(path, { left: x, top: top + height - 16, fill: 'transparent', stroke, strokeWidth: 1.2 }));
            }
            border = new fabric.Group([base, ...hearts], { objectCaching: false });
        } else if (kind === 'snow') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const flakes = [];
            const makeFlake = (x, y) => new fabric.Group([
                new fabric.Line([x - 5, y, x + 5, y], { stroke, strokeWidth: 1.2 }),
                new fabric.Line([x, y - 5, x, y + 5], { stroke, strokeWidth: 1.2 }),
                new fabric.Line([x - 4, y - 4, x + 4, y + 4], { stroke, strokeWidth: 1.2 }),
                new fabric.Line([x - 4, y + 4, x + 4, y - 4], { stroke, strokeWidth: 1.2 }),
            ], { objectCaching: false });
            for (let x = left + 18; x < left + width - 18; x += 44) {
                flakes.push(makeFlake(x, top + 10));
                flakes.push(makeFlake(x, top + height - 10));
            }
            border = new fabric.Group([base, ...flakes], { objectCaching: false });
        } else if (kind === 'pumpkin') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const pumpkins = [];
            for (let x = left + 16; x < left + width - 12; x += 40) {
                pumpkins.push(new fabric.Circle({ left: x, top: top + 2, radius: 5, fill: 'transparent', stroke, strokeWidth: 1.1 }));
                pumpkins.push(new fabric.Circle({ left: x, top: top + height - 12, radius: 5, fill: 'transparent', stroke, strokeWidth: 1.1 }));
            }
            border = new fabric.Group([base, ...pumpkins], { objectCaching: false });
        } else if (kind === 'pencil') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const lines = [];
            for (let x = left + 8; x < left + width - 8; x += 28) {
                lines.push(new fabric.Line([x, top, x + 10, top + 12], { stroke, strokeWidth: 1.3 }));
                lines.push(new fabric.Line([x, top + height, x + 10, top + height - 12], { stroke, strokeWidth: 1.3 }));
            }
            border = new fabric.Group([base, ...lines], { objectCaching: false });
        } else if (kind === 'apple') {
            const base = new fabric.Rect({ left, top, width, height, fill: 'transparent', stroke, strokeWidth: 1.2 });
            const apples = [];
            const path = 'M 0 8 C -6 8 -7 1 -3 -3 C -1 -5 2 -5 4 -3 C 8 1 7 8 1 8 Z M 1 -5 L 2 -9';
            for (let x = left + 16; x < left + width - 12; x += 40) {
                apples.push(new fabric.Path(path, { left: x, top: top + 2, fill: 'transparent', stroke, strokeWidth: 1.1 }));
                apples.push(new fabric.Path(path, { left: x, top: top + height - 16, fill: 'transparent', stroke, strokeWidth: 1.1 }));
            }
            border = new fabric.Group([base, ...apples], { objectCaching: false });
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

    function buildWorksheetFrame(opts = {}) {
        const left = Number.isFinite(opts.left) ? opts.left : 90;
        const titleTop = Number.isFinite(opts.titleTop) ? opts.titleTop : 72;
        const bodyTop = Number.isFinite(opts.bodyTop) ? opts.bodyTop : 150;
        const width = Number.isFinite(opts.width) ? opts.width : Math.max(540, (canvas.width || 900) - left * 2);
        const title = String(opts.title || 'Worksheet');
        const subtitle = String(opts.subtitle || '').trim();
        const instructions = String(opts.instructions || '').trim();

        canvas.add(new fabric.IText(title, { left, top: titleTop, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        if (subtitle) {
            canvas.add(new fabric.IText(subtitle, { left, top: titleTop + 42, fontFamily: 'Sarabun', fontSize: 16, fill: '#475569' }));
        }
        if (instructions) {
            canvas.add(new fabric.IText(instructions, { left, top: bodyTop - 32, fontFamily: 'Sarabun', fontSize: 16, fill: '#64748b' }));
        }
        return {
            left,
            width,
            bodyTop,
        };
    }

    function renderQuestionBlocks(items, layout = {}) {
        const left = Number.isFinite(layout.left) ? layout.left : 90;
        const top = Number.isFinite(layout.top) ? layout.top : 150;
        const width = Number.isFinite(layout.width) ? layout.width : Math.max(560, (canvas.width || 900) - 180);
        const rowHeight = Number.isFinite(layout.rowHeight) ? layout.rowHeight : 58;
        const columns = Math.min(3, Math.max(1, Number(layout.columns) || 1));
        const fontSize = Number.isFinite(layout.fontSize) ? layout.fontSize : 22;
        const answerLine = layout.answerLine !== false;
        const answers = [];
        const colGap = Number.isFinite(layout.colGap) ? layout.colGap : 20;
        const colWidth = (width - (columns - 1) * colGap) / columns;

        (items || []).forEach((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = left + col * (colWidth + colGap);
            const y = top + row * rowHeight;
            const label = String(item?.label || `${index + 1})`);
            const text = String(item?.text || '').trim();
            const answer = String(item?.answer || '').trim();
            const lineText = `${label} ${text}`.trim();
            const node = new fabric.IText(lineText, {
                left: x,
                top: y,
                fontFamily: 'Sarabun',
                fontSize,
                fill: '#334155',
                width: colWidth,
                data: {
                    answerOnly: false,
                    answer,
                    generator: String(layout.generator || ''),
                },
            });
            canvas.add(node);
            if (answer) answers.push({ index: index + 1, answer });

            if (answerLine) {
                const lineY = y + Math.max(28, fontSize + 8);
                canvas.add(new fabric.Line([x + 22, lineY, x + colWidth - 10, lineY], {
                    stroke: '#cbd5e1',
                    strokeWidth: 1.2,
                    strokeDashArray: [7, 6],
                    selectable: false,
                    evented: false,
                }));
            }
        });

        return answers;
    }

    function renderAnswerKeyPage(answerItems, opts = {}) {
        if (!Array.isArray(answerItems) || !answerItems.length) return;
        const left = Number.isFinite(opts.left) ? opts.left : 90;
        const top = Number.isFinite(opts.top) ? opts.top : 120;
        const title = String(opts.title || 'Answer Key');
        const max = Math.min(answerItems.length, Number.isFinite(opts.maxItems) ? opts.maxItems : 24);

        canvas.add(new fabric.IText(title, {
            left,
            top,
            fontFamily: 'Fredoka',
            fontSize: 30,
            fill: '#0f172a',
            data: { answerOnly: true },
        }));

        for (let i = 0; i < max; i++) {
            const item = answerItems[i];
            canvas.add(new fabric.IText(`${item.index}) ${item.answer}`, {
                left,
                top: top + 52 + i * 34,
                fontFamily: 'Sarabun',
                fontSize: 19,
                fill: '#334155',
                data: { answerOnly: true },
            }));
        }
    }

    function shouldIncludeAnswerKey(defaultValue = true) {
        const raw = window.prompt('Include Answer Key? (yes/no)', defaultValue ? 'yes' : 'no');
        if (raw === null) return null;
        return /^y|yes|1|true|ok$/i.test(String(raw).trim());
    }

    function normalizeWordList(raw, limit = 24) {
        return String(raw || '')
            .split(',')
            .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
            .filter(Boolean)
            .filter((w, i, arr) => arr.indexOf(w) === i)
            .slice(0, limit);
    }

    function shuffleWord(word) {
        const arr = String(word || '').split('');
        if (arr.length < 2) return String(word || '');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = getRandomInt(0, i);
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        const result = arr.join('');
        return result === word ? arr.reverse().join('') : result;
    }

    function addWordScrambleGenerator() {
        const raw = window.prompt('ใส่คำศัพท์สำหรับสลับคำ (comma)', 'APPLE,BANANA,ORANGE,TEACHER,STUDENT,LESSON');
        if (raw === null) return { status: 'cancelled' };
        const words = normalizeWordList(raw, 24);
        if (!words.length) return { status: 'cancelled' };
        const includeAnswerKey = shouldIncludeAnswerKey(true);
        if (includeAnswerKey === null) return { status: 'cancelled' };

        const frame = buildWorksheetFrame({
            title: 'Word Scramble',
            subtitle: 'Unscramble the words',
            instructions: 'เรียงตัวอักษรให้เป็นคำที่ถูกต้อง',
            bodyTop: 150,
        });

        const items = words.map((word, i) => ({
            label: `${i + 1})`,
            text: shuffleWord(word),
            answer: word,
        }));
        const answers = renderQuestionBlocks(items, {
            left: frame.left,
            top: frame.bodyTop,
            width: frame.width,
            rowHeight: 56,
            columns: 2,
            fontSize: 22,
            generator: 'word_scramble',
        });
        if (includeAnswerKey) {
            window.wbGenerateAnswerKeyPage?.();
            if (!window.wbGenerateAnswerKeyPage) renderAnswerKeyPage(answers, { title: 'Word Scramble Answer Key' });
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`เพิ่ม Word Scramble แล้ว (${words.length} ข้อ)`);
        return { status: 'success', count: words.length };
    }

    function addCryptogramGenerator() {
        const phraseRaw = window.prompt('ใส่ประโยคสำหรับ Cryptogram', 'LEARNING NEVER STOPS');
        if (phraseRaw === null) return { status: 'cancelled' };
        const phrase = String(phraseRaw || '').toUpperCase().replace(/[^A-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();
        if (!phrase) return { status: 'cancelled' };
        const includeAnswerKey = shouldIncludeAnswerKey(true);
        if (includeAnswerKey === null) return { status: 'cancelled' };

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const shuffled = alphabet.slice().sort(() => Math.random() - 0.5);
        const map = {};
        alphabet.forEach((ch, idx) => {
            map[ch] = shuffled[idx];
        });
        const encoded = phrase
            .split('')
            .map(ch => (/[A-Z]/.test(ch) ? map[ch] : ch))
            .join('');

        const frame = buildWorksheetFrame({
            title: 'Cryptogram',
            subtitle: 'Decode the message',
            instructions: 'ถอดรหัสข้อความด้านล่าง',
            bodyTop: 168,
        });
        canvas.add(new fabric.IText(`Cipher: ${encoded}`, {
            left: frame.left,
            top: frame.bodyTop,
            fontFamily: 'Sarabun',
            fontSize: 26,
            fill: '#1f2937',
            data: { answerOnly: false, answer: phrase, generator: 'cryptogram' },
        }));
        for (let i = 0; i < 8; i++) {
            const y = frame.bodyTop + 62 + i * 44;
            canvas.add(new fabric.Line([frame.left, y, frame.left + frame.width, y], {
                stroke: '#cbd5e1',
                strokeWidth: 1.2,
                strokeDashArray: [7, 5],
            }));
        }
        if (includeAnswerKey) {
            window.wbGenerateAnswerKeyPage?.();
            if (!window.wbGenerateAnswerKeyPage) renderAnswerKeyPage([{ index: 1, answer: phrase }], { title: 'Cryptogram Answer Key' });
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Cryptogram แล้ว');
        return { status: 'success', count: 1 };
    }

    function addMissingLettersGenerator() {
        const raw = window.prompt('ใส่คำศัพท์สำหรับ Missing Letters (comma)', 'CAT,DOG,SCHOOL,MATH,SCIENCE,READING');
        if (raw === null) return { status: 'cancelled' };
        const words = normalizeWordList(raw, 20).filter(w => w.length >= 3);
        if (!words.length) return { status: 'cancelled' };
        const includeAnswerKey = shouldIncludeAnswerKey(true);
        if (includeAnswerKey === null) return { status: 'cancelled' };

        const frame = buildWorksheetFrame({
            title: 'Missing Letters',
            subtitle: 'Fill in the missing letters',
            instructions: 'เติมตัวอักษรที่หายไปให้เป็นคำที่ถูกต้อง',
            bodyTop: 154,
        });

        const items = words.map((word, i) => {
            const chars = word.split('');
            const hideCount = Math.min(2, Math.max(1, Math.floor(chars.length / 4)));
            const positions = [];
            while (positions.length < hideCount) {
                const pos = getRandomInt(1, Math.max(1, chars.length - 2));
                if (!positions.includes(pos)) positions.push(pos);
            }
            positions.forEach(pos => {
                chars[pos] = '_';
            });
            return {
                label: `${i + 1})`,
                text: chars.join(' '),
                answer: word,
            };
        });

        const answers = renderQuestionBlocks(items, {
            left: frame.left,
            top: frame.bodyTop,
            width: frame.width,
            rowHeight: 58,
            columns: 2,
            fontSize: 24,
            generator: 'missing_letters',
        });
        if (includeAnswerKey) {
            window.wbGenerateAnswerKeyPage?.();
            if (!window.wbGenerateAnswerKeyPage) renderAnswerKeyPage(answers, { title: 'Missing Letters Answer Key' });
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`เพิ่ม Missing Letters แล้ว (${words.length} ข้อ)`);
        return { status: 'success', count: words.length };
    }

    function addMultipleChoiceQuizGenerator() {
        const topicRaw = window.prompt('หัวข้อแบบทดสอบ', 'Reading Comprehension');
        if (topicRaw === null) return { status: 'cancelled' };
        const topic = String(topicRaw || '').trim() || 'General Knowledge';
        const count = Math.min(20, Math.max(4, Number(window.prompt('จำนวนข้อ MCQ', '10')) || 10));
        const includeAnswerKey = shouldIncludeAnswerKey(true);
        if (includeAnswerKey === null) return { status: 'cancelled' };

        const frame = buildWorksheetFrame({
            title: 'Multiple Choice Quiz',
            subtitle: topic,
            instructions: 'เลือกคำตอบที่ถูกต้องที่สุดในแต่ละข้อ',
            bodyTop: 150,
        });

        const options = ['A', 'B', 'C', 'D'];
        const answers = [];
        for (let i = 0; i < count; i++) {
            const y = frame.bodyTop + i * 66;
            const correct = options[getRandomInt(0, options.length - 1)];
            answers.push({ index: i + 1, answer: correct });
            canvas.add(new fabric.IText(`${i + 1}) ${topic} question ${i + 1}`, {
                left: frame.left,
                top: y,
                fontFamily: 'Sarabun',
                fontSize: 21,
                fill: '#334155',
                data: { answerOnly: false, answer: correct, generator: 'multiple_choice' },
            }));
            canvas.add(new fabric.IText('A) ______   B) ______   C) ______   D) ______', {
                left: frame.left + 20,
                top: y + 30,
                fontFamily: 'Sarabun',
                fontSize: 18,
                fill: '#64748b',
            }));
        }

        if (includeAnswerKey) {
            window.wbGenerateAnswerKeyPage?.();
            if (!window.wbGenerateAnswerKeyPage) renderAnswerKeyPage(answers, { title: 'Multiple Choice Answer Key' });
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`เพิ่ม Multiple Choice แล้ว (${count} ข้อ)`);
        return { status: 'success', count };
    }

    function addShortAnswerExitTicketGenerator() {
        const modeRaw = window.prompt('โหมด: short หรือ exit-ticket', 'exit-ticket');
        if (modeRaw === null) return { status: 'cancelled' };
        const mode = String(modeRaw || '').trim().toLowerCase().includes('short') ? 'short' : 'exit';
        const count = Math.min(12, Math.max(3, Number(window.prompt('จำนวนข้อ', mode === 'short' ? '6' : '4')) || (mode === 'short' ? 6 : 4)));
        const title = mode === 'short' ? 'Short Answer Worksheet' : 'Exit Ticket';
        const frame = buildWorksheetFrame({
            title,
            subtitle: mode === 'short' ? 'ตอบคำถามสั้น' : 'สรุปท้ายคาบ',
            instructions: mode === 'short' ? 'ตอบเป็นประโยคสั้น ๆ' : 'ตอบคำถามสะท้อนผลการเรียนรู้',
            bodyTop: 162,
        });

        const items = Array.from({ length: count }, (_, i) => ({
            label: `${i + 1})`,
            text: mode === 'short' ? 'Answer in 1-2 sentences' : ['Today I learned...', 'One thing still unclear...', 'My confidence (1-5)...', 'Next step...'][i % 4],
            answer: '',
        }));
        renderQuestionBlocks(items, {
            left: frame.left,
            top: frame.bodyTop,
            width: frame.width,
            rowHeight: mode === 'short' ? 74 : 82,
            columns: 1,
            fontSize: 20,
            generator: 'short_answer_exit_ticket',
        });
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`เพิ่ม ${title} แล้ว`);
        return { status: 'success', count };
    }

    function addAbcOrderCutGlueGenerator() {
        const raw = window.prompt('ใส่คำศัพท์สำหรับ ABC Order (comma)', 'banana,apple,grape,orange,kiwi,melon');
        if (raw === null) return { status: 'cancelled' };
        const words = String(raw || '')
            .split(',')
            .map(w => w.trim())
            .filter(Boolean)
            .slice(0, 18);
        if (!words.length) return { status: 'cancelled' };
        const shuffled = words.slice().sort(() => Math.random() - 0.5);

        const frame = buildWorksheetFrame({
            title: 'ABC Order Cut & Glue',
            subtitle: 'เรียงคำตามลำดับตัวอักษร',
            instructions: 'ตัดคำด้านล่าง แล้วเรียงใส่ช่องให้ถูกต้อง',
            bodyTop: 166,
        });

        const colWidth = frame.width / 2 - 16;
        const slotTop = frame.bodyTop;
        const rows = Math.min(9, words.length);
        for (let i = 0; i < rows; i++) {
            const y = slotTop + i * 50;
            canvas.add(new fabric.IText(`${i + 1})`, { left: frame.left, top: y + 8, fontFamily: 'Sarabun', fontSize: 18, fill: '#334155' }));
            canvas.add(new fabric.Rect({ left: frame.left + 34, top: y, width: colWidth - 36, height: 38, fill: 'transparent', stroke: '#334155', strokeWidth: 1.1 }));
        }

        const cutX = frame.left + colWidth + 20;
        canvas.add(new fabric.IText('Cut words', { left: cutX, top: slotTop - 30, fontFamily: 'Sarabun', fontSize: 16, fill: '#475569' }));
        shuffled.forEach((word, idx) => {
            const y = slotTop + idx * 42;
            canvas.add(new fabric.Rect({ left: cutX, top: y, width: colWidth - 24, height: 34, fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1, strokeDashArray: [6, 5] }));
            canvas.add(new fabric.IText(word, {
                left: cutX + 10,
                top: y + 8,
                fontFamily: 'Sarabun',
                fontSize: 18,
                fill: '#334155',
                data: { answerOnly: false, answer: words.slice().sort((a, b) => a.localeCompare(b))[idx] || '', generator: 'abc_order' },
            }));
        });

        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`เพิ่ม ABC Order แล้ว (${words.length} คำ)`);
        return { status: 'success', count: words.length };
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

    function addTracingWorksheet() {
        const text = String(window.prompt('ข้อความฝึกคัดลายมือ', 'Aa Bb Cc') || 'Aa Bb Cc').trim() || 'Aa Bb Cc';
        const rows = Math.min(10, Math.max(2, Number(window.prompt('จำนวนบรรทัด', '4')) || 4));
        const left = 90;
        const top = 130;
        const width = Math.max(420, (canvas.width || 900) - 180);
        const lineGap = 74;
        canvas.add(new fabric.IText('Tracing Worksheet', { left, top: 72, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let i = 0; i < rows; i++) {
            const y = top + i * lineGap;
            canvas.add(new fabric.Line([left, y, left + width, y], { stroke: '#64748b', strokeWidth: 1.4 }));
            canvas.add(new fabric.Line([left, y + 24, left + width, y + 24], { stroke: '#94a3b8', strokeWidth: 1, strokeDashArray: [6, 5] }));
            canvas.add(new fabric.Line([left, y + 48, left + width, y + 48], { stroke: '#64748b', strokeWidth: 1.4 }));
            canvas.add(new fabric.IText(text, {
                left: left + 12,
                top: y + 4,
                fontFamily: 'Sarabun',
                fontSize: 30,
                fill: '#94a3b8',
                opacity: 0.7,
            }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Tracing worksheet แล้ว');
    }

    function addMatchingWorksheet() {
        const pairCount = Math.min(8, Math.max(3, Number(window.prompt('จำนวนข้อจับคู่', '5')) || 5));
        const leftWords = Array.from({ length: pairCount }, (_, i) => `A${i + 1}`);
        const rightWords = Array.from({ length: pairCount }, (_, i) => `B${i + 1}`).sort(() => Math.random() - 0.5);
        const leftX = 120;
        const rightX = Math.max(420, (canvas.width || 900) - 260);
        const top = 150;
        const gap = 62;
        canvas.add(new fabric.IText('Matching Worksheet', { left: 90, top: 74, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let i = 0; i < pairCount; i++) {
            const y = top + i * gap;
            canvas.add(new fabric.IText(`${i + 1}. ${leftWords[i]}`, { left: leftX, top: y, fontFamily: 'Sarabun', fontSize: 24, fill: '#1e293b' }));
            canvas.add(new fabric.IText(String.fromCharCode(65 + i) + `. ${rightWords[i]}`, { left: rightX, top: y, fontFamily: 'Sarabun', fontSize: 24, fill: '#1e293b' }));
            canvas.add(new fabric.Line([leftX + 150, y + 18, rightX - 16, y + 18], { stroke: '#cbd5e1', strokeWidth: 1.2, strokeDashArray: [8, 6] }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Matching worksheet แล้ว');
    }

    function addFillBlankWorksheet() {
        const title = String(window.prompt('หัวข้อใบงานเติมคำ', 'Fill in the Blank') || 'Fill in the Blank').trim();
        const count = Math.min(14, Math.max(4, Number(window.prompt('จำนวนข้อ', '8')) || 8));
        const left = 90;
        const top = 140;
        const gap = 62;
        canvas.add(new fabric.IText(title || 'Fill in the Blank', { left, top: 74, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let i = 0; i < count; i++) {
            const y = top + i * gap;
            const sentence = `${i + 1}) ________________________________.`;
            canvas.add(new fabric.IText(sentence, {
                left,
                top: y,
                fontFamily: 'Sarabun',
                fontSize: 24,
                fill: '#334155',
            }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Fill-in-the-blank worksheet แล้ว');
    }

    function addBingoCardsWorksheet() {
        const size = (window.prompt('ขนาดบิงโก 3 หรือ 5', '5') || '5').trim() === '3' ? 3 : 5;
        const cards = Math.min(4, Math.max(1, Number(window.prompt('จำนวนการ์ดในหน้า', '2')) || 2));
        const cardW = size === 5 ? 300 : 250;
        const cardH = cardW;
        const cols = cards > 2 ? 2 : cards;
        const gapX = 42;
        const gapY = 66;
        const startX = 70;
        const startY = 140;
        canvas.add(new fabric.IText(`Bingo ${size}x${size}`, { left: 90, top: 72, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));

        for (let i = 0; i < cards; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = startX + col * (cardW + gapX);
            const y = startY + row * (cardH + gapY);
            canvas.add(new fabric.Rect({ left: x, top: y, width: cardW, height: cardH, fill: 'transparent', stroke: '#334155', strokeWidth: 2 }));
            const cell = cardW / size;
            for (let c = 1; c < size; c++) {
                canvas.add(new fabric.Line([x + c * cell, y, x + c * cell, y + cardH], { stroke: '#64748b', strokeWidth: 1.2 }));
            }
            for (let r = 1; r < size; r++) {
                canvas.add(new fabric.Line([x, y + r * cell, x + cardW, y + r * cell], { stroke: '#64748b', strokeWidth: 1.2 }));
            }
            canvas.add(new fabric.IText(`Card ${i + 1}`, { left: x + 8, top: y - 28, fontFamily: 'Sarabun', fontSize: 18, fill: '#334155' }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Bingo cards worksheet แล้ว');
    }

    function addTaskCardsWorksheet() {
        const mode = (window.prompt('รูปแบบการ์ด: 4 หรือ 8 ใบต่อหน้า', '8') || '8').trim() === '4' ? 4 : 8;
        const cols = mode === 4 ? 2 : 2;
        const rows = mode === 4 ? 2 : 4;
        const startX = 80;
        const startY = 130;
        const totalW = Math.max(560, (canvas.width || 900) - 160);
        const totalH = Math.max(760, (canvas.height || 1120) - 220);
        const cardW = totalW / cols;
        const cardH = totalH / rows;
        canvas.add(new fabric.IText(`Task Cards (${mode})`, { left: 90, top: 72, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c + 1;
                const x = startX + c * cardW;
                const y = startY + r * cardH;
                canvas.add(new fabric.Rect({ left: x, top: y, width: cardW, height: cardH, fill: 'transparent', stroke: '#334155', strokeWidth: 1.6 }));
                canvas.add(new fabric.IText(`Card ${idx}`, { left: x + 12, top: y + 10, fontFamily: 'Sarabun', fontSize: 16, fill: '#334155' }));
                canvas.add(new fabric.IText('Question / Prompt', { left: x + 12, top: y + 46, fontFamily: 'Sarabun', fontSize: 20, fill: '#64748b' }));
            }
        }
        for (let c = 1; c < cols; c++) {
            const x = startX + c * cardW;
            canvas.add(new fabric.Line([x, startY, x, startY + totalH], { stroke: '#94a3b8', strokeWidth: 1, strokeDashArray: [8, 6] }));
        }
        for (let r = 1; r < rows; r++) {
            const y = startY + r * cardH;
            canvas.add(new fabric.Line([startX, y, startX + totalW, y], { stroke: '#94a3b8', strokeWidth: 1, strokeDashArray: [8, 6] }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Task Cards แล้ว');
    }

    function addMazePatternWorksheet() {
        const level = (window.prompt('ระดับความยาก: easy, medium, hard', 'medium') || 'medium').trim().toLowerCase();
        const size = level === 'hard' ? 16 : level === 'easy' ? 10 : 13;
        const cell = 42;
        const startX = 90;
        const startY = 160;
        const walls = [];
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        const gridWalls = Array.from({ length: size }, () => Array.from({ length: size }, () => ({ top: true, right: true, bottom: true, left: true })));

        const neighbors = (r, c) => {
            const list = [];
            if (r > 0 && !visited[r - 1][c]) list.push([r - 1, c, 'top']);
            if (c < size - 1 && !visited[r][c + 1]) list.push([r, c + 1, 'right']);
            if (r < size - 1 && !visited[r + 1][c]) list.push([r + 1, c, 'bottom']);
            if (c > 0 && !visited[r][c - 1]) list.push([r, c - 1, 'left']);
            return list;
        };

        const stack = [[0, 0]];
        visited[0][0] = true;
        while (stack.length) {
            const [r, c] = stack[stack.length - 1];
            const next = neighbors(r, c);
            if (!next.length) {
                stack.pop();
                continue;
            }
            const [nr, nc, dir] = next[getRandomInt(0, next.length - 1)];
            if (dir === 'top') {
                gridWalls[r][c].top = false;
                gridWalls[nr][nc].bottom = false;
            } else if (dir === 'right') {
                gridWalls[r][c].right = false;
                gridWalls[nr][nc].left = false;
            } else if (dir === 'bottom') {
                gridWalls[r][c].bottom = false;
                gridWalls[nr][nc].top = false;
            } else {
                gridWalls[r][c].left = false;
                gridWalls[nr][nc].right = false;
            }
            visited[nr][nc] = true;
            stack.push([nr, nc]);
        }

        canvas.add(new fabric.IText('Maze Pattern', { left: 90, top: 72, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const x = startX + c * cell;
                const y = startY + r * cell;
                const w = gridWalls[r][c];
                if (w.top) walls.push(new fabric.Line([x, y, x + cell, y], { stroke: '#334155', strokeWidth: 2 }));
                if (w.left) walls.push(new fabric.Line([x, y, x, y + cell], { stroke: '#334155', strokeWidth: 2 }));
                if (r === size - 1 && w.bottom) walls.push(new fabric.Line([x, y + cell, x + cell, y + cell], { stroke: '#334155', strokeWidth: 2 }));
                if (c === size - 1 && w.right) walls.push(new fabric.Line([x + cell, y, x + cell, y + cell], { stroke: '#334155', strokeWidth: 2 }));
            }
        }
        walls.forEach(line => canvas.add(line));
        canvas.add(new fabric.IText('START', { left: startX + 4, top: startY - 32, fontFamily: 'Sarabun', fontSize: 18, fill: '#334155' }));
        canvas.add(new fabric.IText('FINISH', { left: startX + size * cell - 70, top: startY + size * cell + 6, fontFamily: 'Sarabun', fontSize: 18, fill: '#334155' }));
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Maze Pattern แล้ว');
    }

    function addShapeNetsWorksheet() {
        const shape = (window.prompt('รูปทรง: cube, pyramid, cylinder', 'cube') || 'cube').trim().toLowerCase();
        const left = 120;
        const top = 190;
        const s = 90;
        canvas.add(new fabric.IText('3D Shape Nets', { left: 90, top: 72, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));

        if (shape === 'pyramid') {
            const base = new fabric.Rect({ left: left + s, top: top + s, width: s, height: s, fill: 'transparent', stroke: '#334155', strokeWidth: 2 });
            const t1 = new fabric.Triangle({ left: left + s, top, width: s, height: s, fill: 'transparent', stroke: '#334155', strokeWidth: 2 });
            const t2 = new fabric.Triangle({ left: left, top: top + s, width: s, height: s, fill: 'transparent', stroke: '#334155', strokeWidth: 2, angle: 270 });
            const t3 = new fabric.Triangle({ left: left + 2 * s, top: top + s, width: s, height: s, fill: 'transparent', stroke: '#334155', strokeWidth: 2, angle: 90 });
            const t4 = new fabric.Triangle({ left: left + s, top: top + 2 * s, width: s, height: s, fill: 'transparent', stroke: '#334155', strokeWidth: 2, angle: 180 });
            [base, t1, t2, t3, t4].forEach(obj => canvas.add(obj));
        } else if (shape === 'cylinder') {
            const rect = new fabric.Rect({ left: left + 70, top: top + 60, width: s * 2.2, height: s * 1.2, fill: 'transparent', stroke: '#334155', strokeWidth: 2, strokeDashArray: [8, 6] });
            const c1 = new fabric.Ellipse({ left: left + 90, top: top + 8, rx: 80, ry: 34, fill: 'transparent', stroke: '#334155', strokeWidth: 2 });
            const c2 = new fabric.Ellipse({ left: left + 90, top: top + 220, rx: 80, ry: 34, fill: 'transparent', stroke: '#334155', strokeWidth: 2 });
            [rect, c1, c2].forEach(obj => canvas.add(obj));
        } else {
            const coords = [
                [left + s, top],
                [left, top + s],
                [left + s, top + s],
                [left + 2 * s, top + s],
                [left + 3 * s, top + s],
                [left + s, top + 2 * s],
            ];
            coords.forEach(([x, y]) => {
                canvas.add(new fabric.Rect({ left: x, top: y, width: s, height: s, fill: 'transparent', stroke: '#334155', strokeWidth: 2 }));
            });
        }

        canvas.add(new fabric.IText('Solid line: cut   Dashed line: fold', { left: 90, top: 120, fontFamily: 'Sarabun', fontSize: 18, fill: '#64748b' }));
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม 3D Shape Nets แล้ว');
    }

    function addComicStripWorksheet() {
        const panels = Math.min(6, Math.max(3, Number(window.prompt('จำนวนช่องการ์ตูน (3-6)', '4')) || 4));
        const cols = panels <= 4 ? 2 : 3;
        const rows = Math.ceil(panels / cols);
        const startX = 90;
        const startY = 150;
        const totalW = Math.max(640, (canvas.width || 900) - 180);
        const totalH = Math.max(680, (canvas.height || 1120) - 260);
        const panelW = totalW / cols - 16;
        const panelH = totalH / rows - 16;

        canvas.add(new fabric.IText('Comic Strip Storyboard', { left: 90, top: 72, fontFamily: 'Fredoka', fontSize: 34, fill: '#1e293b' }));
        for (let i = 0; i < panels; i++) {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const x = startX + c * (panelW + 16);
            const y = startY + r * (panelH + 16);
            canvas.add(new fabric.Rect({ left: x, top: y, width: panelW, height: panelH, fill: 'transparent', stroke: '#334155', strokeWidth: 2 }));
            canvas.add(new fabric.IText(`Panel ${i + 1}`, { left: x + 8, top: y + 6, fontFamily: 'Sarabun', fontSize: 15, fill: '#475569' }));
            const bubble = new fabric.Ellipse({ left: x + panelW - 128, top: y + 14, rx: 50, ry: 24, fill: 'transparent', stroke: '#64748b', strokeWidth: 1.4 });
            canvas.add(bubble);
            canvas.add(new fabric.Triangle({ left: x + panelW - 46, top: y + 56, width: 16, height: 14, angle: 180, fill: 'transparent', stroke: '#64748b', strokeWidth: 1.2 }));
        }
        canvas.requestRenderAll();
        markSaving();
        window.showToast?.('เพิ่ม Comic Strip แล้ว');
    }

    const GENERATOR_REGISTRY = [
        { buttonId: 'btnGenMath', key: 'math', handler: addMathProblems },
        { buttonId: 'btnGenAdvancedMath', key: 'advanced_math', handler: addAdvancedMathProblems },
        { buttonId: 'btnGenFractions', key: 'fractions', handler: addFractionProblems },
        { buttonId: 'btnGenAlgebra', key: 'algebra', handler: addAlgebraProblems },
        { buttonId: 'btnGenGeometry', key: 'geometry', handler: addGeometryProblems },
        { buttonId: 'btnGenGraph', key: 'graph', handler: addGraphGenerator },
        { buttonId: 'btnGenParabola', key: 'parabola', handler: addParabolaGenerator },
        { buttonId: 'btnGenNumberLine', key: 'number_line', handler: addNumberLineGenerator },
        { buttonId: 'btnGenCoordinate', key: 'coordinate_plane', handler: addCoordinatePlaneGenerator },
        { buttonId: 'btnGenWordSearch', key: 'word_search', handler: addWordSearch },
        { buttonId: 'btnGenCrossword', key: 'crossword', handler: addCrossword },
        { buttonId: 'btnGenTaskCards', key: 'task_cards', handler: addTaskCardsWorksheet },
        { buttonId: 'btnGenTaskCardsQuick', key: 'task_cards_quick', handler: addTaskCardsWorksheet },
        { buttonId: 'btnGenMazePattern', key: 'maze_pattern', handler: addMazePatternWorksheet },
        { buttonId: 'btnGenShapeNets', key: 'shape_nets', handler: addShapeNetsWorksheet },
        { buttonId: 'btnGenShapeNetsQuick', key: 'shape_nets_quick', handler: addShapeNetsWorksheet },
        { buttonId: 'btnGenComicStrip', key: 'comic_strip', handler: addComicStripWorksheet },
        { buttonId: 'btnGenTracing', key: 'tracing', handler: addTracingWorksheet },
        { buttonId: 'btnGenMatching', key: 'matching', handler: addMatchingWorksheet },
        { buttonId: 'btnGenFillBlank', key: 'fill_blank', handler: addFillBlankWorksheet },
        { buttonId: 'btnGenBingo', key: 'bingo', handler: addBingoCardsWorksheet },
        { buttonId: 'btnGenWordScramble', key: 'word_scramble', handler: addWordScrambleGenerator },
        { buttonId: 'btnGenCryptogram', key: 'cryptogram', handler: addCryptogramGenerator },
        { buttonId: 'btnGenMissingLetters', key: 'missing_letters', handler: addMissingLettersGenerator },
        { buttonId: 'btnGenMultipleChoice', key: 'multiple_choice', handler: addMultipleChoiceQuizGenerator },
        { buttonId: 'btnGenShortAnswer', key: 'short_answer_exit_ticket', handler: addShortAnswerExitTicketGenerator },
        { buttonId: 'btnGenAbcOrder', key: 'abc_order', handler: addAbcOrderCutGlueGenerator },
    ];

    function bindGeneratorRegistryEvents() {
        GENERATOR_REGISTRY.forEach((entry) => {
            const btn = document.getElementById(entry.buttonId);
            if (!btn || typeof entry.handler !== 'function') return;
            btn.addEventListener('click', async () => {
                emitTelemetry('generator_requested', { generator: entry.key, buttonId: entry.buttonId });
                try {
                    const result = await Promise.resolve(entry.handler());
                    if (result && result.status === 'cancelled') {
                        emitTelemetry('generator_cancelled', { generator: entry.key, buttonId: entry.buttonId });
                        return;
                    }
                    emitTelemetry('generator_success', {
                        generator: entry.key,
                        buttonId: entry.buttonId,
                        count: Number.isFinite(result?.count) ? result.count : undefined,
                    });
                } catch (error) {
                    emitTelemetry('generator_error', {
                        generator: entry.key,
                        buttonId: entry.buttonId,
                        message: String(error?.message || error || 'unknown'),
                    });
                    console.error('[SmartWS] generator failed', entry.key, error);
                    window.showToast?.(`Generator error: ${entry.key}`);
                }
            });
        });
    }

    const AI_WORKSHEET_PROMPTS = [
        {
            title: 'คณิตศาสตร์ ป.4: เศษส่วนเทียบเท่าและการเปรียบเทียบ',
            level: 'ประถมศึกษาปีที่ 4',
            useCase: 'สร้างใบงาน 2 หน้าเรื่องเศษส่วนพร้อมเฉลยละเอียดและรูบริก',
            prompt: `ช่วยออกแบบใบงานคณิตศาสตร์หัวข้อ "เศษส่วนเทียบเท่าและการเปรียบเทียบ" สำหรับนักเรียน [ระดับชั้น] โดยทำตามข้อกำหนดนี้อย่างครบถ้วน:
1) ระบุจุดประสงค์การเรียนรู้ที่วัดได้จริง 3 ข้อ
2) เขียนคำชี้แจงที่อ่านง่ายสำหรับเด็ก
3) ออกแบบโจทย์ 3 ระดับ: ง่าย 6 ข้อ, ปานกลาง 6 ข้อ, ท้าทาย 4 ข้อ (คละเติมคำตอบ/เลือกตอบ/แสดงวิธีคิด)
4) เพิ่ม "ข้อผิดพลาดที่พบบ่อย" 4 ข้อ พร้อมคำเตือนสั้น
5) ทำเฉลยแยกเป็นข้อ พร้อมวิธีคิดย่อ 1-2 บรรทัดต่อข้อ
6) สร้างรูบริก 4 ระดับ (4/3/2/1) ในมิติความถูกต้อง วิธีคิด ความเรียบร้อย
7) เพิ่มเวอร์ชันเสริมสำหรับเด็กทำเร็ว และเวอร์ชันช่วยเหลือสำหรับเด็กที่ยังไม่คล่อง
8) จัดรูปแบบให้พิมพ์ A4 ขาวดำชัดเจน มีหัวกระดาษชื่อ-ชั้น-เลขที่
ส่งออกผลลัพธ์เป็นหัวข้อ: ข้อมูลใบงาน, ใบงานนักเรียน, เฉลย, รูบริก, แนวทางพิมพ์`,
        },
        {
            title: 'คณิตศาสตร์ ม.1: สมการเชิงเส้นตัวแปรเดียว',
            level: 'มัธยมศึกษาปีที่ 1',
            useCase: 'ใบงานฝึกแก้สมการพร้อมวิเคราะห์ข้อผิดพลาด',
            prompt: `ช่วยสร้างใบงานคณิตศาสตร์เรื่อง "สมการเชิงเส้นตัวแปรเดียว" สำหรับ [ระดับชั้น] ด้วยโครงสร้างนี้:
1) ระบุมาตรฐาน/ตัวชี้วัดและทักษะเป้าหมาย
2) แบบอุ่นเครื่อง 5 ข้อ (สมบัติของสมการ)
3) ชุดหลัก 12 ข้อ แบ่งง่าย 4 ปานกลาง 5 ยาก 3 และมีโจทย์สถานการณ์อย่างน้อย 3 ข้อ
4) เพิ่มโจทย์ตรวจข้อผิดพลาด 3 ข้อ พร้อมให้อธิบายว่าผิดตรงไหน
5) Exit Ticket ท้ายใบงาน 3 ข้อสำหรับประเมินทันที
6) เฉลยทีละขั้นแบบกระชับ พร้อมจุดที่มักสลับเครื่องหมายผิด
7) รูบริก 4 ระดับ: ความถูกต้อง เหตุผลเชิงคณิต การสื่อสารสัญลักษณ์
8) จัดเลย์เอาต์ A4 2 หน้า: หน้าโจทย์ + หน้าวิธีทำและสะท้อนตนเอง
ผลลัพธ์ต้องเรียงเป็น: แผนใบงาน, แบบฝึก, เฉลย, รูบริก, เลย์เอาต์พิมพ์`,
        },
        {
            title: 'คณิตศาสตร์ ม.3: พีทาโกรัสและการประยุกต์',
            level: 'มัธยมศึกษาปีที่ 3',
            useCase: 'โจทย์ประยุกต์ชีวิตจริง + ปลายเปิด',
            prompt: `ออกแบบใบงานคณิตศาสตร์เรื่อง "ทฤษฎีบทพีทาโกรัส" สำหรับ [ระดับชั้น] โดยทำครบตามนี้:
1) ระบุเป้าหมายการเรียนรู้และความรู้พื้นฐานที่ต้องมี
2) กิจกรรมนำเข้า 1 กิจกรรมสั้นจากสถานการณ์วัดระยะจริง
3) โจทย์ 15 ข้อ: ง่าย 5 (หาด้านที่ขาด), ปานกลาง 6 (หลายขั้น), ยาก 4 (บริบทจริง)
4) เพิ่มโจทย์ท้าทายปลายเปิด 1 ข้อ พร้อมแนวคำตอบได้หลายแบบ
5) เฉลยครบทุกข้อพร้อมหน่วย สูตรที่ใช้ และการตรวจความสมเหตุสมผล
6) รูบริก 5 ระดับสำหรับข้อปลายเปิด: ตั้งสมมติฐาน ขั้นตอน ความถูกต้อง การอธิบาย
7) แนวทางปรับสำหรับผู้เรียนพื้นฐานอ่อนและผู้เรียนที่ต้องการความท้าทายเพิ่ม
8) จัดหน้า A4 ขาวดำให้มีพื้นที่วาดรูปสามเหลี่ยมและช่องเขียนวิธีทำ
สรุปผลลัพธ์ในรูปแบบพร้อมคัดลอกไปพิมพ์ทันที`,
        },
        {
            title: 'วิทยาศาสตร์ ป.5: วัฏจักรน้ำ',
            level: 'ประถมศึกษาปีที่ 5',
            useCase: 'เข้าใจแนวคิด + อธิบายกระบวนการ',
            prompt: `สร้างใบงานวิทยาศาสตร์เรื่อง "วัฏจักรน้ำ" สำหรับ [ระดับชั้น] แบบครบวงจร:
1) ระบุผลลัพธ์การเรียนรู้ 3-4 ข้อ
2) คำชี้แจงภาษาง่าย + คำศัพท์สำคัญ (ระเหย/ควบแน่น/หยาดน้ำฟ้า)
3) โจทย์ 3 ส่วน: A จับคู่คำศัพท์ 6 ข้อ, B เติมแผนภาพ 5 จุด, C อธิบายเหตุผล 5 ข้อ
4) ติดป้ายระดับข้อ ง่าย/ปานกลาง/ยาก ให้สมดุล
5) เพิ่มคำถามเชื่อมโยงชีวิตจริงในชุมชน 2 ข้อ
6) เฉลยละเอียดพร้อมตัวอย่างคำตอบที่ดีสำหรับข้ออธิบาย
7) รูบริก 4 ระดับด้านความถูกต้อง การใช้คำศัพท์ ความชัดเจน
8) แนะนำเลย์เอาต์พิมพ์ A4 1-2 หน้า มีช่องคำตอบและหัวกระดาษมาตรฐาน
ส่งออกเป็น: จุดประสงค์, ใบงาน, เฉลย, รูบริก, แนวทางพิมพ์`,
        },
        {
            title: 'วิทยาศาสตร์ ม.1: ระบบนิเวศและโซ่อาหาร',
            level: 'มัธยมศึกษาปีที่ 1',
            useCase: 'วิเคราะห์ความสัมพันธ์ในระบบนิเวศ',
            prompt: `ช่วยออกแบบใบงานวิทยาศาสตร์เรื่อง "ระบบนิเวศและโซ่อาหาร" สำหรับ [ระดับชั้น] โดยต้องมี:
1) บทนำสั้นและจุดประสงค์เชิงพฤติกรรม
2) โจทย์รวม 14 ข้อ 4 รูปแบบ: ระบุบทบาทสิ่งมีชีวิต, สร้างโซ่อาหาร, วิเคราะห์ผลกระทบ, คำถามเชิงอนุรักษ์
3) กำหนดระดับ 3 ระดับจากพื้นฐานไปวิเคราะห์
4) คำศัพท์สำคัญพร้อมคำอธิบายง่าย
5) เฉลยครบทุกข้อ โดยข้อปลายเปิดให้แนวคิดคำตอบหลายแบบ
6) รูบริก 4 ระดับสำหรับการอธิบายเหตุผลและการเชื่อมโยงระบบ
7) คำแนะนำครูสำหรับการเฉลยหน้าชั้นและจัดกลุ่มตามระดับ
8) แนวทางพิมพ์แบบประหยัดหมึก มีกรอบแผนภาพและพื้นที่สะท้อนผล
ส่งออกเป็น: ใบงานนักเรียน, เฉลยครู, รูบริก, คู่มือพิมพ์`,
        },
        {
            title: 'วิทยาศาสตร์ ม.3: พันธุกรรมเบื้องต้น (Punnett Square)',
            level: 'มัธยมศึกษาปีที่ 3',
            useCase: 'คำนวณและตีความความน่าจะเป็นทางพันธุกรรม',
            prompt: `สร้างใบงานวิทยาศาสตร์เรื่อง "พันธุกรรมเบื้องต้นและตารางพาเน็ต" สำหรับ [ระดับชั้น] ตามขั้นตอน:
1) เป้าหมายการเรียนรู้ด้านความรู้และทักษะ
2) ทบทวนคำศัพท์ ยีน อัลลีล จีโนไทป์ ฟีโนไทป์ แบบกระชับ
3) ข้อฝึก 12 ข้อ: ง่าย 4, ปานกลาง 5, ยาก 3
4) โจทย์ตรวจความเข้าใจผิด 2 ข้อ (เด่น/ด้อย, จีโนไทป์/ฟีโนไทป์)
5) เฉลยต้องแสดงการสร้างตารางและคำนวณเป็นเปอร์เซ็นต์
6) รูบริก 4 ระดับสำหรับข้อเขียนอธิบายผลการผสม
7) ส่วนขยายสำหรับผู้เรียนเก่ง เช่น codominance แบบเบื้องต้น
8) รูปแบบพิมพ์ A4 ขาวดำ มีตารางเขียนสะดวกและช่องหมายเหตุครู
ส่งออกในรูปแบบพร้อมพิมพ์ทันที`,
        },
        {
            title: 'ภาษาไทย ป.3: อ่านจับใจความจากนิทานสั้น',
            level: 'ประถมศึกษาปีที่ 3',
            useCase: 'อ่านจับใจความหลายระดับ',
            prompt: `ช่วยสร้างใบงานภาษาไทยเรื่อง "อ่านจับใจความจากนิทานสั้น" สำหรับ [ระดับชั้น] โดยมีโครงสร้างครบ:
1) แต่งนิทานสั้น 120-180 คำ เหมาะวัย
2) คำถาม 12 ข้อ: ง่าย 5 (ข้อมูลตรง), ปานกลาง 4 (สรุปใจความ), ยาก 3 (อนุมาน/ข้อคิด)
3) คำถามคำศัพท์ในบริบท 3 คำ
4) กิจกรรมเรียงลำดับเหตุการณ์ 1 ชุด
5) เฉลยครบทุกข้อ พร้อมเหตุผลสั้นสำหรับข้ออนุมาน
6) รูบริก 4 ระดับสำหรับคำถามปลายเปิด
7) แบบเสริมสำหรับนักเรียนอ่านช้า (คำใบ้/ตัวเลือกคำศัพท์)
8) รูปแบบหน้า: หน้า 1 นิทาน+คำถาม, หน้า 2 พื้นที่ตอบและสะท้อนการอ่าน
ส่งผลลัพธ์เป็นหัวข้อพร้อมใช้งานในห้องเรียน`,
        },
        {
            title: 'ภาษาไทย ป.6: ชนิดของคำและการใช้ในประโยค',
            level: 'ประถมศึกษาปีที่ 6',
            useCase: 'ไวยากรณ์ไทย + แต่งประโยคเชิงสร้างสรรค์',
            prompt: `ออกแบบใบงานภาษาไทยเรื่อง "ชนิดของคำ" (นาม สรรพนาม กริยา วิเศษณ์ บุพบท สันธาน) สำหรับ [ระดับชั้น] ตามนี้:
1) สรุปสาระสำคัญพร้อมตัวอย่างคำพื้นฐาน
2) ส่วนที่ 1 จำแนกชนิดของคำ 10 ข้อ
3) ส่วนที่ 2 เติมคำลงในประโยค 8 ข้อ
4) ส่วนที่ 3 เขียนประโยคเอง 4 ข้อ โดยกำหนดชนิดคำที่ต้องใช้
5) กำหนดความยาก 3 ระดับในแต่ละส่วน
6) เฉลยพร้อมเหตุผลสั้น และตัวอย่างคำตอบหลากหลายสำหรับข้อเขียน
7) รูบริก 4 ระดับ (ไวยากรณ์ ความชัดเจน ความคิดสร้างสรรค์)
8) แนวพิมพ์ A4 ขาวดำ มีเส้นบรรทัดและช่องตอบสมดุล
ส่งเป็น: จุดประสงค์, ใบงาน, เฉลย, รูบริก, คำแนะนำพิมพ์`,
        },
        {
            title: 'ภาษาไทย ม.2: ย่อความจากบทความ',
            level: 'มัธยมศึกษาปีที่ 2',
            useCase: 'ฝึกทักษะย่อความและประเมินงานเขียน',
            prompt: `ช่วยสร้างใบงานภาษาไทยเรื่อง "การย่อความจากบทความสารคดี" สำหรับ [ระดับชั้น] โดยมี:
1) บทความต้นฉบับ 280-350 คำ
2) ขั้นตอนให้นักเรียนไฮไลต์ใจความสำคัญ ตัดรายละเอียดรอง และย่อความ 80-100 คำ
3) คำถามชี้นำก่อนเขียน 5 ข้อ + เช็กลิสต์ตรวจงานตนเอง
4) ระดับความยาก 3 ระดับโดยปรับความซับซ้อนของบทความ
5) เฉลยเป็นตัวอย่างย่อความคุณภาพดี 2 แบบ พร้อมอธิบายจุดเด่น
6) รูบริก 5 ระดับ: ความครบถ้วน ความกระชับ ภาษา ความเชื่อมโยง การสะกด
7) แนวช่วยเหลือนักเรียนที่เขียนไม่คล่อง
8) รูปแบบหน้า: หน้า 1 บทความ, หน้า 2 ขั้นตอน+พื้นที่ย่อ, หน้า 3 รูบริก
ส่งผลลัพธ์เป็นชุดพร้อมพิมพ์`,
        },
        {
            title: 'ภาษาอังกฤษ ป.4: Daily Routines and Time',
            level: 'Primary Grade 4',
            useCase: 'คำศัพท์+ประโยคเรื่องกิจวัตรประจำวัน',
            prompt: `Create a Thai-instruction English worksheet for [grade level] on "Daily Routines and Time" with full structure:
1) Learning objectives in simple Thai and key vocabulary list (12 words)
2) Warm-up matching activity 6 items
3) Main tasks: fill in blanks (6), sentence ordering (4), write about own routine (4 prompts)
4) Difficulty tiers: Easy / Medium / Challenge clearly tagged
5) Pronunciation support hints in Thai for difficult words
6) Complete answer key for objective items and sample answers for writing
7) 4-level writing rubric (grammar, vocabulary, clarity, relevance)
8) Printable A4 guidance: black-and-white icons, enough writing lines, student header
Output sections: Worksheet Brief, Student Version, Answer Key, Rubric, Print Layout`,
        },
        {
            title: 'ภาษาอังกฤษ ป.6: Reading Comprehension',
            level: 'Primary Grade 6',
            useCase: 'บทอ่านข้อมูล + คำถามวิเคราะห์',
            prompt: `ออกแบบใบงานภาษาอังกฤษสำหรับ [ระดับชั้น] เรื่อง Reading Comprehension จากข้อความข้อมูลสั้น โดยทำตามลำดับ:
1) บทอ่าน 180-220 คำ หัวข้อใกล้ตัว
2) คำศัพท์ก่อนอ่าน 10 คำพร้อมความหมายไทย
3) คำถามหลังอ่าน 12 ข้อ: factual 5, inferential 4, vocabulary-in-context 3
4) ระบุระดับความยากแต่ละข้อและเรียงจากง่ายไปยาก
5) เพิ่มกิจกรรมสรุปใจความ 1 ย่อหน้า
6) เฉลยพร้อมเหตุผลสั้นสำหรับข้อ inferential
7) รูบริก 4 ระดับสำหรับงานสรุป (accuracy, organization, language use, completeness)
8) แนะแนวพิมพ์ A4 2 หน้าโดยเว้นระยะบรรทัดเหมาะสม
ส่งผลเป็น: Teacher Notes, Student Worksheet, Answer Key, Rubric, Printing Spec`,
        },
        {
            title: 'ภาษาอังกฤษ ม.2: Past Simple vs Present Perfect',
            level: 'มัธยมศึกษาปีที่ 2',
            useCase: 'แกรมมาร์เชิงใช้จริง + งานเขียนสั้น',
            prompt: `ช่วยสร้างใบงานภาษาอังกฤษเรื่อง "Past Simple และ Present Perfect" สำหรับ [ระดับชั้น] ให้ใช้ได้ในคาบเดียว:
1) สรุปกฎแบบย่อพร้อมตัวอย่างคู่เปรียบเทียบ
2) แบบฝึกควบคุม 10 ข้อ (เลือก tense)
3) แบบฝึกกึ่งเปิด 6 ข้อ (เติมคำ/เรียบเรียงประโยค)
4) งานเขียนสั้น 80-100 คำ เรื่องประสบการณ์และเหตุการณ์อดีต
5) ระดับความยาก 3 ขั้น + โจทย์เสริมสำหรับผู้เรียนเก่ง
6) เฉลยครบทุกข้อ + ตัวอย่างงานเขียนมาตรฐาน 2 แบบ
7) รูบริก 5 ระดับ (tense accuracy, grammar, vocabulary, coherence, task fulfillment)
8) จัดหน้า A4 ขาวดำ แยกส่วน grammar/writing และมีช่อง feedback ครู
ส่งออกเป็นหัวข้ออ่านง่ายและพร้อมพิมพ์`,
        },
        {
            title: 'สังคมศึกษา ป.5: หน้าที่พลเมืองและการอยู่ร่วมกัน',
            level: 'ประถมศึกษาปีที่ 5',
            useCase: 'ปลูกฝังค่านิยมประชาธิปไตยและความรับผิดชอบ',
            prompt: `สร้างใบงานสังคมศึกษาเรื่อง "หน้าที่พลเมืองและการอยู่ร่วมกัน" สำหรับ [ระดับชั้น] โดยมี:
1) จุดประสงค์การเรียนรู้ที่วัดได้
2) สถานการณ์สมมติ 3 สถานการณ์ให้ตัดสินใจ
3) คำถาม 12 ข้อ: ความรู้พื้นฐาน + วิเคราะห์ผลกระทบ + เสนอทางออก
4) ความยาก 3 ระดับ พร้อมสัญลักษณ์กำกับ
5) กิจกรรมท้ายใบงาน: เขียนข้อตกลงห้องเรียน 5 ข้อ
6) เฉลย/แนวคำตอบแบบยืดหยุ่นสำหรับคำถามเชิงคุณค่า
7) รูบริก 4 ระดับประเมินเหตุผลและการเคารพผู้อื่น
8) แนวพิมพ์ A4 ขาวดำอ่านง่าย มีช่องเขียนเพียงพอ
ส่งผลลัพธ์เป็น: สรุปครู, ใบงานนักเรียน, เฉลย, รูบริก, แบบพิมพ์`,
        },
        {
            title: 'ประวัติศาสตร์ ม.1: หลักฐานทางประวัติศาสตร์',
            level: 'มัธยมศึกษาปีที่ 1',
            useCase: 'ฝึกแยกประเภทและประเมินความน่าเชื่อถือ',
            prompt: `ช่วยออกแบบใบงานประวัติศาสตร์เรื่อง "หลักฐานทางประวัติศาสตร์" สำหรับ [ระดับชั้น] โดยต้องมี:
1) บทนำหลักฐานชั้นต้น/ชั้นรองแบบกระชับ
2) ตัวอย่างหลักฐาน 8 รายการพร้อมคำบรรยายสั้น
3) แบบฝึก 3 ส่วน: จำแนกประเภท, ประเมินความน่าเชื่อถือ, อธิบายเหตุผล
4) กำหนดระดับยากง่ายและโจทย์ท้าทาย 2 ข้อ
5) เฉลยพร้อมเหตุผลตัวอย่าง
6) รูบริก 4 ระดับสำหรับการให้เหตุผลเชิงประวัติศาสตร์
7) กิจกรรมต่อยอดให้ค้นหาหลักฐานในท้องถิ่น
8) เลย์เอาต์ A4 ประหยัดหมึก มีตารางติ๊กตอบและพื้นที่อธิบาย
ส่งผลเป็นหัวข้อชัดเจนพร้อมใช้`,
        },
        {
            title: 'ประวัติศาสตร์ ม.4: การเปลี่ยนแปลงทางสังคมสมัยใหม่',
            level: 'มัธยมศึกษาปีที่ 4',
            useCase: 'วิเคราะห์เหตุและผลทางประวัติศาสตร์เชิงลึก',
            prompt: `สร้างใบงานประวัติศาสตร์เรื่อง "การเปลี่ยนแปลงทางสังคมสมัยใหม่" สำหรับ [ระดับชั้น] โดยเน้นการคิดเชิงเหตุผล:
1) ระบุคำถามหลักของบทเรียน
2) จัดแหล่งข้อมูลสั้น 3 ชิ้น (ข้อความ/ตาราง/คำกล่าว)
3) คำถาม 10 ข้อจากเข้าใจข้อมูลไปสู่สังเคราะห์มุมมอง
4) แบ่งความยากพื้นฐาน/วิเคราะห์/สังเคราะห์
5) งานเขียนเชิงโต้แย้ง 120-150 คำ 1 ชิ้น
6) เฉลยระบุประเด็นสำคัญที่ควรมี
7) รูบริก 5 ระดับ (หลักฐาน เหตุผล โครงสร้าง ภาษา ความถูกต้อง)
8) พิมพ์ A4 2-3 หน้า แยกเอกสารอ้างอิงกับคำถามชัดเจน
ส่งผลลัพธ์พร้อมนำไปใช้ทันที`,
        },
        {
            title: 'ปฐมวัย: ทักษะการนับ 1-10 และการจับคู่ภาพ',
            level: 'อนุบาล 2-3',
            useCase: 'พัฒนากล้ามเนื้อมัดเล็กและพื้นฐานคณิต',
            prompt: `ช่วยสร้างใบงานปฐมวัยเรื่อง "การนับ 1-10 และจับคู่จำนวนกับภาพ" โดยคำนึงถึงเด็กเล็ก:
1) เป้าหมายพัฒนาการที่เหมาะวัย
2) กิจกรรม 4 แบบ (ลากเส้นจับคู่, ระบายสีตามจำนวน, วงกลมคำตอบ, ติดสติกเกอร์จำลอง)
3) ระดับความยาก 3 ระดับ เพิ่มจำนวนสิ่งของทีละขั้น
4) คำสั่งต้องสั้น ชัด ภาษาง่ายมาก
5) ตัวเลือกดัดแปลงสำหรับเด็กที่จับดินสอยังไม่คล่อง
6) แนวเฉลยและจุดสังเกตพฤติกรรมระหว่างทำงาน
7) รูบริกพัฒนาการ 4 ระดับ (การนับ การจับคู่ สมาธิ กล้ามเนื้อมัดเล็ก)
8) เลย์เอาต์ A4 ขาวดำ เส้นหนา ภาพใหญ่ ช่องกิจกรรมกว้าง
ส่งเป็น: คู่มือครู, ใบงานเด็ก, แนวสังเกต, รูบริก, ข้อกำหนดพิมพ์`,
        },
        {
            title: 'ปฐมวัย: การรู้จำพยัญชนะไทยเบื้องต้น',
            level: 'อนุบาล 3',
            useCase: 'อ่านเขียนก่อนประถมแบบเล่นและเรียนรู้',
            prompt: `ออกแบบใบงานปฐมวัยเรื่อง "รู้จำพยัญชนะไทยเบื้องต้น" พร้อมขั้นตอนชัดเจน:
1) เลือกพยัญชนะเป้าหมาย 5 ตัว + คำศัพท์ภาพประกอบ
2) กิจกรรม 3 ช่วง: ดู-ชี้-พูด, จับคู่ตัวอักษรกับภาพ, ฝึกลากรอยเส้น
3) ระดับง่าย/กลาง/ท้าทาย โดยปรับจำนวนตัวเลือกและความคล้ายตัวอักษร
4) คำแนะนำผู้ปกครอง/ครูสำหรับช่วยออกเสียง
5) เฉลยแบบภาพคำตอบแต่ละกิจกรรม
6) รูบริกพัฒนาการ 4 ระดับด้านรู้จำตัวอักษร การออกเสียง การควบคุมมือ
7) กิจกรรมเสริม 5 นาทีท้ายคาบ
8) แนวพิมพ์ A4 ภาพใหญ่ เส้นประหนา ระยะห่างมากพอ
ส่งเป็นโครงสร้างพร้อมพิมพ์ทันที`,
        },
        {
            title: 'ปฐมวัย/ต้นประถม: วิทยาศาสตร์รอบตัว (จม-ลอย)',
            level: 'อนุบาล 3 ถึง ป.1',
            useCase: 'สำรวจและบันทึกผลการทดลองง่ายๆ',
            prompt: `สร้างใบงานเรื่อง "จม-ลอย" แบบลงมือทำสำหรับ [ระดับชั้น] โดยมี:
1) จุดประสงค์เชิงพฤติกรรมง่ายๆ
2) รายการวัตถุทดลองปลอดภัย 8 อย่าง
3) ตารางทายผลก่อนทดลองและบันทึกผลหลังทดลอง
4) คำถามสะท้อนคิด 4 ข้อภาษาง่าย
5) ความยาก 3 ระดับ (มีภาพช่วยมาก/กลาง/น้อย)
6) เฉลยแนวคำตอบและข้อสังเกตที่ครูควรพูดคุย
7) รูบริก 4 ระดับเน้นการสังเกต การสื่อสาร การทำตามขั้นตอน
8) แนวพิมพ์ A4 ขาวดำ ภาพใหญ่ ช่องติ๊กง่าย และพื้นที่วาดผลทดลอง
ส่งผลลัพธ์เป็น: แผนกิจกรรม, ใบงานเด็ก, เฉลยครู, รูบริก, ข้อกำหนดพิมพ์`,
        },
        {
            title: 'Differentiation: คณิตศาสตร์แบบเส้นทาง A/B/C',
            level: 'ป.4 - ป.6',
            useCase: 'ใบงานเดียวแยกตามความพร้อมผู้เรียน',
            prompt: `ช่วยออกแบบใบงานคณิตศาสตร์แบบ Differentiation ด้วยเส้นทาง A (สนับสนุน), B (มาตรฐาน), C (ท้าทาย):
1) ระบุทักษะเป้าหมายเดียวที่ชัดเจน
2) สร้างโจทย์ 3 ชุดที่วัดทักษะเดียวกันแต่ความซับซ้อนต่างกัน
3) คำชี้แจงสั้นและมีตัวอย่างนำ 1 ข้อต่อเส้นทาง
4) เพิ่มคำใบ้ทีละขั้นและช่องช่วยคิดสำหรับเส้นทาง A
5) เพิ่มโจทย์ประยุกต์ปลายเปิดสำหรับเส้นทาง C
6) เฉลยครบทุกเส้นทางและอธิบายกลยุทธ์แก้โจทย์
7) รูบริกกลาง 4 ระดับที่ใช้ได้ทุกเส้นทาง เน้นความก้าวหน้าเทียบฐานเดิม
8) แนะแนวจัดหน้าเพื่อพิมพ์และตัดแจกเป็นชุด A/B/C ได้สะดวก
ส่งผลลัพธ์พร้อมใช้งานในชั้นเรียนคละความสามารถ`,
        },
        {
            title: 'Differentiation: ภาษาไทยสำหรับผู้เรียนอ่านช้า',
            level: 'ป.2 - ป.5',
            useCase: 'ใบงานช่วยอ่านแบบเป็นขั้นพร้อมตัวช่วยรับรู้',
            prompt: `ออกแบบใบงานภาษาไทยสำหรับผู้เรียนที่อ่านช้าหรือสับสนพยัญชนะคล้ายกัน โดยยึดหลักทีละขั้น:
1) กำหนดเป้าหมายย่อยชัดเจน (เช่น แยกพยัญชนะคล้าย)
2) กิจกรรม 4 ขั้น: รู้จำตัวอักษร, จับคู่เสียง, อ่านคำ, อ่านประโยคสั้น
3) ใส่ตัวช่วยภาพและการเน้นรูปแบบคำที่เหมาะสม
4) จำกัดภาระงานต่อหน้าไม่มากเกินไป
5) ความยาก 3 ระดับ พร้อมเงื่อนไขเลื่อนระดับ
6) เฉลยพร้อมแนวการป้อนกลับเชิงบวกสำหรับครู
7) รูบริกติดตามความก้าวหน้า 4 ระดับรายทักษะ
8) เลย์เอาต์เป็นมิตรต่อการอ่าน: ตัวอักษรใหญ่ spacing กว้าง ข้อความสั้นเป็นบล็อก
ส่งผลเป็น: แผนครู, ใบงานผู้เรียน, เฉลย, รูบริก, แนวทางปรับรายบุคคล`,
        },
        {
            title: 'PBL: โครงงานลดขยะในโรงเรียน',
            level: 'มัธยมศึกษาตอนต้น',
            useCase: 'ชุดใบงานโครงงานตั้งแต่โจทย์ถึงนำเสนอ',
            prompt: `ช่วยสร้างชุดใบงาน PBL เรื่อง "ลดขยะในโรงเรียน" สำหรับ [ระดับชั้น] โดยออกแบบลำดับโครงงาน:
1) ใบงานตั้งคำถามวิจัยและนิยามปัญหา
2) ใบงานวางแผนเก็บข้อมูล (กลุ่มตัวอย่าง/เครื่องมือ/เวลา)
3) ใบงานวิเคราะห์ข้อมูลเบื้องต้นและสรุปผล
4) ใบงานออกแบบแนวทางแก้และทดลองใช้
5) ใบงานสะท้อนผลและเตรียมนำเสนอ
6) ทุกใบงานมีระดับ guided/standard/advanced
7) เฉลยเป็นแนวทาง/ตัวอย่างผลงาน ไม่บังคับคำตอบเดียว
8) รูบริก 5 มิติ 4 ระดับ (ตั้งปัญหา, วิธีวิจัย, วิเคราะห์, ทีมเวิร์ก, สื่อสาร)
9) รูปแบบพิมพ์ A4 ต่อเนื่องทั้งชุด มีช่องบทบาทสมาชิก
ส่งผลลัพธ์เป็นแพ็กพร้อมใช้ตลอดหน่วย`,
        },
        {
            title: 'PBL: นิทรรศการประวัติศาสตร์ชุมชน',
            level: 'มัธยมศึกษาตอนปลาย',
            useCase: 'โครงงานสหวิชาเพื่อผลิตนิทรรศการ',
            prompt: `ออกแบบชุดใบงาน PBL สำหรับโครงงาน "นิทรรศการประวัติศาสตร์ชุมชน" โดยมีขั้นตอนครบ:
1) ใบงานกำหนดหัวข้อและคำถามหลัก
2) ใบงานสำรวจแหล่งข้อมูลและสัมภาษณ์
3) ใบงานตรวจสอบความน่าเชื่อถือหลักฐาน
4) ใบงานออกแบบสารนิทรรศการ (ข้อความ/ภาพ/ไทม์ไลน์)
5) ใบงานซ้อมนำเสนอและรับฟีดแบ็ก
6) แบ่งงานตามระดับความยากให้สมาชิกเลือกตามความถนัด
7) เฉลยในรูปเกณฑ์คุณภาพและตัวอย่างชิ้นงานที่ดี
8) รูบริก 5 ระดับประเมินทั้งกระบวนการและผลลัพธ์
9) แนวพิมพ์เป็นชุดแฟ้ม A4 มีเลขหน้า เช็กลิสต์ และส่วนลงนามครู
ส่งผลลัพธ์เป็นโครงสร้างพร้อมใช้ทั้งภาคเรียน`,
        },
        {
            title: 'Assessment: Exit Ticket รายคาบแบบรวดเร็ว',
            level: 'ทุกระดับชั้น',
            useCase: 'ประเมินท้ายคาบพร้อมวิเคราะห์ผลทันที',
            prompt: `ช่วยสร้างเทมเพลต Exit Ticket ที่ใช้ได้ทุกวิชา โดยมี:
1) โครงคำถาม 3 ส่วน: จำได้, เข้าใจ, นำไปใช้
2) ตัวอย่างคำถาม 3 ระดับความยาก
3) พื้นที่สะท้อนสิ่งที่ยังไม่เข้าใจ
4) ระบบให้คะแนนเร็ว 0-1-2 ต่อข้อ
5) เฉลย/แนวคำตอบย่อสำหรับครูตรวจทันที
6) รูบริกสั้น 4 ระดับสำหรับคำตอบปลายเปิด
7) ตารางสรุปผลทั้งห้องเพื่อระบุผู้เรียนที่ต้องเสริม
8) เวอร์ชันพิมพ์ A4 ครึ่งแผ่น/เต็มแผ่น ขาวดำ
ส่งผลเป็น: เทมเพลตนักเรียน, คู่มือตรวจครู, รูบริก, ตารางวิเคราะห์ผล, ข้อกำหนดพิมพ์`,
        },
        {
            title: 'Assessment: Pre-test/Post-test พร้อมวิเคราะห์พัฒนาการ',
            level: 'ป.4 - ม.3',
            useCase: 'ประเมินก่อน-หลังแบบเทียบผลได้จริง',
            prompt: `สร้างชุดประเมิน Pre-test และ Post-test สำหรับหน่วยเดียวกัน โดยต้องมี:
1) วัตถุประสงค์และตัวชี้วัดที่วัดซ้ำได้
2) ข้อสอบเทียบเท่ากัน 2 ชุด ชุดละ 15 ข้อ ครอบคลุมพื้นฐาน-วิเคราะห์
3) ระบุความยากรายข้อและผังวัดผล
4) เฉลยครบพร้อมเหตุผลสั้นในข้อวิเคราะห์
5) รูบริกข้อเขียน 4 ระดับ (ถ้ามี)
6) ตารางบันทึกคะแนนก่อน-หลังและคำนวณพัฒนาการรายคน/รายห้อง
7) แนวทางตีความผลและข้อเสนอแนะสอนซ่อมเสริม
8) แนวพิมพ์ A4 แยกชุดก่อนเรียน-หลังเรียนชัดเจน
ส่งผลลัพธ์เป็นแพ็กเอกสารพร้อมใช้งานจริง`,
        },
        {
            title: 'คณิตศาสตร์ ป.2: การบวกและลบไม่เกิน 100',
            level: 'ประถมศึกษาปีที่ 2',
            useCase: 'พื้นฐานคำนวณพร้อมโจทย์ภาพและรายทักษะ',
            prompt: `ช่วยทำใบงานคณิตศาสตร์เรื่อง "การบวกและลบไม่เกิน 100" สำหรับ [ระดับชั้น] ตามโครงสร้างนี้:
1) เป้าหมายรายทักษะ: บวกตรง บวกทด ลบยืม
2) โจทย์ภาพ 6 ข้อ + โจทย์ตัวเลข 10 ข้อ
3) ความยากง่าย/ปานกลาง/ยากอย่างสมดุล
4) โจทย์สถานการณ์ชีวิตประจำวัน 3 ข้อ
5) เฉลยครบและขั้นตอนคิดแบบสั้นชัด
6) รูบริก 4 ระดับรายทักษะสำหรับติดตามความก้าวหน้า
7) เวอร์ชันช่วยเหลือที่มีเส้นจำนวนและช่องช่วยคิด
8) หน้า A4 ชัดเจนเหมาะเด็กเล็ก ช่องเขียนใหญ่ไม่แน่นเกินไป
ส่งผลลัพธ์เป็นชุดพร้อมพิมพ์ทั้งหลักและเสริม`,
        },
        {
            title: 'วิทยาศาสตร์ ป.6: ไฟฟ้าวงจรง่าย',
            level: 'ประถมศึกษาปีที่ 6',
            useCase: 'ผสมความรู้และการทดลองอย่างปลอดภัย',
            prompt: `ออกแบบใบงานวิทยาศาสตร์เรื่อง "ไฟฟ้าวงจรง่าย" สำหรับ [ระดับชั้น] ให้มีองค์ประกอบครบ:
1) จุดประสงค์การเรียนรู้และข้อควรระวังความปลอดภัย
2) แผนภาพวงจรพื้นฐานให้เติมส่วนประกอบ
3) คำถาม 12 ข้อ ครอบคลุมพื้นฐานและการทำนายผลเมื่อเปลี่ยนองค์ประกอบ
4) ระดับความยาก 3 ระดับพร้อมสัญลักษณ์
5) กิจกรรมทดลองย่อและตารางบันทึกผล
6) เฉลยพร้อมเหตุผลและการเชื่อมโยงแนวคิด
7) รูบริก 4 ระดับด้านทักษะปฏิบัติและการอธิบาย
8) แนวพิมพ์ A4 ขาวดำ มีแผนภาพเส้นชัดและกล่องสรุปท้ายใบงาน
ส่งผลลัพธ์ในรูปแบบครูหยิบใช้ได้ทันที`,
        },
        {
            title: 'ภาษาอังกฤษ ป.3: Phonics CVC Words',
            level: 'Primary Grade 3',
            useCase: 'ฝึกเสียงตัวสะกดพื้นฐานอ่าน-เขียน',
            prompt: `Design a detailed worksheet for [grade level] on CVC phonics words with Thai teacher-friendly instructions:
1) Define objectives for sound recognition, blending, and spelling
2) Provide a word bank of at least 18 CVC words grouped by vowel sounds
3) Create tasks: sound matching, picture-word matching, fill missing letters, read-then-write sentences
4) Tag each task by difficulty (Easy/Medium/Challenge)
5) Include common pronunciation pitfalls and correction cues in Thai
6) Provide full answer key plus two model responses for sentence-writing
7) Add a 4-level rubric for decoding accuracy, spelling, readability
8) Provide printable A4 layout guidance with large fonts, spacing, grayscale visuals
Return in sections: Lesson Goals, Student Worksheet, Answer Key, Rubric, Print Notes`,
        },
        {
            title: 'สังคมศึกษา ม.2: เศรษฐศาสตร์ในชีวิตประจำวัน',
            level: 'มัธยมศึกษาปีที่ 2',
            useCase: 'วางแผนงบประมาณและตัดสินใจทางเศรษฐกิจ',
            prompt: `ช่วยสร้างใบงานสังคมศึกษาเรื่อง "เศรษฐศาสตร์ในชีวิตประจำวัน" สำหรับ [ระดับชั้น] โดยเน้นการตัดสินใจจริง:
1) อธิบายแนวคิดรายรับ รายจ่าย ออม และต้นทุนค่าเสียโอกาสแบบย่อ
2) สร้างสถานการณ์งบประมาณรายสัปดาห์ของนักเรียน 3 แบบ
3) คำถาม 12 ข้อจากคำนวณพื้นฐานสู่การตัดสินใจเชิงเหตุผล
4) ระดับความยาก 3 ขั้น + โจทย์ปลายเปิดท้าทาย 2 ข้อ
5) เฉลยแสดงวิธีคิดตัวเลขและเหตุผลการเลือกทางเลือก
6) รูบริก 4 ระดับสำหรับคำตอบเชิงเหตุผลทางเศรษฐกิจ
7) ส่วนสะท้อนคิดนิสัยการใช้เงินของผู้เรียน
8) เลย์เอาต์ A4 มีตารางงบประมาณอ่านง่ายและช่องอธิบายเพียงพอ
ส่งผลลัพธ์เป็นแพ็ก: ใบงาน, เฉลย, รูบริก, คู่มือครู, แบบพิมพ์`,
        },
        {
            title: 'Universal: Worksheet Generator Prompt (แม่แบบใช้ได้ทุกวิชา)',
            level: 'ทุกระดับ',
            useCase: 'แม่แบบยาวสำหรับสร้างใบงานมาตรฐานคุณภาพสูง',
            prompt: `คุณคือผู้ออกแบบใบงานมืออาชีพ ช่วยสร้างใบงานหัวข้อ [หัวข้อบทเรียน] วิชา [วิชา] สำหรับ [ระดับชั้น] โดยต้องมีองค์ประกอบมาตรฐานดังนี้:
1) จุดประสงค์การเรียนรู้ที่วัดได้ 3-5 ข้อ
2) คำชี้แจงนักเรียนที่กระชับ เข้าใจง่าย และใช้ภาษาบวก
3) โจทย์อย่างน้อย 15 ข้อ แบ่งระดับง่าย/ปานกลาง/ท้าทายอย่างสมดุล
4) ใช้รูปแบบคำถามอย่างน้อย 4 แบบ (เลือกตอบ เติมคำ จับคู่ ปลายเปิด/อธิบาย)
5) เพิ่มส่วน "ข้อผิดพลาดที่พบบ่อย" และ "คำแนะนำก่อนเริ่มทำ"
6) จัดทำเฉลยครบทุกข้อ โดยข้ออธิบายต้องมีแนวคำตอบตัวอย่าง
7) สร้างรูบริก 4 ระดับสำหรับข้อเขียนหรืองานปลายเปิด
8) เพิ่มเวอร์ชัน Differentiation: Support / Standard / Challenge
9) กำหนดเลย์เอาต์พิมพ์ A4 ขาวดำ อ่านง่าย ช่องเขียนพอเพียง มีหัวกระดาษมาตรฐาน
10) ส่งออกเป็นลำดับหัวข้อ: Teacher Brief, Student Worksheet, Answer Key, Rubric, Print Notes
ให้คงรูปแบบเรียบร้อยพร้อมคัดลอกไปใช้งานได้ทันที`,
        },
    ];

    const AI_PROMPT_TARGET_COUNT = 100;
    const AI_WEB_POPULAR_PATTERN_ROWS = [
        'Standards Spiral Worksheet|worksheet-generation|ป.4-ม.6|ฝึกหลายมาตรฐานในแผ่นเดียว|สลับ 3-5 มาตรฐานและติดแท็กทุกข้อ',
        'DOK Ladder Worksheet|worksheet-generation|ม.1-ม.6|ไล่ระดับการคิดเชิงลึก|เรียง Recall → Skill → Strategic พร้อมป้าย DOK',
        'Error Analysis Sheet|worksheet-generation|ป.5-ม.6|จับผิดคำตอบและแก้เหตุผล|ให้วิธีทำผิดสำเร็จรูปและให้นักเรียนตรวจแก้',
        'Text-to-Worksheet Converter|worksheet-generation|ป.4-ม.6|แปลงบทความเป็นใบงานอัตโนมัติ|สร้าง vocab/จับใจความ/อ้างหลักฐานจากข้อความเดียว',
        'Choice Board 3x3|worksheet-generation|ป.3-ม.6|ใบงานเลือกทำตามความสนใจ|มีข้อบังคับ must-do + choose-any เพื่อ differentiation',
        'Station Rotation Packet|worksheet-generation|ป.4-ม.6|แพ็กกิจกรรมแบบหมุนฐาน|กำหนดเวลา บทบาท อุปกรณ์ และเส้นทางหมุน',
        'Inquiry Lab Sheet|worksheet-generation|ป.5-ม.6|ใบงานสืบเสาะวิทย์|บังคับช่องสมมติฐาน ตัวแปร ตารางข้อมูล CER',
        'CER Evidence Organizer|worksheet-generation|ม.1-ม.6|โครงเขียนวิทย์/สังคมแบบ CER|แยกช่อง Claim-Evidence-Reasoning พร้อม sentence stems',
        'Interleaved Skill Drill|worksheet-generation|ป.4-ม.6|ฝึกคละทักษะเก่าใหม่|สลับโจทย์เพื่อลดการจำรูปแบบซ้ำ',
        'Retrieval Grid 3 Horizon|worksheet-generation|ป.4-ม.6|ทบทวนความจำแบบเมื่อวาน/สัปดาห์ก่อน/เดือนก่อน|กริด 3 คอลัมน์คงรูปทั้งหน่วย',
        'Morphology Builder|worksheet-generation|ป.4-ม.6|สร้างใบงานรากศัพท์|เน้น prefix/suffix/root + ขยาย word family',
        'Three-Tier Reading Questions|worksheet-generation|ป.4-ม.6|คำถามอ่าน 3 ชั้น|literal/inferential/evaluative พร้อมอ้างบรรทัด',
        'Context-Switch Math Problems|worksheet-generation|ป.4-ม.6|โจทย์คณิตหลายบริบท|ทักษะเดียวแต่เปลี่ยนสถานการณ์จริงหลายแบบ',
        'Graphic Organizer Forge|worksheet-generation|ป.3-ม.6|เลือกแผนผังอัตโนมัติ|เลือกระหว่าง Venn/Timeline/Cause-Effect ตามเป้าหมาย',
        'Cut-and-Sort Cards|worksheet-generation|อนุบาล-ป.6|กิจกรรมตัดแยกหมวด|มีบัตรตัด + answer bank + เฉลยครู',
        'Timeline Sequencing Sheet|worksheet-generation|ป.5-ม.6|เรียงเหตุการณ์ตามเวลา|ให้เบาะแสวันที่+แหล่งข้อมูลย่อยเพื่อเรียงลำดับ',
        'Claim-Counterclaim Builder|worksheet-generation|ม.1-ม.6|ใบงานถกเถียงเชิงเหตุผล|บังคับช่อง claim/counterclaim/rebuttal/citation',
        'Low-Prep Home Materials Activity|worksheet-generation|ป.1-ม.3|ใบงานใช้อุปกรณ์ง่าย|จำกัดวัสดุเหลือของใช้บ้าน/ห้องเรียนพื้นฐาน',
        'Exit Ticket Trio|worksheet-generation|ทุกระดับ|บัตรท้ายคาบ 3 เวอร์ชัน|support/on-level/extension ในหน้าเดียว',
        'Family-Linked Homework Sheet|worksheet-generation|ป.1-ป.6|การบ้านเชื่อมผู้ปกครอง|มีบันทึกสื่อสารหลายภาษาและคำถามคุยที่บ้าน',
        'Backward Design Unit Map|unit-planners|ทุกระดับ|วางแผนหน่วยแบบย้อนกลับ|เริ่มจากผลลัพธ์และหลักฐานก่อนออกแบบกิจกรรม',
        '20-Day Guiding Question Planner|unit-planners|ป.4-ม.6|แผนคำถามนำรายคาบ|ทุกคาบมี guiding question เชื่อมต่อกันทั้งหน่วย',
        'Weekly Pacing Calendar|unit-planners|ทุกระดับ|ปฏิทิน pacing รายสัปดาห์|เผื่อวันสอนซ่อม/ทบทวนในแผนตั้งแต่ต้น',
        'Standards Crosswalk Unit|unit-planners|ทุกระดับ|เทียบมาตรฐานข้ามกรอบ|ทำตาราง mapping ระหว่างหลักสูตรหลายชุด',
        'Interdisciplinary Unit Weave|unit-planners|ป.4-ม.6|หน่วยบูรณาการหลายวิชา|ใช้ธีมเดียวเชื่อม ELA/Math/Science/Social',
        'PBL Arc Planner|unit-planners|ม.1-ม.6|โครงหน่วย PBL ครบวงจร|มี launch/checkpoint/critique/exhibition',
        'Substitute-Proof Continuity Plan|unit-planners|ทุกระดับ|แผนเผื่อครูแทนสอน|คำสั่งไม่ต้องอาศัยบริบทเดิมก็ใช้ได้',
        'Assessment-First Unit Blueprint|unit-planners|ทุกระดับ|วางหน่วยจากการประเมิน|ผูกทุกบทกับหลักฐานวัดผลที่ชัดเจน',
        'Resource-Light Unit Planner|unit-planners|ทุกระดับ|แผนหน่วย low-tech|ห้ามใช้อุปกรณ์พิเศษ/พิมพ์เยอะ/อุปกรณ์หายาก',
        'Small-Group Rotation Unit|unit-planners|ป.1-ม.3|หน่วยแบบกลุ่มย่อยหมุนรอบ|มี teacher table/independent/collab block',
        'Rubric Table Generator|assessment|ทุกระดับ|สร้างรูบริกตารางพร้อมน้ำหนัก|เขียน descriptors ชัดและคะแนนรวมได้ทันที',
        'Mixed-Format Mastery Quiz|assessment|ป.4-ม.6|ควิซคละรูปแบบ|MCQ+short response+application ครอบคลุมมาตรฐานเดียว',
        'Parallel Forms Quiz A-B|assessment|ป.4-ม.6|ข้อสอบคู่ขนาน A/B|ความยากเท่ากันแต่โจทย์คนละชุด',
        'Oral Checkpoint Prompt Set|assessment|ป.1-ม.6|ชุดคำถามประเมินพูด|มี observable criteria สำหรับ conferencing',
        'Performance Task Scenario|assessment|ม.1-ม.6|ภารกิจประเมินสมรรถนะจริง|กำหนด role-audience-purpose ชัดเจน',
        'Mini-Benchmark Pack|assessment|ป.4-ม.6|แบบทดสอบสั้นรายหน่วย|มีข้อเสนอ cut score ระดับผ่าน/ต้องเสริม',
        'Item Analysis + Reteach|assessment|ทุกระดับ|วิเคราะห์ข้อสอบแล้ววางสอนซ่อม|สร้างกลุ่มซ่อมจากมาตรฐานที่พลาด',
        'Misconception Distractor Builder|assessment|ป.4-ม.6|สร้างตัวลวงจากความเข้าใจผิดจริง|ตัวลวงสัมพันธ์ misconception ไม่สุ่ม',
        'Writing Exemplar Ladder|assessment|ป.4-ม.6|ตัวอย่างงานเขียนหลายระดับ|annotate จุดแข็งจุดอ่อนเพื่อ calibration',
        'Standards-Tagged Exit Tickets|assessment|ทุกระดับ|exit ticket ผูกมาตรฐาน|แต่ละข้อมีรหัสมาตรฐานและ follow-up',
        'Open-Book Higher-Order Check|assessment|ม.1-ม.6|ประเมินแบบเปิดหนังสือ|ห้ามถามจำอย่างเดียว เน้นสังเคราะห์หลักฐาน',
        'Functional Skills Checklist|assessment|ทุกระดับ|เช็กลิสต์ทักษะใช้งานจริง|ให้คะแนนความถี่และระดับพึ่งพาตนเอง',
        'Mood Check-In Sheet|SEL|ทุกระดับ|แบบเช็กอินอารมณ์รายวัน|มีอุณหภูมิอารมณ์ + coping choice + ธงติดตามครู',
        'Conflict Repair Reflection|SEL|ป.4-ม.6|ใบงานซ่อมความสัมพันธ์|สะท้อนเหตุการณ์ ผลกระทบ แผนเยียวยา',
        'Gratitude + Growth Journal|SEL|ป.3-ม.6|บันทึกขอบคุณและพัฒนาตน|เชื่อม emotional literacy กับ growth mindset',
        'Self-Regulation Plan Card|SEL|ป.1-ม.6|แผนคุมอารมณ์ส่วนบุคคล|กำหนด trigger-signals-strategies-support person',
        'Restorative Circle Prep|SEL|ม.1-ม.6|ชีทเตรียมวงสนทนาเชิงสมานฉันท์|คำถามสะท้อนก่อนเข้าวงคุยจริง',
        'Goal-Setting Sprint Sheet|SEL|ป.4-ม.6|ตั้งเป้าระยะสั้น|SMART goal + obstacle plan + accountability',
        'Game Quest Board Worksheet|game-based|ป.3-ม.6|ใบงานภารกิจแบบ quest board|มี mission tiers และ reward logic',
        'Classroom Escape Puzzle Chain|game-based|ป.4-ม.6|ชุดปริศนา escape room|คำตอบด่านก่อนใช้ปลดล็อกด่านถัดไป',
        'Boss Battle Review Sheet|game-based|ป.3-ม.6|ทบทวนก่อนสอบแบบ boss fight|บอสหลายเฟสและ HP score tracker',
        'Dice-Driven Practice Sheet|game-based|ป.1-ม.3|แบบฝึกใช้ลูกเต๋าตัดสินโจทย์|สุ่มเงื่อนไขโจทย์เพื่อลดความจำซ้ำ',
        'Bingo Evidence Hunt|game-based|ป.3-ม.6|บิงโกค้นหาหลักฐานจากบทอ่าน|ต้องระบุบรรทัดยืนยันก่อนปิดช่อง',
        'Card Draft Challenge|game-based|ม.1-ม.6|สุ่มเลือกโจทย์แบบ drafting|ผู้เรียนเลือกชุดโจทย์กลยุทธ์เอง',
        'UDL Triple-Path Worksheet|special-education|ทุกระดับ|ใบงานตาม UDL 3 ทางเลือก|รับข้อมูล-ลงมือทำ-สื่อสารผลได้หลายแบบ',
        'AAC-Friendly Response Board|special-education|ทุกระดับ|ใบงานรองรับ AAC|ลดภาระเขียนยาวและเพิ่มตัวเลือกสื่อสาร',
        'IEP Goal Micro-Practice|special-education|ทุกระดับ|แบบฝึกผูก IEP goal รายข้อ|ติดตามความคืบหน้าเชิงจุลภาค',
        'Sensory-Break Embedded Sheet|special-education|ป.1-ม.3|ใบงานมีจุดพักประสาทสัมผัส|แทรก break cue ทุกช่วงงาน',
        'Errorless Learning Prompt Set|special-education|ป.1-ป.6|ใบงานแนว errorless learning|ลดโอกาสตอบผิดช่วงแรกแล้วค่อยลดตัวช่วย',
        'Executive Function Planner|special-education|ป.4-ม.6|ใบงานฝึกวางแผนจัดการงาน|แบ่ง task chunk + time estimate + check-in',
        'Language Ladder Supports|multilingual-classrooms|ป.1-ม.6|ใบงานผู้เรียนหลายภาษา|จากภาพ/คำ/ประโยค/ย่อหน้าแบบขั้นบันได',
        'Translanguaging Discussion Prompts|multilingual-classrooms|ม.1-ม.6|คำถามอภิปรายข้ามภาษา|ให้คิดภาษาแม่ก่อนผลิตภาษาเป้าหมาย',
        'Cognate-Aware Vocab Sheet|multilingual-classrooms|ป.4-ม.6|คลังคู่คำ cognate|ชี้ true/false cognate และคำเตือนการใช้ผิด',
        'Simplified English + Glossary Pack|multilingual-classrooms|ป.3-ม.6|เวอร์ชันภาษาง่ายพร้อมอภิธาน|ลดภาษาซับซ้อนและเสริม bilingual glossary',
        'Multilingual Family Homework Note|multilingual-classrooms|ทุกระดับ|การบ้านพร้อมบันทึกผู้ปกครองหลายภาษา|มี support tips สำหรับที่บ้าน',
        'Pronunciation Drill Cards|multilingual-classrooms|ป.1-ม.6|การ์ดฝึกออกเสียงเปรียบหน่วยเสียง|เน้น minimal pairs และ stress pattern',
        'Culturally Inclusive Context Rewrite|multilingual-classrooms|ทุกระดับ|แปลงบริบทให้หลากวัฒนธรรม|ตัดตัวอย่างที่อิงวัฒนธรรมเดียวมากเกินไป',
        'Low-Ink Minimal Layout|visual-design-layout|ทุกระดับ|เลย์เอาต์ประหยัดหมึก|ใช้ขาวดำ high contrast และเส้นเรียบง่าย',
        'Dyslexia-Friendly Layout|visual-design-layout|ทุกระดับ|เลย์เอาต์เป็นมิตรต่อ dyslexia|กำหนด spacing/line length/typography ชัดเจน',
        'Large-Print Accessibility Layout|visual-design-layout|ทุกระดับ|เลย์เอาต์ตัวใหญ่สำหรับผู้เรียนสายตาลำบาก|กำหนดขั้นต่ำขนาดตัวอักษรและช่องตอบ',
        'Icon-Coded Instruction Layout|visual-design-layout|ป.1-ป.6|คำสั่งแบบ icon-coded|ทุกขั้นตอนมีไอคอนซ้ำรูปแบบคงที่',
        'Comic-Panel Instruction Sheet|visual-design-layout|ป.1-ป.6|คำสั่งแบบคอมิกทีละช่อง|แสดงขั้นตอนภาพก่อนลงมือทำ',
        'Infographic One-Pager|visual-design-layout|ป.4-ม.6|ใบความรู้หน้าเดียวแบบอินโฟกราฟิก|ใช้ callout และ data snippet อย่างเป็นระบบ',
        'A4/US-Letter Safe Margin Pack|print-ready-formatting|ทุกระดับ|พิมพ์ได้ทั้ง A4 และ Letter|บังคับ safe area เดียวกันทุกหน้า',
        'Booklet Imposition Template|print-ready-formatting|ป.4-ม.6|จัดหน้าพับเล่มอัตโนมัติ|เรียงเลขหน้าเพื่อ fold-and-staple',
        'Cut/Fold Registration Template|print-ready-formatting|ป.1-ป.6|ใบงานตัดพับพร้อมไกด์ไลน์|มี trim/fold/alignment marks',
        'Photocopy-Optimized B/W Version|print-ready-formatting|ทุกระดับ|เวอร์ชันถ่ายเอกสารชัด|หลีกเลี่ยง gray fill และเส้นบางเกินไป',
        'Teacher Key Companion Edition|print-ready-formatting|ทุกระดับ|คู่เอกสารนักเรียน-ครู|เฉลยแสดงวิธีคิดและหมายเหตุการให้คะแนน',
        'Fillable + Printable Twin Export|print-ready-formatting|ทุกระดับ|เวอร์ชันกรอกดิจิทัล+เขียนมือ|ออกสองชุดจากเนื้อหาเดียว',
        'Standards Footer Pagination|print-ready-formatting|ทุกระดับ|footer มาตรฐานทุกหน้า|มี standard code/page/section ชัดเจน',
        'One-Page No-Prep Batch|print-ready-formatting|ทุกระดับ|ชุดใบงานหน้าเดียวพร้อมใช้|ห้ามใช้อุปกรณ์เสริม/ตัดแปะ/ดิจิทัล',
        'Subject Icon Masthead Cover|cover-page-design|ทุกระดับ|หน้าปกหัวแถบไอคอนวิชา|มี title block + grade + term metadata',
        'Seasonal Theme Cover|cover-page-design|ทุกระดับ|หน้าปกธีมฤดูกาล|เปลี่ยน motif ตามฤดูกาลแต่โครงวิชาคงเดิม',
        'School Brand Lockup Cover|cover-page-design|ทุกระดับ|หน้าปกตามแบรนด์โรงเรียน|ยึดตำแหน่งโลโก้และพาเลตที่กำหนด',
        'Unit Mascot Cover|cover-page-design|ป.1-ป.6|หน้าปกมีมาสคอตหน่วยเรียน|มาสคอตตัวเดิมแต่ท่าต่างตามบท',
        'Monochrome Professional Cover|cover-page-design|ม.1-ม.6|หน้าปกขาวดำทางการ|ต้นทุนพิมพ์ต่ำแต่ดูมืออาชีพ',
        'Kid-Friendly Bubble Cover|cover-page-design|อนุบาล-ป.3|หน้าปกโทนเด็กเล็ก|ตัวอักษรโค้งมน ช่องชื่อใหญ่ อ่านง่าย',
        'Photo Collage Learning Cover|cover-page-design|ทุกระดับ|หน้าปกคอลลาจภาพการเรียน|กริดภาพ+คำบรรยาย+เป้าหมายหน่วย',
        'Teacher Signature Cover|cover-page-design|ทุกระดับ|หน้าปกใส่ลายเซ็น/แท็กไลน์ครู|มีบล็อกติดต่อและ usage note',
        'Bilingual Dual-Title Cover|cover-page-design|ทุกระดับ|หน้าปกสองภาษา|หัวเรื่องสองภาษาน้ำหนักสมดุล',
        'Standards Snapshot Cover|cover-page-design|ป.4-ม.6|หน้าปกสรุปมาตรฐานหน่วย|มี essential question และ success criteria',
        'QR Resource Hub Cover|cover-page-design|ทุกระดับ|หน้าปกมี QR ศูนย์ทรัพยากร|ลิงก์เฉลย/สไลด์/เสียง/งานเสริม',
        'House-Color Variant Cover|cover-page-design|ทุกระดับ|หน้าปกโทนสีทีม/บ้าน|เลย์เอาต์เดียว แค่เปลี่ยนโค้ดสี',
        'Grade-Band Series Cover|cover-page-design|ทุกระดับ|หน้าปกซีรีส์หลายระดับชั้น|มี badge ระดับความยากและสีประจำชั้น',
        'Spine-Matching Packet Cover|cover-page-design|ทุกระดับ|หน้าปกพร้อมสันแฟ้ม|พิมพ์คู่ป้ายสันสำหรับจัดเก็บ',
        'Geometric No-Clipart Cover|cover-page-design|ทุกระดับ|หน้าปกสมัยใหม่ไม่ใช้คลิปอาร์ต|ใช้รูปทรงเรขาคณิตและตัวอักษรล้วน',
        'Hand-Drawn Doodle Border Cover|cover-page-design|ป.1-ม.3|หน้าปกกรอบดูเดิลลายมือ|คุม margin safety สำหรับเครื่องพิมพ์',
        'Inclusive Representation Cover|cover-page-design|ทุกระดับ|หน้าปกตัวแทนผู้เรียนหลากหลาย|กำหนดเงื่อนไขภาพไม่ตอกย้ำอคติ',
        'Print-Shop Bleed Cover|cover-page-design|ทุกระดับ|หน้าปกส่งโรงพิมพ์|ใส่ bleed/trim/safe zone ครบ'
    ];

    function hashPromptSeed(text) {
        let hash = 0;
        const value = String(text || '');
        for (let index = 0; index < value.length; index += 1) {
            hash = ((hash << 5) - hash) + value.charCodeAt(index);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function buildGenericVariant(pattern, variant) {
        const blockA = `บทบาท: คุณคือนักออกแบบกิจกรรมการเรียนรู้เชิงหลักฐาน\nโจทย์: สร้างทรัพยากรตามรูปแบบ "${pattern.title}" สำหรับ [วิชา] หัวข้อ [หัวข้อบทเรียน] ระดับ [${pattern.level}]\nข้อกำกับพิเศษ: ${pattern.differentiator}`;
        const blockB = `ขั้นตอนบังคับ:\n1) Learning Targets 3-5 ข้อ (วัดผลได้)\n2) Student Version (Support/Core/Challenge)\n3) Teacher Key พร้อมจุดพลาดที่พบบ่อย\n4) รูบริก 4 ระดับแบบใช้ตรวจจริง\n5) เวอร์ชันพิมพ์ A4 ขาวดำ + spacing พร้อมเขียน`;
        const blockC = `รูปแบบส่งออก:\n- Teacher Brief\n- Student Worksheet\n- Answer Key\n- Rubric\n- Print Notes\nข้อสำคัญ: ห้ามใช้ข้อความทั่วไปซ้ำ ต้องคงเอกลักษณ์ของรูปแบบนี้`;
        if (variant === 0) return `${blockA}\n\n${blockB}\n\n${blockC}`;
        if (variant === 1) return `${blockA}\n\nต้องมี "Success Criteria Checklist" และ "Fast Finisher Task"\n${blockB}\n\nเพิ่ม JSON summary ท้ายสุด: {objective, difficultySplit, estimatedTime}`;
        return `${blockA}\n\nแยกคำตอบเป็น 2 แบบ: concise key และ explanatory key\n${blockB}\n\nเพิ่มหัวข้อ "Differentiation Decision Rules" ว่าเมื่อไรให้ใช้ Support/Core/Challenge`;
    }

    function buildPromptFromWebPattern(pattern, index) {
        const category = pattern.category || 'worksheet-generation';
        const variant = (hashPromptSeed(pattern.title) + Number(index || 0)) % 3;

        if (category === 'cover-page-design') {
            const visualStyle = variant === 0
                ? 'modern educational editorial, clean hierarchy, bold title area'
                : variant === 1
                    ? 'playful classroom poster style, soft rounded elements, kid-friendly visual rhythm'
                    : 'minimal premium workbook cover, geometric composition, strong negative space';
            const paletteRule = variant === 2
                ? 'ใช้ไม่เกิน 2 สีหลัก + 1 accent เท่านั้น'
                : 'ใช้ palette ที่คอนทราสต์ชัดเจนและพิมพ์ได้ทั้งสี/ขาวดำ';
            return `คุณคือ Art Director สำหรับสื่อการศึกษา สร้าง "Prompt สำหรับ Gen ภาพหน้าปก" ตามรูปแบบ "${pattern.title}"\nหัวข้อทรัพยากร: [ชื่อใบงาน/ชุดกิจกรรม]\nระดับชั้น: [${pattern.level}]\nจุดเด่นที่ต้องคงไว้: ${pattern.differentiator}\n\nงานที่ต้องส่ง (ห้ามตกหล่น):\n1) MASTER IMAGE PROMPT (ภาษาอังกฤษ) สำหรับ text-to-image ที่ละเอียดมาก\n2) THAI ADAPT PROMPT สำหรับแก้ไขข้อความไทยบนหน้าปก\n3) NEGATIVE PROMPT (สิ่งที่ห้ามเกิด: ตัวหนังสือเบลอ มือผิดรูป โลโก้เพี้ยน clutter เกิน)\n4) LAYOUT SPEC: safe zone, title box, subtitle, grade badge, teacher name, QR area\n5) TYPOGRAPHY MAP: ฟอนต์แนะนำ 2-3 กลุ่ม + hierarchy (H1/H2/meta)\n6) PRINT SPEC: A4 portrait, bleed 3mm (ถ้าต้องส่งโรงพิมพ์), grayscale fallback\n\nข้อกำกับสไตล์ภาพ:\n- Visual style: ${visualStyle}\n- ${paletteRule}\n- รองรับทั้งเวอร์ชัน classroom print และ marketplace preview\n\nโครงผลลัพธ์ที่ต้องตอบ:\nA) Concept Direction\nB) Master Image Prompt\nC) Negative Prompt\nD) Layout Blueprint\nE) Export/Print Checklist`;
        }

        if (category === 'visual-design-layout') {
            return `ช่วยสร้าง Prompt เฉพาะทางสำหรับ "ออกแบบเลย์เอาต์ใบงาน" ตามรูปแบบ "${pattern.title}" ระดับ [${pattern.level}]\nจุดเด่นรูปแบบ: ${pattern.differentiator}\n\nเงื่อนไข:\n1) ออกแบบโครงหน้าแบบ wireframe เชิงข้อความ (header/body/footer + response zones)\n2) กำหนด spacing, visual hierarchy, instruction density, icon placement\n3) ให้ 2 เวอร์ชัน: ครูใช้พิมพ์ถ่ายเอกสาร และเวอร์ชันสวยสำหรับดิจิทัล\n4) เพิ่ม accessibility rules (font size, contrast, line length, white space)\n5) ระบุข้อห้ามการออกแบบที่ทำให้เด็กอ่านยาก\n6) สร้าง mini style guide สำหรับทั้งหน่วยเพื่อให้หน้าตา consistent\n\nรูปแบบส่งออก:\n- Layout Strategy\n- Component Spec\n- Accessibility Rules\n- Do/Don't Checklist\n- Ready-to-use Prompt for AI Designer`;
        }

        if (category === 'print-ready-formatting') {
            return `คุณคือผู้เชี่ยวชาญ prepress และ worksheet production สร้างคำสั่งสำหรับ "${pattern.title}"\nระดับ: [${pattern.level}] | เงื่อนไขเฉพาะ: ${pattern.differentiator}\n\nต้องมี:\n1) โครงเอกสาร student + teacher key ที่พิมพ์แล้วไม่เพี้ยน\n2) ข้อกำหนด margin, gutter, trim/fold marks ตามงาน\n3) แนวทางแก้ปัญหาเส้นบาง/เทาแตก/ภาพแตกในเครื่องถ่ายเอกสาร\n4) เวอร์ชัน A4 และ US Letter ที่ content ไม่หลุดขอบ\n5) ตารางตรวจสอบก่อนพิมพ์ (preflight checklist)\n6) output naming convention สำหรับไฟล์ส่งโรงเรียน\n\nสรุปผลลัพธ์เป็น:\n- Production Prompt\n- Print Spec Table\n- Copier Optimization Rules\n- Preflight Checklist`;
        }

        if (category === 'game-based') {
            return `สร้าง prompt สำหรับใบงานเกมการเรียนรู้รูปแบบ "${pattern.title}" หัวข้อ [หัวข้อบทเรียน] ระดับ [${pattern.level}]\nเงื่อนไขเฉพาะ: ${pattern.differentiator}\n\nข้อกำหนดบังคับ:\n1) มี narrative hook 1 ย่อหน้า\n2) มี mechanic เกมชัดเจน (win condition, fail condition, scoring)\n3) แยกด่าน/รอบการเล่นอย่างน้อย 3 ช่วง\n4) มี balance ระหว่างความสนุกกับการวัดผลจริง\n5) มี anti-cheat หรือ anti-guessing rule เบื้องต้น\n6) เฉลยครูต้องอธิบาย logic ของแต่ละด่าน\n7) มีเวอร์ชันเล่นเดี่ยวและเล่นกลุ่ม\n\nรูปแบบส่งออก:\n- Game Loop\n- Student Mission Sheet\n- Teacher Control Sheet\n- Answer Logic\n- Difficulty Tuning`;
        }

        if (category === 'assessment') {
            return `ช่วยเขียน prompt สำหรับเครื่องมือประเมินแบบ "${pattern.title}" ระดับ [${pattern.level}]\nจุดเด่นที่ต้องรักษา: ${pattern.differentiator}\n\nกำหนดผลลัพธ์ให้ครอบคลุม:\n1) Blueprint ตารางวัดผล (objective × cognitive level × item type)\n2) สร้างข้อวัดผลพร้อมระดับยากง่ายและเวลาทำ\n3) เฉลย + rationale + misconception mapping\n4) เกณฑ์ผ่านและแนวจัดกลุ่มซ่อมเสริม\n5) รูบริก/Checklist สำหรับตรวจสม่ำเสมอระหว่างครูหลายคน\n6) รายงานสั้นหลังตรวจเพื่อใช้วางแผนคาบถัดไป\n\nส่งออกเป็น:\n- Assessment Blueprint\n- Item Set\n- Key + Rationale\n- Scoring & Grouping Guide`;
        }

        if (category === 'special-education' || category === 'multilingual-classrooms' || category === 'SEL') {
            return `สร้าง prompt สำหรับงานเฉพาะผู้เรียนตามรูปแบบ "${pattern.title}" ระดับ [${pattern.level}]\nโจทย์เฉพาะ: ${pattern.differentiator}\n\nสิ่งที่ต้องมี:\n1) เป้าหมายย่อยที่สังเกตพฤติกรรมได้จริง\n2) scaffold แบบเป็นขั้นพร้อม fade-out support\n3) ตัวเลือกการตอบหลายรูปแบบ (พูด/ชี้/เขียนสั้น/ภาพ)\n4) ภาษาคำสั่งเรียบง่ายและลดภาระความจำใช้งาน\n5) แผนครูสำหรับ feedback เชิงบวกที่เฉพาะเจาะจง\n6) progress tracker รายทักษะ 4 ระดับ\n7) เวอร์ชันสำหรับสื่อสารผู้ปกครองแบบกระชับ\n\nผลลัพธ์ที่ต้องตอบ:\n- Student Sheet\n- Teacher Support Plan\n- Progress Tracker\n- Family Communication Note`;
        }

        if (category === 'unit-planners') {
            return `สร้าง prompt สำหรับวางแผนหน่วยรูปแบบ "${pattern.title}" ระดับ [${pattern.level}]\nจุดเด่น: ${pattern.differentiator}\n\nต้องมีองค์ประกอบ:\n1) เป้าหมายปลายทางของหน่วยและหลักฐานความสำเร็จ\n2) แผนคาบรายวัน/รายสัปดาห์ที่เชื่อมโยงต่อเนื่อง\n3) จุด formative check-in และ trigger สำหรับ reteach\n4) ทรัพยากรที่ต้องใช้ + แผนสำรองเมื่อเวลาไม่พอ\n5) output ของผู้เรียนแต่ละช่วง + rubric checkpoint\n6) แนวสื่อสารความคืบหน้ากับผู้ปกครอง\n\nรูปแบบส่งออก:\n- Unit Architecture\n- Daily/Weekly Plan\n- Assessment Anchors\n- Risk & Backup Plan`;
        }

        return buildGenericVariant(pattern, variant);
    }

    function buildExpandedAIPrompts() {
        const result = [...AI_WORKSHEET_PROMPTS];
        const used = new Set(result.map(item => String(item.title || '').trim().toLowerCase()));
        for (let rowIndex = 0; rowIndex < AI_WEB_POPULAR_PATTERN_ROWS.length; rowIndex += 1) {
            const row = AI_WEB_POPULAR_PATTERN_ROWS[rowIndex];
            if (result.length >= AI_PROMPT_TARGET_COUNT) break;
            const [title, category, level, useCase, differentiator] = row.split('|');
            const cleanTitle = String(title || '').trim();
            if (!cleanTitle) continue;
            const key = cleanTitle.toLowerCase();
            if (used.has(key)) continue;
            used.add(key);
            const pattern = {
                title: cleanTitle,
                category: String(category || '').trim(),
                level: String(level || '').trim(),
                useCase: String(useCase || '').trim(),
                outputType: 'worksheet/printable resource',
                differentiator: String(differentiator || '').trim(),
            };
            result.push({
                title: pattern.title,
                level: pattern.level || 'ทุกระดับ',
                useCase: pattern.useCase || 'แนวทางใบงานยอดนิยมจาก web research',
                prompt: buildPromptFromWebPattern(pattern, rowIndex),
            });
        }
        let fallbackCounter = 1;
        while (result.length < AI_PROMPT_TARGET_COUNT) {
            const fallbackTitle = `Adaptive Prompt Pack ${fallbackCounter}`;
            fallbackCounter += 1;
            const key = fallbackTitle.toLowerCase();
            if (used.has(key)) continue;
            used.add(key);
            result.push({
                title: fallbackTitle,
                level: 'ทุกระดับ',
                useCase: 'fallback ชั่วคราวเพื่อให้ครบจำนวน prompt',
                prompt: buildPromptFromWebPattern({
                    title: fallbackTitle,
                    category: 'worksheet-generation',
                    level: 'ทุกระดับ',
                    outputType: 'worksheet/printable resource',
                    differentiator: 'สร้างชุดคำสั่งใหม่โดยเน้นความหลากหลายรูปแบบโจทย์และรูปแบบการประเมิน',
                }, fallbackCounter),
            });
        }
        return result.slice(0, AI_PROMPT_TARGET_COUNT);
    }

    const AI_WORKSHEET_PROMPTS_FULL = buildExpandedAIPrompts();

    function copyTextToClipboard(text) {
        if (!text) return Promise.resolve(false);
        if (navigator.clipboard?.writeText) {
            return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
        }
        try {
            const area = document.createElement('textarea');
            area.value = text;
            area.style.position = 'fixed';
            area.style.left = '-10000px';
            document.body.appendChild(area);
            area.focus();
            area.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(area);
            return Promise.resolve(!!ok);
        } catch (_) {
            return Promise.resolve(false);
        }
    }

    function buildAIPromptCards() {
        const container = document.getElementById('aiPromptCards');
        if (!container) return;
        container.innerHTML = '';

        AI_WORKSHEET_PROMPTS_FULL.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'market-card';
            card.style.padding = '10px';

            const title = document.createElement('div');
            title.className = 'market-card-title';
            title.textContent = `${index + 1}. ${item.title}`;

            const meta = document.createElement('div');
            meta.style.fontSize = '12px';
            meta.style.color = '#475569';
            meta.style.marginBottom = '8px';
            meta.textContent = `ช่วงชั้น: ${item.level} • ใช้เมื่อ: ${item.useCase}`;

            const textarea = document.createElement('textarea');
            textarea.value = item.prompt;
            textarea.style.width = '100%';
            textarea.style.minHeight = '200px';
            textarea.style.resize = 'vertical';
            textarea.style.border = '1px solid #cbd5e1';
            textarea.style.borderRadius = '8px';
            textarea.style.padding = '8px';
            textarea.style.fontFamily = 'inherit';
            textarea.style.fontSize = '13px';
            textarea.style.boxSizing = 'border-box';

            const actions = document.createElement('div');
            actions.className = 'section-btn-grid';
            actions.style.gridTemplateColumns = 'repeat(1,minmax(0,1fr))';
            actions.style.marginTop = '8px';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'action-btn load-btn';
            copyBtn.textContent = 'Copy Prompt';
            copyBtn.addEventListener('click', async () => {
                const ok = await copyTextToClipboard(textarea.value);
                window.showToast?.(ok ? 'คัดลอก Prompt แล้ว' : 'คัดลอกไม่สำเร็จ');
            });

            actions.append(copyBtn);
            card.append(title, meta, textarea, actions);
            container.appendChild(card);
        });
    }

    function showAIPromptGuide(visible) {
        const modal = document.getElementById('aiPromptGuideModal');
        if (!modal) return;
        modal.style.display = visible ? 'flex' : 'none';
        if (visible) buildAIPromptCards();
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
    let catalogGenerationToken = 0;
    function markSaving() {
        setSaveIndicator('saving');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => setSaveIndicator('saved'), 500);
    }

    function getPresetForFormat(format) {
        const presets = window.SMARTWS_TEMPLATE_PRESETS || {};
        return presets[String(format || '').trim()] || {};
    }

    function getCategoryRenderMode(category) {
        const modeByCategory = {
            early_learning_games: 'game_grid',
            math_visuals: 'math_problem_set',
            classroom_management_decor: 'project_planner',
            ela_graphic_organizers: 'organizer_canvas',
            ela_reading: 'reading_analysis',
            ela_writing: 'writing_builder',
            vocabulary_phonics: 'vocab_stations',
            math_basic: 'math_drill',
            math_middle: 'math_problem_set',
            math_high_algebra: 'algebra_workspace',
            science_reading_lab: 'science_lab_sheet',
            social_studies_history: 'history_source_sheet',
            sel_reflection: 'sel_reflection_journal',
            games_word_crossword_maze_bingo: 'game_grid',
            taskcards_flashcards: 'taskcards_layout',
            graphic_organizers: 'organizer_canvas',
            assessment_quiz_rubric: 'assessment_pack',
            projects_research_presentation: 'project_planner',
            seasonal_holiday_routines: 'seasonal_routine',
        };
        return modeByCategory[String(category || '').trim()] || 'format_default';
    }

    function getTemplateVariantIndex(template) {
        if (Number.isFinite(template?.variantIndex)) {
            return Number(template.variantIndex) % 4;
        }
        const num = Number(String(template?.id || '').replace(/\D/g, ''));
        if (!Number.isFinite(num)) return 0;
        return num % 4;
    }

    function isNewVisualTemplate(template) {
        return Array.isArray(template?.tags) && template.tags.includes('cohort-new');
    }

    function resolveTemplateFamilyKey(template) {
        if (template?.familyKey) return String(template.familyKey);
        const tags = Array.isArray(template?.tags) ? template.tags.map(String) : [];
        const ignored = new Set(['iconify-visual', 'cohort-new']);
        const found = tags.find((tag) => {
            if (ignored.has(tag)) return false;
            if (tag.startsWith('difficulty-')) return false;
            if (tag.startsWith('theme-')) return false;
            if (tag.startsWith('family-')) return false;
            if (tag === 'elg' || tag === 'mth' || tag === 'clm' || tag === 'ela') return false;
            return true;
        });
        return found || '';
    }

    function renderNewFamilyTemplate(familyKey, ctx) {
        const {
            left,
            top,
            width,
            variant,
            addRect,
            addLabel,
            addCircle,
            addLine,
        } = ctx;

        if (familyKey === 'story-sequencing' || familyKey === 'sequence-chain') {
            const steps = familyKey === 'story-sequencing' ? 4 : 5;
            const boxW = (width - (steps - 1) * 12) / steps;
            for (let i = 0; i < steps; i++) {
                const x = left + i * (boxW + 12);
                addRect(x, top + 38, boxW, 140, 1.3);
                addLabel(`Step ${i + 1}`, x + 8, top + 46, 13);
                addRect(x, top + 188, boxW, 72, 1.1);
                if (i < steps - 1) addLabel('→', x + boxW + 2, top + 108, 24, '#64748b');
            }
            return true;
        }

        if (familyKey === 'pattern-completion') {
            const rows = 6 + variant;
            for (let r = 0; r < rows; r++) {
                const y = top + 30 + r * 58;
                for (let c = 0; c < 6; c++) {
                    const x = left + c * 92;
                    addRect(x, y, 82, 46, 1.2);
                    if (c === 5) addLabel('?', x + 34, y + 11, 22, '#0f172a');
                }
            }
            addLabel('เติมรูปแบบที่หายไปในแต่ละแถว', left, top, 14);
            return true;
        }

        if (familyKey === 'transition-cards' || familyKey === 'behavior-cue-cards') {
            const rows = 3;
            const cols = 3;
            const cardW = (width - 20) / cols;
            const cardH = 118;
            let idx = 1;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = left + c * (cardW + 10);
                    const y = top + r * (cardH + 12);
                    addRect(x, y, cardW, cardH, 1.3);
                    addRect(x + 10, y + 10, 36, 36, 1.1);
                    addLabel(familyKey === 'transition-cards' ? `Transition ${idx}` : `Cue ${idx}`, x + 54, y + 16, 13);
                    addRect(x + 10, y + 56, cardW - 20, 48, 1);
                    idx += 1;
                }
            }
            return true;
        }

        if (familyKey === 'i-spy-find-count') {
            addRect(left, top + 20, width * 0.66, 390, 1.2);
            addRect(left + width * 0.69, top + 20, width * 0.31, 390, 1.2);
            for (let i = 0; i < 36; i++) {
                const col = i % 6;
                const row = Math.floor(i / 6);
                addRect(left + 18 + col * 62, top + 38 + row * 58, 40, 34, 1);
            }
            for (let n = 0; n < 8; n++) {
                const y = top + 38 + n * 42;
                addLabel(`${n + 1}) จำนวน = ____`, left + width * 0.71, y, 13);
            }
            return true;
        }

        if (familyKey === 'ten-frames-icons') {
            const frameW = 220;
            const frameH = 96;
            for (let i = 0; i < 4; i++) {
                const x = left + (i % 2) * (frameW + 26);
                const y = top + 26 + Math.floor(i / 2) * (frameH + 24);
                addRect(x, y, frameW, frameH, 1.5);
                const cellW = frameW / 5;
                for (let c = 1; c < 5; c++) addLine(x + c * cellW, y, x + c * cellW, y + frameH, 1);
                addLine(x, y + frameH / 2, x + frameW, y + frameH / 2, 1);
                addLabel(`นับและเขียน ${i + 1}: ____`, x, y + frameH + 8, 13);
            }
            return true;
        }

        if (familyKey === 'compare-quantities') {
            for (let i = 0; i < 8; i++) {
                const y = top + 24 + i * 54;
                addRect(left, y, width * 0.4, 42, 1.2);
                addRect(left + width * 0.6, y, width * 0.4, 42, 1.2);
                addRect(left + width * 0.45, y, width * 0.1, 42, 1.2);
                addLabel('>', left + width * 0.482, y + 8, 16, '#64748b');
                addLabel('<', left + width * 0.507, y + 8, 16, '#64748b');
                addLabel('=', left + width * 0.495, y + 24, 14, '#64748b');
            }
            return true;
        }

        if (familyKey === 'beginning-sounds-match') {
            addRect(left, top + 20, width * 0.48, 430, 1.2);
            addRect(left + width * 0.52, top + 20, width * 0.48, 430, 1.2);
            for (let i = 0; i < 10; i++) {
                const y = top + 34 + i * 40;
                addLabel(`${String.fromCharCode(65 + i)}.`, left + 12, y, 16);
                addRect(left + width * 0.52 + 12, y - 4, width * 0.4, 28, 1);
            }
            addLabel('ลากเส้นจับคู่เสียงต้นคำกับภาพ', left, top - 2, 14);
            return true;
        }

        if (familyKey === 'memory-match-cards' || familyKey === 'flashcards-picture-word') {
            const cols = familyKey === 'memory-match-cards' ? 4 : 3;
            const rows = familyKey === 'memory-match-cards' ? 4 : 4;
            const cardW = (width - (cols - 1) * 10) / cols;
            const cardH = familyKey === 'memory-match-cards' ? 86 : 108;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = left + c * (cardW + 10);
                    const y = top + r * (cardH + 12);
                    addRect(x, y, cardW, cardH, 1.2);
                    addRect(x + 8, y + 8, 34, 34, 1);
                    if (familyKey === 'flashcards-picture-word') addRect(x + 8, y + 50, cardW - 16, 46, 1);
                }
            }
            return true;
        }

        if (familyKey === 'picture-bingo') {
            const cell = Math.min(98, Math.floor((width - 24) / 5));
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 5; c++) {
                    addRect(left + c * cell, top + 36 + r * cell, cell, cell, 1.2);
                    if (r === 2 && c === 2) addLabel('FREE', left + c * cell + 22, top + 36 + r * cell + 30, 16, '#334155');
                }
            }
            addLabel('BINGO', left + 4, top, 20, '#1e293b');
            return true;
        }

        if (familyKey === 'visual-daily-schedule' || familyKey === 'classroom-jobs-chart') {
            const rows = familyKey === 'visual-daily-schedule' ? 8 : 10;
            for (let i = 0; i < rows; i++) {
                const y = top + 20 + i * 48;
                addRect(left, y, width * 0.2, 40, 1.1);
                addRect(left + width * 0.22, y, width * 0.16, 40, 1.1);
                addRect(left + width * 0.4, y, width * 0.6, 40, 1.1);
            }
            return true;
        }

        if (familyKey === 'reward-sticker-charts') {
            const cols = 7;
            const rows = 8;
            const cellW = Math.floor((width - 140) / cols);
            for (let r = 0; r < rows; r++) {
                addRect(left, top + 36 + r * 42, 120, 34, 1.1);
                for (let c = 0; c < cols; c++) {
                    const x = left + 130 + c * cellW;
                    addRect(x, top + 36 + r * 42, cellW - 4, 34, 1);
                }
            }
            return true;
        }

        if (familyKey === 'mind-map-icon-based' || familyKey === 'main-idea-details' || familyKey === 'frayer-model' || familyKey === 'venn-diagram' || familyKey === 'story-map' || familyKey === 'cause-effect-map') {
            if (familyKey === 'venn-diagram') {
                addCircle(left + width * 0.38, top + 160, 120, 1.5);
                addCircle(left + width * 0.62, top + 160, 120, 1.5);
                addLabel('A', left + width * 0.27, top + 48, 14);
                addLabel('B', left + width * 0.73, top + 48, 14);
                addRect(left, top + 320, width, 120, 1.1);
                return true;
            }
            if (familyKey === 'frayer-model') {
                addRect(left + width * 0.35, top + 140, width * 0.3, 70, 1.3);
                addRect(left, top + 20, width * 0.47, 110, 1.2);
                addRect(left + width * 0.53, top + 20, width * 0.47, 110, 1.2);
                addRect(left, top + 220, width * 0.47, 110, 1.2);
                addRect(left + width * 0.53, top + 220, width * 0.47, 110, 1.2);
                return true;
            }
            return false;
        }

        return false;
    }

    function clearPreviousCatalogTemplateObjects() {
        const objects = canvas.getObjects();
        const removable = objects.filter(obj => obj && obj.smartwsTemplateGenerated === true);
        removable.forEach(obj => canvas.remove(obj));
    }

    function clearCanvasForCatalogTemplate() {
        const objects = canvas.getObjects().slice();
        objects.forEach((obj) => canvas.remove(obj));
    }

    function addTemplateObject(obj, templateId) {
        if (!obj) return;
        obj.smartwsTemplateGenerated = true;
        obj.smartwsTemplateId = templateId || '';
        canvas.add(obj);
    }

    function addTemplateText(text, options, templateId) {
        const node = new fabric.IText(text, options || {});
        addTemplateObject(node, templateId);
        return node;
    }

    function addTemplateRect(options, templateId) {
        const node = new fabric.Rect(options || {});
        addTemplateObject(node, templateId);
        return node;
    }

    function getIconKeywordsForTemplate(template, generationOptions) {
        const categoryMap = {
            early_learning_games: ['puzzle', 'cards', 'gamepad-2'],
            math_visuals: ['calculator', 'chart-line', 'shape'],
            classroom_management_decor: ['calendar', 'clipboard-check', 'label'],
            ela_graphic_organizers: ['book', 'mind-map', 'alphabet-latin'],
            ela_reading: ['book', 'text', 'search'],
            ela_writing: ['pencil', 'note', 'edit'],
            vocabulary_phonics: ['abc', 'translate', 'language'],
            math_basic: ['calculator', 'plus', 'ruler'],
            math_middle: ['function', 'chart-line', 'percent'],
            math_high_algebra: ['sigma', 'graph', 'formula'],
            science_reading_lab: ['flask', 'microscope', 'atom'],
            social_studies_history: ['globe', 'map', 'landmark'],
            sel_reflection: ['heart', 'account', 'thought-bubble'],
            games_word_crossword_maze_bingo: ['puzzle', 'gamepad', 'grid'],
            taskcards_flashcards: ['cards', 'layers', 'lightning-bolt'],
            graphic_organizers: ['vector-polyline', 'graph', 'shape'],
            assessment_quiz_rubric: ['clipboard-check', 'checklist', 'target'],
            projects_research_presentation: ['presentation', 'briefcase', 'timeline'],
            seasonal_holiday_routines: ['calendar', 'sunny', 'leaf'],
        };

        const keywords = [];
        const themeKeyword = String(generationOptions?.themeKeyword || '').trim();
        if (themeKeyword) keywords.push(themeKeyword);
        const mapped = categoryMap[String(template?.category || '').trim()] || [];
        mapped.forEach((k) => keywords.push(k));

        (template?.tags || [])
            .map(tag => String(tag || '').replace(/[-_]/g, ' ').trim())
            .filter(Boolean)
            .slice(0, 3)
            .forEach(tag => keywords.push(tag));

        const titleWords = String(template?.title || '')
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(token => token.length >= 4)
            .slice(0, 2);
        titleWords.forEach(word => keywords.push(word));

        return Array.from(new Set(keywords)).slice(0, 6);
    }

    async function fetchIconifyIdsForTemplate(template, maxIcons, generationOptions) {
        const iconIds = [];
        const keywords = getIconKeywordsForTemplate(template, generationOptions);
        const iconMode = String(generationOptions?.iconMode || 'random').toLowerCase();
        const fixedSeed = Number(String(template?.id || '').replace(/\D/g, '')) || 1;

        for (let i = 0; i < keywords.length && iconIds.length < maxIcons; i++) {
            try {
                const list = typeof iconifyApi.searchIcons === 'function'
                    ? await iconifyApi.searchIcons(keywords[i], { limit: 12, retries: 1, timeoutMs: 2600 })
                    : [];
                const picked = iconMode === 'fixed'
                    ? list.slice(fixedSeed % 3, (fixedSeed % 3) + 6)
                    : list.slice(0, 6);
                picked.forEach((name) => {
                    if (!iconIds.includes(name) && iconIds.length < maxIcons) {
                        iconIds.push(name);
                    }
                });
            } catch (error) {
                console.warn('[SmartWS] Iconify query failed', keywords[i], error);
            }
        }
        if (!iconIds.length && typeof iconifyApi.getFallbackIcons === 'function') {
            const fallback = iconifyApi.getFallbackIcons(template?.category).slice(0, maxIcons);
            fallback.forEach((name) => {
                if (!iconIds.includes(name) && iconIds.length < maxIcons) iconIds.push(name);
            });
        }
        return iconIds;
    }

    function loadSvgGroupFromUrl(url) {
        if (typeof iconifyApi.loadSvgGroupFromUrl === 'function') {
            return iconifyApi.loadSvgGroupFromUrl(url);
        }
        return new Promise((resolve, reject) => {
            try {
                fabric.loadSVGFromURL(url, (objects, options) => {
                    if (!objects || !objects.length) {
                        reject(new Error('Empty SVG objects'));
                        return;
                    }
                    const group = fabric.util.groupSVGElements(objects, options || {});
                    if (!group) {
                        reject(new Error('SVG group failed'));
                        return;
                    }
                    resolve(group);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async function injectIconifyVisuals(template, templateId, generationToken, left, top, width, variant, generationOptions) {
        const maxIcons = [2, 3, 3, 4][variant];
        const iconIds = await fetchIconifyIdsForTemplate(template, maxIcons, generationOptions);
        if (!iconIds.length) return;

        const placements = [];
        const step = Math.max(120, Math.floor(width / Math.max(iconIds.length, 2)));
        for (let i = 0; i < iconIds.length; i++) {
            const x = left + 12 + i * step;
            const y = top + 10;
            placements.push({ x, y });
        }

        for (let i = 0; i < iconIds.length; i++) {
            if (generationToken !== catalogGenerationToken) return;
            const iconId = iconIds[i];
            const target = placements[i] || { x: left + 12, y: top + 10 };
            const url = `https://api.iconify.design/${iconId}.svg?color=%23334155`;
            try {
                const group = await loadSvgGroupFromUrl(url);
                const baseW = Math.max(1, group.width || 24);
                const iconSize = [30, 36, 42, 34][variant];
                const scale = iconSize / baseW;
                group.set({
                    left: target.x,
                    top: target.y,
                    scaleX: scale,
                    scaleY: scale,
                    opacity: 0.95,
                });
                addTemplateObject(group, templateId);
            } catch (error) {
                console.warn('[SmartWS] Iconify load failed', iconId, error);
            }
        }
        canvas.requestRenderAll();
    }

    function getTemplateGenerationOptions() {
        return {
            themeKeyword: document.getElementById('templateThemeKeyword')?.value || '',
            iconMode: document.getElementById('templateIconMode')?.value || 'random',
        };
    }

    function addWaveATemplateFromCatalog(template, generationOptions) {
        if (!template) return;
        catalogGenerationToken += 1;
        const generationToken = catalogGenerationToken;
        clearCanvasForCatalogTemplate();
        const options = generationOptions || getTemplateGenerationOptions();

        const preset = getPresetForFormat(template.format);
        const mode = getCategoryRenderMode(template.category);
        const variant = getTemplateVariantIndex(template);
        const left = 90;
        const top = 120;
        const width = Math.max(420, (canvas.width || 900) - 180);
        const title = template.title || 'Template';
        const templateId = template.id || '';

        addTemplateText(title, {
            left,
            top: 74,
            fontFamily: 'Fredoka',
            fontSize: 32,
            fill: '#1e293b',
        }, templateId);
        addTemplateText(`ID: ${template.id} • ${template.category} • ${template.format}`, {
            left,
            top: 108,
            fontFamily: 'Sarabun',
            fontSize: 14,
            fill: '#64748b',
        }, templateId);

        function addRect(x, y, w, h, strokeWidth) {
            addTemplateRect({ left: x, top: y, width: w, height: h, fill: 'transparent', stroke: '#334155', strokeWidth: strokeWidth || 1.2 }, templateId);
        }

        function addCircle(cx, cy, r, strokeWidth) {
            const node = new fabric.Circle({
                left: cx - r,
                top: cy - r,
                radius: r,
                fill: 'transparent',
                stroke: '#334155',
                strokeWidth: strokeWidth || 1.2,
            });
            addTemplateObject(node, templateId);
        }

        function addLine(x1, y1, x2, y2, strokeWidth) {
            const node = new fabric.Line([x1, y1, x2, y2], {
                stroke: '#334155',
                strokeWidth: strokeWidth || 1.2,
            });
            addTemplateObject(node, templateId);
        }

        function addLabel(text, x, y, size, color) {
            addTemplateText(text, {
                left: x,
                top: y,
                fontFamily: 'Sarabun',
                fontSize: size || 16,
                fill: color || '#475569',
            }, templateId);
        }

        const familyKey = resolveTemplateFamilyKey(template);
        if (isNewVisualTemplate(template)) {
            const handled = renderNewFamilyTemplate(familyKey, {
                left,
                top,
                width,
                variant,
                addRect,
                addLabel,
                addCircle,
                addLine,
            });
            if (handled) {
                canvas.requestRenderAll();
                markSaving();
                window.showToast?.(`สร้าง ${template.id} แล้ว`);
                return;
            }
        }

        if (mode === 'reading_analysis') {
            const passageH = [180, 210, 240, 200][variant];
            const prompt = ['Key Details', 'Inference', 'Author Craft', 'Text Evidence'][variant];
            addRect(left, top, width, passageH, 1.5);
            addLabel(`Reading Passage (${prompt})`, left + 10, top + 10, 15);
            const qTop = top + 226;
            const qCount = [5, 6, 7, 6][variant];
            for (let i = 0; i < qCount; i++) {
                addLabel(`${i + 1}) Evidence-based question`, left, qTop + i * 44, 20, '#334155');
            }
        } else if (mode === 'writing_builder') {
            const blockSets = [
                ['Hook', 'Claim/Topic Sentence', 'Evidence 1', 'Evidence 2', 'Conclusion'],
                ['Prompt Analysis', 'Thesis Draft', 'Reasoning', 'Counterclaim', 'Revision Goal'],
                ['Narrative Setup', 'Conflict', 'Rising Action', 'Climax', 'Resolution'],
                ['Topic', 'Facts', 'Examples', 'Transition Plan', 'Closing'],
            ];
            const blocks = blockSets[variant];
            blocks.forEach((name, index) => {
                const y = top + index * 96;
                addRect(left, y, width, 86, 1.3);
                addLabel(name, left + 10, y + 8, 15);
            });
        } else if (mode === 'vocab_stations') {
            const layoutByVariant = [{ cols: 2, rows: 4 }, { cols: 3, rows: 3 }, { cols: 2, rows: 5 }, { cols: 3, rows: 2 }];
            const cols = layoutByVariant[variant].cols;
            const rows = layoutByVariant[variant].rows;
            const cellW = (width - 14) / cols;
            const cellH = [108, 96, 86, 124][variant];
            const labels = ['Word', 'Definition', 'Example Sentence', 'Picture Clue', 'Prefix/Suffix', 'Synonym/Antonym', 'Syllables', 'Use in Context'];
            let i = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = left + c * (cellW + 14);
                    const y = top + r * (cellH + 10);
                    addRect(x, y, cellW, cellH, 1.2);
                    addLabel(labels[i++] || 'Vocabulary Block', x + 8, y + 8, 14);
                }
            }
        } else if (mode === 'math_drill' || mode === 'math_problem_set') {
            const rows = mode === 'math_drill' ? 12 : 10;
            for (let i = 0; i < rows; i++) {
                addLabel(`${i + 1}) __________________  =  _______`, left, top + i * 42, 20, '#334155');
            }
            addRect(left + width - 220, top, 220, 180, 1.2);
            addLabel('Work Area', left + width - 210, top + 8, 14);
        } else if (mode === 'algebra_workspace') {
            addRect(left, top, width * 0.56, 430, 1.4);
            addLabel('Problem Steps', left + 10, top + 10, 15);
            for (let i = 0; i < 7; i++) {
                addLabel(`Step ${i + 1}: ______________________`, left + 12, top + 42 + i * 52, 17, '#334155');
            }
            addRect(left + width * 0.6, top, width * 0.4, 430, 1.4);
            addLabel('Graph / Table Space', left + width * 0.6 + 10, top + 10, 15);
        } else if (mode === 'science_lab_sheet') {
            const blocks = ['Question', 'Hypothesis', 'Variables & Controls', 'Procedure', 'Data Table', 'Conclusion'];
            blocks.forEach((name, index) => {
                const y = top + index * 72;
                addRect(left, y, width, 64, 1.2);
                addLabel(name, left + 10, y + 8, 14);
            });
        } else if (mode === 'history_source_sheet') {
            addRect(left, top, width, 160, 1.3);
            addLabel('Primary Source Excerpt / Image Notes', left + 10, top + 10, 14);
            addRect(left, top + 178, width * 0.48, 240, 1.2);
            addRect(left + width * 0.52, top + 178, width * 0.48, 240, 1.2);
            addLabel('Context & Bias', left + 8, top + 188, 14);
            addLabel('Claim & Evidence', left + width * 0.52 + 8, top + 188, 14);
        } else if (mode === 'sel_reflection_journal') {
            addRect(left, top, width, 96, 1.2);
            addLabel('Mood Check-in (1-5): ___', left + 10, top + 10, 15);
            addRect(left, top + 112, width, 120, 1.2);
            addLabel('Today I learned...', left + 10, top + 122, 15);
            addRect(left, top + 248, width, 120, 1.2);
            addLabel('Next action / personal goal', left + 10, top + 258, 15);
            addRect(left, top + 384, width, 74, 1.2);
            addLabel('Gratitude / reflection', left + 10, top + 394, 15);
        } else if (mode === 'game_grid') {
            const rows = [8, 10, 7, 9][variant];
            const cols = [8, 10, 9, 7][variant];
            const cell = Math.min(56, Math.floor((width - 20) / cols));
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    addRect(left + c * cell, top + r * cell, cell, cell, 1);
                }
            }
            const footerTitle = ['Word Bank / Clues:', 'Puzzle Clues:', 'Rules / Constraints:', 'Challenge Inputs:'][variant];
            addLabel(footerTitle, left, top + rows * cell + 10, 14);
            addRect(left, top + rows * cell + 36, width, 100, 1.1);
        } else if (mode === 'taskcards_layout') {
            const gridByVariant = [{ cols: 2, rows: 4 }, { cols: 4, rows: 2 }, { cols: 3, rows: 3 }, { cols: 2, rows: 5 }];
            const cols = gridByVariant[variant].cols;
            const rows = gridByVariant[variant].rows;
            const cardW = (width - 14) / cols;
            const cardH = [102, 120, 88, 82][variant];
            let idx = 1;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = left + c * (cardW + 14);
                    const y = top + r * (cardH + 10);
                    addRect(x, y, cardW, cardH, 1.2);
                    addLabel(`Card ${idx++}`, x + 8, y + 8, 14);
                }
            }
        } else if (mode === 'organizer_canvas') {
            const centerY = [150, 190, 220, 170][variant];
            addRect(left + width * 0.35, top + centerY, width * 0.3, 70, 1.3);
            addLabel('Main Concept', left + width * 0.39, top + centerY + 24, 14);
            const branchSets = [
                [[left, top + 40], [left + width * 0.7, top + 40], [left, top + 290], [left + width * 0.7, top + 290]],
                [[left, top + 70], [left + width * 0.7, top + 70], [left, top + 330], [left + width * 0.7, top + 330]],
                [[left + width * 0.05, top + 90], [left + width * 0.65, top + 90], [left + width * 0.05, top + 360], [left + width * 0.65, top + 360]],
                [[left, top + 110], [left + width * 0.7, top + 110], [left, top + 300], [left + width * 0.7, top + 300]],
            ];
            const branches = branchSets[variant];
            branches.forEach((point, index) => {
                addRect(point[0], point[1], width * 0.3, 68, 1.2);
                addLabel(`Branch ${index + 1}`, point[0] + 10, point[1] + 22, 14);
            });
        } else if (mode === 'assessment_pack') {
            const count = [10, 12, 8, 11][variant];
            const promptByVariant = ['Question', 'Item', 'Prompt', 'Task'];
            for (let i = 0; i < count; i++) {
                addLabel(`${i + 1}) ${promptByVariant[variant]} _________________________________`, left, top + i * 36, 18, '#334155');
            }
            const notesTop = top + count * 36 + 28;
            addRect(left, notesTop, width, 66, 1.2);
            addLabel('Teacher Notes / Rubric Criteria', left + 10, notesTop + 18, 14);
            if (template.hasAnswerKey) {
                addLabel('Answer Key: Included', left, notesTop + 76, 14, '#64748b');
            }
        } else if (mode === 'project_planner') {
            const cols = 2;
            const rows = 3;
            const boxW = (width - 14) / cols;
            const boxH = 118;
            const nameSets = [
                ['Driving Question', 'Research Sources', 'Milestones', 'Team Roles', 'Presentation Plan', 'Success Criteria'],
                ['Problem Frame', 'Data Sources', 'Work Sprint Plan', 'Dependencies', 'Checkpoint Review', 'Final Deliverable'],
                ['Inquiry Goal', 'Evidence Collection', 'Risk Log', 'Role Ownership', 'Storyboard', 'Peer Critique'],
                ['Outcome Statement', 'Resource Plan', 'Timeline Blocks', 'Task Delegation', 'Rehearsal Plan', 'Reflection'],
            ];
            const names = nameSets[variant];
            let n = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = left + c * (boxW + 14);
                    const y = top + r * (boxH + 10);
                    addRect(x, y, boxW, boxH, 1.2);
                    addLabel(names[n++] || 'Project Block', x + 8, y + 8, 14);
                }
            }
        } else if (mode === 'seasonal_routine') {
            addRect(left, top, width, 86, 1.2);
            const seasonLabels = ['Daily Focus / Theme', 'Weekly Ritual Focus', 'Event Routine Plan', 'Classroom Flow Focus'];
            addLabel(seasonLabels[variant], left + 10, top + 10, 14);
            const cols = 3;
            const boxW = (width - 20) / cols;
            const routineCount = [6, 9, 6, 8][variant];
            for (let i = 0; i < routineCount; i++) {
                const r = Math.floor(i / cols);
                const c = i % cols;
                const x = left + c * (boxW + 10);
                const y = top + 104 + r * 128;
                addRect(x, y, boxW, 118, 1.1);
                addLabel(`Routine ${i + 1}`, x + 8, y + 8, 13);
            }
        } else if (template.format === 'organizer') {
            const sections = Math.min(6, Math.max(3, Number(preset.sections || 4)));
            const boxH = 96;
            for (let i = 0; i < sections; i++) {
                const y = top + i * (boxH + 8);
                addRect(left, y, width, boxH, 1.5);
                addLabel(`Section ${i + 1}`, left + 10, y + 8, 16);
            }
        } else if (template.format === 'activity') {
            const rows = Math.min(12, Math.max(6, Number(preset.rows || 8)));
            const cols = Math.min(3, Math.max(2, Number(preset.cols || 2)));
            const cellW = (width - (cols - 1) * 10) / cols;
            const cellH = 64;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = left + c * (cellW + 10);
                    const y = top + r * (cellH + 8);
                    addRect(x, y, cellW, cellH, 1.2);
                }
            }
        } else if (template.format === 'assessment') {
            const items = Math.min(18, Math.max(8, Number(preset.items || 10)));
            for (let i = 0; i < items; i++) {
                const y = top + i * 46;
                addLabel(`${i + 1}) ____________________________________`, left, y, 21, '#334155');
            }
            if (template.hasAnswerKey) {
                addLabel('Answer Key: Included', left, top + items * 46 + 8, 14, '#64748b');
            }
        } else if (template.format === 'planner') {
            const blocks = Math.min(8, Math.max(4, Number(preset.blocks || 6)));
            const h = 84;
            for (let i = 0; i < blocks; i++) {
                const y = top + i * (h + 8);
                addRect(left, y, width, h, 1.2);
                addLabel(`Plan Block ${i + 1}`, left + 10, y + 8, 15);
            }
        } else {
            const rows = Math.min(16, Math.max(8, Number(preset.rows || 10)));
            for (let i = 0; i < rows; i++) {
                const y = top + i * 44;
                addLabel(`${i + 1}. _________________________________`, left, y, 22, '#334155');
            }
        }

        canvas.requestRenderAll();
        markSaving();
        window.showToast?.(`สร้าง ${template.id} แล้ว`);
    }

    function setupCatalogTemplatePanel(rootId, catalog, handlerMap, emptyText) {
        const root = document.getElementById(rootId);
        if (!root) return;
        if (!catalog.length) {
            root.innerHTML = `<div class="template-empty">${emptyText}</div>`;
            return;
        }
        root.innerHTML = catalog
            .map(item => `<button class="wavea-template-btn" id="btnTpl_${item.id}" data-template-id="${item.id}" title="${item.title}">${item.id} — ${item.title}</button>`)
            .join('');

        root.querySelectorAll('.wavea-template-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.templateId;
                const item = catalog.find(x => x.id === id);
                const handlerKey = typeof templateHandlersApi.resolveHandlerKey === 'function'
                    ? templateHandlersApi.resolveHandlerKey(item, handlerMap)
                    : 'generate_from_catalog';
                if (handlerKey !== 'generate_from_catalog') return;
                addWaveATemplateFromCatalog(item);
            });
        });
    }

    function setupEvents() {
        document.getElementById('templateSearch')?.addEventListener('input', refreshTemplateGallery);
        document.getElementById('templateCategoryFilter')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('templateThemeKeyword')?.addEventListener('input', refreshTemplateGallery);
        document.getElementById('templateIconMode')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('templateGradeBand')?.addEventListener('change', () => {
            syncGradeOptions();
            refreshTemplateGallery();
        });
        document.getElementById('templateGrade')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('templateDifficulty')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('templateFormat')?.addEventListener('change', refreshTemplateGallery);
        document.getElementById('btnTemplateClearFilters')?.addEventListener('click', () => {
            resetTemplateFilters();
            emitTelemetry('template_filters_reset', { source: 'clear_button' });
            refreshTemplateGallery();
        });
        document.getElementById('btnTemplateTelemetryDump')?.addEventListener('click', () => {
            const snapshot = window.wbGetTelemetrySnapshot?.() || { counts: {}, events: [], lastUpdatedAt: 0 };
            downloadTelemetrySnapshot(snapshot);
            emitTelemetry('template_telemetry_dump', {
                totalEvents: Array.isArray(snapshot.events) ? snapshot.events.length : 0,
            });
            updateTelemetryPanel();
            window.showToast?.('📦 Telemetry JSON ถูกดาวน์โหลดแล้ว');
        });
        document.getElementById('btnTemplateTelemetryClear')?.addEventListener('click', () => {
            const ok = window.confirm('ล้าง telemetry ทั้งหมดใช่หรือไม่?');
            if (!ok) return;
            window.wbClearTelemetry?.();
            emitTelemetry('template_telemetry_cleared', { source: 'template_panel' });
            refreshTemplateGallery();
            updateTelemetryPanel();
            window.showToast?.('🧹 ล้าง telemetry แล้ว');
        });
        document.getElementById('btnTemplateTelemetryRefresh')?.addEventListener('click', () => {
            updateTelemetryPanel();
            window.showToast?.('🔄 รีเฟรช telemetry แล้ว');
        });
        document.querySelectorAll('#templateSegments .template-segment').forEach(btn => {
            btn.addEventListener('click', () => {
                templateFilterState.segment = btn.dataset.segment || 'all';
                document.querySelectorAll('#templateSegments .template-segment').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                emitTelemetry('template_segment_changed', { segment: templateFilterState.segment });
                refreshTemplateGallery();
            });
        });
        document.getElementById('btnGenerateTemplateFromCatalog')?.addEventListener('click', () => {
            const state = buildTemplateFilterState();
            const template = pickPrimaryCatalogTemplate(state);
            if (!template) {
                window.showToast?.('ไม่พบ Catalog template ที่ตรงกับตัวกรอง');
                return;
            }
            addWaveATemplateFromCatalog(template, getTemplateGenerationOptions());
            emitTelemetry('template_generate_one_click', {
                templateId: template.id,
                category: template.category,
                iconMode: state.iconMode,
                hasThemeKeyword: !!state.themeKeyword,
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

        bindGeneratorRegistryEvents();
        document.getElementById('btnGenerateAnswerKey')?.addEventListener('click', () => window.wbGenerateAnswerKeyPage?.());
        document.getElementById('btnPlaySlideshow')?.addEventListener('click', startSlideshow);

        document.getElementById('btnInsertHeadingQuick')?.addEventListener('click', () => addTextPreset('heading'));
        document.getElementById('btnInsertSubheadingQuick')?.addEventListener('click', () => addTextPreset('subheading'));
        document.getElementById('btnInsertBodyQuick')?.addEventListener('click', () => addTextPreset('body'));
        document.getElementById('btnTextCurveQuick')?.addEventListener('click', convertTextToCurve);
        document.getElementById('btnGoBordersTab')?.addEventListener('click', () => activateSidebarTab('bordersTab'));
        document.getElementById('btnOpenMarketDashboard')?.addEventListener('click', () => {
            document.getElementById('marketDashboardModal')?.style.setProperty('display', 'flex');
        });
        document.getElementById('btnOpenAIPromptGuide')?.addEventListener('click', () => showAIPromptGuide(true));
        document.getElementById('aiPromptGuideClose')?.addEventListener('click', () => showAIPromptGuide(false));
        document.getElementById('aiPromptGuideModal')?.addEventListener('click', (e) => {
            if (e.target?.id === 'aiPromptGuideModal') showAIPromptGuide(false);
        });

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
        buildBorderGallery('borderGallery', allBorderCards, (item) => addBorder(item.key));
        setupCatalogTemplatePanel('waveATemplateList', waveACatalog, waveAHandlerMap, 'ยังไม่มี Wave A catalog');
        setupCatalogTemplatePanel('waveBTemplateList', waveBCatalog, waveBHandlerMap, 'ยังไม่มี Wave B catalog');
        setupCatalogTemplatePanel('waveCTemplateList', waveCCatalog, waveCHandlerMap, 'ยังไม่มี Wave C catalog');
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
