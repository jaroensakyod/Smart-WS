# 📋 Implementation Plan: Smart-WS Global Persistence & Rendering Guard (Phase 5)

**Project**: `projects/Smart-WS`
**Date**: 2026-03-04 06:52:50 +0700
**Objective**: แก้ไขปัญหาเนื้อหาหาย (Data Loss) จาก Error การเรนเดอร์ และ Auto-Save ที่ทำงานผิดจังหวะ

---

## 🔍 Root Cause Analysis (Dragons)
1. **The 'Alphabetical' Bug**: ใน `app.js` (L1342) และ `fabric.js` มีการพยายามตั้งค่า `textBaseline = "alphabetical"` ซึ่งในบาง Browser/Context ไม่รองรับ ทำให้ Canvas Replay พังกลางคัน (ค้างที่หน้าว่าง)
2. **Global Auto-Save Bypass**: ฟังก์ชัน `setInterval` ใน `export.js` สั่ง `wbGetWorkbookData()` ทุก 60 วินาที ซึ่งไปเรียก `persistCurrentPage()` เสมอแม้อยู่ในสถานะ Loading
3. **Atomic Fail Leak**: การ `addPageAndGo` และการสลับหน้า (Page Switching) ยังมีจุดที่ `isPageLoading` ไม่ได้คุมครอบคลุมถึงขอบเขตการเขียนลง Storage จริงๆ

---

## 🛠️ Phase-by-Phase Plan

### Phase 1: Rendering Engine Hardening (The Foundation)
✅ **Goal**: กันไม่ให้ Canvas พังระหว่างวาด JSON
- **Task 1.1**: แก้ไข `app.js` ในฟังก์ชันที่เกี่ยวข้องกับ `textBaseline` (ค้นหา `"alphabetical"`) ให้เปลี่ยนเป็น `top` หรือค่าที่ Web-standard ยอมรับเสถียรกว่า (เช่น `middle` หรือ `alphabetic` - ตัวสะกดมาตรฐาน)
- **Task 1.2**: เพิ่ม `try...catch` ครอบ `canvas.loadFromJSON` ใน `loadCanvasJson` เพื่อดักจับ Error และสั่ง `isReplaying = false` เสมอใน `finally`

### Phase 2: Global Persistence Guard (The Gatekeeper)
✅ **Goal**: ป้องกันการ Save ข้อมูลที่ยังวาดไม่เสร็จลง Storage
- **Task 2.1**: ปรับปรุงฟังก์ชัน `window.wbGetWorkbookData` ใน `app.js` ให้เช็ค `isPageLoading || isReplaying` ก่อนทำการ `persistCurrentPage()`
- **Task 2.2**: หากอยู่ในสถานะโหลด ให้ `trackTelemetry` และส่งข้อมูล Memory ล่าสุด (เท่าที่มี) ออกไปแทนการดึงจาก Canvas ที่อาจว่างเปล่า

### Phase 3: Auto-Save Resilience in `export.js` (The Buffer)
✅ **Goal**: ปรับแต่ง `export.js` ให้เคารพสถานะระบบ
- **Task 3.1**: ใน `setInterval` ก่อนเรียก `chrome.storage.local.set` หากตรวจพบว่า Payload ที่ได้มาใหม่ "ว่างเปล่าผิดปกติ" (เช่น objects = 0 ทั้งที่เดิมมีข้อมูล) ให้ข้ามการ Save รอบนั้นไปก่อน
- **Task 3.2**: เพิ่ม Visual Indicator ตอน Save ว่ากำลัง "Waiting for sync..." หากระบบยังโหลดไม่เสร็จ

### Phase 4: Full-Stack Verification (The Hard Gate)
✅ **Goal**: ทดสอบทุก Scenario
- **Test 4.1**: รันชุด Test เดิม (`tests/page.lifecycle.test.js`) ภายใต้เงื่อนไข Auto-save วิ่งแทรก
- **Test 4.2**: Manual Test: สลับหน้า 1 -> 2 (Template) -> ทันทีที่กด 2 ให้กดสลับกลับ 1 รัวๆ เพื่อดูว่า Page 2 ยังอยู่ครบหรือไม่

---

## 🛡️ Vow
"เราจะไม่ยอมให้ข้อมูลที่คุณนนท์สร้างมาสูญหายเพียงเพราะระบบพยายามจะรักษามัน (Save) ในเวลาที่ผิดที่ผิดทาง"

---
**Ready to implement Phase 1-2 first?**
- แผนนี้ครอบคลุมทั้งเรื่อง Text Error และเรื่อง Auto-save ที่คุณนนท์กังวลครับ
- ผมจะเริ่มหลังจากคุณนนท์ยืนยันแผนนี้ครับ

---

## ✅ Implementation Status (Completed)

### Phase 1: Rendering Engine Hardening
- [x] Patch `fabric.Text.prototype._setTextStyles` ให้ใช้ baseline มาตรฐาน (`alphabetic`) และ fallback telemetry เมื่อ context ไม่รองรับ
- [x] เสริม `loadCanvasJson` ให้ปิด `isReplaying` แบบกันหลุดทุกเส้นทางด้วย settle guard

### Phase 2: Global Persistence Guard
- [x] อัปเดต `window.wbGetWorkbookData` ให้ไม่เรียก persist ระหว่าง `isPageLoading || isReplaying`
- [x] คืนค่า workbook snapshot ล่าสุดจาก memory พร้อม telemetry (`workbook_data_snapshot_loading_guard`)
- [x] เพิ่ม `window.wbGetPersistenceStatus` ให้โมดูลภายนอกตรวจสถานะ sync ได้

### Phase 3: Auto-Save Resilience (`export.js`)
- [x] เพิ่ม guard ก่อน autosave ให้รอเมื่อระบบยัง loading/replaying (`Waiting for sync...`)
- [x] เพิ่ม heuristic กัน payload ว่างผิดปกติ (previous objects > 0 แต่ payload ใหม่ = 0) แล้ว skip save รอบนั้น
- [x] เพิ่ม telemetry สำหรับ autosave wait/skip และ callback error handling ของ `chrome.storage.local.set`

### Phase 4: Verification
- [x] Node test suite: `pass 60/60`, `fail 0`
- [x] Build/Lint gate: โปรเจกต์นี้ไม่มี `package.json` (`NO_PACKAGE_JSON`) จึงไม่มี `npm run build` / `npm run lint` ใน scope นี้
