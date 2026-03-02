(function (root) {
    function toDataUri(svg) {
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    function buildThumbnail(title, subtitle, accent) {
        return toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"><rect width="360" height="220" rx="16" fill="#ffffff"/><rect x="14" y="14" width="332" height="192" rx="12" fill="#f8fafc" stroke="${accent}" stroke-width="3"/><rect x="26" y="28" width="188" height="20" rx="8" fill="${accent}" opacity="0.18"/><rect x="26" y="60" width="308" height="112" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><rect x="36" y="74" width="284" height="2" fill="#e2e8f0"/><rect x="36" y="92" width="284" height="2" fill="#e2e8f0"/><rect x="36" y="110" width="284" height="2" fill="#e2e8f0"/><rect x="36" y="128" width="284" height="2" fill="#e2e8f0"/><text x="26" y="196" font-family="Sarabun, Arial" font-size="14" fill="#475569">${subtitle}</text><text x="26" y="44" font-family="Sarabun, Arial" font-size="14" font-weight="700" fill="#0f172a">${title}</text></svg>`);
    }

    function textObj(text, left, top, fontSize, extra) {
        const width = Number(extra?.width || 620);
        return {
            type: 'textbox',
            text,
            left,
            top,
            width,
            fontFamily: 'Sarabun',
            fontSize: fontSize || 22,
            fill: '#1e293b',
            ...extra,
        };
    }

    function rectObj(left, top, width, height, extra) {
        return {
            type: 'rect',
            left,
            top,
            width,
            height,
            fill: 'transparent',
            stroke: '#334155',
            strokeWidth: 1.4,
            selectable: true,
            evented: true,
            padding: 8,
            ...extra,
        };
    }

    function fillRect(left, top, width, height, extra) {
        return {
            type: 'rect',
            left,
            top,
            width,
            height,
            fill: '#ffffff',
            stroke: '#334155',
            strokeWidth: 1.4,
            selectable: true,
            evented: true,
            padding: 6,
            ...extra,
        };
    }

    function buildHandwritingThai() {
        const objects = [
            textObj('ใบงานคัดลายมือภาษาไทย', 68, 44, 32, { fontFamily: 'Fredoka' }),
        ];
        const left = 70;
        const width = 654;
        for (let i = 0; i < 8; i++) {
            const y = 120 + i * 112;
            objects.push(rectObj(left, y, width, 2, { fill: '#64748b' }));
            objects.push(rectObj(left, y + 36, width, 1.5, { fill: '#94a3b8', strokeDashArray: [4, 5] }));
            objects.push(rectObj(left, y + 72, width, 2, { fill: '#64748b' }));
            objects.push(textObj(`${i + 1}. _____________________________`, left + 8, y + 80, 20));
        }
        return { version: '5.2.4', objects };
    }

    function buildMatching() {
        const objects = [
            textObj('ใบงานจับคู่คำศัพท์', 68, 44, 32, { fontFamily: 'Fredoka' }),
            textObj('จับคู่คำด้านซ้ายกับคำอธิบายด้านขวา', 70, 90, 18, { fill: '#475569' }),
        ];
        for (let i = 0; i < 10; i++) {
            const y = 140 + i * 86;
            objects.push(fillRect(78, y, 250, 56, { rx: 8, ry: 8 }));
            objects.push(fillRect(466, y, 250, 56, { rx: 8, ry: 8 }));
            objects.push(textObj(`${i + 1}. __________`, 92, y + 14, 20));
            objects.push(textObj(`${String.fromCharCode(65 + i)}. __________`, 480, y + 14, 20));
        }
        return { version: '5.2.4', objects };
    }

    function buildFillBlank() {
        const objects = [
            textObj('เติมคำในช่องว่าง', 68, 44, 32, { fontFamily: 'Fredoka' }),
        ];
        for (let i = 0; i < 12; i++) {
            const y = 126 + i * 74;
            objects.push(textObj(`${i + 1}. ________________________________________________`, 70, y, 20));
        }
        return { version: '5.2.4', objects };
    }

    function buildMindMap() {
        const objects = [
            textObj('Mind Map', 68, 40, 34, { fontFamily: 'Fredoka' }),
            fillRect(300, 430, 190, 96, { rx: 16, ry: 16, strokeWidth: 2.2 }),
            textObj('หัวข้อหลัก', 346, 466, 28, { fontFamily: 'Fredoka' }),
        ];
        const nodes = [
            { x: 90, y: 178, w: 210, h: 90, label: 'ไอเดีย 1' },
            { x: 500, y: 178, w: 210, h: 90, label: 'ไอเดีย 2' },
            { x: 90, y: 680, w: 210, h: 90, label: 'ไอเดีย 3' },
            { x: 500, y: 680, w: 210, h: 90, label: 'ไอเดีย 4' },
        ];
        nodes.forEach((node) => {
            objects.push(fillRect(node.x, node.y, node.w, node.h, { rx: 14, ry: 14 }));
            objects.push(textObj(node.label, node.x + 64, node.y + 28, 24));
        });
        objects.push(rectObj(300, 478, -40, -220, { fill: '#64748b', width: 340, height: 2 }));
        objects.push(rectObj(490, 478, 220, -220, { fill: '#64748b', width: 2, height: 340 }));
        objects.push(rectObj(300, 478, -40, 250, { fill: '#64748b', width: 340, height: 2 }));
        objects.push(rectObj(490, 478, 220, 250, { fill: '#64748b', width: 2, height: 340 }));
        return { version: '5.2.4', objects };
    }

    function buildTenFrameMath() {
        const objects = [
            textObj('Ten Frames (ฝึกนับจำนวน)', 68, 44, 30, { fontFamily: 'Fredoka' }),
        ];
        const startX = 80;
        const startY = 130;
        const frameW = 280;
        const frameH = 120;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 2; c++) {
                const left = startX + c * 320;
                const top = startY + r * 180;
                objects.push(fillRect(left, top, frameW, frameH, { strokeWidth: 2 }));
                for (let i = 1; i < 5; i++) objects.push(rectObj(left + i * (frameW / 5), top, 1.5, frameH, { fill: '#64748b' }));
                objects.push(rectObj(left, top + frameH / 2, frameW, 1.5, { fill: '#64748b' }));
                objects.push(textObj('นับ = ____', left + 88, top + 132, 18));
            }
        }
        return { version: '5.2.4', objects };
    }

    function buildNumberLine() {
        const objects = [
            textObj('Number Line', 68, 60, 34, { fontFamily: 'Fredoka' }),
            rectObj(100, 340, 600, 3, { fill: '#334155', strokeWidth: 0 }),
            rectObj(100, 700, 600, 3, { fill: '#334155', strokeWidth: 0 }),
        ];
        for (let i = 0; i <= 10; i++) {
            const x = 100 + i * 60;
            objects.push(rectObj(x, 325, 2, 34, { fill: '#334155', strokeWidth: 0 }));
            objects.push(rectObj(x, 685, 2, 34, { fill: '#334155', strokeWidth: 0 }));
            objects.push(textObj(String(i), x - 6, 364, 18));
            objects.push(textObj(String(i * 10), x - 10, 724, 18));
        }
        return { version: '5.2.4', objects };
    }

    function buildObservationSheet() {
        const objects = [
            textObj('Science Observation Sheet', 68, 44, 30, { fontFamily: 'Fredoka' }),
            fillRect(70, 104, 654, 940, { strokeWidth: 2 }),
            textObj('หัวข้อการทดลอง: ___________________________', 86, 124, 20),
            textObj('สมมติฐาน: __________________________________', 86, 158, 20),
            textObj('อุปกรณ์: ____________________________________', 86, 192, 20),
            fillRect(86, 242, 620, 210, { strokeDashArray: [8, 6] }),
            textObj('บันทึกการสังเกต', 92, 250, 18, { fill: '#475569' }),
            fillRect(86, 476, 620, 240, { strokeDashArray: [8, 6] }),
            textObj('ผลการทดลอง / ข้อสรุป', 92, 484, 18, { fill: '#475569' }),
            fillRect(86, 738, 620, 290, { strokeDashArray: [8, 6] }),
            textObj('คำถามต่อยอด', 92, 746, 18, { fill: '#475569' }),
        ];
        return { version: '5.2.4', objects };
    }

    function buildDailySchedule() {
        const objects = [
            textObj('Daily Schedule', 68, 44, 32, { fontFamily: 'Fredoka' }),
        ];
        for (let i = 0; i < 8; i++) {
            const y = 122 + i * 110;
            objects.push(fillRect(78, y, 170, 88, { rx: 8, ry: 8 }));
            objects.push(fillRect(264, y, 460, 88, { rx: 8, ry: 8 }));
            objects.push(textObj(`${String(i + 8).padStart(2, '0')}:00`, 116, y + 28, 24, { fontFamily: 'Fredoka' }));
            objects.push(textObj('กิจกรรม: ____________________________', 284, y + 30, 22));
        }
        return { version: '5.2.4', objects };
    }

    function buildExitTicket() {
        const objects = [
            textObj('Exit Ticket', 68, 44, 32, { fontFamily: 'Fredoka' }),
            textObj('ชื่อ: ______________________  ห้อง: ______  วันที่: ___________', 70, 96, 18),
        ];
        const blocks = [
            { title: '1) วันนี้ฉันได้เรียนรู้...', y: 152 },
            { title: '2) สิ่งที่ยังสงสัย...', y: 352 },
            { title: '3) ตัวอย่างที่ฉันทำได้...', y: 552 },
            { title: '4) Self-rating (1-5): ____', y: 752 },
        ];
        blocks.forEach((block) => {
            objects.push(fillRect(70, block.y, 654, 172, { rx: 10, ry: 10 }));
            objects.push(textObj(block.title, 84, block.y + 14, 20));
            objects.push(fillRect(84, block.y + 48, 626, 106, { strokeDashArray: [8, 6] }));
        });
        return { version: '5.2.4', objects };
    }

    function buildTChart() {
        const objects = [
            textObj('T-Chart (เปรียบเทียบ)', 68, 44, 30, { fontFamily: 'Fredoka' }),
            fillRect(70, 108, 654, 920, { strokeWidth: 2 }),
            rectObj(396, 108, 2, 920, { fill: '#334155', strokeWidth: 0 }),
            rectObj(70, 190, 654, 2, { fill: '#334155', strokeWidth: 0 }),
            textObj('หัวข้อซ้าย', 86, 136, 24, { fontFamily: 'Fredoka' }),
            textObj('หัวข้อขวา', 416, 136, 24, { fontFamily: 'Fredoka' }),
        ];
        for (let i = 0; i < 18; i++) {
            const y = 220 + i * 44;
            objects.push(rectObj(84, y, 298, 1.5, { fill: '#cbd5e1', strokeWidth: 0 }));
            objects.push(rectObj(412, y, 298, 1.5, { fill: '#cbd5e1', strokeWidth: 0 }));
        }
        return { version: '5.2.4', objects };
    }

    function buildProjectPlanner() {
        const objects = [
            textObj('Project Planner', 68, 44, 32, { fontFamily: 'Fredoka' }),
            textObj('ชื่อโครงงาน: ________________________________', 70, 96, 18),
            fillRect(70, 134, 654, 170, { rx: 10, ry: 10 }),
            textObj('เป้าหมายโครงงาน', 84, 146, 18, { fill: '#475569' }),
            fillRect(70, 322, 654, 210, { rx: 10, ry: 10 }),
            textObj('ขั้นตอนดำเนินงาน (Milestones)', 84, 334, 18, { fill: '#475569' }),
            fillRect(70, 550, 654, 210, { rx: 10, ry: 10 }),
            textObj('ผู้รับผิดชอบ / ทรัพยากร', 84, 562, 18, { fill: '#475569' }),
            fillRect(70, 778, 654, 250, { rx: 10, ry: 10 }),
            textObj('ความคืบหน้า / สิ่งที่ต้องปรับ', 84, 790, 18, { fill: '#475569' }),
        ];
        return { version: '5.2.4', objects };
    }

    function buildReadingComprehension() {
        const objects = [
            textObj('Reading Comprehension', 68, 44, 30, { fontFamily: 'Fredoka' }),
            fillRect(70, 102, 654, 430, { rx: 10, ry: 10 }),
            textObj('บทอ่าน', 84, 114, 18, { fill: '#475569' }),
            fillRect(70, 548, 654, 480, { rx: 10, ry: 10 }),
            textObj('คำถาม', 84, 560, 18, { fill: '#475569' }),
        ];
        for (let i = 0; i < 14; i++) {
            const y = 146 + i * 26;
            objects.push(rectObj(86, y, 620, 1.2, { fill: '#cbd5e1', strokeWidth: 0 }));
        }
        for (let i = 0; i < 8; i++) {
            const y = 592 + i * 54;
            objects.push(textObj(`${i + 1}. ________________________________________________`, 86, y, 20));
        }
        return { version: '5.2.4', objects };
    }

    function buildRubric4() {
        const objects = [
            textObj('Rubric 4 Levels', 68, 44, 30, { fontFamily: 'Fredoka' }),
            fillRect(70, 110, 654, 918, { strokeWidth: 2 }),
        ];
        const left = 70;
        const top = 110;
        const width = 654;
        const height = 918;
        const colW = width / 5;
        const rowH = height / 6;
        for (let c = 1; c < 5; c++) {
            objects.push(rectObj(left + c * colW, top, 1.6, height, { fill: '#334155', strokeWidth: 0 }));
        }
        for (let r = 1; r < 6; r++) {
            objects.push(rectObj(left, top + r * rowH, width, 1.6, { fill: '#334155', strokeWidth: 0 }));
        }
        objects.push(textObj('เกณฑ์', left + 18, top + 14, 18, { fontFamily: 'Fredoka' }));
        ['4', '3', '2', '1'].forEach((level, idx) => {
            objects.push(textObj(`ระดับ ${level}`, left + colW * (idx + 1) + 16, top + 14, 18, { fontFamily: 'Fredoka' }));
        });
        for (let r = 0; r < 5; r++) {
            objects.push(textObj(`Criterion ${r + 1}`, left + 12, top + rowH * (r + 1) + 14, 16));
        }
        return { version: '5.2.4', objects };
    }

    function buildTaskCards8() {
        const objects = [
            textObj('Task Cards x8', 68, 44, 30, { fontFamily: 'Fredoka' }),
        ];
        const marginX = 70;
        const marginY = 110;
        const gapX = 16;
        const gapY = 16;
        const cardW = (794 - marginX * 2 - gapX) / 2;
        const cardH = (1123 - marginY * 2 - gapY * 3) / 4;
        let n = 1;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 2; c++) {
                const left = marginX + c * (cardW + gapX);
                const top = marginY + r * (cardH + gapY);
                objects.push(fillRect(left, top, cardW, cardH, { rx: 8, ry: 8, strokeDashArray: [8, 6] }));
                objects.push(textObj(`${n++}.`, left + 12, top + 10, 20, { fontFamily: 'Fredoka' }));
            }
        }
        return { version: '5.2.4', objects };
    }

    function buildStorySequence() {
        const objects = [
            textObj('Story Sequence', 68, 44, 30, { fontFamily: 'Fredoka' }),
        ];
        const left = 70;
        const width = 654;
        const stepW = (width - 24) / 3;
        const boxY = 132;
        const boxH = 360;
        ['Beginning', 'Middle', 'End'].forEach((label, idx) => {
            const x = left + idx * (stepW + 12);
            objects.push(fillRect(x, boxY, stepW, boxH, { rx: 10, ry: 10 }));
            objects.push(textObj(label, x + 12, boxY + 12, 20, { fontFamily: 'Fredoka' }));
            objects.push(fillRect(x + 10, boxY + 50, stepW - 20, 184, { strokeDashArray: [6, 5], rx: 8, ry: 8 }));
            objects.push(rectObj(x + 10, boxY + 260, stepW - 20, 1.2, { fill: '#cbd5e1', strokeWidth: 0 }));
            objects.push(rectObj(x + 10, boxY + 296, stepW - 20, 1.2, { fill: '#cbd5e1', strokeWidth: 0 }));
            objects.push(rectObj(x + 10, boxY + 332, stepW - 20, 1.2, { fill: '#cbd5e1', strokeWidth: 0 }));
        });
        return { version: '5.2.4', objects };
    }

    const CURATED_TEMPLATES = [
        {
            id: 'CUR-WS-001',
            title: 'ใบงานคัดลายมือไทย (เส้นประ)',
            desc: 'เส้นคัดลายมือแบบทึบ-ประ-ทึบ พร้อมบรรทัดเลขข้อ',
            category: 'curated_worksheet',
            subCategory: 'handwriting',
            format: 'worksheet',
            gradeBands: ['elementary'],
            grades: ['kindergarten', 'g1', 'g2'],
            subjects: ['language'],
            skills: ['writing'],
            difficulty: 'beginner',
            tags: ['thai', 'handwriting', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Thai Handwriting', 'เส้นคัดลายมือพร้อมเลขข้อ', '#0ea5e9'),
            canvasData: buildHandwritingThai(),
        },
        {
            id: 'CUR-WS-002',
            title: 'ใบงานจับคู่คำศัพท์',
            desc: 'คอลัมน์ซ้าย-ขวา พร้อมกรอบตอบคำถาม',
            category: 'curated_worksheet',
            subCategory: 'matching',
            format: 'worksheet',
            gradeBands: ['elementary', 'middle'],
            grades: ['g2', 'g3', 'g4', 'g5', 'g6'],
            subjects: ['language'],
            skills: ['vocabulary', 'reading'],
            difficulty: 'beginner',
            tags: ['matching', 'vocabulary', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Vocabulary Matching', 'จับคู่คำกับความหมาย', '#f97316'),
            canvasData: buildMatching(),
        },
        {
            id: 'CUR-WS-003',
            title: 'เติมคำในช่องว่าง',
            desc: 'แบบฝึกเติมคำ 12 ข้อ ใช้ได้หลายวิชา',
            category: 'curated_worksheet',
            subCategory: 'fillblank',
            format: 'worksheet',
            gradeBands: ['elementary', 'middle', 'high'],
            grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9'],
            subjects: ['language'],
            skills: ['reading', 'writing'],
            difficulty: 'beginner',
            tags: ['fillblank', 'language', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Fill in the Blank', '12 ข้อ พร้อมเส้นคำตอบ', '#8b5cf6'),
            canvasData: buildFillBlank(),
        },
        {
            id: 'CUR-WS-004',
            title: 'Mind Map 4 กิ่ง',
            desc: 'ผังความคิดพร้อมช่องย่อย 4 ทิศ',
            category: 'curated_worksheet',
            subCategory: 'mindmap',
            format: 'organizer',
            gradeBands: ['middle', 'high'],
            grades: ['g6', 'g7', 'g8', 'g9', 'g10'],
            subjects: ['project'],
            skills: ['analysis', 'communication'],
            difficulty: 'intermediate',
            tags: ['mindmap', 'organizer', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Mind Map', 'หัวข้อหลัก + ไอเดีย 4 กิ่ง', '#22c55e'),
            canvasData: buildMindMap(),
        },
        {
            id: 'CUR-WS-005',
            title: 'Ten Frames ฝึกนับ',
            desc: 'เฟรม 10 ช่องจำนวน 6 ชุด สำหรับคณิตพื้นฐาน',
            category: 'curated_worksheet',
            subCategory: 'math',
            format: 'worksheet',
            gradeBands: ['elementary'],
            grades: ['kindergarten', 'g1', 'g2', 'g3'],
            subjects: ['math'],
            skills: ['computation'],
            difficulty: 'beginner',
            tags: ['ten-frame', 'counting', 'math', 'free-curated'],
            thumbnail: buildThumbnail('Ten Frames', 'ฝึกนับจำนวนและเขียนคำตอบ', '#06b6d4'),
            canvasData: buildTenFrameMath(),
        },
        {
            id: 'CUR-WS-006',
            title: 'Number Line 0-10 และ 0-100',
            desc: 'เส้นจำนวนสองระดับในแผ่นเดียว',
            category: 'curated_worksheet',
            subCategory: 'math',
            format: 'worksheet',
            gradeBands: ['elementary', 'middle'],
            grades: ['g2', 'g3', 'g4', 'g5', 'g6'],
            subjects: ['math'],
            skills: ['computation', 'reasoning'],
            difficulty: 'beginner',
            tags: ['numberline', 'math', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Number Line', '0-10 และ 0-100', '#14b8a6'),
            canvasData: buildNumberLine(),
        },
        {
            id: 'CUR-WS-007',
            title: 'แบบบันทึกการทดลองวิทยาศาสตร์',
            desc: 'ฟอร์มบันทึกสมมติฐาน สังเกตการณ์ และสรุปผล',
            category: 'curated_worksheet',
            subCategory: 'science',
            format: 'worksheet',
            gradeBands: ['middle', 'high'],
            grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11'],
            subjects: ['science'],
            skills: ['analysis', 'writing'],
            difficulty: 'intermediate',
            tags: ['science', 'lab', 'observation', 'free-curated'],
            thumbnail: buildThumbnail('Science Lab Sheet', 'สังเกตการณ์และสรุปผล', '#3b82f6'),
            canvasData: buildObservationSheet(),
        },
        {
            id: 'CUR-WS-008',
            title: 'ตารางกิจกรรมรายวัน',
            desc: 'Daily schedule 8 ช่วงเวลา',
            category: 'curated_worksheet',
            subCategory: 'planner',
            format: 'planner',
            gradeBands: ['elementary', 'middle', 'high'],
            grades: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'],
            subjects: ['planning'],
            skills: ['reflection', 'communication'],
            difficulty: 'beginner',
            tags: ['schedule', 'planner', 'classroom', 'free-curated'],
            thumbnail: buildThumbnail('Daily Schedule', '8 ช่วงเวลา พร้อมกิจกรรม', '#6366f1'),
            canvasData: buildDailySchedule(),
        },
        {
            id: 'CUR-WS-009',
            title: 'Exit Ticket 4 ช่อง',
            desc: 'แบบประเมินท้ายคาบพร้อม self-rating',
            category: 'curated_worksheet',
            subCategory: 'assessment',
            format: 'assessment',
            gradeBands: ['elementary', 'middle', 'high'],
            grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
            subjects: ['assessment'],
            skills: ['reflection', 'analysis'],
            difficulty: 'beginner',
            tags: ['exit-ticket', 'assessment', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Exit Ticket', 'คำถามสะท้อนคิด 4 ช่อง', '#f43f5e'),
            canvasData: buildExitTicket(),
        },
        {
            id: 'CUR-WS-010',
            title: 'T-Chart เปรียบเทียบ',
            desc: 'ตาราง 2 ฝั่งสำหรับเปรียบเทียบข้อมูล',
            category: 'curated_worksheet',
            subCategory: 'organizer',
            format: 'organizer',
            gradeBands: ['elementary', 'middle', 'high'],
            grades: ['g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],
            subjects: ['language', 'social'],
            skills: ['analysis'],
            difficulty: 'beginner',
            tags: ['t-chart', 'compare', 'organizer', 'free-curated'],
            thumbnail: buildThumbnail('T-Chart', 'เปรียบเทียบสองฝั่ง', '#a855f7'),
            canvasData: buildTChart(),
        },
        {
            id: 'CUR-WS-011',
            title: 'Project Planner (1 หน้า)',
            desc: 'วางเป้าหมาย งานย่อย และความคืบหน้า',
            category: 'curated_worksheet',
            subCategory: 'planner',
            format: 'planner',
            gradeBands: ['middle', 'high', 'adult'],
            grades: ['g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'],
            subjects: ['project', 'planning'],
            skills: ['analysis', 'communication', 'reflection'],
            difficulty: 'intermediate',
            tags: ['project', 'planner', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Project Planner', 'เป้าหมาย + milestone + review', '#0891b2'),
            canvasData: buildProjectPlanner(),
        },
        {
            id: 'CUR-WS-012',
            title: 'Reading Comprehension',
            desc: 'บทอ่านพร้อมคำถามท้ายเรื่อง 8 ข้อ',
            category: 'curated_worksheet',
            subCategory: 'reading',
            format: 'worksheet',
            gradeBands: ['middle', 'high'],
            grades: ['g6', 'g7', 'g8', 'g9', 'g10', 'g11'],
            subjects: ['language'],
            skills: ['reading', 'analysis'],
            difficulty: 'intermediate',
            tags: ['reading', 'comprehension', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Reading Comprehension', 'บทอ่าน + คำถามท้ายเรื่อง', '#0f766e'),
            canvasData: buildReadingComprehension(),
        },
        {
            id: 'CUR-WS-013',
            title: 'Rubric 4 ระดับ',
            desc: 'ตารางประเมินเกณฑ์ 4 ระดับ',
            category: 'curated_worksheet',
            subCategory: 'assessment',
            format: 'assessment',
            gradeBands: ['middle', 'high', 'adult'],
            grades: ['g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'adult'],
            subjects: ['assessment'],
            skills: ['analysis', 'reflection'],
            difficulty: 'intermediate',
            tags: ['rubric', 'assessment', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Rubric 4 Levels', 'เกณฑ์ + ระดับคะแนน', '#7c3aed'),
            canvasData: buildRubric4(),
        },
        {
            id: 'CUR-WS-014',
            title: 'Task Cards 8 ช่อง',
            desc: 'การ์ดกิจกรรม 8 ช่องพร้อมเลขข้อ',
            category: 'curated_worksheet',
            subCategory: 'activity',
            format: 'activity',
            gradeBands: ['elementary', 'middle', 'high'],
            grades: ['g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9'],
            subjects: ['project', 'assessment'],
            skills: ['reasoning', 'communication'],
            difficulty: 'beginner',
            tags: ['taskcards', 'activity', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Task Cards x8', 'การ์ดกิจกรรมพร้อมใช้', '#2563eb'),
            canvasData: buildTaskCards8(),
        },
        {
            id: 'CUR-WS-015',
            title: 'Story Sequence 3 Steps',
            desc: 'ลำดับเรื่อง เริ่มต้น-กลาง-จบ',
            category: 'curated_worksheet',
            subCategory: 'organizer',
            format: 'organizer',
            gradeBands: ['elementary', 'middle'],
            grades: ['g2', 'g3', 'g4', 'g5', 'g6'],
            subjects: ['language'],
            skills: ['reading', 'writing', 'analysis'],
            difficulty: 'beginner',
            tags: ['story-sequence', 'organizer', 'worksheet', 'free-curated'],
            thumbnail: buildThumbnail('Story Sequence', 'Beginning • Middle • End', '#ea580c'),
            canvasData: buildStorySequence(),
        },
    ];

    function getCuratedTemplateById(id) {
        const key = String(id || '').trim();
        if (!key) return null;
        return CURATED_TEMPLATES.find((item) => item.id === key) || null;
    }

    const api = {
        CURATED_TEMPLATES,
        getCuratedTemplateById,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_CURATED_TEMPLATES_API = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
