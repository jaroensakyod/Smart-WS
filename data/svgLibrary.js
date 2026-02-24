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

  /* ── MONOLINE ARROWS ─────────────────────────────────────── */
  {
    id: 'arrow_monoline_classic', name: 'ลูกศรตรง', category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8,32 L56,32 M44,20 L56,32 L44,44" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'arrow_monoline_dashed', name: 'ลูกศรเส้นประ', category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8,32 L56,32 M44,20 L56,32 L44,44" fill="none" stroke="#1e293b" stroke-width="3" stroke-dasharray="8,4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'arrow_monoline_curve', name: 'ลูกศรโค้ง', category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8,48 Q32,12 56,48 M42,42 L56,48 L48,34" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'arrow_monoline_zigzag', name: 'ลูกศรซิกแซก', category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8,40 L18,24 L28,40 L38,24 L48,40 L56,32 M44,24 L56,32 L46,42" fill="none" stroke="#1e293b" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },

  {
    id: 'frame_mono_header', name: 'กรอบหัวกระดาษ (Mono)', category: 'frames',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="8" y="8" width="204" height="154" rx="8" fill="none" stroke="#1e293b" stroke-width="2.5"/><line x1="8" y1="34" x2="212" y2="34" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/></svg>`
  },
  {
    id: 'frame_mono_note', name: 'กรอบเน้นข้อความ (Mono)', category: 'frames',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 170"><rect x="14" y="14" width="192" height="142" rx="10" fill="none" stroke="#1e293b" stroke-width="2.5"/><path d="M24,44 H196 M24,64 H176 M24,84 H188" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="6,5"/></svg>`
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

  /* ── MONOLINE GEOMETRY ───────────────────────────────────── */
  {
    id: 'geom_mono_cube', name: 'ลูกบาศก์', category: 'geometry',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M12,24 L32,12 L52,24 L52,48 L32,60 L12,48 Z M12,24 L32,36 L52,24 M32,36 L32,60" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'geom_mono_cylinder', name: 'ทรงกระบอก', category: 'geometry',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="14" rx="20" ry="8" fill="none" stroke="#1e293b" stroke-width="2.5"/><path d="M12,14 L12,50 A20,8 0 0,0 52,50 L52,14" fill="none" stroke="#1e293b" stroke-width="2.5"/><ellipse cx="32" cy="50" rx="20" ry="8" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-dasharray="4,4"/></svg>`
  },

  /* ── MONOLINE ANIMALS ────────────────────────────────────── */
  {
    id: 'animal_mono_cat', name: 'แมว', category: 'animals',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M16,42 Q8,42 8,30 Q8,18 16,10 L24,18 L40,18 L48,10 Q56,18 56,30 Q56,42 48,42 M16,42 L48,42 M32,42 L32,56 Q32,62 38,62" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="28" r="2" fill="#1e293b"/><circle cx="40" cy="28" r="2" fill="#1e293b"/><path d="M28,34 Q32,38 36,34" fill="none" stroke="#1e293b" stroke-width="2"/></svg>`
  },
  {
    id: 'animal_mono_bird', name: 'นก', category: 'animals',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M12,32 Q12,12 32,12 Q52,12 52,32 Q52,52 32,52 Q18,52 12,42 M52,32 L60,28 L52,36" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="24" r="2" fill="#1e293b"/><path d="M24,52 L24,60 M40,52 L40,60" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/></svg>`
  }
];
