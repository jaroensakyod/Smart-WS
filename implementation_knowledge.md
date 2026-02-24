# Implementation Knowledge — Smart WS Phase 2

เอกสารนี้สรุปความรู้เชิงเทคนิคจากการลงมือพัฒนา Smart WS รอบนี้ เพื่อใช้ต่อยอดในรอบถัดไป

## 1) Multi-page Architecture (สำคัญที่สุด)

- ใช้ **Fabric Canvas ตัวเดียว** แต่เก็บข้อมูลแต่ละหน้าใน `workbook.pages[]`
- โครงสร้างข้อมูลหน้า:
  - `json`: snapshot ของ canvas (`canvas.toJSON(...)`)
  - `undoStack`: ประวัติของหน้านั้น
  - `redoStack`: ประวัติทำซ้ำของหน้านั้น
- ตัวแปรหลัก:
  - `activePageIndex`
  - `workbook`
- ฟังก์ชันหลัก:
  - `persistCurrentPage()` เก็บ snapshot ก่อนเปลี่ยนหน้า/ส่งออก/บันทึก
  - `goToPage(index)` โหลดหน้าใหม่เข้าผืนผ้าใบเดิม
  - `addPageAndGo()` เพิ่มหน้าแล้วสลับไปหน้านั้นทันที

## 2) Undo/Redo รายหน้า

- ก่อนหน้านี้ undo/redo เป็น global เดียวทั้งไฟล์
- ปรับเป็น **แยกตามหน้า** โดยใช้ `undoStack` และ `redoStack` ของ page state
- Event `object:added/removed/modified` จะเรียก `saveHistory()` ให้บันทึกเฉพาะหน้าปัจจุบัน

## 3) Export หลายหน้า

- สร้าง helper `collectAllPagesPng()`
  1. จำ index หน้าปัจจุบัน
  2. วนทุกหน้า → สลับหน้า → `toDataURL()`
  3. กลับมาหน้าเดิม
- PDF:
  - วนรูปทุกหน้าแล้ว `pdf.addPage()` ตามลำดับ
- Word:
  - ใช้แนวทาง **Word-compatible .doc** โดยสร้าง HTML + `<img>` + `page-break-after`

## 4) เหตุผลที่ใช้ `.doc` แทน `.docx`

- หน้า extension ของ Chrome (MV3) มี CSP เข้มงวด และโดยทั่วไปไม่อนุญาตโหลดสคริปต์ CDN ตรงๆ
- เพื่อให้ฟีเจอร์ใช้งานได้ทันทีใน extension environment จึงเลือกวิธีสร้างไฟล์ `.doc` ที่ Word เปิดได้โดยไม่ต้องพึ่งไลบรารีภายนอก

## 5) Monoline Improvements

- เพิ่ม asset ใหม่ใน `data/svgLibrary.js`:
  - กรอบ monoline เพิ่มเติม
  - ลูกศร zigzag เพิ่มเติม
- เพิ่มตัวกรอง `Monoline only` ใน panel (`panel.js`) เพื่อคัดหมวด `arrows/symbols/geometry/animals`
- ปรับ image search (`webImages.js`):
  - boost query ด้วยคำ `line art`, `outline`, `black and white`
  - ตัวกรอง metadata ให้เหลือภาพแนว monoline มากขึ้น

## 6) APIs ที่ expose ให้โมดูลอื่นใช้งาน

จาก `app.js`:
- `window.wbGetWorkbookData()`
- `window.wbLoadWorkbookData(payload)`
- `window.wbGoToPage(index)`
- `window.wbGetPageCount()`
- `window.wbGetActivePageIndex()`
- `window.wbPersistCurrentPage()`

จาก `export.js`:
- ใช้ API ข้างต้นทั้งหมดเพื่อไม่ผูกกับ internal state โดยตรง

## 7) ข้อควรระวังรอบถัดไป

- การสลับหน้าเพื่อ export อาจมีอาการกระพริบ UI หากโปรเจกต์ใหญ่มาก
- หากต้องการ `.docx` จริงในอนาคต ควร bundle ไลบรารีไว้ในโฟลเดอร์ `vendor/` แล้วอ้างอิงแบบ local script
- ควรเพิ่ม automated test ระดับ serialization/load เพื่อกันข้อมูลหน้าเสียหาย

## 8) Wikimedia Monoline Search Upgrade (รอบ Wikimedia)

- `webImages.js` เปลี่ยน strategy ค้นหาในโหมด Monoline เป็นการ boost query ด้วย
  - `incategory:"Line art" OR incategory:"Coloring pages"`
  - `intitle:"outline" OR intitle:"line art"`
- เพิ่ม language mapping สำหรับคำค้นที่พบบ่อย (เช่น แมว/หมา/ดอกไม้) เพื่อให้ query อังกฤษแม่นขึ้นทันที
- เปิดรับไฟล์ `image/svg+xml` แล้ว และจัดลำดับผลลัพธ์ด้วย scoring ฝั่ง client:
  - SVG > PNG > JPEG
  - มีคำเชิง line-art ได้คะแนนเพิ่ม
  - คำเชิงภาพถ่ายสี/portrait/landscape โดนหักคะแนน
- เพิ่ม metadata filter ที่รวมข้อมูลจาก `ImageDescription`, `Categories`, `ObjectName`, `LicenseShortName` แทนดูแค่ field เดียว
- ตอนเพิ่มรูปลง Canvas:
  - ถ้าเป็น SVG ใช้ `fabric.loadSVGFromURL` แล้ว group เป็นวัตถุเดียว
  - ถ้าโหลด SVG ไม่ได้ ให้ fallback เป็น thumbnail PNG โดยอัตโนมัติ
  - มีสถานะ toast แยกสำหรับการเตรียมเวกเตอร์
- เพิ่ม badge `SVG` / `Vector` บนการ์ดผลค้นหาเพื่อสื่อคุณภาพไฟล์ให้ผู้ใช้ทันที

## 9) Monoline Chips in Left Panel

- `panel.js` เพิ่มชิปย่อยเมื่อเปิด `Monoline only` เพื่อกรองหมวด Mono ได้เร็วขึ้น (`all`, `arrows`, `symbols`, `geometry`, `animals`)
- ชิปจะซ่อนอัตโนมัติเมื่อปิดโหมด Monoline และรีเซ็ตกลับ `all`
- ใช้ class ใหม่ใน `style.css` (`panel-mono-chips`, `panel-mono-chip`) โดยยึด theme token เดิม (`--blue`, `--blue-dim`, `--border`)
