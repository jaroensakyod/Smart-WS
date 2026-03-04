# Implementation Plan: OpenDataLoader PDF Integration for Smart-WS (26 กุมภาพันธ์ 2026)

## เอกสารนี้คืออะไร
เอกสารนี้เป็นแผนลงมือพัฒนาแบบละเอียดสำหรับการเชื่อม **OpenDataLoader PDF (ODL)** เข้ากับ **Smart-WS** โดยเน้นให้เริ่มใช้งานได้จริงแบบค่อยเป็นค่อยไป และ **ยังไม่ลงมือเขียนโค้ดในเอกสารนี้**

---

## 1) เป้าหมายเชิงธุรกิจและผลลัพธ์ที่ต้องได้

### 1.1 เป้าหมายหลัก
1. ให้ผู้ใช้ Smart-WS นำเข้าเอกสารจากผลลัพธ์ ODL ได้อย่างรวดเร็ว
2. ลดงาน manual copy/paste จาก PDF ลงอย่างน้อย 60% ในงานทำใบงานทั่วไป
3. รักษาความสามารถแก้ไขต่อบน canvas (ไม่ใช่ภาพแบนทั้งหมด)

### 1.2 ผลลัพธ์ที่คาดหวัง (MVP)
- นำเข้าไฟล์ ODL JSON แล้วได้ workbook หลายหน้าใน Smart-WS
- รองรับ element หลัก: heading, paragraph, list, table (ระดับพื้นฐาน), image, formula (ผ่าน fallback เมื่อจำเป็น)
- มีระบบแจ้งข้อผิดพลาดอ่านง่าย และไม่ทำให้แอปล่มเมื่อเจอข้อมูลไม่รองรับ

---

## 2) ขอบเขตงาน (Scope)

### 2.1 In Scope (รอบนี้)
- การออกแบบและพัฒนา **Importer ฝั่ง Smart-WS** เพื่ออ่านไฟล์ผลลัพธ์ ODL
- การ map ข้อมูล ODL -> Fabric object/workbook payload
- การวางระบบ validation + fallback + telemetry เบื้องต้น
- การทดสอบเชิงคุณภาพกับเอกสารการเรียนการสอนภาษาไทย/อังกฤษ

### 2.2 Out of Scope (รอบนี้)
- ไม่สร้าง cloud service ใหม่
- ไม่เปลี่ยนสถาปัตยกรรมหลักของ Smart-WS ทั้งระบบ
- ไม่ทำ i18n เต็มรูปแบบใหม่ทั้งโปรเจกต์
- ไม่ optimize OCR model/hybrid backend ของ ODL ในรอบ MVP

---

## 3) สมมติฐานและข้อจำกัด

1. Smart-WS เป็น Chrome Extension + Fabric.js เป็นแกน canvas
2. ODL สามารถให้ผลลัพธ์เป็น JSON/Markdown ได้อยู่แล้ว
3. รอบ MVP จะเริ่มจาก **File-based import** ก่อน (ผู้ใช้อัปโหลดไฟล์ ODL JSON)
4. ยังไม่ติดตั้ง dependency ใหม่ในรอบวางแผนนี้

---

## 4) สถาปัตยกรรมเป้าหมาย (Target Architecture)

## 4.1 Logical Components
1. **Import UI Layer**
   - ปุ่ม/เมนูนำเข้าไฟล์ ODL
   - แสดงสถานะนำเข้า: validating, mapping, rendering, done/failed
2. **ODL Parser Layer**
   - ตรวจ schema ขั้นต้น
   - normalize field ชื่อ key ที่อาจต่างเวอร์ชัน
3. **Mapping Engine**
   - element-to-object transformer
   - coordinate transform (PDF points -> canvas px)
4. **Workbook Builder**
   - สร้าง payload รูปแบบเดียวกับ `wbLoadWorkbookData`
5. **Error & Fallback Layer**
   - unsupported element -> textbox หรือ note object

## 4.2 Data Flow (MVP)
1. ผู้ใช้เลือกไฟล์ ODL JSON
2. ระบบ validate โครงหลัก (`pages`/`kids`/content nodes)
3. Mapper แปลงแต่ละหน้าเป็น Fabric JSON page state
4. รวมเป็น workbook payload เวอร์ชัน Smart-WS
5. ส่งเข้า `wbLoadWorkbookData(...)` เพื่อเปิดงานทันที

---

## 5) Data Contract และ Mapping Design

## 5.1 Input Contract (ODL)
คาดหวังข้อมูลขั้นต่ำ:
- เอกสารมี list ของ elements ต่อหน้า
- element มีอย่างน้อย: `type`, `content` (ถ้ามีข้อความ), `page number` (ถ้ามี), `bounding box` (ถ้ามี)

## 5.2 Output Contract (Smart-WS)
ใช้รูปแบบ workbook ที่รองรับอยู่แล้ว:
- `version: 2`
- `paperSize`
- `worksheetMode`
- `activePageIndex`
- `pages: string[]` (JSON ของ canvas รายหน้า)

## 5.3 Mapping Matrix (MVP)
1. `heading` -> `fabric.Textbox`
   - fontSize สูงกว่า paragraph
   - weight ตาม heading level
2. `paragraph` -> `fabric.Textbox`
   - wrap ตามความกว้าง bbox
3. `list` -> `fabric.Textbox`
   - prepend bullet/number ตาม metadata
4. `table` ->
   - Phase MVP: group text blocks แบบโครงตาราง
   - Phase Beta: map เข้า smart-table object โดยตรง
5. `image` / `picture` -> `fabric.Image`
   - รองรับ external path หรือ embedded data
6. `formula` -> equation pipeline
   - ถ้าแปลงไม่ผ่าน -> fallback textbox

## 5.4 Coordinate Transform
- ODL bbox มักเป็น PDF points ([left, bottom, right, top])
- Smart-WS ใช้พิกเซล canvas
- ต้องกำหนด transform function:
  - normalize ตาม page width/height ของ ODL
  - scale ให้พอดีกับ `PAPER_W`, `PAPER_H`
  - invert y-axis เมื่อจำเป็น

---

## 6) แผนการพัฒนาแบบเป็นเฟส

## Phase A — Discovery & Contract Freeze (2-3 วัน)

### งาน
1. เก็บตัวอย่าง ODL JSON อย่างน้อย 10 เอกสาร (ง่าย/กลาง/ยาก)
2. สรุป schema ที่ใช้งานจริง (field required/optional)
3. สรุป mapping matrix final + fallback policy

### Deliverables
- `docs/odl-schema-notes.md`
- `docs/odl-mapping-matrix.md`
- sample fixtures สำหรับ test

### Acceptance Criteria
- มีตัวอย่างครอบคลุม 2 ภาษา + ตาราง + รูป + สูตร
- ทีมเห็นพ้องเรื่อง field ขั้นต่ำที่ importer ต้องรองรับ

---

## Phase B — UX Flow & Error Model (1-2 วัน)

### งาน
1. ออกแบบ import entry point ในเมนูเอกสาร
2. ออกแบบ progress/toast/error states
3. ออกแบบข้อความแจ้งเตือนภาษาไทย/อังกฤษแบบสั้น

### Deliverables
- UX flow diagram
- error catalog (code -> message -> action)

### Acceptance Criteria
- ผู้ใช้ไม่สับสนว่าไฟล์ที่เลือก “รองรับ/ไม่รองรับ” เพราะอะไร

---

## Phase C — Core Importer MVP (4-6 วัน)

### งานหลัก
1. เพิ่มโมดูล `odlImporter` (parser + normalizer)
2. เพิ่มโมดูล `odlMapper` (element transform)
3. เพิ่ม workbook assembler
4. เชื่อมกับ load flow ปัจจุบันให้เปิดงานได้ทันที
5. ใส่ fallback สำหรับ unsupported nodes

### งานย่อยเชิงเทคนิค
- parser validation:
  - ตรวจ JSON parse
  - ตรวจ required root fields
  - ตรวจ type consistency
- text handling:
  - sanitize control chars
  - preserve line breaks ตาม option
- image handling:
  - ตรวจความปลอดภัย URL scheme
  - timeout/fail-safe ตอนโหลดรูป
- performance:
  - chunk processing ถ้าหน้ามาก
  - render batch เพื่อลด blocking

### Deliverables
- Import ODL JSON ใช้งานได้ end-to-end
- เอกสาร option/import limits

### Acceptance Criteria
- import เอกสาร 20 หน้าได้โดยไม่ crash
- ข้อความหลักอ่านได้และตำแหน่งใกล้เคียงต้นฉบับ
- เมื่อเจอ element ไม่รองรับ ระบบยัง import ต่อได้

---

## Phase D — Table & Formula Quality Upgrade (3-5 วัน)

### งาน
1. เพิ่ม table fidelity (row/col boundary ดีขึ้น)
2. route formula element เข้า equation renderer โดยตรง
3. เพิ่ม “quality mode” ให้ผู้ใช้เลือก (Fast / Better Layout)

### Deliverables
- ตารางที่แก้ไขต่อได้ดีขึ้น
- สูตรคณิตแสดงผลดีขึ้นโดยไม่แตก layout

### Acceptance Criteria
- table readability ผ่านเกณฑ์อย่างน้อย 80% ใน test set
- formula render success rate >= 90% (ที่มี source เพียงพอ)

---

## Phase E — Hardening, QA, Rollout (3-4 วัน)

### งาน
1. regression test จุดที่กระทบ (save/load/export)
2. stress test เอกสารหลายหน้า
3. ปรับ telemetry/log ให้วิเคราะห์ปัญหาได้
4. เปิด feature flag แบบ staged rollout

### Deliverables
- release checklist
- rollback plan
- known limitations

### Acceptance Criteria
- ไม่มี critical regression ใน flow เดิมของ Smart-WS
- เปิด/ปิดฟีเจอร์ importer ได้โดยไม่กระทบผู้ใช้เดิม

---

## 7) โครงสร้างงาน (WBS)

1. Product/UX
   - define import journey
   - define errors and guidance
2. Engineering
   - parser
   - mapper
   - workbook integration
   - performance tuning
3. QA
   - fixture-based tests
   - manual visual checks
   - regression checklist
4. Documentation
   - user guide
   - known limitations
   - troubleshooting

---

## 8) Test Plan แบบละเอียด

## 8.1 Test Data Set
ต้องมีอย่างน้อย:
1. เอกสาร single-column text
2. เอกสารสองคอลัมน์
3. เอกสารที่มีตารางธรรมดา
4. เอกสารที่มีตารางซับซ้อน
5. เอกสารมีรูป/แผนภาพ
6. เอกสารมีสูตรคณิต
7. เอกสารไทยล้วน / อังกฤษล้วน / ไทย-อังกฤษผสม

## 8.2 Test Cases สำคัญ
1. Import success (happy path)
2. Invalid JSON file
3. Unsupported schema version
4. Missing bbox fields
5. Large file (50+ pages)
6. Mixed content with tables+images+formula
7. Save/Reload imported workbook
8. Export PDF/PPTX หลัง import

## 8.3 KPI/Quality Metrics
- Import success rate >= 95% (ไฟล์ตรงสเปก)
- Unhandled exception = 0
- Median import time (10 หน้า) < 5 วินาที (เครื่องมาตรฐาน)
- Reading order correctness (manual sampling) >= 90%

---

## 9) ความเสี่ยงและแผนรับมือ (Risk Register)

1. **Schema drift จาก ODL เวอร์ชันใหม่**
   - ผลกระทบ: parser พังหรือ map ผิด
   - แผนรับมือ: ใส่ schema adapter + compatibility table

2. **Coordinate mismatch ทำให้วางวัตถุผิดตำแหน่ง**
   - ผลกระทบ: layout เพี้ยน
   - แผนรับมือ: สร้าง visual debug overlay + golden samples

3. **ตารางซับซ้อน map ไม่ครบ**
   - ผลกระทบ: แก้ไขต่อยาก
   - แผนรับมือ: fallback to grouped text + ปรับใน Phase D

4. **ไฟล์ใหญ่ทำให้ UI กระตุก**
   - ผลกระทบ: UX แย่
   - แผนรับมือ: batch rendering + progressive import

5. **รูปภาพจาก URL ภายนอกโหลดล้มเหลว/CORS**
   - ผลกระทบ: ภาพหาย
   - แผนรับมือ: retry/fallback placeholder + แจ้งผู้ใช้

---

## 10) แผนการปล่อยใช้งาน (Rollout)

## 10.1 Milestone
1. M1 (MVP): import text-first + basic table/image
2. M2 (Beta): table quality + formula routing
3. M3 (GA): hardening + docs + telemetry

## 10.2 Feature Flags
- `odlImportEnabled`
- `odlAdvancedTableMapping`
- `odlFormulaRouting`

## 10.3 Rollback Strategy
- ปิด flags เพื่อ revert พฤติกรรมโดยไม่ rollback โค้ดทั้งชุด
- เก็บ importer แยกโมดูลเพื่อง่ายต่อ isolate ปัญหา

---

## 11) Definition of Done (DoD)

ถือว่าจบเฟส MVP เมื่อครบทุกข้อ:
1. ผู้ใช้ import ODL JSON แล้วได้ workbook หลายหน้าแก้ไขต่อได้
2. flow save/load/export เดิมไม่เสีย
3. มี fallback ครบสำหรับ node ที่ไม่รองรับ
4. ผ่าน test cases หลักและไม่มี critical bug
5. มีเอกสารการใช้งาน + known limitations

---

## 12) งานต่อเนื่องหลัง MVP

1. เพิ่ม one-click integration ผ่าน local bridge service (optional)
2. เพิ่ม template-aware placement (เช่น import ลง template worksheet ที่เลือก)
3. เพิ่ม citation overlay จาก bbox สำหรับงานวิชาการ
4. เพิ่ม import profile ตามประเภทเอกสาร (worksheet, article, scan)

---

## 13) สรุปสำหรับการตัดสินใจ

แนะนำให้เดินตามลำดับ **A -> B -> C -> D -> E** โดยเน้น MVP ให้เร็วที่สุดก่อน แล้วเพิ่มคุณภาพตาราง/สูตรในรอบถัดไป เพื่อให้ Smart-WS ได้คุณค่าใช้งานจริงเร็ว และควบคุมความเสี่ยงด้านคุณภาพ layout ได้ดีกว่า “ทำทั้งหมดพร้อมกัน”
