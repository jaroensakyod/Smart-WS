# แผนการปรับปรุงระบบค้นหารูป Monoline (Wikimedia Commons)

เป้าหมาย: เพิ่มความแม่นยำในการค้นหารูปภาพสไตล์ Monoline (ลายเส้นเดี่ยว) จากฐานข้อมูล Wikimedia Commons เพื่อนำมาใช้ในใบงาน (Worksheet)

---

## Phase 1: Search Query Strategy (ยุทธศาสตร์คำค้น)
การค้นหาแบบเดิมมักจะกระจายและเจอรูปไม่ตรงประเด็น เราจะปรับปรุงโดย:
- **Keyword Boosting:** เมื่อติ๊ก "Monoline Only" จะเพิ่มคำสั่ง `incategory:"Line art" OR incategory:"Coloring pages"` เข้าไปใน Query
- **Intitle Search:** เพิ่มการค้นหาจากชื่อไฟล์ (Intitle) เช่น `intitle:"outline"` หรือ `intitle:"line art"`
- **Language Mapping:** ปรับแต่งคำค้นอัตโนมัติ (เช่น ค้น "แมว" จะเปลี่ยนเป็น "cat outline" หรือ "incategory:Line art of cats")

## Phase 2: Technical Upgrade (รองรับไฟล์ SVG)
รูป Monoline ที่เป็นลายเส้นคุณภาพดีที่สุดคือไฟล์ SVG ซึ่งปัจจุบันระบบกรองออก เราจะเปลี่ยนมาเป็น:
- **Enable SVG:** อนุญาตให้ดึงไฟล์ `.svg` มาแสดงผลเมื่อเลือกโหมด Monoline
- **Vector Loading:** ใช้ `fabric.loadSVGFromURL` แทน `fabric.Image.fromURL` สำหรับไฟล์ SVG เพื่อให้ผู้ใช้สามารถ:
    - ขยายรูปได้ไม่จำกัด (Lossless Scaling)
    - เปลี่ยนสีเส้น (Stroke) และสีพื้น (Fill) ได้ในอนาคต

## Phase 3: Metadata & Client-Side Filtering (การกรองผลลัพธ์)
กรองรูปที่ไม่ใช่ขาวดำออกจากผลลัพธ์ที่ได้จาก API:
- **Category Check:** ตรวจสอบว่าใน `extmetadata` มีคำว่า "Line art", "Coloring pages", "Black and white" หรือไม่
- **Color Exclusion:** กรองคำว่า "color photograph", "landscape", "portrait" ออกจากคำอธิบายรูป
- **MIME Prioritization:** ให้คะแนนความสำคัญรูปภาพที่เป็น `image/svg+xml` สูงกว่า `image/png` หรือ `image/jpeg`

## Phase 4: User Interface Enhancements (การปรับแต่ง UI)
ช่วยให้ผู้ใช้เข้าถึงรูป Monoline ได้เร็วขึ้น:
- **Sub-Category Chips:** เพิ่มปุ่มลัด (Chips) ใต้ช่องค้นหาเฉพาะโหมด Monoline:
    - 🎨 `ระบายสี (Coloring)`
    - 🖊️ `ลายเส้น (Outline)`
    - 🔳 `ไอคอน (Icon)`
    - 📏 `รูปวาดเทคนิค (Diagram)`
- **Visual Badge:** แสดงสัญลักษณ์ "SVG" หรือ "Vector" บนการ์ดรูปภาพเพื่อให้รู้ว่าเป็นรูปคุณภาพสูง

## Phase 5: Reliable Loading & CORS Handling (ความเสถียร)
- **Fallback Logic:** หากโหลดไฟล์ SVG ต้นฉบับไม่ได้ (เนื่องจาก CORS) ให้ถอยลับไปใช้ไฟล์ PNG (Thumbnail) ที่ Wikimedia แปลงไว้ให้แล้วแทน
- **Loading Progress:** เพิ่มการแสดงสถานะ "กำลังเตรียมไฟล์เวกเตอร์..." เมื่อเลือกรูป SVG ขนาดใหญ่

---

### รายการไฟล์ที่ต้องแก้ไข:
1. `webImages.js`: แก้ไข Logic การสร้าง URL Search และการ Render SVG
2. `panel.js`: เพิ่มการจัดการ UI Chips สำหรับโหมด Monoline
3. `style.css`: เพิ่มสไตล์สำหรับการ์ดรูปภาพแบบใหม่ (Badges/Chips)

---

## สถานะดำเนินการ (อัปเดต 2026-02-24)

- ✅ Phase 1 เสร็จแล้ว: เพิ่ม query boosting + intitle + language mapping ใน `webImages.js`
- ✅ Phase 2 เสร็จแล้ว: เปิดรับ SVG และใช้ `fabric.loadSVGFromURL` พร้อม fallback เป็น PNG thumbnail
- ✅ Phase 3 เสร็จแล้ว: เพิ่ม metadata scoring/filtering และจัดลำดับ MIME (SVG มาก่อน)
- ✅ Phase 4 เสร็จแล้ว: เพิ่ม Sub-Category chips สำหรับโหมด Monoline และ badge `SVG/Vector` บนการ์ดรูป
- ✅ Phase 5 เสร็จแล้ว: เพิ่ม toast สถานะเตรียมเวกเตอร์ และ fallback logic เมื่อโหลด SVG ไม่สำเร็จ

### สรุปผลลัพธ์ที่ลงมือจริง

1. ปรับระบบค้นหา Wikimedia ให้ตรงรูปแบบ Monoline มากขึ้นด้วยคำค้นเชิงหมวดและชื่อไฟล์
2. รองรับไฟล์เวกเตอร์ SVG แบบใช้งานได้จริงบน Canvas (พร้อมถอยกลับ PNG หาก CORS/โหลดล้มเหลว)
3. เพิ่ม UX สำหรับคัดผลลัพธ์เร็วขึ้นทั้งใน modal ค้นหารูปและ panel หมวด SVG
4. บันทึกองค์ความรู้รอบนี้ไว้ที่ `implementation_knowledge.md` แล้ว

---

**งานตามแผนนี้ถูกดำเนินการเสร็จแล้ว**
