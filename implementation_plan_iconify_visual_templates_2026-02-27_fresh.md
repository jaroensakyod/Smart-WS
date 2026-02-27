# SMART-WS Fresh Implementation Plan (Iconify Visual Templates)
**Date:** 2026-02-27  
**Status:** New Plan (Clean Slate)  
**Purpose:** แผนนี้เป็นฉบับใหม่แบบแยกจากแผนเดิมทั้งหมด เพื่อลดความสับสนในการดำเนินงาน

---

## 1) Executive Summary
เป้าหมายหลักคือขยายระบบ Template ไปสู่กลุ่ม **Visual-Heavy, Low-Prep, Classroom-Ready** โดยใช้ Iconify เป็นแกนในการสร้างสื่อที่ “ทำเร็ว”, “ปรับธีมง่าย”, และ “เหมาะกับเด็กเล็ก/ประถมต้น” เพื่อเพิ่มโอกาสขายบนแนวตลาด TpT/Education printable ecosystem

**North Star (Q1-Q2):**
- เพิ่ม Catalog จาก 65 เป็นอย่างน้อย 150 templates
- ปล่อย Generator ที่ใช้งานได้จริง 30+ แบบในลำดับแรก
- ลดเวลาสร้าง worksheet ต่อชิ้นให้เหลือไม่เกิน 2-3 นาที
- เพิ่มสัดส่วน template แบบมีภาพประกอบเป็น 70%+

---

## 2) Web Research Findings (2026-02-27)

### 2.1 Sources ที่ดึงข้อมูลได้
1. Teachers Pay Teachers Marketplace (หน้า browse/home และตัวอย่าง resource ยอดนิยม)  
   https://www.teacherspayteachers.com/
2. TPT Blog (แนวคอนเทนต์และ resource format ที่เน้นกิจกรรมใช้งานจริง)  
   https://blog.teacherspayteachers.com/
3. Iconify Documentation (ความสามารถ API/Usage สำหรับ icon dynamic loading)  
   https://iconify.design/docs/
4. Education.com Worksheets (หมวด worksheet จำนวนมาก + filter ตาม grade/type)  
   https://www.education.com/worksheets/
5. K5 Learning Free Math Worksheets (หมวดคณิตและโครงสร้าง worksheet ระดับ elementary)  
   https://www.k5learning.com/free-math-worksheets
6. Wikipedia: Graphic Organizer (ประเภท organizer และเหตุผลเชิงการเรียนรู้)  
   https://en.wikipedia.org/wiki/Graphic_organizer

### 2.2 Constraints ของการค้นหา
- Etsy market pages ถูกบล็อกด้วย 403 ใน environment ปัจจุบัน (anti-bot)
- บางเว็บการศึกษาดึงคอนเทนต์ไม่ได้ครบจากข้อจำกัด extraction
- ดังนั้น แผนนี้ใช้หลักฐานจากแหล่งที่เข้าถึงได้จริง + โครงสร้างตลาดที่สอดคล้องกัน

### 2.3 สรุปอินไซต์ตลาดที่ actionable
- ผู้ใช้ครูมองหา resource ที่ **พร้อมพิมพ์/พร้อมใช้ทันที (low-prep)**
- กลุ่ม **Early learning + visual worksheet** มีความต้องการสูง (counting, phonics, matching, tracing)
- **Math visuals** และ **graphic organizers** เป็นรูปแบบที่นำไปใช้ได้ข้ามวิชา
- เนื้อหาที่เป็นเกม/กิจกรรม (bingo, scavenger, puzzle-style) มีแรงดึงดูดสูง
- การทำสินค้าให้ **theme ได้** (animals, space, food, seasons) เพิ่มโอกาสการใช้งานซ้ำและการขายซ้ำ

---

## 3) Product Strategy: “Iconify-first Visual Engine”

### 3.1 Value Proposition
1. **Time Saver:** ครูสร้าง worksheet/flashcard/decor ได้เร็วจาก preset + icon search
2. **Engagement Booster:** เปลี่ยนโจทย์ text-heavy เป็น visual-based interaction
3. **Theme Customization:** ผู้ใช้พิมพ์ keyword แล้ว generate template ธีมเฉพาะทันที
4. **Scalable Catalog:** แม่แบบ 1 โครงสามารถแตกเป็นหลายระดับชั้น/หลายธีม

### 3.2 Core Capabilities ที่ต้องมี
- ค้นหา icon ด้วย keyword (Iconify)
- โหลด SVG และ normalize เป็น object สำหรับ Fabric canvas
- recolor / resize / align grid / randomize icon set
- fallback icon เมื่อ query ไม่พบผลลัพธ์
- cache ผลลัพธ์เพื่อลด latency และลดการยิงซ้ำ

---

## 4) Template Expansion Plan (100+ New)

> โครงสร้างด้านล่างคือล็อตใหม่ที่เน้นภาพเป็นหลัก และหลีกเลี่ยงการซ้ำกับชุดเดิม 65 แบบ

### A) Early Learning & Games (35)
- Picture Bingo (หลายธีม)
- Shadow Matching
- Cut & Paste Sorting
- Story Sequencing
- I Spy Find & Count
- Flashcards (picture+word)
- Board Game Path (printable)
- Memory Match Cards
- Alphabet + Picture Match
- Same/Different Visual Cards

### B) Math Visuals (30)
- Pictographs
- Counting Objects 1-10 / 1-20 / 1-50
- Visual Addition / Subtraction
- Pattern Completion
- Fraction Visual Sets
- Ten Frame with Icons
- Compare Quantities (>, <, =)
- Number Bonds with Images
- Skip Counting Icons
- Word Problem with Picture Prompts

### C) Classroom Management & Decor (25)
- Visual Daily Schedule
- Reward Charts
- Supply Labels
- Student Name Tags
- Classroom Jobs Chart
- Hall Passes
- Behavior Cue Cards
- Transition Cards
- Center Rotation Cards
- Calendar & Weather Board Cards

### D) ELA & Graphic Organizers (30)
- Frayer Model
- Beginning Sounds Matching
- CVC Word Builder
- Reading Comprehension Visual Support
- Mind Map (Icon-based)
- Venn Diagram
- Story Map
- Sequence Chain
- Cause-Effect Organizer
- Main Idea + Details Map

**Total New = 120 templates**  
**Combined Catalog Target = 185 (65 เดิม + 120 ใหม่)**

---

## 5) Technical Implementation Blueprint

### Phase 1 — Data & Taxonomy (Foundation)
**Files:**
- `data/templateTaxonomy.v1.js`
- `data/templateCatalog.v1.js`
- (new optional) `data/templateBundles.v1.js`

**Tasks:**
- เพิ่มหมวดหลักใหม่ 4 หมวด (A/B/C/D)
- ระบุ metadata ทุก template: `id`, `title`, `gradeBand`, `subject`, `visualDensity`, `iconifyTags`, `difficulty`, `isDynamic`
- ทำ ID scheme ใหม่ให้ชัดเจน เช่น:
  - `ELG-001...035`
  - `MTH-001...030`
  - `CLM-001...025`
  - `ELA-001...030`

**Definition of Done:**
- Catalog อ่านได้ครบ 185 รายการ
- ไม่มี id ซ้ำ
- taxonomy map ตรงกับ catalog 100%

### Phase 2 — Iconify Integration Core
**Target files:**
- (new) `iconify.utils.js`
- `proFeatures.js`
- `export.utils.js` (ถ้าต้องรองรับ export SVG-rich behavior)

**Core API ที่ต้องมี:**
- `searchIcons(query, options)`
- `getIconSvg(iconName)`
- `svgToFabricObject(svgText)`
- `buildIconGrid({icons, rows, cols, box, gap})`
- `applyIconStyle({fill, stroke, scale})`
- `getFallbackIcons(category)`

**Non-functional requirements:**
- timeout + retry policy
- memory cache (LRU size เล็ก)
- graceful fallback เมื่อ icon API fail
- deterministic mode (seed) สำหรับ template ที่ต้อง reproducible

**Definition of Done:**
- generate icon grid ได้ใน template ตัวอย่างอย่างน้อย 5 แบบ
- รองรับ recolor และ resize ได้สม่ำเสมอ
- ไม่ค้าง UI เมื่อ API ช้า

### Phase 3 — UI & Generator Mapping
**Target files:**
- `newtab.html`
- `style.css`
- `proFeatures.js`

**UX (minimal + scaleable):**
- เพิ่มหมวดค้นหา Template ตาม category
- มีช่อง `Theme keyword` (เช่น animals, space, food)
- มี toggle `Random icons` / `Fixed icons`
- ปุ่ม `Generate` แบบ one-click

**Mapping work:**
- map ปุ่ม/selector ไปยัง handler จริง
- ตรวจว่าแต่ละ handler อ่าน metadata จาก catalog ได้

**Definition of Done:**
- ผู้ใช้เลือก category + template + keyword แล้ว generate ได้ใน flow เดียว
- ไม่มี dead button และ error ใน console ที่เกี่ยวกับ mapping

### Phase 4 — Incremental Generator Delivery
ปล่อยแบบเป็น sprint ย่อย โดยเน้น template ที่ให้ impact สูงก่อน

**Sprint 4.1 (10 templates):** Math Visuals Core  
**Sprint 4.2 (10 templates):** Early Learning Games Core  
**Sprint 4.3 (10 templates):** Classroom Management Core  
**Sprint 4.4 (10 templates):** ELA Organizer Core

ทุก sprint ต้องมี:
- 1 demo template ต่อหมวด
- regression check export PNG/PDF/PPTX
- catalog status update

### Phase 5 — QA, Telemetry-lite, and Release Readiness
- เพิ่ม test coverage ใน `tests/` สำหรับ utility ใหม่
- test deterministic outputs (seed mode)
- ตรวจ performance baseline (generate < 2s สำหรับ template มาตรฐาน)
- release checklist + rollback notes

---

## 6) Prioritization Matrix (Now / Next / Later)

### Now (ต้องทำทันที)
1. สร้าง taxonomy + catalog โครงใหม่ 185 ids
2. ทำ iconify utility layer ให้ครบ minimal API
3. ต่อ UI keyword + random/fixed + generate flow
4. ปล่อย 10 template แรก (Math Visuals)

### Next
1. ขยาย Early Learning และ Classroom Management
2. เพิ่ม preset theme packs (animals, transport, nature, space)
3. ปรับ UX ค้นหา template ให้เร็วขึ้น

### Later
1. local offline icon pack สำหรับโหมด no-network
2. smart recommendation ตาม grade/subject
3. marketplace pack builder (bundle export)

---

## 7) Risks & Mitigation
1. **API Instability / Rate Limit**  
   Mitigation: cache, fallback sets, retry with backoff
2. **Template Overlap กับของเดิม**  
   Mitigation: enforce id namespace + duplicate checker script
3. **UI Complexity เพิ่มเร็วเกิน**  
   Mitigation: คุม UX ให้เป็น minimal controls เท่าที่จำเป็น
4. **Export Consistency**  
   Mitigation: snapshot tests สำหรับ export utils

---

## 8) Immediate Work Breakdown (Next 7 Days)

**Day 1-2**
- อัปเดต `templateTaxonomy.v1.js` และร่าง `templateCatalog.v1.js` ให้ครบ 185 รายการ
- วางโครง `iconify.utils.js`

**Day 3-4**
- เชื่อม `newtab.html` + `proFeatures.js` สำหรับ keyword/theme flow
- ทำ generator ชุด Math Visuals แรก 10 แบบ

**Day 5**
- เขียน/ปรับ tests (`template catalog integrity`, `iconify utility unit tests`)
- ทดสอบ export pipeline

**Day 6-7**
- ปรับแก้จาก QA
- เตรียมรายการ template สำหรับ sprint ถัดไป

---

## 9) Success Metrics
- จำนวน template ใหม่ที่ usable จริง (target: 30+ ภายในรอบแรก)
- อัตรา generate สำเร็จ (target: > 98%)
- เวลาเฉลี่ย generate ต่อ 1 template (target: <= 2-3 วินาทีในงานปกติ)
- สัดส่วน template visual-based ต่อ catalog รวม (target: >= 70%)

---

## 10) Decision Log
- ใช้แผนนี้เป็น reference หลักเพียงฉบับเดียวสำหรับงาน Iconify Visual Templates
- แผนเดิมทั้งหมดถือเป็น historical context เท่านั้น
- การเปลี่ยน scope หลังจากนี้ให้ append ต่อท้ายไฟล์นี้ในหัวข้อ “Change Log”

---

## Change Log
- 2026-02-27: Initial fresh plan created from new web research and current product direction
