# 🗺️ Project Map: Smart-WS

## 🧭 Philosophy
**"Visual Worksheet Builder for Modern Educators"**
Smart-WS คือ Chrome Extension (Manifest V3) ที่เปลี่ยน New Tab ให้กลายเป็นพื้นที่สร้างใบงาน (Worksheet Canvas) แบบ Local-First ที่รวดเร็ว และสวยงาม
เป้าหมายคือช่วยคุณครูสร้างสื่อการสอนได้ภายใน 5 นาที โดยไม่ต้องต่อเน็ตตลอดเวลา และมี Template รองรับหลากหลาย

## 📍 Key Landmarks
-   `manifest.json`: Override NewTab & Permissions
-   `newtab.html`: The Stage (Main UI Container)
-   `app.js`: **The Core Engine** (Fabric.js Wrapper, State Management, Tools)
-   `proFeatures.js`: **Logic Hub** (Templates, Generators, export logic)
-   `data/`: **Knowledge Base** (JSON Templates, Presets)
-   `vendor/`: **Libraries** (Fabric.js, KaTeX, jsPDF)

## 🔄 Data Flow
```mermaid
graph TD
    User[Teacher] -->|New Tab| Canvas[Smart-WS Canvas]
    Canvas -->|Drag & Drop| Fabric[Fabric.js Engine]
    Fabric -->|Render| Screen
    
    User -->|Click Export| Export[Export Pipeline]
    Export -->|Generate| PDF[PDF / PNG / PPTX]
    
    subgraph Future Connection (The Nexus)
    Canvas -->|Login| Hub[SimpleEq Hub]
    Hub -->|License Check| Unlock[Unlock Pro Templates]
    end
```

## 🛠️ Tech Stack
-   **Core**: Vanilla JavaScript (ES6 Modules)
-   **Extension**: Chrome MV3 (New Tab Override)
-   **Graphics**: Fabric.js (Canvas Manipulation)
-   **Math**: KaTeX (Equation Rendering)
-   **Export**: jsPDF (PDF), PptxGenJS (PowerPoint)
-   **Persistence**: `localStorage` (Local Workbooks)

## 🔗 Backend Hub (The Nexus)
*Connection Planned (Phase 4 of Nexus Evolution)*
- **Central Hub**: [projects/simple-eq-hub](../simple-eq-hub)
- **Role**: Identity & License Provider
- **Strategy**: เหมือนกับ SimpleEq คือใช้ Global Session Cookie เพื่อเช็คสถานะ "Pro" สำหรับปลดล็อก:
    - Premium Templates
    - Watermark Removal
    - Unlimited Cloud Save (Future)

## 🎨 UI/UX Theme
-   **Style**: Modern Clean Dashboard (Tailwind-like logic but vanilla CSS)
-   **Visuals**: Card-based Asset browser, Drag-and-drop toolbar.
-   **Interactivity**: Instant feedback, snapping, zoom/pan.

## 🐉 Challenges & Debt
-   **Monolithic Files**: `app.js` และ `proFeatures.js` มีขนาดใหญ่มากและ Coupling สูง ยากต่อการเพิ่มฟีเจอร์โดยไม่กระทบส่วนอื่น
-   **Global State**: การใช้ `window.*` และ Global Variables ทำให้ Test ยากและ debug ลำบาก
-   **Asset Management**: การจัดการรูปภาพและ Font ใน Canvas ที่ซับซ้อนกว่า HTML ปกติ

## 🏁 Phase Updates
- ✅ **Deep Dive**: เข้าใจโครงสร้างและ Tech Stack ทั้งหมดแล้ว
- ⏳ **Integration**: รอการเชื่อมต่อกับ `simple-eq-hub` (Nexus Project)

---
*Last Updated: 2026-02-28 via Oracle Keeper*
