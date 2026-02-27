# แผนการนำไปปฏิบัติ (Implementation Plan) - Smart WS Phase 2

เอกสารนี้ระบุขั้นตอนทางเทคนิคและการแบ่งงานสำหรับการอัปเดตระบบ Smart WS ตามความต้องการ 8 ข้อที่คุณแจ้งมา

---

## 📅 ระยะที่ 1: การยกระดับ Graphic & Monoline (เร็วที่สุด)

### 1.1 ขยายคลัง SVG (ใน `data/svgLibrary.js`)
- [x] เพิ่มหมวดหมู่ Arrows, Symbols, Geometry และ Animals (เบื้องต้นทำแล้ว)
- [x] เพิ่มความหลากหลายของหมวดหมู่ `frames_monoline` (กรอบหัวกระดาษ, กรอบเน้นข้อความ)
- [x] เพิ่ม `arrows_monoline` สำหรับเส้นประ (Dashed Line) และเส้นหยัก (Zigzag)
- [x] อัปเดต `panel.js` ให้แสดงหมวด Monoline และตัวกรอง `Monoline only`

### 1.2 ปรับปรุงการค้นหารูปภาพ (ใน `webImages.js`)
- [x] แก้ไขฟังก์ชัน `doSearch()` ใน `webImages.js`:
  - บังคับพารามิเตอร์ `gsrsearch` ให้เพิ่มคีย์เวิร์ด `line art` หรือ `outline clipart` เป็นค่าเริ่มต้น
  - เพิ่ม Filter "Monoline / Line Art" เพื่อคัดรูปที่เป็น black & white / outline

---

## 📅 ระยะที่ 2: ระบบหลายหน้า (Multi-page Architecture)

### 2.1 ปรับโครงสร้างข้อมูลหน้า (ใน `app.js`)
- [x] เปลี่ยนจากตัวแปร `canvas` ตัวเดียว เป็นระบบ `workbook`:
  ```javascript
  let activePageIndex = 0;
  let pagesData = [null]; // เก็บ JSON ของแต่ละหน้า
  ```
- [x] สร้างฟังก์ชัน `persistCurrentPage()` และ `goToPage(index)`
- [x] อัปเดตระบบ Undo/Redo ให้จำแนกตามรายหน้า

### 2.2 ปรับปรุง UI (ใน `newtab.html` และ `style.css`)
- [x] เพิ่มทูลบาร์ด้านล่าง (Bottom Page Bar):
  - ปุ่ม ➕ เพื่อเพิ่มหน้าใหม่
  - การแสดงผลตัวเลขหน้า (เช่น 1 / 3)
  - ปุ่ม ◀️ และ ▶️ เพื่อเปลี่ยนหน้า
- [x] เพิ่มระบบจัดการไฟล์ (File Persistence) ให้บันทึกหน้าทั้งหมด (ไม่ใช่แค่หน้าเดียว) ลงใน `chrome.storage.local`

---

## 📅 ระยะที่ 3: การส่งออก (Advanced Export)

### 3.1 การส่งออกเป็น Word (ใน `export.js`)
- [x] สร้างฟังก์ชัน `exportToWord()` แบบ Word-compatible (`.doc`) โดยไม่พึ่ง CDN (รองรับ CSP ของ Chrome Extension):
  - วนลูปทุกหน้าใน `pagesData`
  - แปลงแต่ละหน้าเป็น PNG (Multiplier x2 เพื่อความคมชัดเหมือนพิมพ์จริง)
  - แทรกรูปภาพแต่ละหน้าลงในเอกสาร Word และบังคับ page-break ต่อหน้า
  - บันทึกไฟล์ `.doc`

### 3.2 ปรับปรุง PDF (ใน `export.js`)
- [x] อัปเดตปุ่ม `btnExportPDF` ให้รองรับหลายหน้า (ปัจจุบันส่งออกเฉพาะหน้าที่เปิดอยู่เท่านั้น)
- [x] รวมรูปภาพจากทุกหน้าลงใน PDF ไฟล์เดียว (ลำดับหน้าตามโครงงาน)

---

## 📅 ระยะที่ 4: การสรุปและตรวจสอบความเรียบร้อย

### 4.1 ตรวจสอบความถูกต้องของ UI/UX
- [x] ตรวจ syntax/runtime error จากไฟล์หลักที่แก้ไข (`get_errors` ผ่านทั้งหมด)
- [ ] ทดสอบความลื่นไหลในการสลับหน้า (manual UX test ในเบราว์เซอร์)
- [ ] ตรวจสอบว่ารูป Monoline ที่เพิ่มเข้าไป สามารถเปลี่ยนสีได้ถูกต้องตามการตั้งค่า Fill/Stroke (manual visual test)

---

**สถานะปัจจุบัน**:
1. ระบบหลายหน้า + บันทึก/โหลดหลายหน้า ทำเสร็จแล้ว
2. ส่งออก PDF หลายหน้า + Word-compatible (.doc) ทำเสร็จแล้ว
3. เหลืองานทดสอบเชิงประสบการณ์ใช้งาน (manual test)
