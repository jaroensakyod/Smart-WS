# 🗺️ Project Map: Smart-WS

> **"The Canvas for Education"**
> Smart-WS is a Chrome Extension (New Tab Override) enabling teachers to build interactive worksheets via a Fabric.js canvas.

## 📍 Orientation
- **Type**: Chrome Extension (Manifest V3)
- **Entry Point**: `newtab.html` -> `app.js`
- **Stack**: Vanilla JS, [Fabric.js](http://fabricjs.com/), HTML5 Canvas, LocalStorage peristence.
- **Location**: `/Users/non/dev/opilot/projects/Smart-WS`

## 🗺️ Territory (Key Files)
- **Core Logic**:
  - `app.js`: 🏰 **The Monolith**. Handles Canvas init, event listeners, page switching, undo/redo, and tool logic. (2400+ lines).
  - `template.factory.js`: 🏭 Logic for generating pages from templates and duplicating sheets.
  - `persistence.utils.js`: 💾 Auto-save and LocalStorage management.
  - `telemetry.utils.js`: 📡 User action tracking.
- **UI/Components**:
  - `panel.js`: Side panel interactions (Tools, Layers).
  - `newtab.html`: The main UI skeleton.
  - `style.css`: Global styles.
- **Integrations**:
  - `webImages.js`: Flickr/Wikimedia image search/import.
  - `iconify.utils.js`: Icon integration.
  - `odl.import.js`: Open Document Logic (Importing existing files).

## 🌊 Data Flow
1.  **Session State**: Held in global `workbook` object (in `app.js`).
    -   `workbook.pages`: Array of page objects `{ id, json, thumbnail }`.
    -   `activePageIndex`: Integer pointer.
2.  **Rendering**: 
    -   `fabric.Canvas` is the "View".
    -   On page switch: `saveCurrentPage()` (Canvas -> JSON) -> Switch Index -> `loadPage()` (JSON -> Canvas).
3.  **Persistence**:
    -   `persistence.utils.js` saves `workbook` to `localStorage` periodically or on change keys.

## 🐉 Dragons & Challenges
1.  **The "Blank Page" Ghost**: 
    -   *Symptom*: When creating a page from a template and switching away too fast, the data is lost (reverts to blank).
    -   *Root Cause*: Race condition between `canvas.loadFromJSON` (Async) and `persistCurrentPage` (Sync/Auto). The system saves the "not-yet-loaded" blank canvas over the template data.
    -   *Status*: **Active Battle** (Phase 1-3 Atomic Injection failed. Next: Explicit Persistence Lock).
2.  **Monolithic Architecture**: `app.js` holds too much responsibility, making state management brittle.
3.  **Sync Gap**: No central state manager (like Redux). State is split between DOM/Fabric/JS Variable/LocalStorage.

## 🔮 Vows & Decisions
-   **No Framework Overkill**: Stick to Vanilla JS/Fabric for performance and simplicity in this extension context.
-   **Atomic Persistence**: We vow to fix the data/view synchronization issue before adding new features.
-   **Strict Typing (Future)**: Use JSDoc heavily to compensate for lack of TypeScript in key files.
