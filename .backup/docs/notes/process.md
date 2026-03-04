# Process of Smart WS (Smart Worksheet)

โปรแกรม Smart WS เป็นเครื่องมือสร้างแบบฝึกหัด (Worksheet Builder) ในรูปแบบ Chrome/Web Extension โดยใช้ HTML5 Canvas เป็นพื้นที่ทำงานหลัก เอกสารนี้จะอธิบายขั้นตอนการทำงานและโครงสร้างของระบบทั้งหมด

## 1. การเริ่มต้นระบบ (Initialization)
เมื่อเปิดหน้า `newtab.html` ระบบจะทำการ:
- **ตั้งค่า Canvas**: โหลด Fabric.js และสร้าง Workspace ขนาด A4 (794x1123px ที่ 96dpi) ภายในไฟล์ `app.js`
- **โหลดข้อมูลเบื้องต้น**: ดึงข้อมูล SVG จาก `data/svgLibrary.js` มาแสดงที่แถบด้านซ้าย (`panel.js`)
- **จัดการประวัติ (Undo/Redo)**: สร้าง Stack สำหรับเก็บสถานะของ Canvas (JSON) เพื่อให้สามารถย้อนกลับหรือทำซ้ำได้ (สูงสุด 30 ขั้นตอน)
- **เตรียม Font**: เตรียมฟอนต์ "Sarabun" (ภาษาไทย) สำหรับการพิมพ์ข้อความและ Render สมการ

## 2. ส่วนประกอบของหน้าจอ (UI Components)
หน้าจอแบ่งออกเป็น 4 ส่วนหลัก:
1.  **Top Toolbar**: แถบเครื่องมือสำหรับเลือก (Select), วาดกล่อง (Rect), วาดเส้น (Line), พิมพ์ข้อความ (Text), แทรกสมการ (Equation), และค้นหารูป (Image Search)
2.  **Left Panel (SVG Library)**: คลังไอคอนและรูปภาพ Vector ที่จัดหมวดหมู่ไว้ สามารถคลิกหรือลากวาง (Drag-and-Drop) ลงบน Canvas ได้
3.  **Center Area (Canvas)**: พื้นที่หลักสำหรับออกแบบใบงาน
4.  **Right Panel (Properties)**: แผงควบคุมคุณสมบัติของ Object ที่เลือก เช่น ขนาดอักษร, สี, ความโปร่งใส, และการจัดลำดับเลเยอร์

## 3. ขั้นตอนการทำงานหลัก (Core Processes)

### 3.1 การวาดและจัดการ Object
- **วาดรูปทรง**: เมื่อผู้ใช้เลือกเครื่องมือ Rect หรือ Line ใน `app.js` จะเริ่มดักจับเหตุการณ์ `mouse:down`, `mouse:move`, และ `mouse:up` เพื่อสร้าง `fabric.Rect` หรือ `fabric.Line` แบบ Dynamic
- **พิมพ์ข้อความ**: ใช้ `fabric.IText` เพื่อรองรับการคลิกเพื่อแก้ไขข้อความได้ทันที
- **เปลี่ยนสี/คุณสมบัติ**: `toolbar.js` จะดึง Object ที่เลือกอยู่ (Active Object) มาอัปเดตคุณสมบัติตามที่ผู้ใช้กำหนดใน Right Panel

### 3.2 การจัดการสมการ (Equation Rendering)
นี่คือส่วนที่ซับซ้อนที่สุดใน `equation.js`:
1.  ผู้ใช้พิมพ์ข้อความผสม LaTeX (เช่น `$x^2 + y^2 = r^2$`) ใน Modal
2.  ระบบใช้ **KaTeX** แปลง LaTeX เป็น HTML String
3.  สร้าง **Offscreen Canvas** และใส่ HTML นั้นลงใน `foreignObject` ของ SVG
4.  แปลง SVG เป็น **PNG Data URL** เพื่อความคมชัด
5.  นำ PNG มาสร้างเป็น `fabric.Image` วางบน Canvas และเก็บ Source Code ไว้ใน `obj.data` เพื่อให้สามารถดับเบิลคลิกกลับมาแก้ไขได้

### 3.3 การค้นหารูปภาพ (Web Image Search)
- `webImages.js` เชื่อมต่อกับ **Wikimedia Commons API**
- ค้นหาไฟล์ภาพที่เป็น Public Domain/CC0
- แสดงผลในรูปแบบ Grid เมื่อผู้ใช้คลิก รูปจะถูกดาวน์โหลดและเพิ่มเข้า Canvas อัตโนมัติ

### 3.4 การใช้งาน Clipboard และ Drag-Drop
- `clipboard.js` รองรับการวาง (Paste) รูปภาพจากหน้าเว็บหรือการ Print Screen
- รองรับการวาง Text ที่มีสัญลักษณ์ `$` เพื่อแปลงเป็นสมการคณิตศาสตร์อัตโนมัติ
- รองรับการลากไฟล์ภาพจากเครื่องมาวางบน Canvas โดยตรง

## 4. การบันทึกและส่งออก (Export & Save)
จัดการโดย `export.js`:
- **บันทึกโครงงาน**: เก็บสถานะ JSON ลงใน `chrome.storage.local` (ถ้าเป็น Extension) หรือดาวน์โหลดเป็นไฟล์ `.json` (ถ้าเปิดเป็น Web)
- **Export PNG**: แปลง Canvas เป็นรูปภาพความละเอียดสูง (Multiplier x2)
- **Export PDF**: ใช้ไลบรารี **jsPDF** นำรูปภาพที่ได้จาก Canvas ไปวางบนหน้า A4 ในไฟล์ PDF เพื่อความสะดวกในการพิมพ์ (Print)

---
*จัดทำขึ้นโดย Model: Gemini 3 Flash (Preview)*
