# Smart WS Pro

Smart WS Pro คือเครื่องมือสร้างใบงาน/สไลด์การสอนบน Chrome New Tab ที่ขับเคลื่อนด้วย Fabric.js โดยเน้น workflow สำหรับครู: สร้างเร็ว, แก้ไขง่าย, export ได้หลายรูปแบบ และรองรับโจทย์คณิต/เรขาคณิตแบบอัตโนมัติ

## ภาพรวมระบบ

- UI หลักอยู่ใน `newtab.html`
- Styling อยู่ใน `style.css`
- Canvas engine, page state, tools, snapping อยู่ใน `app.js`
- ฟีเจอร์โปร/แกลเลอรี/generator เสริมอยู่ใน `proFeatures.js`
- สูตรคณิต (LaTeX + Text+Math) อยู่ใน `equation.js`
- Export อยู่ใน `export.js` (`PNG`, `PDF`, `PPTX`)

## ฟีเจอร์หลัก

### 1) เอกสารหลายหน้า (Workbook)
- เพิ่มหน้า/ลบหน้า/ทำซ้ำหน้า
- เปลี่ยนลำดับหน้า
- Page/Slide indicator และ jump page
- รองรับทั้งโหมด Worksheet และ Presentation

### 2) เครื่องมือวาดและจัดวาง
- Select, Text, Rect, Table, Line, Arrow, Curve, Callout
- Lock/Unlock, Group/Ungroup
- Bring front/back, forward/backward
- Zoom in/out/fit
- Grid + Snap guides

### 3) ระบบสมการคณิตศาสตร์
- รองรับ LaTeX ผ่าน KaTeX
- รองรับ Text+Math (ข้อความผสมสมการ)
- ปุ่มลัดแทรกสมการในแถบเครื่องมือ

### 4) Sidebar สำหรับสร้างคอนเทนต์
- Templates (จัดหมวด)
- Elements (shape + SVG + search)
- Borders (หลายสไตล์ + จัดหมวด)
- Uploads / Text tools / Generators / Layers / Saved elements

### 5) Generators
- Math generator พื้นฐาน (+ - × ÷)
- Advanced Math (quadratic, cubic, exponent, decimal, negative)
- Fractions
- Algebra
- Geometry (2D + 3D)
- Line graph และ Parabola graph
- Number line, Coordinate plane
- Word search, Crossword

### 6) Export
- PNG
- PDF
- PPTX (แก้ต่อใน PowerPoint ได้)
- Preview

---

## อธิบายฟังก์ชันสำคัญ (Function Reference)

## `app.js`

### Canvas / Paper
- `getPaperConfig(size)`
  - คืนค่า preset ของขนาดกระดาษ/สไลด์
- `applyPaperLayout(size)`
  - ปรับ canvas ตาม paper preset และ sync UI
- `syncUiToggles()`
  - sync สถานะปุ่ม grid/snap/mode

### Workbook
- `goToPage(index)`
  - สลับไปหน้าที่กำหนด
- `addPageAndGo()`
  - เพิ่มหน้าใหม่และไปยังหน้าที่เพิ่ม
- `duplicateCurrentPage()`
  - ทำสำเนาหน้าที่กำลังเปิด
- `deleteCurrentPage(index)`
  - ลบหน้า
- `clearCurrentPage()`
  - ล้างวัตถุในหน้าปัจจุบัน

### UI State
- `updateDocumentModeUi()`
  - เปลี่ยนข้อความปุ่มระหว่างโหมด หน้า/สไลด์
- `updatePageIndicator()`
  - อัปเดต `pageIndicator` และ jump input

---

## `proFeatures.js`

### Gallery / Sidebar
- `buildCardGallery(rootId, cards, onClick)`
  - สร้าง card list สำหรับ templates
- `buildBorderGallery(rootId, cards, onClick)`
  - สร้าง border gallery แบบจัดหมวด
- `setupTemplateGallery()`
  - bind template + border gallery

### Shapes / Borders
- `addShape(type)`
  - เพิ่ม shape พื้นฐาน (square/circle/triangle/arrow)
- `addBorder(kind)`
  - เพิ่มกรอบเอกสารตามชนิด
  - รองรับ `simple, double, triple, dashed, dotted, geo, doodle, stars, wavy, zigzag, stitch, ribbon, scallop, corners, cornerDots, cornerBrackets`

### Generator (Math)
- `addMathProblems()`
  - สุ่มโจทย์เลขพื้นฐาน
- `addAdvancedMathProblems()`
  - สุ่มสมการขั้นสูง และ render ด้วย Text+Math
- `addFractionProblems()`
  - สุ่มโจทย์เศษส่วน
- `addAlgebraProblems()`
  - สุ่มโจทย์พีชคณิต 1 ตัวแปร
- `addGeometryProblems()`
  - สุ่มรูปเรขาคณิต 2D/3D พร้อมพื้นที่/พื้นที่ผิว/ปริมาตร

### Generator (Graph)
- `computeLineSegmentInBounds(m, c, minX, maxX, minY, maxY)`
  - คำนวณเส้นตรงที่ถูก clip ให้อยู่ในกรอบกราฟ
- `addGraphGenerator()`
  - วาดกราฟเส้นตรง `y = mx + c`
- `addParabolaGenerator()`
  - วาดกราฟพาราโบลา `y = ax² + bx + c`

### Generator (Other)
- `addNumberLineGenerator()`
- `addCoordinatePlaneGenerator()`
- `addWordSearch()`
- `addCrossword()`

### Slide mode
- `startSlideshow()` / `exitSlideshow()`
  - เข้า/ออก fullscreen presentation และ restore สถานะเดิม

### Event Wiring
- `setupEvents()`
  - bind ปุ่มทั้งหมดใน sidebar และ toolbar ฝั่งโปร

---

## `toolbar.js`

- กำหนด active drawing tool ผ่าน `toolDefs`
- bind Undo/Redo/Delete
- bind property controls (font, bold, italic, align, opacity)
- bind arrange tools (bring forward/backward)
- helper จัดแนวและกระจาย spacing ของ object

---

## `equation.js`

- จัดการโหมดสมการ (LaTeX / Mixed Text+Math)
- parse และ render สมการลง canvas
- expose ฟังก์ชันใช้งานร่วมกับ generators เช่น `window.addMathTextToCanvas(...)`

---

## `export.js`

- Export canvas/page เป็น PNG
- Export workbook เป็น PDF
- Export presentation เป็น PPTX
- เชื่อมกับปุ่ม export บน toolbar

---

## การติดตั้ง/รัน

1. เปิด Chrome ไปที่ `chrome://extensions`
2. เปิด Developer mode
3. กด Load unpacked แล้วเลือกโฟลเดอร์ `Smart-WS`
4. เปิดแท็บใหม่เพื่อใช้งาน Smart WS Pro

---

## หมายเหตุการพัฒนา

- โครงสร้างนี้ถูกออกแบบให้แยก "engine" (`app.js`) และ "feature layer" (`proFeatures.js`) เพื่อง่ายต่อการขยายระบบ
- แนะนำให้เพิ่มฟีเจอร์ใหม่ผ่าน `setupEvents()` + function ใหม่ใน `proFeatures.js` เพื่อไม่ให้ core engine ใน `app.js` บวมเกินไป
