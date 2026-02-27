# แผนการพันา: Smart-WS (อัปเดต 27 ก.พ. 2026)
**เป้าหมายหลัก:** เพิ่ม Generators ที่ขายดีบน TpT, ขยายคลัง Borders ให้สวยงามและหลากหลาย, และปรับปรุง Market Analysis Dashboard ให้ฟกัสเพาะ TpT พร้อมการใช้งานที่ง่ายขึ้น

---

## Phase 1: ปรับปรุง Market Analysis Dashboard (TpT Focus)
**เป้าหมาย:** ทำให้ระบบวิเคราะหตลาดใช้งานง่ายที่สุด (Minimalist UI) ตัดข้อมลที่ไม่จำเปนออก และเชื่อมยงกับ TpT ดยตรง

*   **1.1 ปรับลดความับ้อนของ UI (
ewtab.html, style.css)**
    *   ลบแทบและข้อมลที่เกี่ยวกับ Amazon KDP ออกทั้งหมด
    *   เปลี่ยน UI เปนแบบ **Single Search Bar** (ช่องค้นหาเดียว) คล้าย Google Search
    *   แสดงผลลัพ (Opportunity Score) ในรปแบบเกจวัด (Gauge) หรือแถบสี (เขียว=ดีมาก, เหลือง=ปานกลาง, แดง=การแข่งขันสง)
*   **1.2 ระบบเชื่อมยงข้อมล (Live Data & Smart Link) (market_analysis.js)**
    *   **Smart Link:** เพิ่มปุ่ม "ดผลลัพจริงบน TpT" (View on TpT) ที่จะเปิดแทบใหม่ไปที่หน้าค้นหาของเวบ Teachers Pay Teachers ทันที (https://www.teacherspayteachers.com/Browse/Search:[keyword])
    *   **Live Suggestions (Optional/Future):** เตรียมครงสร้างค้ดสำหรับดึงข้อมล Keyword Suggestions ผ่าน API สาาระเมื่อผ้ใช้พิมพข้อความ
    *   **Cloud Trends:** ปรับให้ดึงข้อมลเทรนด (Trending/Seasonal) จากไฟล JSON ภายนอก (เช่น GitHub Raw) แทนการฝัง (Hardcode) ไว้ในแอป เพื่อให้แอดมินอัปเดตเทรนดได้ดยไม่ต้องแก้ค้ด Extension

---

## Phase 2: ขยายคลัง Borders (Premium SVG/Image Borders)
**เป้าหมาย:** เพิ่มกรอบใบงานที่สวยงามระดับพรีเมียม ึ่งเปนที่นิยมในหม่ครและนักออกแบบสื่อการสอน

*   **2.1 สร้างานข้อมล Borders ใหม่ (data/borderLibrary.js)**
    *   สร้างไฟลใหม่เพื่อเกบข้อมล SVG Paths หรือ Base64 Images ของกรอบรปภาพ
    *   **หมวดหม่ที่จะเพิ่ม:**
        1.  **Doodle & Scalloped:** กรอบวาดมือสไตลน่ารักๆ และกรอบขอบหยัก
        2.  **Seasonal & Holiday:** กรอบตามเทศกาล (ใบไม้ร่วง, หิมะ, วาเลนไทน, ฮาลวีน)
        3.  **School Theme:** กรอบลายเครื่องเขียน (ดินสอ, สีเทียน, กระดานดำ, แอปเปิ้ล)
        4.  **Nature & Floral:** กรอบเถาวัลย ดอกไม้ สไตลมินิมอล
*   **2.2 เชื่อมต่อ UI และ Canvas (
ewtab.html, proFeatures.js)**
    *   เพิ่มปุ่ม/Dropdown ในส่วนของ Accordion "Borders"
    *   เขียนฟังกชัน pplyPremiumBorder(borderData) ดยใช้ abric.loadSVGFromURL หรือ abric.Image.fromURL เพื่อหลดกรอบลงบน Canvas และปรับขนาด (Scale) ให้พอดีกับหน้ากระดาษอัตนมัติ

---

## Phase 3: เพิ่ม Generators ยอดฮิตบน TpT
**เป้าหมาย:** สร้างเครื่องมือสร้างใบงานอัตนมัติ (No-prep worksheets) ที่กำลังเปนที่ต้องการสงในตลาด

*   **3.1 Word Search Generator (เกมค้นหาคำศัพท)**
    *   **UI:** ช่องใส่คำศัพท (Comma-separated), เลือกขนาดตาราง (เช่น 10x10, 15x15)
    *   **Logic:** อัลกอริทึมสุ่มวางคำศัพท (แนวนอน, แนวตั้ง, แนวทแยง) และเติมตัวอักษรแบบสุ่มในช่องว่างที่เหลือ สร้างเปนตาราง abric.Text และ abric.Line
*   **3.2 Task Cards / Flashcards Generator**
    *   **UI:** เลือกรปแบบ (2x2 หรือ 2x4 ใบต่อหน้า)
    *   **Logic:** สร้างเทมเพลตการดพร้อมเส้นประสำหรับตัด (Cut lines) และกล่องข้อความ (Text Box) ตรงกลางแต่ละการด เพื่อให้ผ้ใช้พิมพคำถาม/คำศัพทได้ทันที
*   **3.3 Maze Generator (เกมเขาวงกต)**
    *   **UI:** เลือกความยาก (ง่าย, ปานกลาง, ยาก)
    *   **Logic:** ใช้ Recursive Backtracker Algorithm สร้างตารางเขาวงกต หรือหลดจากเทมเพลต SVG ที่เตรียมไว้
*   **3.4 3D Shape Nets Generator (รปคลี่เรขาคิต)**
    *   **UI:** เลือกรปทรง (ลกบาศก, พีระมิด, ทรงกระบอก)
    *   **Logic:** วาดรปคลี่ (Nets) พร้อมเส้นทึบ (สำหรับตัด) และเส้นประ (สำหรับพับ) และเพิ่มแถบกาว (Tabs)
*   **3.5 Comic Strip / Storyboard Generator**
    *   **UI:** เลือก Layout (เช่น 3 ช่อง, 4 ช่อง, 6 ช่อง)
    *   **Logic:** วาดกรอบสี่เหลี่ยม (Panels) และเพิ่ม Speech Bubbles (กรอบคำพด) ให้ผ้ใช้ลากวางได้อิสระ

---

## Phase 4: ขั้นตอนการลงมือทำ (Execution Steps)
1.  **อัปเดตไฟลเอกสาร:** บันทึกแผนการทำงานนี้ลงใน implementation_plan_ui_generators_market_2026-02-27.md (เสรจสิ้น)
2.  **Market Dashboard:** แก้ไข 
ewtab.html, style.css, และ market_analysis.js ตาม Phase 1
3.  **Borders:** สร้าง data/borderLibrary.js และอัปเดต proFeatures.js ตาม Phase 2
4.  **Generators:** เขียนลอจิกสำหรับ Word Search, Task Cards, Maze, 3D Nets, Comic Strip ลงใน proFeatures.js และเชื่อม UI ตาม Phase 3
5.  **Testing:** รันคำสั่ง 
ode --check เพื่อตรวจสอบ Syntax และทดสอบการใช้งานจริงบนเบราวเอร
6.  **Commit:** บันทึกการเปลี่ยนแปลงลง Git (git commit)
