# Smart WS — Webapp

**Smart WS** เป็นเครื่องมือสร้างใบงานและสื่อการสอนแบบ drag-and-drop บน Canvas ใช้งานได้ทันทีในเบราว์เซอร์ ไม่ต้องติดตั้งอะไรเพิ่ม

> **Branch นี้ (`webapp`)** = Standalone Web App — เปิดด้วย `index.html` หรือ deploy บน web server ได้เลย  
> **Branch `main`** = Chrome Extension เวอร์ชัน (มี `manifest.json` + override New Tab)

---

## เริ่มใช้งาน

```bash
# Clone repo
git clone -b webapp https://github.com/<owner>/Smart-WS.git
cd Smart-WS

# เปิดด้วย local server (แนะนำ — เพื่อให้โหลด vendor files ได้ถูกต้อง)
npx serve .
# แล้วเปิด http://localhost:3000

# หรือเปิดไฟล์ตรง (บาง feature อาจ CORS-blocked)
open index.html
```

> **หมายเหตุ**: ควรใช้ local server เสมอ เพราะ vendor libraries (Fabric.js, jsPDF, KaTeX) โหลดด้วย HTTP fetch

---

## ฟีเจอร์

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🗂 Multi-page Workbook | เพิ่ม / ลบ / ทำซ้ำ / จัดลำดับหน้าได้ไม่จำกัด |
| 🎨 Canvas Editor | ลากวางข้อความ รูปภาพ รูปทรง สมการ ไอคอน SVG |
| 📋 Curated Templates | เทมเพลตพร้อมใช้ 15+ แบบ พร้อม preview — เพิ่มหน้าใหม่ได้ทันที |
| ⚙️ Generators | สร้างใบงาน MCQ / Matching / Fill-in / Mind Map / Rubric ฯลฯ อัตโนมัติ |
| ➗ Equation Editor | เขียน LaTeX / สมการแบบ mixed text+math พร้อม KaTeX preview |
| 🖼 Web Images | ค้นหาและแทรกรูปจาก Flickr / Wikimedia |
| 🤖 AI Prompt Guide | คัดลอก prompt สำเร็จรูปสำหรับสร้างสื่อด้วย AI ภายนอก |
| 📤 Export Engine | PNG / PDF (multi-page) / PPTX — รองรับงานขนาดใหญ่ |
| 💾 Auto-save | บันทึกลง `localStorage` อัตโนมัติ (ไม่ต้องการ server) |
| 🌙 Dark Mode | สลับธีมได้ทันที |

---

## โครงสร้างไฟล์

```
Smart-WS/
├── index.html              ← จุดเริ่มต้นของแอป
├── style.css               ← สไตล์ทั้งหมด (Light + Dark theme)
├── app.js                  ← Canvas core, Workbook, Page management, Undo/Redo
├── proFeatures.js          ← Generators, AI guide, Market analysis, modals
├── export.js               ← PNG / PDF / PPTX export engine
├── export.utils.js         ← Helper functions สำหรับ export
├── toolbar.js              ← Toolbar interactions
├── panel.js                ← Side panel (SVG library, icons)
├── clipboard.js            ← Copy/paste objects
├── equation.js             ← LaTeX / KaTeX equation editor
├── webImages.js            ← Flickr / Wikimedia image search
├── market_analysis.js      ← Market trend dashboard
├── odl.import.js           ← นำเข้า Open Document Layout JSON
│
├── data/
│   ├── curatedTemplates.v1.js   ← 15 Curated Templates (canvas data + thumbnail)
│   ├── templateCatalog.v1.js    ← แคตตาล็อกเทมเพลต 185 รายการ
│   ├── templateHandlers.v1.js   ← ฟังก์ชันสร้างเทมเพลตแต่ละแบบ
│   ├── templatePresets.v1.js    ← Preset ค่าเริ่มต้น
│   ├── templateTaxonomy.v1.js   ← โครงสร้างหมวดหมู่
│   ├── svgLibrary.js            ← คลัง SVG inline
│   ├── borderLibrary.js         ← กรอบตกแต่ง
│   └── marketTrends.js          ← ข้อมูล trend สำหรับ dashboard
│
├── vendor/
│   ├── fabric.min.js            ← Fabric.js 5.x (Canvas engine)
│   ├── jspdf.umd.min.js         ← jsPDF (PDF export)
│   ├── pptxgen.bundle.js        ← PptxGenJS (PPTX export)
│   └── katex/                   ← KaTeX (Equation rendering)
│
├── tests/                       ← Node.js test suite
└── docs/                        ← เอกสารแผนและบันทึกการพัฒนา
```

---

## รัน Tests

```bash
# ต้องการ Node.js 18+
node --test tests/*.test.js

# หรือเลือกเฉพาะไฟล์
node --test tests/curated.templates.test.js
node --test tests/export.utils.test.js
node --test tests/template.catalog.test.js
node --test tests/template.handlers.test.js
node --test tests/iconify.utils.test.js
node --test tests/odl.import.utils.test.js
```

---

## การบันทึกข้อมูล

| สภาพแวดล้อม | วิธีบันทึก |
|---|---|
| Web App (branch นี้) | `localStorage` — ข้อมูลอยู่ใน browser |
| Chrome Extension (main) | `chrome.storage.local` พร้อม fallback `localStorage` |

ข้อมูลไม่ถูกส่งไปที่ server ใด ทำงานได้ออฟไลน์ทั้งหมด

---

## Branches

| Branch | วัตถุประสงค์ |
|---|---|
| `main` | Chrome Extension — override New Tab, packaged เป็น `.crx` |
| `webapp` | Standalone Web App — deploy บน Vercel / Netlify / GitHub Pages |
| `staging` | Integration testing |

---

## Deploy บน GitHub Pages / Netlify / Vercel

เนื่องจากทุก dependency อยู่ใน `vendor/` แล้ว ไม่มี build step:

```bash
# GitHub Pages: push branch webapp แล้วตั้ง Source = webapp / root
# Netlify / Vercel: เชื่อม repo แล้วเลือก branch webapp, Build command = (none), Publish dir = .
```

---

## Dependencies

ทุก library bundled ใน `vendor/` — ไม่ต้องรัน `npm install`

| Library | เวอร์ชัน | ใช้ทำอะไร |
|---|---|---|
| Fabric.js | 5.x | Canvas rendering & object model |
| jsPDF | 2.x | PDF generation |
| PptxGenJS | 3.x | PPTX generation |
| KaTeX | 0.16.x | Math equation rendering |

---

## ความแตกต่างระหว่าง Webapp กับ Extension

| ด้าน | Webapp (`webapp` branch) | Extension (`main` branch) |
|---|---|---|
| เปิดใช้ | เปิด URL / deploy | Override New Tab ใน Chrome |
| การบันทึก | `localStorage` | `chrome.storage.local` |
| Download | Blob URL + `<a>` click | `chrome.downloads` API |
| ไฟล์พิเศษ | — | `manifest.json`, `icons/` |
| Deploy | Vercel / Netlify / GitHub Pages | Chrome Web Store / Load unpacked |
