# 🚀 Smart-WS Pro: Canva-Style & TpT Ultimate Upgrade Plan

**เป้าหมาย (Objective):** ยกระดับ Smart-WS จากเครื่องมือสร้างใบงานพื้นฐาน สู่แพลตฟอร์มออกแบบระดับมืออาชีพ (Professional Design Tool) ที่มี UI/UX เทียบเท่า **Canva** และมีฟีเจอร์ที่ปรับแต่งมาเพื่อนักสร้างสื่อการสอนบน **Teachers Pay Teachers (TpT)** โดยเฉพาะ

---

## 🎨 Phase 1: UI/UX Architecture Revamp (ปฏิวัติหน้าตาและการใช้งานแบบ Canva)
ปรับโครงสร้างหน้าจอใหม่ทั้งหมด แก้ปัญหาแถบเครื่องมือล้นจอ และจัดระเบียบพื้นที่ทำงานให้กว้างขึ้น

- [x] **1.1 Layout Restructuring (โครงสร้างหน้าจอใหม่)**
  - [x] **Left Sidebar (แถบเมนูหลักด้านซ้าย):** สร้างแท็บหมวดหมู่ (Templates, Text, Elements, Borders, Uploads)
  - [x] **Top Global Bar (แถบบนสุด):** ย้ายเครื่องมือจัดการไฟล์ไปไว้ด้านบน (Undo/Redo, ชื่อโปรเจกต์, Save/Load, Export PDF, Preview)
  - [x] **Contextual Properties Bar (แถบคุณสมบัติอัจฉริยะ):** แถบใต้ Top Bar ที่จะเปลี่ยนไปตามวัตถุที่คลิก (เช่น คลิกข้อความโผล่แถบฟอนต์, คลิกรูปโผล่แถบสี/ขอบ, ไม่คลิกอะไรเลยโผล่แถบตั้งค่าหน้ากระดาษ)
- [x] **1.2 Asset Management (ระบบจัดการไฟล์ภาพ)**
  - [x] ถอดระบบ Openverse ออกเพื่อป้องกันปัญหาลิขสิทธิ์เชิงพาณิชย์ (Commercial Use)
  - [x] สร้างแท็บ **"My Uploads"** ให้ผู้ใช้ลากวาง (Drag & Drop) ไฟล์ Clipart ของตัวเองเข้ามาในโปรเจกต์ได้
  - [x] บันทึกภาพที่อัปโหลดไว้ใน Local Storage/IndexedDB ชั่วคราวเพื่อให้เรียกใช้ซ้ำได้ง่าย
- [x] **1.3 Workspace Navigation (ระบบมุมมองกระดาน)**
  - [x] **Zoom In / Zoom Out / Zoom to Fit:** เพิ่มปุ่มแว่นขยายและแถบสไลด์ซูมที่มุมขวาล่าง
  - [x] **Pan Tool (เครื่องมือเลื่อนกระดาน):** กด Spacebar ค้างไว้เพื่อเลื่อนดูส่วนต่างๆ ของใบงาน (Infinite Canvas Feel)

---

## 🛠️ Phase 2: Advanced Canvas Interactions (เครื่องมือออกแบบระดับโปร)
เพิ่มความสามารถของ Fabric.js ให้รองรับการจัดหน้ากระดาษที่ซับซ้อน

- [x] **2.1 Object Layering (ระบบจัดการเลเยอร์)**
  - [x] เพิ่มปุ่ม/คีย์ลัด: Bring to Front (นำมาหน้าสุด), Send to Back (นำไปหลังสุด), Bring Forward, Send Backward
- [x] **2.2 Object Locking (ระบบล็อกวัตถุ)**
  - [x] เพิ่มปุ่ม Lock/Unlock วัตถุ (ป้องกันการเผลอขยับกรอบกระดาษหรือพื้นหลังเวลาลากเมาส์คลุม)
  - [x] วัตถุที่ถูกล็อกจะไม่สามารถเลือก (Select) หรือขยับได้จนกว่าจะปลดล็อก
- [x] **2.3 Grouping & Ungrouping (ระบบจัดกลุ่ม)**
  - [x] เพิ่มปุ่ม Group (รวมกลุ่ม) และ Ungroup (แยกกลุ่ม) สำหรับวัตถุที่เลือกหลายชิ้น
  - [x] รองรับคีย์ลัด `Ctrl+G` และ `Ctrl+Shift+G`
- [x] **2.4 Advanced Clipboard (ระบบคัดลอกขั้นสูง)**
  - [x] ปรับปรุง Copy/Paste (`Ctrl+C`, `Ctrl+V`) ให้วางวัตถุเยื้องจากตำแหน่งเดิมเล็กน้อย (Offset) เพื่อให้เห็นชัดเจน
  - [x] เพิ่มปุ่ม Duplicate (`Ctrl+D`) ทำซ้ำวัตถุอย่างรวดเร็ว
- [x] **2.5 Document Color Palette (จานสีอัจฉริยะ)**
  - [x] ระบบจดจำ "สีที่ใช้ล่าสุดในเอกสาร" (Document Colors) เพื่อให้ครูคุมโทนสีใบงาน (Color Scheme) ได้ง่ายขึ้น

---

## 🖼️ Phase 3: TpT Asset Library (คลังองค์ประกอบตกแต่งใบงาน)
เพิ่มของตกแต่งที่จำเป็นสำหรับการทำใบงานขาย โดยเน้นความเรียบง่ายและดูแพง

- [x] **3.1 Page Borders Collection (คลังกรอบกระดาษ)**
  - [x] สร้างแท็บ "Borders" ในแถบซ้าย
  - [x] **Simple Borders:** เส้นทึบ, เส้นคู่, เส้นประ (Dashed/Dotted)
  - [x] **Geometric Borders:** กรอบลายเรขาคณิต
  - [x] **Doodle Borders:** กรอบสไตล์วาดมือ (Hand-drawn SVG)
  - [x] *ฟังก์ชันพิเศษ:* เมื่อคลิกเพิ่มกรอบกระดาษ ระบบจะปรับขนาดให้พอดีกับ Safe Margin อัตโนมัติและแนะนำให้ Lock ไว้
- [x] **3.2 Basic Shapes Engine (ระบบรูปทรงเรขาคณิต)**
  - [x] สร้างแท็บ "Elements"
  - [x] เพิ่มรูปทรงพื้นฐาน: สี่เหลี่ยม, วงกลม, สามเหลี่ยม, เส้นตรง, ลูกศร
  - [x] สามารถปรับแต่งสีพื้นหลัง (Fill), สีเส้นขอบ (Stroke), และความหนาของเส้นขอบ (Stroke Width) ได้อิสระ

---

## 📑 Phase 4: High-Converting TpT Templates (ระบบแม่แบบยอดนิยม)
สร้างโครงร่างใบงานที่ขายดีที่สุดบน TpT ให้ผู้ใช้กดใช้ได้ทันที

- [x] **4.1 Template Browser UI**
  - [x] สร้างหน้าต่างเลือก Template แบบมี Thumbnail ภาพตัวอย่างชัดเจนในแถบซ้าย
- [x] **4.2 Task Cards Generator (การ์ดงาน)**
  - [x] เลย์เอาต์แบ่ง 4 ช่อง หรือ 8 ช่องต่อหน้า พร้อมเส้นประสำหรับตัด (Cut Lines)
- [x] **4.3 Graphic Organizers (แผนผังความคิด)**
  - [x] **Venn Diagram:** แผนภาพเวนน์ 2 วงซ้อนกัน (ปรับความโปร่งใสได้)
  - [x] **Frayer Model:** ตาราง 4 ช่องสำหรับสอนคำศัพท์ (Definition, Characteristics, Examples, Non-examples)
  - [x] **KWL Chart:** ตาราง Know - Want to know - Learned
- [x] **4.4 Math & Grid Layouts (เค้าโครงคณิตศาสตร์)**
  - [x] **Graph Paper:** ตารางกราฟ (ปรับขนาดช่องได้)
  - [x] **Number Lines:** เส้นจำนวน (เติมตัวเลขหัวท้ายได้)
  - [x] **Fraction Pies:** วงกลมเศษส่วน
- [x] **4.5 Quiz/Test Layouts (โครงร่างแบบทดสอบ)**
  - [x] โครงสร้างข้อสอบแบบปรนัย (Multiple Choice) ก. ข. ค. ง. พร้อมช่องฝนคะแนน
  - [x] โครงสร้างข้อสอบแบบจับคู่ (Matching Columns)

---

## 🚀 Phase 5: Polish & Performance (การปรับแต่งขั้นสุดท้าย)
- [x] **5.1 Keyboard Shortcuts Engine:** แสดง Tooltip คีย์ลัดเมื่อเอาเมาส์ชี้ที่ปุ่มต่างๆ
- [x] **5.2 Export Optimization:** ตรวจสอบให้แน่ใจว่าระบบ Export PDF 300 DPI สามารถเรนเดอร์วัตถุที่ถูก Group, Lock หรือ Layer ซ้อนกันได้อย่างถูกต้องสมบูรณ์
- [x] **5.3 Auto-Save Indicator:** เพิ่มไอคอนแสดงสถานะ "Saving..." และ "Saved" บน Top Bar เพื่อความอุ่นใจของผู้ใช้

---

## 👑 Phase 6: Advanced Pro Features (ฟังก์ชันระดับโปร 100x)
ยกระดับเครื่องมือให้เหนือกว่าคู่แข่ง ลดเวลาการทำงานซ้ำซ้อน และเพิ่มความพรีเมียมให้ชิ้นงาน

- [x] **6.1 Smart Guides & Snapping (ระบบเส้นกะระยะอัจฉริยะ)**
  - [x] แสดงเส้นไกด์สีชมพู/แดง (Alignment Guidelines) เมื่อลากวัตถุตรงกับกึ่งกลางหน้ากระดาษ หรือตรงกับขอบวัตถุอื่น
  - [x] ระบบ Snap to Grid / Snap to Object เพื่อความเป๊ะของ Layout
- [x] **6.2 Advanced Page Management (ระบบจัดการหน้ากระดาษขั้นสูง)**
  - [x] เพิ่มปุ่ม **Duplicate Page** (ทำซ้ำหน้านี้) เพื่อสร้าง Task Cards หรือข้อสอบหน้าถัดไปได้ทันที
  - [x] เพิ่มปุ่ม **Delete Page** (ลบหน้า) และ **Clear Page** (ล้างหน้ากระดาษ)
  - [x] UI สำหรับดูภาพรวมทุกหน้า (Page Thumbnail View) และลากสลับลำดับหน้า (Reorder)
- [x] **6.3 Text Effects Engine (ระบบเอฟเฟกต์ข้อความ)**
  - [x] **Outline / Stroke:** เพิ่มขอบตัวหนังสือหนาๆ (ฮิตมากในหน้าปก TpT)
  - [x] **Drop Shadow:** เพิ่มเงาให้ข้อความดูมีมิติ
  - [x] **Curved Text:** ข้อความโค้งตามรูปทรง (ถ้า Fabric.js รองรับ หรือใช้ Path)
- [x] **6.4 Image Masking & Cropping (ระบบตัดและมาสก์รูปภาพ)**
  - [x] **Crop Tool:** ตัดขอบรูปภาพที่อัปโหลดเข้ามา
  - [x] **Shape Masks:** นำรูปภาพไปใส่ในกรอบวงกลม, สี่เหลี่ยมขอบมน, หรือรูปดาว (Clipping Path)
- [x] **6.5 QR Code Generator (ระบบสร้างคิวอาร์โค้ด)**
  - [x] สร้าง QR Code จาก URL ได้โดยตรงในแอป (ใช้ไลบรารีเช่น qrcode.js)
  - [x] แทรกลง Canvas อัตโนมัติ สำหรับทำ Interactive Worksheet

---

## 💎 Phase 7: Ultimate TpT Template Library (คลังเทมเพลตทำเงิน)
เพิ่มโครงร่างใบงานที่ขายดีที่สุด 10 แบบ ครอบคลุมทุก Niche ตลาดการศึกษา

- [x] **7.1 Primary & Early Childhood (กลุ่มเด็กเล็ก)**
  - [x] **Handwriting Lines:** เส้นบรรทัดคัดลายมือ (ทึบ-ประ-ทึบ) ปรับความห่างได้
  - [x] **Comic Strip / Storyboard:** กรอบวาดการ์ตูน 3-6 ช่อง พร้อมพื้นที่เขียนบรรยาย
  - [x] **Foldable / Flipbook:** เลย์เอาต์ใบงานพับได้ (Interactive Notebooks) พร้อมเส้นตัด/เส้นพับ
- [x] **7.2 Games & Interactive (กลุ่มเกมและกิจกรรม)**
  - [x] **Bingo Board:** กระดานบิงโก 3x3, 4x4, 5x5 พร้อมช่อง Free Space
  - [x] **Word Search Grid:** ตารางหาคำศัพท์ 10x10 หรือ 15x15
  - [x] **Board Game Path:** เลย์เอาต์บอร์ดเกมบันไดงู (Snake Path)
- [x] **7.3 Assessment & Management (กลุ่มประเมินผลและจัดการ)**
  - [x] **Exit Tickets:** ตั๋วออกห้องเรียน (แบ่งกระดาษ 3-4 ส่วนย่อย)
  - [x] **Mind Map / Bubble Map:** แผนผังความคิดแบบแตกแขนง 4-6 แฉก
  - [x] **Certificates:** เกียรติบัตรแนวนอน พร้อมกรอบและเส้นบรรทัด
  - [x] **Teacher Planner:** ตารางสอนรายสัปดาห์ (Weekly Lesson Plan) แบบมินิมอล
