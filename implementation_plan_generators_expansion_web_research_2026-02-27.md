# Smart-WS: แผนขยาย Generators จาก Web Research (27 ก.พ. 2026)

## เป้าหมาย
- เพิ่มชุด generator ให้ครอบคลุมงานครูแบบ No-prep มากขึ้น
- ลดเวลาสร้างใบงานจาก “ต้องวาง layout เอง” → “กดสร้างแล้วพร้อมสอน/พร้อมขาย”
- ขยายจากกลุ่มเดิม (Math/WordSearch/Crossword/TaskCards/Maze/Bingo/Matching/FillBlank/ShapeNets/ComicStrip) ไปสู่ชุดที่ตลาดใช้งานจริงบ่อย

---

## สรุปสิ่งที่พบจาก Web Search

### แหล่งอ้างอิงที่ดึงข้อมูลได้
- Canva Worksheet/Word Search pages: เน้นกิจกรรมปรับความยากได้, ธีมเยอะ, ทำงานได้ทั้งพิมพ์และดิจิทัล
- WordMint: เครื่องมือที่ครูใช้บ่อยคือ Crossword, Word Search, Bingo, Bubble Tests
- CrosswordLabs: จุดเด่นคือสร้างเร็ว, ส่งออกได้หลายแบบ, มี answer key และ share URL
- SuperTeacherWorksheets (full generators index): มี generator ครอบคลุมมาก ทั้ง Math drills, Quiz, Puzzle, Flashcards, Calendar/Newsletter
- Discovery Puzzlemaker: มี puzzle formats เพิ่มจากพื้นฐาน เช่น Cryptogram, Hidden Message, Fallen Phrase, Number Blocks, Letter Tiles
- DuckDuckGo results snapshot: เครื่องมือที่ถูกพูดถึงซ้ำคือ Word Search, Crossword, Bingo, Matching, Fill-in-the-blank, Multiple choice, Cryptogram, Puzzle-based literacy/maths

### Insight เชิงผลิตภัณฑ์
1. สิ่งที่ตลาดใช้จริงไม่ใช่แค่ “ใบงานสวย” แต่คือ “generator ที่ปรับโจทย์จำนวนมากได้เร็ว”
2. กลุ่มที่ทำซ้ำเยอะสุด: Puzzle + Quiz + Literacy drills + Math drills
3. Feature สำคัญที่ควรมีทุก generator: Difficulty, Answer Key, Multi-page batch, Theme preset

---

## Gap Analysis เทียบกับ Smart-WS ปัจจุบัน

### มีแล้ว (หลักๆ)
- Math, Advanced Math, Fractions, Algebra, Geometry
- Graph/Parabola/Number line/Coordinate
- Word Search, Crossword
- Task Cards, Maze Pattern, Shape Nets, Comic Strip, Tracing, Matching, Fill Blank, Bingo

### ยังขาด (โอกาสเพิ่มทันที)
- Cryptogram
- Word Scramble
- Missing Letters / CVC Builder
- ABC Order (Cut & Paste style)
- Multiple Choice / Short Answer Test builder (แบบพิมพ์เร็ว)
- Reading Passage + Auto Questions scaffold
- Logic Grid / Sudoku variants
- Number Blocks / Math Squares
- Hidden Message / Decode worksheet
- Exit Ticket / Bell Ringer generators

---

## Generator Backlog (แนะนำเพิ่ม 16 รายการ)

## P0 (ขายได้เร็ว + ทำไม่ซับซ้อน)
1. **Word Scramble Generator**
2. **Cryptogram Generator**
3. **Missing Letters Generator** (รองรับ phonics/CVC)
4. **Multiple Choice Quiz Generator**
5. **Short Answer / Exit Ticket Generator**
6. **ABC Order Cut-and-Glue Generator**

## P1 (เพิ่มคุณภาพชุดใบงาน)
7. **Reading Passage + Question Set Generator** (main idea, inferencing, vocab)
8. **Math Squares Generator**
9. **Number Blocks Puzzle Generator**
10. **Hidden Message Generator**
11. **Fallen Phrase Generator**
12. **Letter Tiles Worksheet Generator**

## P2 (เพิ่มความหลากหลายและมูลค่าสูง)
13. **Logic Grid Puzzle Generator**
14. **Daily Spiral Review Generator** (Math/ELA แบบ 5 ข้อ x หลายวัน)
15. **Assessment Pack Generator** (MCQ + FillBlank + ShortAnswer รวมหน้า)
16. **Editable Rubric Generator** (4-level/5-level)

---

## สเปกมาตรฐานที่ควรใช้กับทุก Generator ใหม่

1. **Input Schema กลาง**
- topic, gradeBand, subject, difficulty
- itemCount, pageCount, language (EN/TH)
- includeAnswerKey (boolean)

2. **Output Contract กลาง**
- หน้าโจทย์ 1..n
- หน้าเฉลย (ถ้าเปิด)
- metadata สำหรับ export และ telemetry

3. **UI Contract กลาง**
- ปุ่มในแถบ Generator + Quick actions
- modal ตั้งค่าขั้นต่ำ (ไม่เกิน 6 controls)
- ใช้ toast + progress status ที่มีอยู่แล้ว

---

## แผนลงมือทำ (Implementation Roadmap)

## Phase 1: Core Architecture (2-3 วัน)
- เพิ่ม `generator registry` กลางใน `proFeatures.js` เพื่อไม่ต้อง bind event แบบกระจัดกระจาย
- สร้าง helper กลาง
  - `buildWorksheetFrame(opts)`
  - `renderQuestionBlocks(items, layout)`
  - `renderAnswerKeyPage(answerItems)`
- เพิ่ม telemetry event แบบเดียวกับ template discovery
  - requested / cancelled / success / error

**ไฟล์หลักที่กระทบ:**
- `proFeatures.js`
- `newtab.html` (เฉพาะจุดปุ่ม/option)
- `data/marketTrends.js` (mapping keyword → generator button ใหม่)

## Phase 2: ส่งมอบ P0 (3-5 วัน)
- ทำ generator P0 ทั้ง 6 ตัว
- เพิ่ม preset difficulty (easy/medium/hard)
- เพิ่ม “Generate Variants” (เช่น 3 ชุดโจทย์ในครั้งเดียว)

**Definition of Done (P0):**
- สร้าง worksheet + answer key ได้
- export PDF/PPTX ผ่าน
- มี smoke tests ฝั่ง utility/logic ที่จำเป็น

## Phase 3: ส่งมอบ P1 (4-6 วัน)
- ทำ generator P1 ทั้ง 6 ตัว
- ปรับ UX ให้ใช้ input pattern เดียวกันมากที่สุด
- เพิ่ม seasonal presets (Back to School, Halloween, Christmas, Summer Review)

## Phase 4: ส่งมอบ P2 + Bundle Selling (5-7 วัน)
- ทำ generator P2 ทั้ง 4 ตัว
- เพิ่มคำสั่ง “Generate Pack” สำหรับผลิตชุดขาย
  - Worksheet
  - Answer key
  - Cover page
  - Terms/Teacher notes page

---

## แผนทดสอบ

### Logic Tests (แนะนำเพิ่ม)
- `tests/generators.word-scramble.test.js`
- `tests/generators.cryptogram.test.js`
- `tests/generators.quiz.test.js`

### Smoke Test Checklist
- สร้างหน้าได้ตาม itemCount/pageCount
- เฉลยตรงกับโจทย์
- Export PDF/PPTX ไม่ล้มเมื่อหลายหน้า
- รองรับ EN/TH labels

---

## Prioritization Matrix (Impact x Effort)

### High Impact / Low-Medium Effort (ทำก่อน)
- Word Scramble
- Missing Letters
- Multiple Choice
- Exit Ticket
- Cryptogram

### High Impact / Medium-High Effort
- Reading Passage + Question Set
- Assessment Pack Generator
- Daily Spiral Review

---

## ความเสี่ยงและแนวทางลดความเสี่ยง
- **Risk:** โค้ด `proFeatures.js` ใหญ่มากและผูก event เยอะ
  - **Mitigation:** แตกส่วน generator เป็นโมดูลย่อยทีละชุด (ยังคง API เดิม)
- **Risk:** Layout overflow เมื่อ itemCount สูง
  - **Mitigation:** บังคับ pagination helper กลาง
- **Risk:** คุณภาพคำถามไม่สม่ำเสมอ
  - **Mitigation:** ใช้ template bank + deterministic seed

---

## ข้อเสนอ “มากกว่านี้” (Next Step ที่แนะนำ)
1. ทำ **P0 Sprint** ก่อนทันทีเพื่อปล่อยฟีเจอร์ที่ผู้ใช้เห็นผลเร็ว
2. ตามด้วย **Pack Generator** เพื่อเปลี่ยนจากสร้างหน้าเดี่ยว → สร้างชุดพร้อมขาย
3. เพิ่ม dashboard วัดผลว่า generator ไหนถูกใช้/export มากสุด แล้วเอาข้อมูลมาจัดลำดับพัฒนารอบถัดไป
