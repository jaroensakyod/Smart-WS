# Smart WS

Smart WS คือ Chrome New Tab Extension สำหรับสร้างใบงาน/สื่อการสอนแบบลากวางบน Canvas และส่งออกได้ทันที

## ใช้ทำอะไรได้บ้าง
- สร้างเอกสารหลายหน้า (Worksheet / Activity Pack / Slide)
- ใช้เทมเพลตและตัวช่วย Generator เพื่อลดเวลาทำงาน
- เพิ่มข้อความ สมการ รูปภาพ ไอคอน และองค์ประกอบกราฟิก
- ส่งออกเป็น PNG, PDF, PPTX

## ฟีเจอร์หลักแบบสั้น
- Multi-page Workbook: เพิ่ม/ลบ/ทำซ้ำ/จัดลำดับหน้า
- Template + Generator: ใบงานหลายรูปแบบพร้อมใช้งาน
- Curated Free Templates: แกลเลอรีเทมเพลตพร้อม preview และกดเพิ่มได้ทันที
- AI Prompt Guide: คัดลอก prompt ไปใช้กับ AI ภายนอก
- Market Analysis: ช่วยดูแนวโน้มไอเดียสินค้า
- Export Engine: รองรับงานหลายหน้าได้เสถียร

## โครงสร้างไฟล์สำคัญ
- `newtab.html` หน้าหลักของแอป
- `style.css` สไตล์ทั้งหมด
- `app.js` แกน canvas/workbook
- `proFeatures.js` ฟีเจอร์เสริม + generators + modal logic
- `export.js`, `export.utils.js` ระบบ export
- `data/` ข้อมูล templates และ taxonomy
- `data/curatedTemplates.v1.js` ชุด curated templates (preview + canvasData)
- `vendor/` ไลบรารีภายนอก
- `docs/` เอกสารแผน/บันทึกการพัฒนา

## เอกสารใหม่
- ความรู้รวมไฟล์เดียว: `docs/SMARTWS_KNOWLEDGE_BASE.md`

## ติดตั้ง (Developer Mode)
1. เปิด `chrome://extensions`
2. เปิด `Developer mode`
3. กด `Load unpacked`
4. เลือกโฟลเดอร์โปรเจกต์ `Smart-WS`
5. เปิดแท็บใหม่เพื่อใช้งาน

## ทดสอบ
```bash
node --test tests/export.utils.test.js
node --test tests/iconify.utils.test.js
node --test tests/odl.import.utils.test.js
node --test tests/curated.templates.test.js
node --test tests/template.catalog.test.js
node --test tests/template.handlers.test.js
```

## หมายเหตุ
- โปรเจกต์นี้เป็น Chrome Extension: หากย้ายไฟล์ runtime ต้องอัปเดต path ใน `manifest.json` และ `newtab.html` ให้ครบ
