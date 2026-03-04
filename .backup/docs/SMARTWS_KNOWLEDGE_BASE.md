# Smart WS Knowledge Base (Single File)

ไฟล์นี้รวบรวมความรู้สำคัญของโปรเจกต์แบบอ่านจบในที่เดียว

## 1) โปรเจกต์นี้คืออะไร
Smart WS คือ Chrome Extension (New Tab override) สำหรับสร้างใบงาน/สื่อการสอนด้วย Canvas (Fabric.js) แบบลากวาง แก้ไขง่าย และส่งออกได้หลายรูปแบบ

## 2) โครงสร้างระบบโดยย่อ
- `manifest.json`: กำหนด extension และชี้หน้า `newtab.html`
- `newtab.html`: โครงหน้า UI หลัก และ modal ต่างๆ
- `style.css`: styling ทั้งระบบ
- `app.js`: canvas core, page/workbook state, template rendering แกนหลัก
- `proFeatures.js`: ฟีเจอร์ระดับโปร, generators, telemetry, modal logic
- `panel.js`, `toolbar.js`: UI interaction ฝั่ง sidebar/toolbar
- `export.js`, `export.utils.js`: export PNG/PDF/PPTX และ helper layout/profile
- `odl.import.js`, `odl.import.utils.js`: นำเข้า ODL JSON
- `market_analysis.js`: dashboard แนวโน้มตลาด
- `webImages.js`, `iconify.utils.js`: ค้นหา/ดึง asset ภายนอก
- `data/*`: แหล่งข้อมูล template/taxonomy/presets
- `vendor/*`: third-party libs (fabric/jspdf/pptxgen/katex)

## 3) แนวคิดการทำงานหลัก
1. ผู้ใช้สร้าง/แก้ไขเนื้อหาบน canvas
2. ระบบเก็บสถานะเอกสารหลายหน้า
3. ใช้ template/generator เพื่อลดเวลาการทำงาน
4. export ออกไฟล์สื่อการสอนได้ทันที

## 4) ฟีเจอร์เด่นใช้งานจริง
- Multi-page workbook (เพิ่ม/ลบ/ทำซ้ำ/จัดลำดับหน้า)
- Template catalog + filters
- Worksheet generators หลายรูปแบบ
- AI Prompt Guide สำหรับคัดลอก prompt ไปใช้กับ AI ภายนอก
- Market Analysis Dashboard (โหมดช่วยวางไอเดียสินค้า)
- Export PNG/PDF/PPTX

## 5) แนวทางคุณภาพโค้ดที่ใช้ในโปรเจกต์นี้
- แยก core logic กับ UI wiring
- รวม utility ที่ทดสอบได้ในไฟล์แยก
- ใช้ unit tests สำหรับ utility สำคัญ
- ใช้ event binding แบบมี guard (`?.addEventListener`) ป้องกันจุดพังจาก element หาย

## 6) ความรู้จากรอบปรับปรุงล่าสุด
- จัดระเบียบเอกสารแผน/โน้ตเข้าโฟลเดอร์ `docs/`
  - `docs/plans/` สำหรับ implementation plans
  - `docs/notes/` สำหรับโน้ตการทำงาน
- AI Prompt Guide ถูกปรับให้เน้นการ `Copy Prompt` เป็นหลัก
- ขยายคลัง prompt จำนวนมาก และปรับให้แตกต่างตามหมวด เพื่อลดความซ้ำของแนว prompt
- เพิ่มแนว prompt สำหรับ cover/page design และงาน image generation มากขึ้น

## 7) วิธีรันและทดสอบเร็ว
### ติดตั้ง extension
1. เปิด `chrome://extensions`
2. เปิด Developer mode
3. กด Load unpacked แล้วเลือกโฟลเดอร์โปรเจกต์

### ทดสอบ (Node test)
- `node --test tests/export.utils.test.js`
- `node --test tests/iconify.utils.test.js`
- `node --test tests/odl.import.utils.test.js`
- `node --test tests/template.catalog.test.js`
- `node --test tests/template.handlers.test.js`

## 8) แนวทางพัฒนาต่อ (แนะนำ)
- เพิ่มตัวกรองหมวดใน AI Prompt Guide
- เพิ่มระบบ regenerate variant สำหรับ prompt รายการเดียว
- เพิ่ม e2e smoke test สำหรับ flow สำคัญ (open newtab -> add template -> export)

## 9) Known constraints
- เป็น extension ฝั่ง browser จึงผูกกับโครงสร้างไฟล์ static ค่อนข้างมาก
- การย้ายไฟล์ runtime หลักต้องปรับ path ใน `manifest.json` และ script references อย่างระวัง
