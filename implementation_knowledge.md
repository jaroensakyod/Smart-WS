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

## 10) Phase 3 UI Refresh + Tooling Upgrade

- Toolbar ถูกปรับเป็นโทนน้ำเงินเข้มคอนทราสต์สูง เพื่อให้ปุ่ม/ไอคอนอ่านง่ายขึ้นบนจอมืด
- ปุ่มค้นหารูป `toolImageSearch` ถูกย้ายไปตำแหน่งแรกสุดของกลุ่มเครื่องมือ
- ตัดระบบส่งออก Word (`btnExportDOCX`) ออกจากทั้ง HTML และ JS เพื่อให้ bundle เล็กลงและลดโค้ดที่ไม่จำเป็น

## 11) SVG Library Expansion (Geometry / Symbols / Frames)

- ลบหมวดเก่า `arrows` และ `animals` ออกจาก panel categorization เพื่อโฟกัสชุดที่ใช้งานจริง
- เพิ่มชุดเรขาคณิตพื้นฐานและสามมิติในหมวด `geometry`:
  - cone, cylinder (detail), sphere (latitude), pyramid (tri/square base), prisms, pentagon/hexagon/octagon
- เพิ่มชุด `symbols` แนวข้อสอบ/เอกสาร:
  - check/cross, star 4-12 แฉก, heart, warning, phone/laptop/tablet
- เพิ่มกรอบใหม่ใน `frames`:
  - floral, thai-applied, shadow, scallop-corner

## 12) Image Search Engine (Infinite Scroll + Advanced Filters)

- เพิ่ม state pagination:
  - `currentOffset`, `currentQuery`, `hasMore`, `isLoading`
- เปลี่ยนการค้นหาเป็น incremental:
  - ค้นครั้งแรก reset grid
  - เลื่อนลงท้าย `#imgSearchGrid` แล้วโหลดหน้าเพิ่ม (`append`) อัตโนมัติ
- เพิ่ม filter ใหม่:
  - `imgSvgOnly`, `imgVectorOnly`
  - build query เพิ่ม `filetype:svg` เมื่อเลือก SVG/Vector
- เพิ่ม post-filter ฝั่ง client:
  - คัด mime ที่ตรง filter
  - โหมด Monoline ยังคงใช้ scoring model เดิมเพื่อจัดอันดับคุณภาพผลลัพธ์

## 13) Advanced Drawing System (Line / Arrow / Curve / Callout)

- ขยาย tool mode ใน `app.js`:
  - `line`, `lineDoubleArrow`, `curve`, `callout`
- เพิ่ม line settings ใน properties panel:
  - type (`line`, `arrow`, `doubleArrow`), width, dashed
- เส้นลูกศรสร้างจาก line + triangle head (group) เพื่อให้ควบคุมทรงหัวลูกศรได้ง่าย
- เส้นโค้งใช้ quadratic path (`M ... Q ...`) สำหรับ arc แบบเร็ว
- callout สร้างจาก group (bubble + pointer + text) เพื่อแก้ไข/ย้ายได้เป็นก้อนเดียว
- expose API ใหม่:
  - `window.wbSetLineSettings(next)`
  - `window.wbGetLineSettings()`
  เพื่อให้ `toolbar.js` sync ค่า line settings กับ engine

## 14) ข้อสังเกตหลังใช้งานจริง

- การแก้ style ของ object กลุ่มลูกศร (`fabric.Group`) ต้องจัดการ child object แยก (line/triangle) ไม่สามารถ set stroke ทีเดียวที่ group แล้วครบทุกกรณี
- การ redraw เส้นลูกศรระหว่างลากเมาส์ใช้วิธี remove+create object ใหม่ในทุก move event เพื่อคำนวณหัวลูกศรให้ตรงทิศ
- ถ้าต้องการรองรับการสลับชนิดเส้นของ object เดิมแบบสมบูรณ์ (line ↔ arrow ↔ doubleArrow) ควรเพิ่ม utility แปลง object ที่คง geometry เดิมโดยตรงในรอบถัดไป

## 15) Phase 3.1 (Theme + Callout + Arrow Pattern + Multi-source Search)

- เพิ่มระบบ Theme จริงแบบ stateful:
  - ใช้ `body[data-theme='light']` สำหรับ override token สีทั้งหมด
  - ใช้ `localStorage` key `smartws_theme` เพื่อจำค่าธีมข้าม session
  - ใช้ปุ่ม `#themeToggle` เพื่อสลับ Light/Dark แบบไม่ต้อง reload
- บทเรียนด้าน Contrast:
  - ปุ่มเครื่องมือบน toolbar ควรมีทั้ง `color`, `background`, `border` ที่ต่างระดับกันชัดเจน
  - สถานะ `active` ควรมีทั้งสีพื้น + เส้นขอบ + shadow เพื่อแยกจาก `hover` อย่างชัด
- ปรับ Callout ให้เป็น “กล่องเปล่า” โดยยังแก้ไขข้อความได้:
  - `fabric.IText('')` แทน placeholder text ช่วยลดขั้นตอนลบข้อความเดิม
  - คง `subTargetCheck: true` และ event `mousedblclick` เพื่อเข้าระบบพิมพ์ใน group ได้
- อัปเกรดระบบเส้นให้รองรับ Pattern:
  - เปลี่ยนจาก boolean `dashed` เป็น enum `pattern` (`solid`, `dashed`, `dotted`)
  - ทำ helper `getDashArray(pattern, width)` ให้ทั้ง `app.js` และ `toolbar.js` ใช้ตรรกะเดียวกัน
  - group line/arrow ต้องตั้ง dash เฉพาะ child ที่เป็น `line/path` ไม่ใช่ `triangle` (หัวลูกศร)
- ระบบค้นหารูปฟรีหลายแหล่ง:
  - เพิ่ม source switch: `Wikimedia Commons` และ `Openverse`
  - โหมด Wikimedia ใช้ query แบบเน้น `intitle:"..."` + token เฉพาะโดเมน (clipart/vector/line-art)
  - โหมด Openverse ใช้ endpoint `https://api.openverse.org/v1/images/` พร้อม page-based infinite scroll
  - ทำ normalize layer รวมผลลัพธ์ต่างโครงสร้างให้ UI render ชุดเดียวได้ (`thumbUrl/fullUrl/mime/title`)
- ข้อสังเกตเชิงระบบค้นหา:
  - Wikimedia เหมาะกับไฟล์เชิงเอกสารและภาพจากหมวดหมู่
  - Openverse ให้ผลกว้างและเน้นรูปใช้งานได้จริง จึงควรมีทั้งสองแหล่งเพื่อ balance precision/coverage

## 16) Hotfix รอบล่าสุด (Search UX + Openverse 401 + Library Expansion)

- ปรับ UX ของหน้าค้นหารูปให้เห็นรูปตัวอย่างชัดขึ้น:
  - เพิ่มขนาด modal ค้นหารูป และขยาย card thumbnail + ข้อความใต้ภาพ
  - เปลี่ยน grid เป็น `auto-fill minmax(...)` เพื่อให้ card ใหญ่ขึ้นอัตโนมัติตามพื้นที่
- แก้ปัญหา infinite scroll ไม่โหลดต่อ:
  - เพิ่ม `ensureGridFilled()` ให้โหลดหน้าเพิ่มทันทีเมื่อผลลัพธ์ยังไม่พอจนเกิด scrollbar
  - เพิ่ม guard เมื่อ append แล้วไม่พบรายการ ให้หยุด `hasMore` ป้องกัน loop วน
  - เพิ่ม listener เสริมบน wheel ของ modal เพื่อให้ trigger append ได้เสถียรขึ้น
- แก้ปัญหา `Openverse API Error 401`:
  - เมื่อเจอ 401 จะ fallback อัตโนมัติไป Wikimedia
  - อัปเดต source selector ให้ตรงกับ source ที่ใช้งานจริงและแจ้งผู้ใช้ด้วย toast
  - แนวคิดนี้ช่วยไม่ให้ UX หยุดด้วย error แม้ third-party source จะ block ชั่วคราว
- เพิ่มความสามารถเปลี่ยนสีข้อความ:
  - รองรับ `i-text`, `text`, `textbox`
  - รองรับข้อความที่อยู่ภายใน `fabric.Group` (เช่น Callout) โดยไล่เปลี่ยน fill เฉพาะ child ที่เป็น text object
- ขยาย SVG Library จำนวนมาก:
  - เพิ่มชุด `frames` ใหม่หลายแบบ (ticket, cloud, notebook-hole, math-grid, ฯลฯ)
  - เพิ่มชุด `symbols` ใหม่ (mail, home, calendar, clock, gear, link, ฯลฯ)
  - เพิ่มชุด `geometry` ใหม่ (tetrahedron, torus, frustum, nonagon, decagon, ellipse axes, ฯลฯ)

## 17) Hotfix รอบใหม่ (Source Replace + Scoped Color + Table Tool)

- เปลี่ยนแหล่งค้นหารูปฟรี:
  - ถอด `Openverse` ออกจาก UI/logic ทั้งหมดตาม requirement
  - เพิ่มแหล่ง `OpenClipart` แทน และ fallback ไป Wikimedia อัตโนมัติเมื่อแหล่งใหม่ล้มเหลว
- แก้ปัญหา preview ย่อ/กลายเป็นขีดระหว่างเลื่อน:
  - ล็อกโครง grid เป็น 2 คอลัมน์คงที่ ลดการ reflow ที่ทำให้ card ยุบ
  - เพิ่มขนาดภาพ preview และใช้ `object-fit: contain` + พื้นหลังขาวเพื่ออ่านรูปได้ชัด
  - คุม `min-height` ของ card/info เพื่อไม่ให้ collapse ระหว่างโหลดภาพ
- แยกการเปลี่ยนสีตามชนิด object (scoped color editing):
  - `colorText` มีผลเฉพาะ text objects (`i-text/text/textbox`) เท่านั้น
  - `colorFill` มีผลเฉพาะกล่อง/shape เท่านั้น ไม่กระทบเส้น/ข้อความ
  - `colorStroke` มีผลเฉพาะ line/path/arrow/table เท่านั้น ไม่กระทบ object อื่น
- เพิ่มเครื่องมือสร้างตาราง:
  - เพิ่มปุ่ม `toolTable` (ไอคอน ▦) และ shortcut `G`
  - ตารางถูกสร้างเป็น group ของเส้นตามสี/รูปแบบเส้นปัจจุบัน และปรับผ่าน panel เส้นได้

## 18) Hotfix รอบล่าสุด (Multi-source Search + UX Simplify + Equation Width)

- ถอด OpenClipart ออกจากระบบค้นหารูป (เนื่องจากเสถียรภาพไม่ดีในสภาพแวดล้อมจริง)
- เพิ่มแหล่งค้นหารูปฟรีแบบไม่ต้องใช้ API key รวม 2 แหล่งใหม่:
  - `Flickr Public` (ภาพสาธารณะ)
  - `Iconify` (ไอคอน SVG)
  - รวมกับ `Wikimedia` เป็น 3 แหล่งค้นหา
- โหมด Monoline ถูกบังคับเปิดตลอด (always-on) โดยไม่ต้องมี checkbox
- ถอด quick chips หมวดหมู่ (การศึกษา/วิทยาศาสตร์/ฯลฯ) ออกจาก UI ตาม requirement
- เพิ่มคำแนะนำการกรอกในช่องค้นหา เพื่อช่วยให้ user ใส่คีย์เวิร์ดได้แม่นขึ้น
- แก้ปัญหา card preview ย่อ/เป็นเส้นระหว่างเลื่อน:
  - ล็อก grid เป็นคอลัมน์คงที่
  - เพิ่ม `min-height` card และกำหนดขนาดรูปคงที่ + `object-fit: contain`
- ตารางกำหนดจำนวนแถว/คอลัมน์ได้:
  - ตอนวางตารางจะถาม Rows/Columns และ validate ช่วง 1..20
- ปรับขนาดกรอบสมการ:
  - ลด max render width ของสมการ
  - เพิ่ม auto-fit scale ตามพื้นที่กระดาษเพื่อลดปัญหากรอบกว้างเกิน

## 19) Hotfix รอบปัจจุบัน (Wikimedia Reliability + Infinite Scroll + Source Guide)

- ปรับระบบค้นหารูปใหม่ทั้งโมดูล โดยเน้นความเสถียร:
  - ทำ `safeFetch()` พร้อม timeout และ error handling กลาง
  - แสดงข้อความ `Failed to fetch` แบบเข้าใจง่ายขึ้น พร้อมแนะแนวตรวจอินเทอร์เน็ต/สิทธิ์โดเมน
- ปรับ query ของ Wikimedia ให้กว้างขึ้น ลดอาการ “ไม่เจอรูป” จาก query ที่แคบเกิน:
  - ใช้คำผสมแนว `outline / line art / icon / diagram / clipart / vector`
  - มี fallback query เมื่อผลรอบแรกว่าง
- เพิ่มช่องทางค้นหารูปฟรีหลายแหล่ง (รวมเกิน 2 แหล่ง):
  - Wikimedia Commons
  - Flickr Public
  - Iconify Icons
  - Library (ในเครื่อง)
- เพิ่มคู่มือการค้นหา Iconify แบบ contextual:
  - hint เปลี่ยนตาม source ที่เลือก
  - ยกตัวอย่างทั้ง keyword และรูปแบบ `prefix:name` (เช่น `mdi:home`)
- แก้ infinite scroll ให้เสถียร:
  - ใช้ทั้ง `IntersectionObserver` (sentinel) + near-bottom scroll trigger
  - มี `ensureGridFilled()` เติมผลลัพธ์อัตโนมัติเมื่อรายการยังไม่พอให้เกิด scroll
- เพิ่ม host permissions ใน manifest สำหรับแหล่งใหม่เพื่อลด fetch error ใน extension context
- ขยายคลัง SVG เพิ่มอีกมากกว่า 10 ชิ้น กระจายในหมวดที่ร้องขอ:
  - math / people / nature / school / frames / symbols / geometry

## 20) Hotfix ล่าสุด (Search Relevance + Manual Search + Openverse 401)

- แก้ปัญหา `Iconify/Flickr` เลื่อนสุดแล้วไม่โหลดเพิ่ม:
  - ใช้ offset/page ที่คงที่ขึ้น และไม่ผูกกับจำนวนผลลัพธ์หลังกรอง
  - เพิ่ม dedupe key ต่อ session เพื่อกันรายการซ้ำตอน append
  - กรณีผลลัพธ์หน้าใหม่ว่าง จะลองขยับหน้าเพิ่มอีกรอบก่อนหยุด
- แก้ relevance เมื่อเปิด `SVG Only / Vector Only`:
  - ปรับ Wikimedia query เป็น `filetype:svg` แบบตรงคำค้น
  - จัดอันดับ/คัดผลจาก “ชื่อรายการ” เป็นหลัก
  - fallback query (`<query> image`) ยังใช้คำค้นเดิมเป็น relevance key เพื่อไม่หลุดหัวข้อ
- ปรับ UX การค้นหา:
  - เปลี่ยนจากค้นหาอัตโนมัติขณะพิมพ์ → ค้นหาเมื่อกดปุ่ม/Enter เท่านั้น

## 21) Phase 6 + 7 Delivery Notes (Pro Features + Template Scale)

- Advanced Page Management ถูกย้ายจากแนวคิดเป็นระบบใช้งานจริง:
  - เพิ่ม API ระดับ app core: `wbDuplicatePage`, `wbDeletePage`, `wbClearPage`, `wbMovePage`, `wbGetPageThumbnails`
  - `wbGetPageThumbnails()` ใช้วิธีวนสลับหน้า + `toDataURL` แล้วกลับหน้าปัจจุบันเพื่อให้ thumbnail ตรง state จริง
- Page Manager UX:
  - ใช้ modal เดียวพร้อม thumbnail grid
  - รองรับ drag and drop reorder โดย drop target เป็น page card แต่ละหน้า
  - หลัง reorder ต้อง reload หน้า active เพื่อ sync index + indicator
- Text Effects Implementation:
  - Outline: toggle ผ่าน `stroke` + `strokeWidth`
  - Shadow: ใช้ `fabric.Shadow`
  - Curved text: แปลงข้อความเป็น `fabric.Text` แล้วผูกกับ `fabric.Path` แบบ quadratic
- Image Finishing:
  - Crop ใช้ native image crop props (`cropX`, `cropY`, `width`, `height`) โดย quick percentage crop
  - Mask ใช้ `clipPath` แบบ circle/rounded rect และ reset ได้
- QR Generator:
  - ใช้ URL API (`api.qrserver.com`) แล้วโหลดกลับเข้า Fabric image object
  - ต้องเพิ่ม host permission ใน MV3 ให้ครบ มิฉะนั้น extension fetch/load อาจถูกบล็อก
- Template scaling strategy:
  - เพิ่ม template ใหม่เป็น branch ใน `applyTemplate(type)` เพื่อ reuse object factory เดิมและลด regression
  - sync key เดียวกันทั้ง `templateSelect` และ `templateCards` ป้องกัน mismatch ระหว่าง dropdown กับ gallery
  - เพิ่มปุ่ม `ค้นหา` ใน modal เพื่อให้ workflow ชัดเจน
- Openverse API:
  - บริการฟรีแต่บางช่วงเจอ `401` ได้
  - ระบบสลับ fallback ไป Wikimedia อัตโนมัติและแจ้งผู้ใช้ด้วย toast

## 22) Ultimate Delivery Notes (Phase 8-11)

- Smart Table ที่ editable ใน Fabric:
  - ใช้วิธีสร้าง `fabric.Group` ที่ประกอบด้วย `Rect + IText` ต่อ cell
  - เก็บ schema ตารางไว้ใน `group.data` (`rows`, `cols`, `cellW`, `cellH`, `cells`)
  - ดับเบิลคลิกแล้วคำนวณ pointer -> row/col ด้วย local coordinate ของ group
  - เมื่อแก้ไขข้อมูลหรือเพิ่ม/ลด row/col ใช้วิธี rebuild group ทั้งก้อนเพื่อคงโครงสร้างสม่ำเสมอ
- Handwriting presets:
  - แยก style เป็น `primary`, `dotted`, `grid`
  - ตั้งค่า `spacing` จาก UI แล้วส่งผ่าน API `wbSetWritingLinesConfig`
  - ค่าตั้งต้นของ tool ถูกเก็บใน state กลาง (`writingLineSettings`) เพื่อใช้ซ้ำทุกครั้งที่วาง
- Layers panel architecture:
  - render จาก `canvas.getObjects()` แล้ว reverse ให้ชั้นบนสุดแสดงบนสุด
  - event sync สำคัญ: `object:added/modified/removed` + `selection:*`
  - การ lock object ต้องตั้งทั้ง `selectable/evented/hasControls` และ `lockMovement/lockScaling/lockRotation`
- Auto-generators:
  - Math generator: random expression + layout แบบ grid columns
  - Word Search: place คำแบบสุ่มทิศทาง (แนวนอน/แนวตั้ง/ทแยง) แล้ว fill ช่องว่างด้วย A-Z
  - Crossword (เวอร์ชันเบา): วางคำสลับแนวนอน/แนวตั้งและเติม clue list ข้างกริด
- Answer key generation pattern:
  - ใช้รูปแบบข้อความ `[answer]` เป็น marker ในหน้าใบงาน
  - เมื่อ Generate Answer Key: duplicate หน้า -> replace marker -> highlight เฉลย -> ใส่ watermark
  - วัตถุที่เป็นเฉลยถูก tag `answerOnly` เพื่อทำงานร่วมกับ worksheet mode เดิม
- Saved Elements ด้วย IndexedDB:
  - localStorage ไม่เหมาะกับ object JSON/preview ขนาดใหญ่
  - ใช้ object store เดียว (`elements`) เก็บ `name`, `json`, `preview`, `createdAt`
  - revive object กลับเข้า canvas ผ่าน `fabric.util.enlivenObjects`
  - รองรับ CRUD เบื้องต้น: save, list, insert, delete
