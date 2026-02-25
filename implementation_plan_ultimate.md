# 🚀 Ultimate Worksheet Creator - Implementation Plan

**Document Status:** Draft / Proposed
**Objective:** ยกระดับ Smart-WS ให้เป็นแอปพลิเคชันสร้างใบงานที่สมบูรณ์แบบ จบในตัวโดยไม่ต้องพึ่งพาซอฟต์แวร์ภายนอก (เช่น Canva, Word) เน้นเครื่องมือเฉพาะทางสำหรับครูและนักสร้างสื่อการสอน (Teachers Pay Teachers Creators)

---

## 📋 Phase 8: Smart Worksheet Elements (เครื่องมือโครงสร้างใบงาน)
*เป้าหมาย: ลดเวลาในการวาดเส้นและตารางซ้ำซาก ให้ผู้ใช้สร้างโครงสร้างพื้นฐานได้ในไม่กี่คลิก*

- [x] **8.1 Smart Tables (ตารางอัจฉริยะ)**
  - [x] สร้างคลาสตารางแบบ Group-based สำหรับ Fabric.js
  - [x] UI สำหรับกำหนดจำนวน แถว (Rows) และ คอลัมน์ (Columns)
  - [x] ฟังก์ชันเพิ่ม/ลบ แถวและคอลัมน์แบบไดนามิก
  - [x] รองรับการดับเบิลคลิกเพื่อแก้ไขข้อความในเซลล์ (Cell Text Editing)
- [x] **8.2 Handwriting Lines (เส้นคัดลายมือ & กราฟ)**
  - [x] เครื่องมือสร้างเส้นประ (Dotted Lines) สำหรับเด็กอนุบาล
  - [x] เครื่องมือสร้างเส้นครึ่งบรรทัด (Primary Lined Paper)
  - [x] เครื่องมือสร้างตารางกราฟ (Grid Paper) สำหรับวิชาคณิตศาสตร์
  - [x] UI ปรับระยะห่างระหว่างบรรทัด (Line Spacing)
- [x] **8.3 Dynamic Charts & Math Tools (กราฟและเครื่องมือคณิตศาสตร์)**
  - [x] เครื่องมือสร้างโจทย์คณิตศาสตร์แบบอัตโนมัติและวางเป็นตาราง
  - [x] เครื่องมือสร้าง Word Search/Crossword เพื่อใช้งานแบบกิจกรรม
  - [x] เครื่องมือสร้างโครงสร้างโจทย์เชิงคณิตศาสตร์บน Canvas ผ่าน Generators

---

## 📐 Phase 9: Pro Layout & Workflow (การจัดหน้าเป๊ะระดับมืออาชีพ)
*เป้าหมาย: ให้การจัดเรียงข้อสอบและองค์ประกอบต่างๆ ตรงกัน สวยงาม และทำงานได้เร็วขึ้น*

- [x] **9.1 Alignment & Distribution (เครื่องมือจัดเรียง)**
  - [x] เพิ่มเมนู Alignment บน Toolbar (ชิดซ้าย, กึ่งกลาง, ชิดขวา, บน, กลาง, ล่าง)
  - [x] ฟังก์ชัน Distribute Evenly (กระจายช่องไฟแนวนอน/แนวตั้งให้เท่ากัน)
- [x] **9.2 Layers Panel (ระบบจัดการเลเยอร์)**
  - [x] สร้าง UI แผงควบคุมเลเยอร์ (Layers Sidebar)
  - [x] ฟังก์ชัน Lock/Unlock วัตถุ
  - [x] ฟังก์ชัน Hide/Show วัตถุ
  - [x] ฟังก์ชันสลับลำดับชั้น (Bring Forward / Send Backward)
- [x] **9.3 Rulers & Precision (ไม้บรรทัดและความแม่นยำ)**
  - [x] แสดงไม้บรรทัด (Rulers) ที่ขอบ Canvas
  - [x] ระบบ Snap to Grid (ดูดติดเส้นกริด)
  - [x] ระบบ Snap to Objects (ดูดติดวัตถุอื่นเมื่อลากเข้าใกล้)

---

## 🤖 Phase 10: Auto-Generators (ระบบสร้างโจทย์อัตโนมัติ)
*เป้าหมาย: ให้แอปช่วยคิดและสร้างโครงสร้างโจทย์ ลดภาระสมองของผู้สร้าง*

- [x] **10.1 Math Problem Generator (สุ่มโจทย์คณิตศาสตร์)**
  - [x] UI เลือกประเภทโจทย์และจำนวนหลัก
  - [x] สุ่มสร้างโจทย์และวางลงบน Canvas อัตโนมัติแบบจัดเรียงเป็น Grid
- [x] **10.2 Word Puzzle Maker (สร้างเกมคำศัพท์)**
  - [x] UI รับค่ารายการคำศัพท์ (Word List)
  - [x] อัลกอริทึมสร้างตาราง Word Search (หาคำศัพท์)
  - [x] อัลกอริทึมสร้าง Crossword (ปริศนาอักษรไขว้) แบบง่าย
- [x] **10.3 Answer Key Mode (โหมดสร้างเฉลย)**
  - [x] ปุ่ม "Generate Answer Key"
  - [x] Duplicate หน้าปัจจุบัน และเปลี่ยนข้อความในรูปแบบคำตอบให้เด่นในหน้าเฉลย
  - [x] เพิ่มลายน้ำ (Watermark) คำว่า "ANSWER KEY" บนหน้ากระดาษ

---

## 🎨 Phase 11: Rich Assets & Library (คลังทรัพยากรสำเร็จรูป)
*เป้าหมาย: มีของตกแต่งพร้อมใช้ ไม่ต้องออกไปหาโหลดจากเว็บอื่น*

- [x] **11.1 Borders & Frames (กรอบใบงาน)**
  - [x] คลังกรอบหน้ากระดาษสำเร็จรูป (Doodle borders, Academic borders)
  - [x] ฟังก์ชันคลิกเดียวครอบเต็มหน้ากระดาษ (Fit to Page)
- [x] **11.2 Icon & Clipart Integration (คลังไอคอน)**
  - [x] เชื่อมต่อ API ฟรี (Iconify API) สำหรับค้นหาไอคอนแบบ Vector (SVG)
  - [x] เน้นฟิลเตอร์ค้นหาภาพ "Black & White" หรือ "Line Art" สำหรับใบงานระบายสี
- [x] **11.3 My Saved Elements (คลังส่วนตัว)**
  - [x] ฟังก์ชัน "Save as Template Element" บันทึกวัตถุ/กลุ่มวัตถุ
  - [x] จัดเก็บลง IndexedDB
  - [x] แผง UI สำหรับคลิกเรียกใช้องค์ประกอบที่บันทึกไว้ลงหน้าใหม่ได้ทันที

---

## 🛠️ Technical Architecture & Notes
1. **Fabric.js Extensions:** การทำ Smart Tables ต้องใช้การสร้าง Custom Class (`fabric.util.createClass`) เพื่อให้จัดการกลุ่มของ Rect และ Text ได้อย่างมีประสิทธิภาพ
2. **State Management:** การทำ Layers Panel ต้องผูก Event `object:added`, `object:removed`, `object:modified` ของ Fabric.js เข้ากับ UI เพื่อให้แสดงผลตรงกันเสมอ
3. **Storage:** My Saved Elements จะใช้ `IndexedDB` (ผ่านไลบรารีอย่าง localforage หรือเขียน native) เพราะ SVG/JSON ของ Fabric.js อาจมีขนาดใหญ่เกินโควต้าของ `localStorage`
4. **External APIs:** การดึง Icon จะใช้ `fetch` ไปยัง Iconify API (`https://api.iconify.design`) ซึ่งต้องเพิ่มใน `host_permissions` ของ `manifest.json`

---
**Status:** ✅ Implemented (Phase 8-11 delivered)
