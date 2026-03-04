# Action Plan: Native Curated Templates Integration (Inspired by Canva Worksheets)

**Date:** March 2, 2026
**Objective:** แผนการทำงานเพื่อเพิ่มระบบ "เทมเพลตใบงานฟรี" เข้าสู่แอปพลิเคชัน Smart-WS โดยอาศัยการสร้างเทมเพลตเข้าสู่ระบบเอง (Native Generation) แทนการดึงข้อมูลจากภายนอก เพื่อประสิทธิภาพ, การปรับแต่งได้ 100%, และป้องกันปัญหาลิขสิทธิ์

---

## Phase 1: Research & Discovery (การวิเคราะห์และรวบรวมแบบฟอร์ม)
*เป้าหมาย: หาแนวทางว่าเทมเพลตแบบไหนที่ผู้ใช้ต้องการมากที่สุด*
- [ ] **Analyze Top Categories:** เข้าไปศึกษาโครงสร้างใบงานฮิตจากแหล่งต่างๆ (เช่น Canva) แบ่งออกเป็นกลุ่มหลักๆ ได้แก่:
  - ใบงานคัดลายมือ (Handwriting practice lines)
  - ใบงานจับคู่ / โยงเส้น (Matching / Connect the dots)
  - แผนผังความคิด (Mind Mapping / Graphic Organizers)
  - ใบงานเติมคำในช่องว่าง (Fill-in-the-blanks / Cloze tests)
  - ตารางเวลา / แผนการสอน (Schedules / Lesson Planners)
- [ ] **Identify Primitive Shapes:** วิเคราะห์ว่าใบงานเหล่านั้นประกอบด้วยรูปทรงพื้นฐานอะไรบ้างในระบบเรา (เช่น เส้นประ, กล่องสี่เหลี่ยมมุมโค้ง, รูปเมฆ, ตาราง)
- [ ] **Copyright Clearance:** วางสไตล์ไกด์ (Style Guide) ของแอปเราเอง เพื่อเวลาสร้างเทมเพลตจะได้รูปโฉมที่เป็นเอกลักษณ์เฉพาะของ Smart-WS ไม่ลอกเลียนแบบโดยตรง

## Phase 2: System Architecture & Data Structure (การออกแบบโครงสร้างข้อมูล)
*เป้าหมาย: เตรียมระบบหลังบ้านของแอปให้พร้อมรับข้อมูลเทมเพลตจำนวนมาก*
- [ ] **Review Current Catalog:** ตรวจสอบโครงสร้างไฟล์ `data/templateCatalog.v1.js` และ `data/templatePresets.v1.js` ว่ารองรับหมวดหมู่ย่อย (Sub-categories) หรือยัง
- [ ] **Define Template Schema:** กำหนดโครงสร้างข้อมูล JSON สำหรับเทมเพลต 1 ชิ้น ตัวอย่างเช่น:
  ```json
  {
    "id": "tpl_handwriting_01",
    "title": "ใบงานคัดลายมือภาษาไทย (เส้นประ)",
    "category": "education",
    "subCategory": "worksheet",
    "thumbnail": "assets/templates/tpl_handwriting_01_thumb.webp",
    "tags": ["thai", "writing", "primary"],
    "canvasData": { /* Fabric.js JSON object */ }
  }
  ```
- [ ] **Asset Management:** สร้างโฟลเดอร์สำหรับเก็บภาพ Thumbnail ของเทมเพลต (แนะนำให้ใช้ .webp เพื่อลดขนาดแอป)

## Phase 3: Template Creation Pipeline (กระบวนการผลิตเทมเพลต)
*เป้าหมาย: สร้างเทมเพลตและแปลงสภาพให้พร้อมใช้งานในแอป*
- [ ] **Dogfooding Method:** ใช้แอป Smart-WS ของเราเองในการ "วาด/สร้าง" เทมเพลตขึ้นมา (จัดเรียงเส้น, ใส่ข้อความ Placeholder ให้น่าสนใจ)
- [ ] **Locking System:** กำหนดคุณสมบัติ Object บางตัวให้ล็อค (เช่น กรอบใบงาน ไม่ให้ขยับโดยไม่ตั้งใจ) แต่ข้อความให้ปลดล็อคเพื่อให้ผู้ใช้แก้ไขได้ทันที `(lockMovementX: true, editable: true)`
- [ ] **Export to JSON:** ดึงข้อมูล state ของ canvas ออกมาเป็น JSON และนำไปบันทึกไว้ใน `templatePresets.v1.js`
- [ ] **Batch 1 Goal:** ทำเทมเพลตเริ่มต้น (Starter Pack) ขึ้นมาก่อนประมาณ 10-15 แบบให้คลุมทุกหมวดหมู่หลัก

## Phase 4: UI/UX Implementation (การสร้างหน้าต่างเลือกเทมเพลต)
*เป้าหมาย: ให้ผู้ใช้เข้าถึงและเรียกใช้เทมเพลตได้ง่ายที่สุด*
- [ ] **Toolbar / Sidebar Button:** เพิ่มปุ่ม "Templates / ใบงาน" ที่เมนูด้านข้างหรือด้านบน (อิงตาม UI ปัจจุบัน)
- [ ] **Template Gallery Panel:** สร้าง Modal หรือ Sidebar ที่แสดงรายการเทมเพลต:
  - มี Search bar สำหรับค้นหา (เช่น พิมพ์ "คณิตศาสตร์")
  - มี Category Filter (ปุ่มกรองหมวดหมู่)
  - Grid View แสดงภาพ Thumbnail พร้อมชื่อ
- [ ] **Insert Logic (`templateHandlers.v1.js`):** เขียนฟังก์ชันเมื่อผู้ใช้กดเลือกเทมเพลต:
  - แจ้งเตือนผู้ใช้ (ถ้าใน Canvas มีงานอยู่แล้ว) ว่าจะแทรกทับ (Overwrite) หรือขยายหน้าใหม่ (New Page)
  - โหลด JSON เข้าสู่ Fabric.js Canvas ทันที (`canvas.loadFromJSON`)

## Phase 5: Testing & Refinement (การทดสอบและปรับปรุง)
*เป้าหมาย: ทำให้มั่นใจว่าผู้ใช้ทุกคนใช้งานได้ไม่สะดุด*
- [ ] **Responsiveness & Scaling:** ทดสอบว่าเมื่อโหลดเทมเพลตลงบนกระดาษขนาดต่างกัน (A4, Letter) ชิ้นส่วนต่างๆ ย่อขยายถูกต้องไหม
- [ ] **Font Compatibilities:** ทดสอบการแสดงผลฟอนต์ภาษาไทยและอังกฤษในเทมเพลตว่าไม่เพี้ยน
- [ ] **Export Test:** ทดสอบทำการ Export กระดาษที่ใช้เทมเพลต ออกเป็น PDF และ PPTX ว่าทำงานได้สมบูรณ์ (อ้างอิงโค้ดชุด `export.utils.js`)

---
*Status: Planning Phase*
*Next Action: ถ้าเห็นด้วยกับแผนนี้ เราสามารถเริ่มที่ Phase 2 (ปรับโครงสร้าง Catalog) หรือ Phase 4 (ร่าง UI Modal) ได้เลย*