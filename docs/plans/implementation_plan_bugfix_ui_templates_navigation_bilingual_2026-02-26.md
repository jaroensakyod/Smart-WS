# Implementation Plan: Bug Fix + Bilingual UX (26 กุมภาพันธ์ 2026)

## เอกสารนี้คืออะไร
เอกสารนี้เป็นแผนลงมือแก้ปัญหาเชิงระบบสำหรับ Smart WS โดย **ยังไม่ลงมือแก้โค้ดในเอกสารนี้** และเน้น 4 เรื่องที่ผู้ใช้รายงาน:
1) เปลี่ยนกระดาษ 16:9 Presentation ไม่ได้
2) เทมเพลต 6 แบบใช้ไม่ได้ (Timeline, Fishbone, Lab Report, Music Sheet, Flashcards, Sudoku)
3) ปุ่ม "ไปหน้า" ไม่ทำงาน
4) ต้องการชื่อไทย หรือรองรับสองภาษาไทย/อังกฤษ

---

## ขอบเขตงาน (Scope)

### In Scope
- แก้โครงสร้าง preset ขนาดกระดาษให้รองรับค่าที่มีอยู่ใน UI จริง
- เติม implementation ให้ template key ที่มีใน UI แต่ยังไม่มี logic วาดใน canvas
- ผูก event ปุ่ม jump page + validation อินพุตอย่างปลอดภัย
- ปรับข้อความแสดงผลชื่อ template ให้ไทย/อังกฤษสม่ำเสมอ
- ทดสอบ regression จุดที่กระทบโดยตรง

### Out of Scope
- ไม่เปลี่ยนโครงสร้างสถาปัตยกรรมหลัก (เช่น แยกไฟล์ template engine ใหม่)
- ไม่เพิ่ม template ใหม่นอกเหนือจาก 6 รายการที่มีปัญหา
- ไม่เพิ่มระบบ i18n เต็มรูปแบบหลาย locale ในรอบนี้ (เว้นแต่จำเป็น)
- ไม่ปรับ UI ดีไซน์ใหญ่/ธีม/โครง layout ใหม่

---

## สรุป Root Cause (ยืนยันจากโค้ดปัจจุบัน)

### A) 16:9 Presentation เปลี่ยนไม่ได้
- ใน UI (`newtab.html`) มี option:
  - `a4_landscape`
  - `presentation_16_9`
- แต่ใน `app.js` (`PAPER_PRESETS`) มีเฉพาะ `a4` และ `letter`
- เมื่อส่งค่า preset ที่ไม่รู้จักเข้า `getPaperConfig(size)`, ระบบ fallback เป็น `a4`
- ผลลัพธ์: ผู้ใช้เลือก 16:9 แล้วมองว่า "ไม่เปลี่ยน"

### B) Templates 6 รายการไม่ทำงาน
- มี key ใน dropdown + card gallery แล้ว
- `applyTemplate(type)` ใน `app.js` ยังไม่มี branch สำหรับ:
  - `timeline`
  - `fishbone`
  - `labreport`
  - `musicsheet`
  - `flashcards`
  - `sudoku`
- ผลลัพธ์: หน้าถูก clear ตาม flow เดิม แต่ไม่มีการ add object ใหม่

### C) ปุ่ม "ไปหน้า" ไม่ทำงาน
- มี UI element ครบใน `newtab.html` (`jumpPageInput`, `btnJumpPage`)
- ใน `app.js` ไม่มี `addEventListener` ให้ `btnJumpPage`
- จึงไม่มีการเรียก `goToPage()` จากปุ่มนี้

### D) ชื่อไทย/สองภาษาไม่สม่ำเสมอ
- ชื่อ template ใน dropdown เป็นอังกฤษเป็นหลัก
- ชื่อ card ส่วนหนึ่งเป็นอังกฤษ + คำอธิบายไทย
- ยังไม่มีมาตรฐานเดียวสำหรับข้อความบน UI หลายจุด

---

## แนวทางแก้เชิงเทคนิค (Implementation Design)

## Phase 1 — Paper Preset Compatibility Fix

### งานที่ต้องทำ
1. เพิ่ม preset ที่ขาดใน `PAPER_PRESETS` (`app.js`)
   - `a4_landscape`
   - `presentation_16_9`
2. กำหนดมิติให้เหมาะกับการใช้งานจริง
   - A4 แนวนอน: สลับกว้าง/สูงจาก A4 เดิม
   - 16:9: ใช้สัดส่วนสไลด์ที่ชัดเจนและสอดคล้องกับระบบ zoom/export
3. ตรวจสอบว่า `applyPaperLayout()` sync ครบ:
   - canvas width/height
   - CSS vars: `--paper-w`, `--paper-h`, `--safe-margin`
   - ค่าใน `pageSizeSelect`

### ข้อกำหนดคุณภาพ
- เปลี่ยน preset แล้วไม่ทำให้ object เดิมหาย
- ไม่มีผลข้างเคียงกับฟังก์ชัน zoom (`wbSetZoom`, `wbGetZoom`)

### Acceptance Criteria
- เลือก `16:9 Presentation` แล้ว canvas เปลี่ยนเป็นสัดส่วน 16:9 ทันที
- เลือก `A4 Landscape` แล้วกว้าง > สูง
- refresh/open ใหม่แล้วยังไม่เกิด error จาก preset key

---

## Phase 2 — Template Engine Completion (6 Missing Templates)

### งานที่ต้องทำ
เติมใน `applyTemplate(type)` ของ `app.js` ให้ครบ 6 case:

1. `timeline`
   - เส้นหลักแนวนอน
   - จุด milestone สม่ำเสมอ
   - กล่องข้อความสลับบน/ล่าง
2. `fishbone`
   - แกนกลาง + หัวปลา
   - ก้างหลักหลายแกน
   - กล่องหัวข้อสาเหตุ
3. `labreport`
   - หัวข้อมาตรฐาน: Title, Objective, Hypothesis, Materials, Procedure, Data, Conclusion
   - กล่องเขียนข้อความพร้อม spacing พิมพ์ได้
4. `musicsheet`
   - ชุดบรรทัด 5 เส้นหลาย staff
   - margin และช่องเว้นหัวกระดาษ
5. `flashcards`
   - layout การ์ดหลายช่องต่อหน้า
   - เส้นตัดแบบ dash
   - หมายเลข/หัวการ์ดมุมบน
6. `sudoku`
   - grid 9x9
   - เส้นหนาทุกขอบ subgrid 3x3
   - เส้นบางในช่องย่อย

### หลักออกแบบร่วม
- คำนวณ layout จาก `PAPER_W` และ `PAPER_H` เท่านั้น (ไม่ fix พิกเซลแข็งเกิน)
- ทุก template ต้องปิดท้ายด้วย flow เดิม:
  - `canvas.renderAll()`
  - `saveHistory()`
  - `showToast(...)`
- ใช้ style เดิมของโปรเจกต์ (font family, color source จาก panel)

### Acceptance Criteria
- ทั้ง 6 key ใช้งานได้จากทั้ง dropdown และ template gallery
- กด Apply แล้วได้ object จริง ไม่ใช่หน้าเปล่า
- ใช้งานได้บน A4 portrait/landscape และ 16:9 โดยไม่ล้นหน้าแบบผิดปกติ

---

## Phase 3 — Jump-to-Page Wiring + Validation

### งานที่ต้องทำ
1. เพิ่ม listener ปุ่ม `btnJumpPage` ใน `app.js`
2. อ่านค่าจาก `jumpPageInput` แล้ว normalize:
   - trim
   - parse number
   - floor เป็นจำนวนเต็ม
3. แปลงเป็น index ภายใน (`pageNumber - 1`)
4. validate ช่วงหน้า:
   - ถ้าไม่ใช่ตัวเลข/น้อยกว่า 1/มากกว่าจำนวนหน้า => toast แจ้งเตือน
   - ถ้าถูกต้อง => เรียก `goToPage(targetIndex)`
5. sync input กับหน้าปัจจุบันใน `updatePageIndicator()`
   - เมื่อสลับหน้าโดยวิธีอื่น (prev/next/thumbnail) ช่อง jump ยังสะท้อนค่าถูกต้อง
6. เพิ่ม keyboard UX ทางลัด
   - Enter ใน `jumpPageInput` ให้ทำงานเหมือนกดปุ่ม

### Acceptance Criteria
- กรอกเลขหน้าแล้วกด `ไปหน้า` หรือ Enter ไปหน้าถูกต้อง
- ค่าผิดรูปแบบไม่ทำให้ระบบพัง และมีข้อความแจ้งชัดเจน
- อินพุตแสดงหน้าปัจจุบันตรงกับ indicator เสมอ

---

## Phase 4 — Thai Naming / Two-Language Strategy

### ข้อเสนอชื่อไฟล์และแนวทางภาษาที่ใช้
- รูปแบบที่แนะนำสำหรับรอบนี้: **สองภาษาในป้ายเดียว**
- มาตรฐาน: `English (ไทย)`
  - ตัวอย่าง: `Timeline (ไทม์ไลน์)`, `Lab Report (รายงานทดลอง)`

### งานที่ต้องทำ
1. อัปเดต dropdown ชื่อ template ใน `newtab.html`
2. อัปเดต card titles ใน `templateCards` ของ `proFeatures.js`
3. ตรวจความสอดคล้องของคำใน toast/ปุ่มสำคัญที่เกี่ยวกับ template
4. รักษา key ภายใน (`value`) เหมือนเดิมทั้งหมด เพื่อไม่กระทบ logic เดิม

### Acceptance Criteria
- ผู้ใช้เห็นชื่อไทย/อังกฤษสม่ำเสมอในจุดหลักของการเลือก template
- ไม่กระทบการเลือกค่า (`value` keys ไม่เปลี่ยน)

---

## รายการไฟล์ที่คาดว่าจะถูกแก้ (รอบลงมือจริง)
- `app.js`
  - `PAPER_PRESETS`
  - `applyTemplate(type)`
  - event wiring สำหรับ jump page
  - `updatePageIndicator()` (sync jump input)
- `newtab.html`
  - label ข้อความชื่อ template แบบสองภาษา
- `proFeatures.js`
  - `templateCards` titles แบบสองภาษา
- `README.md` (ถ้าต้องการให้เอกสารสอดคล้อง UI ล่าสุด)

---

## Test Plan (Manual Regression)

### TC-01: เปลี่ยนกระดาษ 16:9
- ขั้นตอน: เลือก `16:9 Presentation`
- คาดหวัง: canvas เปลี่ยนสัดส่วนทันที, ไม่มี error, object เดิมยังอยู่

### TC-02: เปลี่ยน A4 Landscape
- ขั้นตอน: เลือก `A4 Landscape`
- คาดหวัง: กว้าง > สูง, grid/safe margin แสดงถูกต้อง

### TC-03: ใช้งาน Timeline Template
- ขั้นตอน: เลือก template แล้วกด apply
- คาดหวัง: ได้เส้นเวลา + จุดเหตุการณ์ + กล่องข้อความ

### TC-04: ใช้งาน Fishbone Template
- คาดหวัง: โครง fishbone ครบและแก้ข้อความได้

### TC-05: ใช้งาน Lab Report
- คาดหวัง: section หลักครบ ใช้พิมพ์ได้จริง

### TC-06: ใช้งาน Music Sheet
- คาดหวัง: staff lines เป็นระเบียบและ spacing อ่านง่าย

### TC-07: ใช้งาน Flashcards
- คาดหวัง: การ์ดเรียงสม่ำเสมอ มีเส้นตัด

### TC-08: ใช้งาน Sudoku
- คาดหวัง: 9x9 ชัดเจน, เส้นหนา subgrid ถูกต้อง

### TC-09: Jump Page ปกติ
- ขั้นตอน: สร้างหลายหน้า, กรอกเลขหน้า, กดปุ่ม/Enter
- คาดหวัง: ไปถูกหน้า, indicator ตรง

### TC-10: Jump Page ค่าไม่ถูกต้อง
- ขั้นตอน: กรอก 0, ค่าติดลบ, ค่าสูงเกิน, ตัวอักษร
- คาดหวัง: แจ้งเตือนและไม่ crash

### TC-11: ชื่อสองภาษา
- ขั้นตอน: ตรวจ dropdown + gallery
- คาดหวัง: รูปแบบชื่อสม่ำเสมอ `EN (TH)`

---

## Risk Register

1. ความเสี่ยง: layout template ล้นเมื่อใช้ 16:9
- ความรุนแรง: กลาง
- แผนรับมือ: คำนวณแบบ relative ต่อ `PAPER_W/PAPER_H` และเผื่อ margin

2. ความเสี่ยง: เพิ่ม listener ใหม่แล้วเกิด bind ซ้ำ
- ความรุนแรง: กลาง
- แผนรับมือ: ผูก event จุดเดียวในช่วง setup ปกติ และหลีกเลี่ยง bind ซ้ำจากฟังก์ชัน init ที่อาจถูกเรียกซ้ำ

3. ความเสี่ยง: ชื่อสองภาษายาวเกิน ทำให้ select อ่านยาก
- ความรุนแรง: ต่ำ
- แผนรับมือ: ใช้คำไทยสั้น, คงชื่อหลักอังกฤษก่อนวงเล็บ

---

## แผนการลงมือ (Execution Order)
1. แก้ Preset กระดาษ (กระทบทั้งระบบมากสุด)
2. แก้ Jump-to-page (แก้ usability เร็วและทดสอบง่าย)
3. เติม 6 template ที่ขาด
4. ปรับชื่อไทย/สองภาษาใน dropdown + gallery
5. ทดสอบ regression ตาม test cases
6. อัปเดต README (ถ้าต้องการให้เอกสารตรง UI)

---

## Definition of Done (DoD)
- ปัญหา 1-3 ปิดครบตาม acceptance criteria
- ชื่อ template แสดงแบบสองภาษาในจุดใช้งานหลัก
- ไม่มี error ใหม่ใน console จาก flow ที่แก้
- ผ่าน manual regression ขั้นต่ำ TC-01 ถึง TC-11
