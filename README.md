# Smart WS Pro

Smart WS Pro คือ Chrome new tab app สำหรับออกแบบใบงานแบบมืออาชีพ (Canva-style) โดยโฟกัสงานครูและคอนเทนต์ Teachers Pay Teachers (TpT)

## จุดเด่นหลัก

- Workspace 3 ส่วน: Global top bar, contextual bar, sidebar tabs
- Multi-page workbook พร้อม Undo/Redo แยกต่อหน้า
- Zoom / Fit / Spacebar pan
- Layer, Lock/Unlock, Group/Ungroup
- Export PNG และ PDF 300 DPI
- Auto-save indicator

## ฟีเจอร์โปรล่าสุด (Phase 6)

- Smart guides + snapping กลางหน้า, กริด, และ object-to-object
- Advanced page management
  - Add / Duplicate / Delete / Clear page
  - Page Manager modal พร้อม thumbnail และ drag reorder
- Text effects
  - Outline
  - Drop shadow
  - Curved text
- Image finishing tools
  - Crop image (quick crop)
  - Circle / rounded mask
  - Reset mask
- QR code generator
  - กรอก URL แล้วแทรก QR ลง canvas ได้ทันที

## Template library ล่าสุด (Phase 7)

เดิม:
- MCQ, Matching, Fill in the Blank, Bingo 5x5
- Task Cards 4/8, Venn, Frayer, KWL
- Graph Paper, Number Line, Fraction Pies
- Quiz, Matching Columns

เพิ่มใหม่:
- Handwriting Lines
- Comic Strip
- Foldable / Flipbook
- Bingo 3x3
- Word Search 10x10
- Board Game Path
- Exit Tickets
- Mind Map
- Certificate
- Teacher Planner

## โครงสร้างไฟล์หลัก

- `newtab.html` โครง UI หลัก
- `style.css` ธีม/เลย์เอาต์/คอมโพเนนต์
- `app.js` canvas engine, page state, template generator, exposed APIs
- `proFeatures.js` UX โปร, zoom-pan, uploads, text fx, image mask/crop, page manager, QR
- `export.js` PNG/PDF export และ save/load flow
- `panel.js`, `toolbar.js`, `clipboard.js`, `equation.js`, `webImages.js`

## Development notes

- Canvas engine: Fabric.js
- Equation render: KaTeX
- PDF export: jsPDF
- All state runs client-side in browser context

## Installation (Chrome extension)

1. เปิด `chrome://extensions`
2. เปิด Developer mode
3. กด Load unpacked
4. เลือกโฟลเดอร์ `Smart-WS`

## Host permissions ที่ใช้งาน

- Wikimedia
- Flickr
- Iconify
- QR Server API

## Current status

- Phase 1-5: เสร็จสมบูรณ์
- Phase 6: พัฒนาแล้วตามรายการหลัก
- Phase 7: เพิ่ม template ใหม่ครบ 10 แบบ
