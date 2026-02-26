# Smart WS Pro

Smart WS Pro คือ Chrome New Tab Extension สำหรับครูและผู้สร้างสื่อการสอน ใช้สร้างใบงานและสไลด์จาก Fabric.js แบบหลายหน้า แก้ไขง่าย และส่งออกได้ทั้ง PNG, PDF, PPTX

## จุดเด่นล่าสุด

- รองรับเอกสารหลายหน้า (เพิ่ม/ลบ/ทำซ้ำ/จัดลำดับ/กระโดดหน้า)
- รองรับขนาดกระดาษและสไลด์
  - A4 แนวตั้ง
  - A4 แนวนอน
  - US Letter
  - 16:9 Presentation
- Template ใช้งานได้จริงครบชุดสำคัญ (รวม Timeline, Fishbone, Lab Report, Music Sheet, Flashcards, Sudoku, Maze, Presentation layouts)
- Template Discovery แบบใหม่: ค้นหาและกรองตาม Grade Band / Grade / Subject / Skill / Difficulty / Format
- มี sections ใน gallery: All / Featured / Popular / New
- เพิ่มเทมเพลต P0: Lesson Plan และ Reading Comprehension
- ขยายคลังเทมเพลตช่วง Elementary/Middle เพิ่ม (เช่น Letter Tracing, Picture Vocabulary, Add/Sub Practice, Context Clues, Cause-Effect, Reflection Journal, Project Planning)
- UI Template แบบสองภาษา EN (TH) ทั้ง dropdown และ gallery
- รองรับนำเข้า OpenDataLoader JSON (MVP) เพื่อแปลงเป็นหน้า workbook อัตโนมัติ
- Export ที่เสถียรขึ้น
  - PDF หลายหน้าแบบประมวลผลทีละหน้า (ลด peak memory)
  - PPTX หลายหน้าใช้งานได้จริงผ่าน PptxGenJS
- มี Utility + Unit tests สำหรับ logic export profile/layout เพื่อลด regression

---

## โครงสร้างไฟล์หลัก

- `newtab.html` — หน้า UI หลัก
- `style.css` — ระบบสไตล์และ layout
- `app.js` — Canvas engine, workbook state, templates, page nav
- `proFeatures.js` — ฟีเจอร์โปร, gallery, generators, zoom, slideshow
- `export.js` — Export PNG/PDF/PPTX + save/load project
- `export.utils.js` — helper สำหรับ export profile/page spec/layout spec
- `equation.js` — โหมดสมการ LaTeX และ text+math
- `toolbar.js`, `panel.js` — wiring ของเครื่องมือและ sidebar
- `tests/export.utils.test.js` — unit tests ของ export utilities
- `odl.import.utils.js` — parser/mapping utility สำหรับ OpenDataLoader JSON
- `odl.import.js` — UI wiring สำหรับปุ่มนำเข้า ODL JSON
- `tests/odl.import.utils.test.js` — unit tests สำหรับ ODL importer utility
- `vendor/`
  - `fabric.min.js`
  - `jspdf.umd.min.js`
  - `pptxgen.bundle.js`
  - `katex/*`

---

## ฟีเจอร์หลัก

### 1) Workbook หลายหน้า

- เพิ่มหน้า / ลบหน้า / ทำซ้ำหน้า
- สลับหน้าแบบ Prev/Next
- Jump to Page พร้อม validation
- Page Manager พร้อม thumbnail และลากสลับลำดับ

### 2) เครื่องมือแก้ไขบน Canvas

- Select, Text, Rect, Table, Line, Arrow, Curve, Callout
- Group/Ungroup, Lock/Unlock, Arrange layer
- Zoom In/Out/Fit, Grid, Snap

### 3) Templates และ Assets

- เทมเพลตด้านการเรียนการสอนและพรีเซนต์
- กรองเทมเพลตตามช่วงชั้น (Elementary / Middle / High / Adult) ได้โดยตรง
- Border gallery, shape tools, upload assets
- Saved elements (IndexedDB)

### 4) Generators

- Math (basic/advanced/fraction/algebra/geometry)
- Graph/Parabola/Number line/Coordinate
- Word Search / Crossword
- Answer Key generation

### 5) สมการและข้อความคณิต

- รองรับ KaTeX
- รองรับ text + math ภายในเอกสาร

### 6) Export

- PNG (หน้าปัจจุบัน)
- PDF (ทุกหน้า)
- PPTX (ทุกหน้า)
- Preview watermark

---

## Export Reliability (สำคัญ)

รอบล่าสุดแก้ปัญหาเครื่องสเปกต่ำที่ export หลายหน้าแล้วล้ม โดยเปลี่ยนจากการกอง dataURL ทุกหน้าในหน่วยความจำ ไปเป็นประมวลผลทีละหน้าและใส่ลงไฟล์ทันที

- PDF ใช้ adaptive profile ตามจำนวนหน้า
  - เอกสารเล็ก: คุณภาพสูง
  - เอกสารใหญ่: memory saver
- PPTX ใช้ PptxGenJS แบบ bundle ใน `vendor/pptxgen.bundle.js`
- มี dependency checks และ toast แจ้งสถานะ export ระหว่างทำงาน

---

## วิธีติดตั้ง (Developer Mode)

1. เปิด Chrome ที่ `chrome://extensions`
2. เปิด `Developer mode`
3. กด `Load unpacked`
4. เลือกโฟลเดอร์ `Smart-WS`
5. เปิดแท็บใหม่เพื่อใช้งาน

---

## การทดสอบ

### Unit test

รันจากโฟลเดอร์โปรเจกต์:

```bash
node --test tests/export.utils.test.js
node --test tests/odl.import.utils.test.js
```

ครอบคลุม:

- page count normalization
- render profile selection ตามจำนวนหน้า
- PDF page spec จาก paper config
- PPTX layout conversion (mm -> inches)

---

## หมายเหตุพัฒนา

- ระบบแยก core (`app.js`) กับ feature layer (`proFeatures.js`) เพื่อง่ายต่อการขยาย
- หากเพิ่ม template ใหม่ ให้ sync key ทั้งใน
  - `newtab.html` (option value)
  - `proFeatures.js` (`templateCards`)
  - `app.js` (`applyTemplate(type)`)
- หากเพิ่ม export mode ใหม่ แนะนำให้วาง logic เลือก profile/layout ที่ `export.utils.js` และเพิ่ม test ใน `tests/export.utils.test.js`

---

## License

ใช้งานภายในโปรเจกต์ Smart WS Pro (โปรดจัดการ license ภายนอกของไลบรารี vendor ตามเงื่อนไขต้นทาง)
