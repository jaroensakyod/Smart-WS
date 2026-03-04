/* ================================================================
   SVG Library Data — bundled free SVGs (Public Domain / CC0)
   ================================================================ */

/* Each item: { id, name, category, svg: '<svg ...>...</svg>' }  */
window.SVG_LIBRARY = [
    /* ── MATH ─────────────────────────────────────────────────── */
    {
        id: 'math_plus', name: 'บวก', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="28" y="8" width="8" height="48" rx="4" fill="#1e40af"/><rect x="8" y="28" width="48" height="8" rx="4" fill="#1e40af"/></svg>`
    },
    {
        id: 'math_minus', name: 'ลบ', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="28" width="48" height="8" rx="4" fill="#dc2626"/></svg>`
    },
    {
        id: 'math_times', name: 'คูณ', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><line x1="12" y1="12" x2="52" y2="52" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/><line x1="52" y1="12" x2="12" y2="52" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/></svg>`
    },
    {
        id: 'math_divide', name: 'หาร', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="14" r="5" fill="#059669"/><rect x="8" y="28" width="48" height="8" rx="4" fill="#059669"/><circle cx="32" cy="50" r="5" fill="#059669"/></svg>`
    },
    {
        id: 'math_equal', name: 'เท่ากับ', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="10" y="20" width="44" height="8" rx="4" fill="#0284c7"/><rect x="10" y="36" width="44" height="8" rx="4" fill="#0284c7"/></svg>`
    },
    {
        id: 'math_pi', name: 'พาย (π)', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="12" y="50" font-family="serif" font-size="52" fill="#7c3aed">π</text></svg>`
    },
    {
        id: 'math_sigma', name: 'ซิกมา (Σ)', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="8" y="52" font-family="serif" font-size="52" fill="#0891b2">Σ</text></svg>`
    },
    {
        id: 'math_sqrt', name: 'รากที่สอง', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polyline points="4,38 14,52 26,10 60,10" stroke="#16a34a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'math_triangle', name: 'สามเหลี่ยม', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 6,58 58,58" stroke="#b45309" stroke-width="4" fill="rgba(180,83,9,0.15)" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'math_circle', name: 'วงกลม', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" stroke="#1d4ed8" stroke-width="4" fill="rgba(29,78,216,0.1)"/></svg>`
    },

    /* ── PEOPLE ────────────────────────────────────────────────── */
    {
        id: 'person_boy', name: 'เด็กชาย', category: 'people',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><circle cx="32" cy="14" r="13" fill="#fbbf24"/><rect x="16" y="28" width="32" height="34" rx="8" fill="#3b82f6"/><rect x="12" y="62" width="14" height="16" rx="4" fill="#1e40af"/><rect x="38" y="62" width="14" height="16" rx="4" fill="#1e40af"/><line x1="8" y1="34" x2="16" y2="55" stroke="#3b82f6" stroke-width="9" stroke-linecap="round"/><line x1="56" y1="34" x2="48" y2="55" stroke="#3b82f6" stroke-width="9" stroke-linecap="round"/></svg>`
    },
    {
        id: 'person_girl', name: 'เด็กหญิง', category: 'people',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><circle cx="32" cy="14" r="13" fill="#fbbf24"/><path d="M14 30 Q32 24 50 30 L54 62 H10 Z" fill="#ec4899"/><rect x="12" y="62" width="14" height="16" rx="4" fill="#be185d"/><rect x="38" y="62" width="14" height="16" rx="4" fill="#be185d"/></svg>`
    },
    {
        id: 'person_teacher', name: 'ครู', category: 'people',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><circle cx="32" cy="13" r="11" fill="#fbbf24"/><rect x="17" y="26" width="30" height="36" rx="6" fill="#6d28d9"/><rect x="5" y="30" width="10" height="26" rx="5" fill="#6d28d9"/><rect x="49" y="30" width="10" height="26" rx="5" fill="#6d28d9"/><rect x="14" y="63" width="13" height="14" rx="4" fill="#4c1d95"/><rect x="37" y="63" width="13" height="14" rx="4" fill="#4c1d95"/></svg>`
    },
    {
        id: 'person_student', name: 'นักเรียน', category: 'people',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><circle cx="32" cy="13" r="11" fill="#fbbf24"/><rect x="17" y="26" width="30" height="36" rx="6" fill="#059669"/><rect x="5" y="30" width="10" height="26" rx="5" fill="#059669"/><rect x="49" y="30" width="10" height="26" rx="5" fill="#059669"/><rect x="14" y="63" width="13" height="14" rx="4" fill="#064e3b"/><rect x="37" y="63" width="13" height="14" rx="4" fill="#064e3b"/><polygon points="18,2 32,10 46,2 32,18" fill="#1f2937"/></svg>`
    },

    /* ── NATURE ─────────────────────────────────────────────────── */
    {
        id: 'nature_sun', name: 'ดวงอาทิตย์', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="60"/><line x1="4" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="19" y2="19"/><line x1="45" y1="45" x2="52" y2="52"/><line x1="52" y1="12" x2="45" y2="19"/><line x1="19" y1="45" x2="12" y2="52"/></g></svg>`
    },
    {
        id: 'nature_tree', name: 'ต้นไม้', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><polygon points="32,4 6,44 20,44 10,64 54,64 44,44 58,44" fill="#16a34a"/><rect x="26" y="56" width="12" height="22" fill="#92400e"/></svg>`
    },
    {
        id: 'nature_flower', name: 'ดอกไม้', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="18" rx="8" ry="14" fill="#f9a8d4"/><ellipse cx="32" cy="46" rx="8" ry="14" fill="#f9a8d4"/><ellipse cx="18" cy="32" rx="14" ry="8" fill="#f9a8d4"/><ellipse cx="46" cy="32" rx="14" ry="8" fill="#f9a8d4"/><circle cx="32" cy="32" r="10" fill="#fbbf24"/></svg>`
    },
    {
        id: 'nature_cloud', name: 'เมฆ', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 44"><ellipse cx="26" cy="30" rx="22" ry="12" fill="#e2e8f0"/><circle cx="18" cy="24" r="12" fill="#e2e8f0"/><circle cx="38" cy="20" r="16" fill="#e2e8f0"/><circle cx="52" cy="26" r="10" fill="#e2e8f0"/></svg>`
    },
    {
        id: 'nature_rain', name: 'ฝน', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="26" cy="20" rx="20" ry="10" fill="#94a3b8"/><circle cx="16" cy="16" r="10" fill="#94a3b8"/><circle cx="34" cy="12" r="14" fill="#94a3b8"/><circle cx="48" cy="18" r="9" fill="#94a3b8"/><line x1="18" y1="36" x2="14" y2="52" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/><line x1="30" y1="36" x2="26" y2="52" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/><line x1="42" y1="36" x2="38" y2="52" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/></svg>`
    },
    {
        id: 'nature_fish', name: 'ปลา', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 50"><ellipse cx="36" cy="25" rx="26" ry="16" fill="#0ea5e9"/><polygon points="62,10 80,25 62,40" fill="#0284c7"/><circle cx="18" cy="20" r="3" fill="#ffffff"/><circle cx="16" cy="20" r="1" fill="#0f172a"/></svg>`
    },

    /* ── SCHOOL ─────────────────────────────────────────────────── */
    {
        id: 'school_book', name: 'หนังสือ', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="56" rx="4" fill="#dc2626"/><rect x="16" y="8" width="8" height="56" fill="#b91c1c"/><rect x="20" y="20" width="28" height="4" rx="2" fill="#fecaca"/><rect x="20" y="30" width="22" height="4" rx="2" fill="#fecaca"/><rect x="20" y="40" width="26" height="4" rx="2" fill="#fecaca"/></svg>`
    },
    {
        id: 'school_pencil', name: 'ดินสอ', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 64"><rect x="4" y="4" width="16" height="44" rx="4" fill="#fbbf24"/><polygon points="4,48 20,48 12,62" fill="#fcd34d"/><polygon points="4,48 20,48 12,58" fill="#d97706"/><rect x="4" y="4" width="16" height="8" rx="3" fill="#e11d48"/></svg>`
    },
    {
        id: 'school_ruler', name: 'ไม้บรรทัด', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 24"><rect x="2" y="2" width="60" height="20" rx="4" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/><line x1="14" y1="2" x2="14" y2="12" stroke="#059669" stroke-width="1.5"/><line x1="26" y1="2" x2="26" y2="12" stroke="#059669" stroke-width="1.5"/><line x1="38" y1="2" x2="38" y2="12" stroke="#059669" stroke-width="1.5"/><line x1="50" y1="2" x2="50" y2="12" stroke="#059669" stroke-width="1.5"/></svg>`
    },
    {
        id: 'school_calculator', name: 'เครื่องคิดเลข', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64"><rect x="2" y="2" width="44" height="60" rx="8" fill="#334155"/><rect x="8" y="8" width="32" height="14" rx="4" fill="#94a3b8"/><circle cx="14" cy="32" r="5" fill="#475569"/><circle cx="24" cy="32" r="5" fill="#475569"/><circle cx="34" cy="32" r="5" fill="#475569"/><circle cx="14" cy="44" r="5" fill="#475569"/><circle cx="24" cy="44" r="5" fill="#475569"/><circle cx="34" cy="44" r="5" fill="#22c55e"/><circle cx="14" cy="56" r="5" fill="#475569"/><circle cx="24" cy="56" r="5" fill="#475569"/><circle cx="34" cy="56" r="5" fill="#ef4444"/></svg>`
    },
    {
        id: 'school_globe', name: 'ลูกโลก', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72"><circle cx="32" cy="32" r="28" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/><ellipse cx="32" cy="32" rx="12" ry="28" stroke="#1d4ed8" stroke-width="1.5" fill="none"/><ellipse cx="32" cy="32" rx="28" ry="10" stroke="#1d4ed8" stroke-width="1.5" fill="none"/><rect x="28" y="60" width="8" height="10" fill="#92400e"/><rect x="16" y="70" width="32" height="4" rx="2" fill="#422006"/></svg>`
    },
    {
        id: 'school_microscope', name: 'กล้องจุลทรรศน์', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 72"><rect x="22" y="2" width="12" height="26" rx="4" fill="#64748b"/><circle cx="28" cy="2" r="8" fill="#94a3b8"/><circle cx="28" cy="2" r="4" fill="#cbd5e1"/><rect x="24" y="28" width="8" height="16" rx="2" fill="#475569"/><ellipse cx="28" cy="44" rx="18" ry="4" fill="#334155"/><rect x="24" y="44" width="8" height="8" fill="#334155"/><rect x="6" y="64" width="44" height="6" rx="3" fill="#1e293b"/></svg>`
    },

    /* ── FRAMES / BORDERS ─────────────────────────────────────── */
    {
        id: 'frame_simple', name: 'กรอบเส้นเดี่ยว', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><rect x="4" y="4" width="192" height="152" rx="6" fill="none" stroke="#334155" stroke-width="3"/></svg>`
    },
    {
        id: 'frame_dashed', name: 'กรอบเส้นประ', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><rect x="6" y="6" width="188" height="148" rx="8" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="10,5"/></svg>`
    },
    {
        id: 'frame_double', name: 'กรอบเส้นคู่', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><rect x="4" y="4" width="192" height="152" rx="4" fill="none" stroke="#1e40af" stroke-width="2"/><rect x="10" y="10" width="180" height="140" rx="4" fill="none" stroke="#1e40af" stroke-width="2"/></svg>`
    },
    {
        id: 'frame_rounded', name: 'กรอบมน', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><rect x="4" y="4" width="192" height="152" rx="24" fill="none" stroke="#7c3aed" stroke-width="3"/></svg>`
    },
    {
        id: 'frame_ribbon', name: 'กรอบริบบิ้น', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="10" y="10" width="200" height="150" rx="4" fill="none" stroke="#dc2626" stroke-width="3"/><rect x="50" y="2" width="120" height="18" rx="4" fill="#dc2626"/><text x="110" y="15" text-anchor="middle" fill="#fff" font-size="12" font-family="sans-serif">หัวข้อ</text></svg>`
    },
    {
        id: 'frame_corner', name: 'กรอบมุมประดับ', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><rect x="12" y="12" width="176" height="136" rx="2" fill="none" stroke="#b45309" stroke-width="2"/><path d="M4,4 L32,4 L32,10 L10,10 L10,32 L4,32 Z" fill="#b45309"/><path d="M196,4 L168,4 L168,10 L190,10 L190,32 L196,32 Z" fill="#b45309"/><path d="M4,156 L32,156 L32,150 L10,150 L10,128 L4,128 Z" fill="#b45309"/><path d="M196,156 L168,156 L168,150 L190,150 L190,128 L196,128 Z" fill="#b45309"/></svg>`
    },
    {
        id: 'frame_dotted', name: 'กรอบจุด', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><rect x="6" y="6" width="188" height="148" rx="10" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="3,6" stroke-linecap="round"/></svg>`
    },
    {
        id: 'frame_wavy', name: 'กรอบคลื่น', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"><path d="M10,8 Q30,0 50,8 Q70,16 90,8 Q110,0 130,8 Q150,16 170,8 Q190,0 196,8 L196,152 Q176,160 156,152 Q136,144 116,152 Q96,160 76,152 Q56,144 36,152 Q16,160 4,152 Z" fill="none" stroke="#ec4899" stroke-width="2.5"/></svg>`
    },

    {
        id: 'frame_mono_header', name: 'กรอบหัวกระดาษ (Mono)', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="8" y="8" width="204" height="154" rx="8" fill="none" stroke="#1e293b" stroke-width="2.5"/><line x1="8" y1="34" x2="212" y2="34" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/></svg>`
    },
    {
        id: 'frame_mono_note', name: 'กรอบเน้นข้อความ (Mono)', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="14" y="14" width="192" height="142" rx="10" fill="none" stroke="#1e293b" stroke-width="2.5"/><path d="M24,44 H196 M24,64 H176 M24,84 H188" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="6,5"/></svg>`
    },
    {
        id: 'frame_floral', name: 'กรอบดอกไม้', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="10" y="10" width="200" height="150" rx="10" fill="none" stroke="#db2777" stroke-width="2.5"/><g fill="#f9a8d4"><circle cx="16" cy="16" r="6"/><circle cx="204" cy="16" r="6"/><circle cx="16" cy="154" r="6"/><circle cx="204" cy="154" r="6"/></g><g fill="none" stroke="#db2777" stroke-width="1.6"><path d="M28,18 C48,26 60,26 82,18"/><path d="M192,28 C184,48 184,60 192,82"/><path d="M28,152 C48,144 60,144 82,152"/><path d="M18,28 C26,48 26,60 18,82"/></g></svg>`
    },
    {
        id: 'frame_thai_applied', name: 'กรอบลายไทยประยุกต์', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="8" y="8" width="204" height="154" rx="6" fill="none" stroke="#b45309" stroke-width="2.3"/><path d="M16,16 Q30,10 36,24 Q24,26 22,36 Q10,30 16,16 Z" fill="none" stroke="#b45309" stroke-width="1.8"/><path d="M204,16 Q190,10 184,24 Q196,26 198,36 Q210,30 204,16 Z" fill="none" stroke="#b45309" stroke-width="1.8"/><path d="M16,154 Q30,160 36,146 Q24,144 22,134 Q10,140 16,154 Z" fill="none" stroke="#b45309" stroke-width="1.8"/><path d="M204,154 Q190,160 184,146 Q196,144 198,134 Q210,140 204,154 Z" fill="none" stroke="#b45309" stroke-width="1.8"/></svg>`
    },
    {
        id: 'frame_shadow_box', name: 'กรอบเงา', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="20" y="18" width="190" height="140" rx="10" fill="rgba(30,41,59,0.18)"/><rect x="10" y="10" width="190" height="140" rx="10" fill="none" stroke="#1e40af" stroke-width="2.2"/></svg>`
    },
    {
        id: 'frame_scallop_corner', name: 'กรอบมุมหยัก', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="14" y="14" width="192" height="142" rx="8" fill="none" stroke="#0f766e" stroke-width="2.2"/><path d="M14,36 C20,30 26,30 32,36 C38,42 44,42 50,36" fill="none" stroke="#0f766e" stroke-width="1.8"/><path d="M170,14 C176,20 176,26 170,32 C164,38 164,44 170,50" fill="none" stroke="#0f766e" stroke-width="1.8"/><path d="M14,134 C20,140 26,140 32,134 C38,128 44,128 50,134" fill="none" stroke="#0f766e" stroke-width="1.8"/><path d="M170,156 C176,150 176,144 170,138 C164,132 164,126 170,120" fill="none" stroke="#0f766e" stroke-width="1.8"/></svg>`
    },

    /* ── MONOLINE SYMBOLS ────────────────────────────────────── */
    {
        id: 'symbol_mono_circle', name: 'วงกลมกรอกช่อง', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#1e293b" stroke-width="2.5"/></svg>`
    },
    {
        id: 'symbol_mono_square', name: 'สี่เหลี่ยมกรอกช่อง', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke="#1e293b" stroke-width="2.5"/></svg>`
    },
    {
        id: 'symbol_mono_triangle', name: 'สามเหลี่ยมกรอกช่อง', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,8 58,54 6,54" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'symbol_check', name: 'เครื่องหมายถูก', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M10,34 L24,48 L54,16" fill="none" stroke="#166534" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'symbol_cross', name: 'เครื่องหมายผิด', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M14,14 L50,50 M50,14 L14,50" fill="none" stroke="#b91c1c" stroke-width="6" stroke-linecap="round"/></svg>`
    },
    {
        id: 'symbol_star_4', name: 'ดาว 4 แฉก', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 40,24 58,32 40,40 32,58 24,40 6,32 24,24" fill="none" stroke="#1e293b" stroke-width="2.4"/></svg>`
    },
    {
        id: 'symbol_star_6', name: 'ดาว 6 แฉก', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 38,22 56,22 42,34 48,52 32,40 16,52 22,34 8,22 26,22" fill="none" stroke="#1e293b" stroke-width="2.4"/></svg>`
    },
    {
        id: 'symbol_star_8', name: 'ดาว 8 แฉก', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,4 38,18 52,12 46,26 60,32 46,38 52,52 38,46 32,60 26,46 12,52 18,38 4,32 18,26 12,12 26,18" fill="none" stroke="#1e293b" stroke-width="2.2"/></svg>`
    },
    {
        id: 'symbol_star_10', name: 'ดาว 10 แฉก', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,4 36,18 48,10 44,24 58,22 46,32 58,42 44,40 48,54 36,46 32,60 28,46 16,54 20,40 6,42 18,32 6,22 20,24 16,10 28,18" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'symbol_star_12', name: 'ดาว 12 แฉก', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,4 35,14 44,8 42,18 52,14 46,22 56,22 48,30 60,32 48,34 56,42 46,42 52,50 42,46 44,56 35,50 32,60 29,50 20,56 22,46 12,50 18,42 8,42 16,34 4,32 16,30 8,22 18,22 12,14 22,18 20,8 29,14" fill="none" stroke="#1e293b" stroke-width="1.8"/></svg>`
    },
    {
        id: 'symbol_heart', name: 'หัวใจ', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32,56 C24,48 8,38 8,24 C8,16 14,10 22,10 C27,10 30,12 32,16 C34,12 37,10 42,10 C50,10 56,16 56,24 C56,38 40,48 32,56 Z" fill="none" stroke="#be185d" stroke-width="3"/></svg>`
    },
    {
        id: 'symbol_warning', name: 'สัญลักษณ์เตือน', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 58,56 6,56" fill="none" stroke="#ca8a04" stroke-width="3"/><line x1="32" y1="22" x2="32" y2="38" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="46" r="2.8" fill="#ca8a04"/></svg>`
    },
    {
        id: 'symbol_phone', name: 'โทรศัพท์', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="18" y="6" width="28" height="52" rx="6" fill="none" stroke="#1e293b" stroke-width="2.5"/><rect x="24" y="14" width="16" height="30" rx="2" fill="none" stroke="#1e293b" stroke-width="2"/><circle cx="32" cy="50" r="2.8" fill="#1e293b"/></svg>`
    },
    {
        id: 'symbol_laptop', name: 'แล็ปท็อป', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="14" y="14" width="36" height="24" rx="3" fill="none" stroke="#1e293b" stroke-width="2.5"/><path d="M8,44 H56 L52,54 H12 Z" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'symbol_tablet', name: 'แท็บเล็ต', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="16" y="8" width="32" height="48" rx="6" fill="none" stroke="#1e293b" stroke-width="2.5"/><circle cx="32" cy="50" r="2" fill="#1e293b"/></svg>`
    },

    /* ── MONOLINE GEOMETRY ───────────────────────────────────── */
    {
        id: 'geom_mono_cube', name: 'ลูกบาศก์', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M12,24 L32,12 L52,24 L52,48 L32,60 L12,48 Z M12,24 L32,36 L52,24 M32,36 L32,60" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'geom_mono_cylinder', name: 'ทรงกระบอก', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="14" rx="20" ry="8" fill="none" stroke="#1e293b" stroke-width="2.5"/><path d="M12,14 L12,50 A20,8 0 0,0 52,50 L52,14" fill="none" stroke="#1e293b" stroke-width="2.5"/><ellipse cx="32" cy="50" rx="20" ry="8" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-dasharray="4,4"/></svg>`
    },
    {
        id: 'geom_mono_cylinder_detail', name: 'ทรงกระบอกละเอียด', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="12" rx="18" ry="7" fill="none" stroke="#1e293b" stroke-width="2.2"/><path d="M14,12 V50 M50,12 V50" stroke="#1e293b" stroke-width="2.2"/><ellipse cx="32" cy="50" rx="18" ry="7" fill="none" stroke="#1e293b" stroke-width="2.2"/><ellipse cx="32" cy="31" rx="18" ry="7" fill="none" stroke="#1e293b" stroke-width="1.6" stroke-dasharray="3,3"/></svg>`
    },
    {
        id: 'geom_mono_cone', name: 'ทรงกรวย', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="50" rx="20" ry="8" fill="none" stroke="#1e293b" stroke-width="2.4"/><path d="M12,50 L32,10 L52,50" fill="none" stroke="#1e293b" stroke-width="2.4" stroke-linejoin="round"/><path d="M22,46 A10,4 0 0,0 42,46" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="3,3"/></svg>`
    },
    {
        id: 'geom_mono_sphere_lat', name: 'ทรงกลมเส้นละติจูด', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="none" stroke="#1e293b" stroke-width="2.3"/><ellipse cx="32" cy="32" rx="24" ry="8" fill="none" stroke="#1e293b" stroke-width="1.8"/><ellipse cx="32" cy="24" rx="20" ry="6" fill="none" stroke="#1e293b" stroke-width="1.4"/><ellipse cx="32" cy="40" rx="20" ry="6" fill="none" stroke="#1e293b" stroke-width="1.4"/><ellipse cx="32" cy="32" rx="10" ry="24" fill="none" stroke="#1e293b" stroke-width="1.6"/></svg>`
    },
    {
        id: 'geom_mono_pyramid_square', name: 'พีระมิดฐานสี่เหลี่ยม', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="12,46 32,54 52,46 32,38" fill="none" stroke="#1e293b" stroke-width="2"/><path d="M32,10 L12,46 M32,10 L52,46 M32,10 L32,54" fill="none" stroke="#1e293b" stroke-width="2.3" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'geom_mono_pyramid_tri', name: 'พีระมิดฐานสามเหลี่ยม', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="14,48 50,48 32,30" fill="none" stroke="#1e293b" stroke-width="2"/><path d="M32,10 L14,48 M32,10 L50,48 M32,10 L32,30" fill="none" stroke="#1e293b" stroke-width="2.3"/></svg>`
    },
    {
        id: 'geom_mono_prism_tri', name: 'ปริซึมสามเหลี่ยม', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="12,20 28,14 28,42 12,48" fill="none" stroke="#1e293b" stroke-width="2"/><polygon points="36,16 52,10 52,38 36,44" fill="none" stroke="#1e293b" stroke-width="2"/><line x1="12" y1="20" x2="36" y2="16" stroke="#1e293b" stroke-width="2"/><line x1="28" y1="14" x2="52" y2="10" stroke="#1e293b" stroke-width="2"/><line x1="28" y1="42" x2="52" y2="38" stroke="#1e293b" stroke-width="2"/><line x1="12" y1="48" x2="36" y2="44" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'geom_mono_prism_rect', name: 'ปริซึมสี่เหลี่ยม', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="10" y="20" width="28" height="30" fill="none" stroke="#1e293b" stroke-width="2.2"/><rect x="26" y="12" width="28" height="30" fill="none" stroke="#1e293b" stroke-width="2.2"/><line x1="10" y1="20" x2="26" y2="12" stroke="#1e293b" stroke-width="2.2"/><line x1="38" y1="20" x2="54" y2="12" stroke="#1e293b" stroke-width="2.2"/><line x1="10" y1="50" x2="26" y2="42" stroke="#1e293b" stroke-width="2.2"/><line x1="38" y1="50" x2="54" y2="42" stroke="#1e293b" stroke-width="2.2"/></svg>`
    },
    {
        id: 'geom_mono_pentagon', name: 'ห้าเหลี่ยมสม่ำเสมอ', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,8 54,24 46,52 18,52 10,24" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'geom_mono_hexagon', name: 'หกเหลี่ยมสม่ำเสมอ', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="20,8 44,8 58,32 44,56 20,56 6,32" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'geom_mono_octagon', name: 'แปดเหลี่ยมสม่ำเสมอ', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="22,6 42,6 58,22 58,42 42,58 22,58 6,42 6,22" fill="none" stroke="#1e293b" stroke-width="2.4" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'frame_ticket', name: 'กรอบตั๋ว', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><path d="M14,14 H206 V52 C194,54 194,68 206,70 V156 H14 V70 C26,68 26,54 14,52 Z" fill="none" stroke="#334155" stroke-width="2.4"/><line x1="110" y1="14" x2="110" y2="156" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="5,6"/></svg>`
    },
    {
        id: 'frame_cloud', name: 'กรอบเมฆ', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><path d="M36,148 H182 C198,148 208,138 208,124 C208,111 198,102 185,102 C183,84 170,74 154,74 C146,58 131,50 114,52 C102,41 84,39 70,48 C58,48 48,56 44,68 C28,68 14,80 14,96 C14,108 22,118 34,122 Z" fill="none" stroke="#0ea5e9" stroke-width="2.6"/></svg>`
    },
    {
        id: 'frame_bracket', name: 'กรอบวงเล็บ', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><path d="M34,20 H18 V150 H34 M186,20 H202 V150 H186" fill="none" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/><rect x="48" y="20" width="124" height="130" rx="8" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="8,6"/></svg>`
    },
    {
        id: 'frame_science', name: 'กรอบวิทย์', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="12" y="12" width="196" height="146" rx="10" fill="none" stroke="#0891b2" stroke-width="2.3"/><circle cx="24" cy="24" r="4" fill="#0891b2"/><circle cx="196" cy="24" r="4" fill="#0891b2"/><circle cx="24" cy="146" r="4" fill="#0891b2"/><circle cx="196" cy="146" r="4" fill="#0891b2"/><path d="M28,28 L44,28 M176,28 L192,28 M28,142 L44,142 M176,142 L192,142" stroke="#0891b2" stroke-width="1.6"/></svg>`
    },
    {
        id: 'frame_notebook_hole', name: 'กรอบสมุดรู', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="20" y="10" width="188" height="150" rx="8" fill="none" stroke="#475569" stroke-width="2.4"/><line x1="46" y1="10" x2="46" y2="160" stroke="#94a3b8" stroke-width="1.5"/><circle cx="32" cy="28" r="4" fill="none" stroke="#475569" stroke-width="1.6"/><circle cx="32" cy="56" r="4" fill="none" stroke="#475569" stroke-width="1.6"/><circle cx="32" cy="84" r="4" fill="none" stroke="#475569" stroke-width="1.6"/><circle cx="32" cy="112" r="4" fill="none" stroke="#475569" stroke-width="1.6"/><circle cx="32" cy="140" r="4" fill="none" stroke="#475569" stroke-width="1.6"/></svg>`
    },
    {
        id: 'frame_award', name: 'กรอบรางวัล', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="12" y="12" width="196" height="146" rx="8" fill="none" stroke="#ca8a04" stroke-width="2.4"/><path d="M60,12 L74,26 L88,12 M132,12 L146,26 L160,12" fill="none" stroke="#ca8a04" stroke-width="2"/><circle cx="110" cy="30" r="10" fill="none" stroke="#ca8a04" stroke-width="2"/><path d="M104,28 L110,22 L116,28 L112,36 H108 Z" fill="none" stroke="#ca8a04" stroke-width="1.6"/></svg>`
    },
    {
        id: 'frame_math_grid', name: 'กรอบตารางคณิต', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="10" y="10" width="200" height="150" rx="6" fill="none" stroke="#2563eb" stroke-width="2.3"/><path d="M10,40 H210 M10,70 H210 M10,100 H210 M10,130 H210 M50,10 V160 M90,10 V160 M130,10 V160 M170,10 V160" stroke="#93c5fd" stroke-width="1.2"/></svg>`
    },
    {
        id: 'frame_wave_corner2', name: 'กรอบลอนมุม', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="14" y="14" width="192" height="142" rx="8" fill="none" stroke="#db2777" stroke-width="2.2"/><path d="M14,26 C24,20 34,20 44,26 C54,32 64,32 74,26" fill="none" stroke="#db2777" stroke-width="1.8"/><path d="M206,54 C200,64 200,74 206,84 C212,94 212,104 206,114" fill="none" stroke="#db2777" stroke-width="1.8"/><path d="M14,144 C24,150 34,150 44,144 C54,138 64,138 74,144" fill="none" stroke="#db2777" stroke-width="1.8"/></svg>`
    },
    {
        id: 'symbol_flag', name: 'ธง', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><line x1="14" y1="8" x2="14" y2="56" stroke="#1e293b" stroke-width="3"/><path d="M14,10 L48,14 L40,26 L48,38 L14,34 Z" fill="none" stroke="#1e293b" stroke-width="2.4" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'symbol_mail', name: 'ซองจดหมาย', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="14" width="48" height="36" rx="4" fill="none" stroke="#1e293b" stroke-width="2.5"/><path d="M10,18 L32,36 L54,18" fill="none" stroke="#1e293b" stroke-width="2.2"/></svg>`
    },
    {
        id: 'symbol_home', name: 'บ้าน', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8,30 L32,10 L56,30" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linejoin="round"/><rect x="14" y="30" width="36" height="24" rx="2" fill="none" stroke="#1e293b" stroke-width="2.4"/><rect x="28" y="40" width="8" height="14" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'symbol_location_pin', name: 'หมุดตำแหน่ง', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32,58 C32,58 14,40 14,28 A18,18 0 0,1 50,28 C50,40 32,58 32,58 Z" fill="none" stroke="#1e293b" stroke-width="2.4"/><circle cx="32" cy="28" r="6" fill="none" stroke="#1e293b" stroke-width="2.2"/></svg>`
    },
    {
        id: 'symbol_calendar', name: 'ปฏิทิน', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="10" y="12" width="44" height="42" rx="5" fill="none" stroke="#1e293b" stroke-width="2.5"/><line x1="10" y1="24" x2="54" y2="24" stroke="#1e293b" stroke-width="2.2"/><line x1="22" y1="8" x2="22" y2="18" stroke="#1e293b" stroke-width="2.2"/><line x1="42" y1="8" x2="42" y2="18" stroke="#1e293b" stroke-width="2.2"/><rect x="18" y="30" width="8" height="8" fill="none" stroke="#1e293b" stroke-width="1.8"/></svg>`
    },
    {
        id: 'symbol_clock', name: 'นาฬิกา', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="none" stroke="#1e293b" stroke-width="2.5"/><line x1="32" y1="32" x2="32" y2="18" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/><line x1="32" y1="32" x2="42" y2="38" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/></svg>`
    },
    {
        id: 'symbol_lightbulb', name: 'หลอดไฟ', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M22,28 A10,10 0 0,1 42,28 C42,34 38,36 36,40 H28 C26,36 22,34 22,28 Z" fill="none" stroke="#1e293b" stroke-width="2.4"/><rect x="28" y="40" width="8" height="8" fill="none" stroke="#1e293b" stroke-width="2"/><line x1="24" y1="52" x2="40" y2="52" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'symbol_gear', name: 'เฟือง', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="8" fill="none" stroke="#1e293b" stroke-width="2.3"/><path d="M32,10 V16 M32,48 V54 M10,32 H16 M48,32 H54 M17,17 L21,21 M43,43 L47,47 M17,47 L21,43 M43,21 L47,17" stroke="#1e293b" stroke-width="2.3" stroke-linecap="round"/><circle cx="32" cy="32" r="16" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'symbol_link', name: 'ลิงก์', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M26,24 L20,30 A8,8 0 0,0 32,42 L38,36" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linecap="round"/><path d="M38,28 L44,22 A8,8 0 0,0 32,10 L26,16" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linecap="round"/><line x1="24" y1="32" x2="40" y2="16" stroke="#1e293b" stroke-width="2.2"/></svg>`
    },
    {
        id: 'geom_mono_tetrahedron', name: 'เตตระฮีดรอน', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="12,46 52,46 32,20" fill="none" stroke="#1e293b" stroke-width="2.2"/><path d="M32,8 L12,46 M32,8 L52,46 M32,8 L32,20" fill="none" stroke="#1e293b" stroke-width="2.3"/></svg>`
    },
    {
        id: 'geom_mono_icosa', name: 'ไอโคซาเฮดรอน (simplified)', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 50,18 50,46 32,58 14,46 14,18" fill="none" stroke="#1e293b" stroke-width="2"/><path d="M14,18 L32,30 L50,18 M14,46 L32,34 L50,46 M32,6 L32,30 M32,58 L32,34" fill="none" stroke="#1e293b" stroke-width="1.8"/></svg>`
    },
    {
        id: 'geom_mono_torus', name: 'ทรงโดนัท (Torus)', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="24" ry="14" fill="none" stroke="#1e293b" stroke-width="2.3"/><ellipse cx="32" cy="32" rx="10" ry="6" fill="none" stroke="#1e293b" stroke-width="2"/><ellipse cx="32" cy="32" rx="24" ry="6" fill="none" stroke="#1e293b" stroke-width="1.6" stroke-dasharray="3,3"/></svg>`
    },
    {
        id: 'geom_mono_frustum', name: 'ทรงตัดยอด', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="14" rx="10" ry="5" fill="none" stroke="#1e293b" stroke-width="2"/><ellipse cx="32" cy="48" rx="22" ry="8" fill="none" stroke="#1e293b" stroke-width="2.4"/><path d="M22,14 L10,48 M42,14 L54,48" fill="none" stroke="#1e293b" stroke-width="2.2"/></svg>`
    },
    {
        id: 'geom_mono_parallelogram', name: 'สี่เหลี่ยมด้านขนาน', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="18,16 52,16 46,48 12,48" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'geom_mono_trapezoid', name: 'สี่เหลี่ยมคางหมู', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="20,16 44,16 54,48 10,48" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/></svg>`
    },
    {
        id: 'geom_mono_nonagon', name: 'เก้าเหลี่ยมสม่ำเสมอ', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 46,10 56,22 58,36 50,50 36,58 22,58 8,50 6,36 8,22 18,10" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'geom_mono_decagon', name: 'สิบเหลี่ยมสม่ำเสมอ', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 45,10 54,20 58,32 54,44 45,54 32,58 19,54 10,44 6,32 10,20 19,10" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'geom_mono_ellipse_axes', name: 'วงรีพร้อมแกน', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="22" ry="14" fill="none" stroke="#1e293b" stroke-width="2.4"/><line x1="10" y1="32" x2="54" y2="32" stroke="#1e293b" stroke-width="1.6" stroke-dasharray="4,4"/><line x1="32" y1="18" x2="32" y2="46" stroke="#1e293b" stroke-width="1.6" stroke-dasharray="4,4"/></svg>`
    },
    {
        id: 'math_angle', name: 'มุม', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><line x1="10" y1="52" x2="54" y2="52" stroke="#1d4ed8" stroke-width="4"/><line x1="10" y1="52" x2="36" y2="16" stroke="#1d4ed8" stroke-width="4"/><path d="M22,52 A12,12 0 0,1 30,42" fill="none" stroke="#1d4ed8" stroke-width="2.5"/></svg>`
    },
    {
        id: 'math_fraction', name: 'เศษส่วน', category: 'math',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="20" y="24" font-size="16" font-family="serif" fill="#7c3aed">a</text><line x1="16" y1="30" x2="48" y2="30" stroke="#7c3aed" stroke-width="2.5"/><text x="20" y="48" font-size="16" font-family="serif" fill="#7c3aed">b</text></svg>`
    },
    {
        id: 'person_doctor', name: 'คุณหมอ', category: 'people',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><circle cx="32" cy="12" r="10" fill="#fbbf24"/><rect x="16" y="24" width="32" height="36" rx="7" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/><rect x="28" y="30" width="8" height="20" rx="2" fill="#ef4444"/><rect x="22" y="36" width="20" height="8" rx="2" fill="#ef4444"/><rect x="14" y="60" width="14" height="16" rx="4" fill="#334155"/><rect x="36" y="60" width="14" height="16" rx="4" fill="#334155"/></svg>`
    },
    {
        id: 'person_farmer', name: 'ชาวนา', category: 'people',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><ellipse cx="32" cy="10" rx="18" ry="6" fill="#ca8a04"/><circle cx="32" cy="16" r="9" fill="#fbbf24"/><rect x="18" y="28" width="28" height="34" rx="6" fill="#16a34a"/><rect x="12" y="62" width="14" height="14" rx="4" fill="#166534"/><rect x="38" y="62" width="14" height="14" rx="4" fill="#166534"/></svg>`
    },
    {
        id: 'nature_mountain', name: 'ภูเขา', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 64"><polygon points="6,58 28,18 50,58" fill="#64748b"/><polygon points="24,58 48,10 74,58" fill="#475569"/><polygon points="42,20 48,10 54,20" fill="#e2e8f0"/></svg>`
    },
    {
        id: 'nature_leaf', name: 'ใบไม้', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M10,44 C10,24 26,10 50,10 C50,34 34,50 14,50" fill="#22c55e"/><path d="M14,48 L40,22" stroke="#166534" stroke-width="2" stroke-linecap="round"/></svg>`
    },
    {
        id: 'school_chalkboard', name: 'กระดานดำ', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 56"><rect x="4" y="4" width="64" height="40" rx="4" fill="#14532d" stroke="#854d0e" stroke-width="3"/><line x1="14" y1="50" x2="58" y2="50" stroke="#854d0e" stroke-width="4"/></svg>`
    },
    {
        id: 'school_backpack', name: 'กระเป๋านักเรียน', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72"><rect x="14" y="16" width="36" height="46" rx="10" fill="#2563eb"/><rect x="22" y="6" width="20" height="12" rx="6" fill="#1d4ed8"/><rect x="20" y="28" width="24" height="14" rx="4" fill="#93c5fd"/></svg>`
    },
    {
        id: 'frame_exam_box', name: 'กรอบข้อสอบ', category: 'frames',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="10" y="10" width="200" height="150" rx="8" fill="none" stroke="#334155" stroke-width="2.3"/><line x1="10" y1="40" x2="210" y2="40" stroke="#334155" stroke-width="1.8"/><line x1="36" y1="40" x2="36" y2="160" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4,5"/></svg>`
    },
    {
        id: 'symbol_question_mark', name: 'เครื่องหมายคำถาม', category: 'symbols',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M22,22 C22,14 28,10 34,10 C41,10 46,14 46,21 C46,28 40,30 36,33 C34,35 34,37 34,40" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="50" r="3" fill="#1e293b"/></svg>`
    },
    {
        id: 'geom_mono_dodecagon', name: 'สิบสองเหลี่ยม', category: 'geometry',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polygon points="32,6 42,8 50,14 56,22 58,32 56,42 50,50 42,56 32,58 22,56 14,50 8,42 6,32 8,22 14,14 22,8" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
    },
    {
        id: 'nature_butterfly', name: 'ผีเสื้อ', category: 'nature',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="22" cy="24" rx="10" ry="14" fill="#f472b6"/><ellipse cx="42" cy="24" rx="10" ry="14" fill="#f472b6"/><ellipse cx="22" cy="42" rx="10" ry="12" fill="#ec4899"/><ellipse cx="42" cy="42" rx="10" ry="12" fill="#ec4899"/><rect x="30" y="18" width="4" height="30" rx="2" fill="#1f2937"/></svg>`
    },
    {
        id: 'school_test_tube', name: 'หลอดทดลอง', category: 'school',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 72"><rect x="16" y="4" width="16" height="44" rx="8" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/><path d="M18,34 H30 V48 A8,8 0 0,1 18,48 Z" fill="#38bdf8"/></svg>`
    }
];
