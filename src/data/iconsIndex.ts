import type { Icon } from '../types'

const ICONS: Icon[] = [
  // ── Cells & Organelles ──────────────────────────────────────────────────
  {
    id: 'cell-generic',
    name: 'Animal Cell',
    category: 'Cells & Organelles',
    tags: ['cell', 'animal', 'eukaryote', 'biology', 'generic'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="42" rx="36" ry="28" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
      <ellipse cx="35" cy="40" rx="11" ry="9" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="54" cy="34" r="2.5" fill="#93c5fd" opacity="0.7"/>
      <circle cx="26" cy="50" r="2" fill="#93c5fd" opacity="0.7"/>
      <circle cx="50" cy="54" r="3" fill="#93c5fd" opacity="0.6"/>
      <circle cx="28" cy="34" r="1.5" fill="#93c5fd" opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'cell-plant',
    name: 'Plant Cell',
    category: 'Cells & Organelles',
    tags: ['cell', 'plant', 'chloroplast', 'vacuole', 'cell wall', 'eukaryote'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="68" height="64" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
      <rect x="12" y="14" width="56" height="52" rx="2" fill="#bbf7d0" stroke="#15803d" stroke-width="1"/>
      <ellipse cx="40" cy="40" rx="18" ry="16" fill="#86efac" stroke="#15803d" stroke-width="1"/>
      <ellipse cx="22" cy="25" rx="6" ry="4" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
      <ellipse cx="60" cy="28" rx="5" ry="3.5" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
      <ellipse cx="58" cy="55" rx="5" ry="3.5" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
    </svg>`,
  },
  {
    id: 'cell-neuron',
    name: 'Neuron',
    category: 'Cells & Organelles',
    tags: ['neuron', 'nerve', 'brain', 'axon', 'dendrite', 'synapse', 'neural'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="34" cy="38" r="12" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/>
      <line x1="46" y1="38" x2="74" y2="38" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="72" y="34" width="6" height="8" rx="1" fill="#818cf8" stroke="#4338ca" stroke-width="1.5"/>
      <path d="M34 26 C28 18 18 14 14 10" fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M34 26 C36 16 30 10 26 6" fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M24 34 C14 30 8 24 4 20" fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M24 42 C14 46 8 56 6 62" fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M32 50 C28 58 20 62 14 68" fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="34" cy="38" r="5" fill="#a5b4fc"/>
    </svg>`,
  },
  {
    id: 'cell-red-blood',
    name: 'Red Blood Cell',
    category: 'Cells & Organelles',
    tags: ['red blood cell', 'erythrocyte', 'blood', 'hemoglobin', 'rbc'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="34" ry="22" fill="#fecaca" stroke="#ef4444" stroke-width="2"/>
      <ellipse cx="40" cy="40" rx="18" ry="8" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
      <ellipse cx="32" cy="36" rx="5" ry="3" fill="#f87171" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'organelle-nucleus',
    name: 'Cell Nucleus',
    category: 'Cells & Organelles',
    tags: ['nucleus', 'nucleolus', 'chromatin', 'organelle', 'dna', 'gene'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="34" ry="28" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <ellipse cx="40" cy="40" rx="34" ry="28" fill="none" stroke="#a78bfa" stroke-width="1" stroke-dasharray="5,3"/>
      <circle cx="36" cy="38" r="9" fill="#c4b5fd" stroke="#6d28d9" stroke-width="1.5"/>
      <path d="M28 36 Q36 28 44 36 Q36 44 28 36" fill="#7c3aed" opacity="0.3"/>
    </svg>`,
  },
  {
    id: 'organelle-mitochondria',
    name: 'Mitochondria',
    category: 'Cells & Organelles',
    tags: ['mitochondria', 'atp', 'energy', 'organelle', 'cristae', 'respiration'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="36" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <ellipse cx="40" cy="40" rx="30" ry="16" fill="#fde68a" stroke="#b45309" stroke-width="1"/>
      <path d="M16 40 C20 32 26 36 30 40 C34 44 38 36 42 40" fill="none" stroke="#92400e" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M40 40 C44 32 50 36 54 40 C58 44 62 36 64 40" fill="none" stroke="#92400e" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'organelle-ribosome',
    name: 'Ribosome',
    category: 'Cells & Organelles',
    tags: ['ribosome', 'translation', 'protein synthesis', 'rna', 'organelle'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="38" cy="34" rx="20" ry="14" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
      <ellipse cx="42" cy="50" rx="16" ry="10" fill="#fdba74" stroke="#c2410c" stroke-width="2"/>
      <line x1="36" y1="44" x2="52" y2="42" stroke="#9a3412" stroke-width="1.5" stroke-dasharray="2,2"/>
    </svg>`,
  },
  {
    id: 'organelle-golgi',
    name: 'Golgi Apparatus',
    category: 'Cells & Organelles',
    tags: ['golgi', 'secretion', 'vesicle', 'organelle', 'membrane'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 28 C20 24 60 24 68 28" fill="none" stroke="#0891b2" stroke-width="4" stroke-linecap="round"/>
      <path d="M14 38 C22 34 58 34 66 38" fill="none" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/>
      <path d="M16 48 C24 44 56 44 64 48" fill="none" stroke="#155e75" stroke-width="4" stroke-linecap="round"/>
      <circle cx="18" cy="38" r="5" fill="#a5f3fc" stroke="#0891b2" stroke-width="1.5"/>
      <circle cx="62" cy="34" r="5" fill="#a5f3fc" stroke="#0891b2" stroke-width="1.5"/>
      <circle cx="66" cy="48" r="4" fill="#a5f3fc" stroke="#0891b2" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'organelle-er',
    name: 'Endoplasmic Reticulum',
    category: 'Cells & Organelles',
    tags: ['endoplasmic reticulum', 'organelle', 'membrane', 'ribosome', 'protein synthesis'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M8 22 C16 12 26 12 34 22 C42 32 52 32 60 22 C66 15 70 15 74 20" fill="none" stroke="#7e22ce" stroke-width="3" stroke-linecap="round"/><path d="M8 40 C16 30 26 30 34 40 C42 50 52 50 60 40 C66 33 70 33 74 38" fill="none" stroke="#9333ea" stroke-width="3" stroke-linecap="round"/><path d="M10 58 C18 50 28 50 36 58 C44 66 54 66 62 58" fill="none" stroke="#7e22ce" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="16" r="2.4" fill="#c084fc" stroke="#6b21a8" stroke-width="1"/><circle cx="46" cy="34" r="2.4" fill="#c084fc" stroke="#6b21a8" stroke-width="1"/><circle cx="30" cy="52" r="2.4" fill="#c084fc" stroke="#6b21a8" stroke-width="1"/></svg>`,
  },
  {
    id: 'organelle-lysosome',
    name: 'Lysosome',
    category: 'Cells & Organelles',
    tags: ['lysosome', 'organelle', 'digestion', 'enzyme', 'vesicle'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="42" r="30" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/><path d="M28 34 C34 30 30 42 36 44 C42 46 38 56 30 52" fill="#fca5a5" stroke="#b91c1c" stroke-width="1.5"/><circle cx="50" cy="30" r="4" fill="#f87171" stroke="#991b1b" stroke-width="1.5"/><circle cx="54" cy="46" r="3.5" fill="#f87171" stroke="#991b1b" stroke-width="1.5"/><circle cx="42" cy="56" r="3" fill="#f87171" stroke="#991b1b" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'organelle-peroxisome',
    name: 'Peroxisome',
    category: 'Cells & Organelles',
    tags: ['peroxisome', 'organelle', 'vesicle', 'catalase', 'metabolism'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="28" fill="#ffedd5" stroke="#ea580c" stroke-width="2.5"/><polygon points="40,22 50,34 46,50 34,50 30,34" fill="#fdba74" stroke="#c2410c" stroke-width="2" stroke-linejoin="round"/><circle cx="40" cy="38" r="3" fill="#fed7aa" stroke="#9a3412" stroke-width="1"/><circle cx="24" cy="24" r="2.5" fill="#fb923c" stroke="#9a3412" stroke-width="1"/><circle cx="58" cy="30" r="2" fill="#fb923c" stroke="#9a3412" stroke-width="1"/></svg>`,
  },
  {
    id: 'cell-vacuole',
    name: 'Vacuole',
    category: 'Cells & Organelles',
    tags: ['vacuole', 'organelle', 'storage', 'membrane', 'cell'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="42" r="32" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/><path d="M18 30 C26 24 34 24 40 30" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/><path d="M46 54 C54 60 62 58 66 52" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/><circle cx="30" cy="50" r="3" fill="#bae6fd" stroke="#0369a1" stroke-width="1"/><circle cx="52" cy="32" r="2.5" fill="#bae6fd" stroke="#0369a1" stroke-width="1"/></svg>`,
  },
  {
    id: 'cell-cytoskeleton',
    name: 'Cytoskeleton',
    category: 'Cells & Organelles',
    tags: ['cytoskeleton', 'microtubule', 'filament', 'cell structure', 'scaffold'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 40 L12 14" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><path d="M40 40 L68 16" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><path d="M40 40 L14 62" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><path d="M40 40 L66 64" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><path d="M40 40 L40 72" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><path d="M40 40 L8 40" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><circle cx="40" cy="40" r="7" fill="#cbd5e1" stroke="#334155" stroke-width="2"/></svg>`,
  },
  {
    id: 'cell-macrophage',
    name: 'Macrophage',
    category: 'Cells & Organelles',
    tags: ['macrophage', 'immune cell', 'phagocyte', 'white blood cell', 'immunity'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M20 24 C10 30 8 44 16 52 C14 62 24 70 34 66 C42 74 58 70 60 60 C70 58 72 44 62 38 C64 26 50 16 40 22 C32 14 22 16 20 24 Z" fill="#ecfccb" stroke="#4d7c0f" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="38" cy="42" rx="12" ry="10" fill="#bef264" stroke="#365314" stroke-width="2"/><circle cx="20" cy="30" r="4" fill="#d9f99d" stroke="#4d7c0f" stroke-width="1.5"/><circle cx="56" cy="52" r="3.5" fill="#d9f99d" stroke="#4d7c0f" stroke-width="1.5"/><circle cx="48" cy="26" r="3" fill="#d9f99d" stroke="#4d7c0f" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'cell-tcell',
    name: 'T-Cell',
    category: 'Cells & Organelles',
    tags: ['t cell', 'lymphocyte', 'immune cell', 'receptor', 'white blood cell'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="26" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.5"/><circle cx="40" cy="40" r="12" fill="#a5b4fc" stroke="#3730a3" stroke-width="2"/><path d="M40 14 L36 6 M40 14 L44 6" fill="none" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/><path d="M66 40 L74 36 M66 40 L74 44" fill="none" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/><path d="M40 66 L36 74 M40 66 L44 74" fill="none" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/><path d="M14 40 L6 36 M14 40 L6 44" fill="none" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'cell-bcell',
    name: 'B-Cell',
    category: 'Cells & Organelles',
    tags: ['b cell', 'lymphocyte', 'antibody', 'immune cell', 'white blood cell'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="26" fill="#ccfbf1" stroke="#0d9488" stroke-width="2.5"/><circle cx="40" cy="40" r="13" fill="#5eead4" stroke="#115e59" stroke-width="2"/><path d="M40 27 L40 14 M40 14 L32 6 M40 14 L48 6" fill="none" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round"/><path d="M61 28 L70 20 M70 20 L78 22 M70 20 L74 12" fill="none" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round"/><path d="M19 28 L10 20 M10 20 L2 22 M10 20 L6 12" fill="none" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'cell-stem',
    name: 'Stem Cell',
    category: 'Cells & Organelles',
    tags: ['stem cell', 'dividing cell', 'undifferentiated', 'mitosis', 'development'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="40" r="20" fill="#fae8ff" stroke="#a21caf" stroke-width="2.5"/><circle cx="52" cy="40" r="20" fill="#fae8ff" stroke="#a21caf" stroke-width="2.5"/><circle cx="28" cy="40" r="9" fill="#f0abfc" stroke="#86198f" stroke-width="1.5"/><circle cx="52" cy="40" r="9" fill="#f0abfc" stroke="#86198f" stroke-width="1.5"/><path d="M40 22 C36 30 36 50 40 58" fill="none" stroke="#a21caf" stroke-width="1.5" stroke-dasharray="2 3"/></svg>`,
  },
  {
    id: 'cell-platelet',
    name: 'Platelet',
    category: 'Cells & Organelles',
    tags: ['platelet', 'blood cell', 'clotting', 'thrombocyte', 'disc'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="42" rx="26" ry="14" fill="#fecdd3" stroke="#be123c" stroke-width="2.5"/><ellipse cx="40" cy="42" rx="26" ry="14" fill="none" stroke="#fb7185" stroke-width="1" stroke-dasharray="3 2"/><circle cx="32" cy="38" r="2.5" fill="#fb7185" stroke="#9f1239" stroke-width="1"/><circle cx="46" cy="46" r="2.5" fill="#fb7185" stroke="#9f1239" stroke-width="1"/><circle cx="40" cy="36" r="2" fill="#fb7185" stroke="#9f1239" stroke-width="1"/></svg>`,
  },

  // ── Molecules ────────────────────────────────────────────────────────────
  {
    id: 'molecule-dna',
    name: 'DNA Double Helix',
    category: 'Molecules',
    tags: ['dna', 'double helix', 'nucleic acid', 'genetics', 'genome', 'chromosome'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 5 C45 13 35 27 25 35 C15 43 25 57 45 65 C55 69 55 75 55 75" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M55 5 C35 13 45 27 55 35 C65 43 55 57 35 65 C25 69 25 75 25 75" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="29" y1="12" x2="51" y2="12" stroke="#6b7280" stroke-width="1.5"/>
      <line x1="27" y1="22" x2="53" y2="22" stroke="#6b7280" stroke-width="1.5"/>
      <line x1="26" y1="32" x2="54" y2="32" stroke="#6b7280" stroke-width="1.5"/>
      <line x1="29" y1="48" x2="51" y2="48" stroke="#6b7280" stroke-width="1.5"/>
      <line x1="33" y1="58" x2="47" y2="58" stroke="#6b7280" stroke-width="1.5"/>
      <line x1="37" y1="68" x2="43" y2="68" stroke="#6b7280" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'molecule-mrna',
    name: 'mRNA',
    category: 'Molecules',
    tags: ['mrna', 'rna', 'messenger', 'transcript', 'nucleic acid', 'gene expression'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 40 C15 30 20 50 25 40 C30 30 35 50 40 40 C45 30 50 50 55 40 C60 30 65 50 70 40" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
      <circle cx="10" cy="40" r="3" fill="#fb923c"/>
      <circle cx="70" cy="40" r="3" fill="#fb923c"/>
      <text x="40" y="70" text-anchor="middle" font-size="10" fill="#c2410c" font-family="sans-serif">mRNA</text>
    </svg>`,
  },
  {
    id: 'molecule-protein',
    name: 'Protein',
    category: 'Molecules',
    tags: ['protein', 'folded', 'tertiary structure', 'polypeptide', 'amino acid'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10 C55 10 68 20 70 35 C72 50 64 64 50 68 C36 72 20 66 14 52 C8 38 16 20 30 14 C34 12 37 10 40 10 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
      <path d="M40 10 C48 18 56 14 60 22 C64 30 60 40 52 44 C44 48 34 44 30 36 C26 28 30 18 38 14 Z" fill="#c4b5fd" stroke="#6d28d9" stroke-width="1" opacity="0.6"/>
      <path d="M28 42 C24 52 30 62 42 64" fill="none" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'molecule-antibody',
    name: 'Antibody',
    category: 'Molecules',
    tags: ['antibody', 'immunoglobulin', 'igG', 'immune', 'antigen binding', 'Fab', 'Fc'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="34" y="46" width="12" height="28" rx="4" fill="#d1fae5" stroke="#059669" stroke-width="2"/>
      <path d="M34 54 L18 34 L10 20 L22 16 L30 32 L34 44" fill="#a7f3d0" stroke="#059669" stroke-width="2" stroke-linejoin="round"/>
      <path d="M46 54 L62 34 L70 20 L58 16 L50 32 L46 44" fill="#a7f3d0" stroke="#059669" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="14" cy="17" rx="6" ry="4" fill="#34d399" stroke="#047857" stroke-width="1.5"/>
      <ellipse cx="66" cy="17" rx="6" ry="4" fill="#34d399" stroke="#047857" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'molecule-atp',
    name: 'ATP',
    category: 'Molecules',
    tags: ['atp', 'energy', 'adenosine triphosphate', 'phosphate', 'metabolism'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="38" r="16" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="40" y="43" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e" font-family="sans-serif">ATP</text>
      <line x1="56" y1="38" x2="64" y2="38" stroke="#b45309" stroke-width="2"/>
      <circle cx="68" cy="38" r="4" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
      <line x1="46" y1="54" x2="40" y2="62" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="40" cy="66" r="3.5" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
      <line x1="34" y1="54" x2="26" y2="60" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="23" cy="63" r="3.5" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'molecule-small',
    name: 'Small Molecule / Drug',
    category: 'Molecules',
    tags: ['small molecule', 'drug', 'ligand', 'compound', 'inhibitor', 'pharmaceutical'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,10 60,22 60,46 40,58 20,46 20,22" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
      <polygon points="40,20 52,27 52,41 40,48 28,41 28,27" fill="#fbcfe8" stroke="#be185d" stroke-width="1"/>
      <circle cx="40" cy="34" r="5" fill="#f9a8d4"/>
    </svg>`,
  },
  {
    id: 'molecule-lipid',
    name: 'Lipid Bilayer',
    category: 'Molecules',
    tags: ['lipid', 'membrane', 'bilayer', 'phospholipid', 'cell membrane'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="28" width="72" height="10" rx="3" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="4" y="42" width="72" height="10" rx="3" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5"/>
      <circle cx="14" cy="23" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="26" cy="23" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="38" cy="23" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="50" cy="23" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="62" cy="23" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="14" cy="57" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="26" cy="57" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="38" cy="57" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="50" cy="57" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="62" cy="57" r="4" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'molecule-trna',
    name: 'tRNA',
    category: 'Molecules',
    tags: ['trna', 'transfer rna', 'cloverleaf', 'anticodon', 'translation', 'nucleic acid'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M40 6 L40 28" fill="none" stroke="#0d9488" stroke-width="4" stroke-linecap="round"/> <circle cx="40" cy="34" r="7" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/> <ellipse cx="17" cy="32" rx="14" ry="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/> <ellipse cx="63" cy="30" rx="14" ry="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/> <ellipse cx="40" cy="63" rx="10" ry="15" fill="#99f6e4" stroke="#0f766e" stroke-width="2"/> <path d="M32 37 C28 39 24 34 17 32" fill="none" stroke="#0f766e" stroke-width="1.5"/> <path d="M48 34 C52 32 58 31 63 30" fill="none" stroke="#0f766e" stroke-width="1.5"/> <path d="M40 41 L40 49" fill="none" stroke="#0f766e" stroke-width="2"/> </svg>`,
  },
  {
    id: 'molecule-glucose',
    name: 'Glucose',
    category: 'Molecules',
    tags: ['glucose', 'sugar', 'hexose', 'carbohydrate', 'monosaccharide', 'metabolism'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <polygon points="40,18 58,29 58,51 40,62 22,51 22,29" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/> <circle cx="40" cy="18" r="4" fill="#93c5fd" stroke="#1e40af" stroke-width="1.5"/> <line x1="40" y1="62" x2="40" y2="72" stroke="#1d4ed8" stroke-width="2"/> <circle cx="40" cy="74" r="4" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.5"/> <line x1="58" y1="29" x2="68" y2="22" stroke="#1d4ed8" stroke-width="2"/> <circle cx="70" cy="20" r="3.5" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.5"/> <line x1="22" y1="51" x2="12" y2="58" stroke="#1d4ed8" stroke-width="2"/> <circle cx="10" cy="60" r="3.5" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'molecule-fatty-acid',
    name: 'Fatty Acid',
    category: 'Molecules',
    tags: ['fatty acid', 'lipid', 'hydrocarbon chain', 'carboxyl group', 'lipid metabolism', 'fat'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M6 50 L15 34 L24 50 L33 34 L42 50 L51 34 L58 44" fill="none" stroke="#b45309" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="66" cy="42" r="9" fill="#fecaca" stroke="#dc2626" stroke-width="2"/> <line x1="66" y1="33" x2="66" y2="24" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/> <line x1="72" y1="48" x2="76" y2="53" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/> <circle cx="76" cy="55" r="3" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'molecule-hormone',
    name: 'Hormone',
    category: 'Molecules',
    tags: ['hormone', 'steroid', 'endocrine', 'ring structure', 'signaling molecule', 'receptor'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="16" cy="44" r="13" fill="#fce7f3" stroke="#db2777" stroke-width="2"/> <circle cx="34" cy="38" r="13" fill="#fce7f3" stroke="#db2777" stroke-width="2"/> <circle cx="52" cy="38" r="13" fill="#fce7f3" stroke="#db2777" stroke-width="2"/> <circle cx="67" cy="43" r="9" fill="#fce7f3" stroke="#db2777" stroke-width="2"/> <line x1="34" y1="25" x2="34" y2="15" stroke="#be185d" stroke-width="2" stroke-linecap="round"/> <circle cx="34" cy="13" r="2.5" fill="#f9a8d4" stroke="#be185d" stroke-width="1.5"/> <line x1="52" y1="25" x2="52" y2="17" stroke="#be185d" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'molecule-vitamin',
    name: 'Vitamin',
    category: 'Molecules',
    tags: ['vitamin', 'supplement', 'micronutrient', 'capsule', 'cofactor', 'nutrition'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="30" width="35" height="20" rx="10" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/> <rect x="27" y="30" width="35" height="20" rx="10" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/> <line x1="30" y1="31" x2="30" y2="49" stroke="#c2410c" stroke-width="1.5"/> <circle cx="63" cy="20" r="8" fill="none" stroke="#c2410c" stroke-width="2"/> <circle cx="63" cy="20" r="3" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'molecule-ion',
    name: 'Ion',
    category: 'Molecules',
    tags: ['ion', 'charge', 'cation', 'anion', 'electrolyte', 'ion channel'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="26" cy="38" r="14" fill="#ffe4e6" stroke="#e11d48" stroke-width="2"/> <line x1="26" y1="31" x2="26" y2="45" stroke="#9f1239" stroke-width="2.5" stroke-linecap="round"/> <line x1="19" y1="38" x2="33" y2="38" stroke="#9f1239" stroke-width="2.5" stroke-linecap="round"/> <circle cx="58" cy="48" r="11" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/> <line x1="52" y1="48" x2="64" y2="48" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'molecule-oxygen',
    name: 'Oxygen Molecule',
    category: 'Molecules',
    tags: ['oxygen', 'o2', 'diatomic', 'respiration', 'gas exchange', 'double bond'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="28" cy="40" r="17" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5"/> <circle cx="58" cy="40" r="17" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5"/> <line x1="41" y1="30" x2="41" y2="50" stroke="#b91c1c" stroke-width="2"/> <line x1="45" y1="30" x2="45" y2="50" stroke="#b91c1c" stroke-width="2"/> </svg>`,
  },
  {
    id: 'molecule-water',
    name: 'Water Molecule',
    category: 'Molecules',
    tags: ['water', 'h2o', 'triatomic', 'solvent', 'hydration', 'polar molecule'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="34" r="15" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/> <circle cx="18" cy="56" r="9" fill="#f3f4f6" stroke="#9ca3af" stroke-width="2"/> <circle cx="62" cy="56" r="9" fill="#f3f4f6" stroke="#9ca3af" stroke-width="2"/> <line x1="29" y1="43" x2="22" y2="50" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/> <line x1="51" y1="43" x2="58" y2="50" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'molecule-peptide-chain',
    name: 'Peptide Chain',
    category: 'Molecules',
    tags: ['peptide', 'amino acid chain', 'polypeptide', 'beads', 'primary structure', 'oligopeptide'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M8 50 C16 34 24 34 32 44 C40 54 48 54 56 40 C62 30 68 30 72 38" fill="none" stroke="#7e22ce" stroke-width="2.5" stroke-linecap="round"/> <circle cx="8" cy="50" r="6" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/> <circle cx="32" cy="44" r="6" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/> <circle cx="56" cy="40" r="6" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/> <circle cx="72" cy="38" r="6" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/> </svg>`,
  },
  {
    id: 'molecule-vesicle',
    name: 'Vesicle',
    category: 'Molecules',
    tags: ['vesicle', 'exosome', 'lipid bilayer', 'transport', 'secretion', 'membrane'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="42" r="26" fill="#cffafe" stroke="#0e7490" stroke-width="2.5"/> <circle cx="40" cy="42" r="18" fill="#a5f3fc" stroke="#0891b2" stroke-width="1.5"/> <circle cx="22" cy="26" r="3" fill="#ecfeff" stroke="#06b6d4" stroke-width="1.5"/> <circle cx="58" cy="24" r="3" fill="#ecfeff" stroke="#06b6d4" stroke-width="1.5"/> <circle cx="62" cy="52" r="3" fill="#ecfeff" stroke="#06b6d4" stroke-width="1.5"/> <circle cx="18" cy="56" r="3" fill="#ecfeff" stroke="#06b6d4" stroke-width="1.5"/> </svg>`,
  },

  // ── Signaling ────────────────────────────────────────────────────────────
  {
    id: 'signaling-receptor',
    name: 'Membrane Receptor',
    category: 'Signaling',
    tags: ['receptor', 'membrane', 'GPCR', 'transmembrane', 'signal', 'binding'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="34" width="72" height="12" rx="2" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
      <path d="M28 34 C28 20 24 12 24 8 M32 34 C32 20 36 12 36 8 M28 8 L36 8" fill="none" stroke="#0369a1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M44 46 C44 60 40 68 40 72 M52 46 C52 60 48 68 48 72 M40 72 L48 72" fill="none" stroke="#0369a1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="30" cy="8" r="4" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'signaling-enzyme',
    name: 'Enzyme',
    category: 'Signaling',
    tags: ['enzyme', 'catalyst', 'substrate', 'active site', 'reaction'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8 C56 8 70 20 70 36 C70 52 58 68 40 68 C22 68 10 52 10 36 C10 20 24 8 40 8 Z" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <path d="M30 32 C30 24 36 20 40 20 C44 20 50 24 50 32 L50 38 C50 42 46 44 40 44 C34 44 30 42 30 38 Z" fill="#86efac" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="40" cy="56" r="6" fill="#4ade80" stroke="#15803d" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'signaling-kinase',
    name: 'Kinase',
    category: 'Signaling',
    tags: ['kinase', 'phosphorylation', 'phosphate', 'signaling', 'atp', 'substrate'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="20" width="56" height="40" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
      <text x="40" y="38" text-anchor="middle" font-size="9" fill="#15803d" font-family="sans-serif" font-weight="bold">Kinase</text>
      <circle cx="58" cy="22" r="8" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
      <text x="58" y="26" text-anchor="middle" font-size="8" fill="#92400e" font-family="sans-serif" font-weight="bold">P</text>
      <path d="M40 60 L40 70 M34 70 L46 70" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'signaling-transcription-factor',
    name: 'Transcription Factor',
    category: 'Signaling',
    tags: ['transcription factor', 'TF', 'gene regulation', 'dna binding', 'nucleus', 'signaling'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="50" width="64" height="10" rx="2" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M24 50 L24 36 C24 28 32 22 40 22 C48 22 56 28 56 36 L56 50" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="24" cy="30" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="56" cy="30" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="1.5"/>
      <text x="24" y="34" text-anchor="middle" font-size="7" fill="#1d4ed8" font-family="sans-serif">TF</text>
      <text x="56" y="34" text-anchor="middle" font-size="7" fill="#1d4ed8" font-family="sans-serif">TF</text>
    </svg>`,
  },
  {
    id: 'signaling-cytokine',
    name: 'Cytokine / Growth Factor',
    category: 'Signaling',
    tags: ['cytokine', 'growth factor', 'interleukin', 'signaling molecule', 'secreted'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="20" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
      <circle cx="40" cy="40" r="13" fill="#fbcfe8" stroke="#be185d" stroke-width="1"/>
      <path d="M40 20 L40 10 M55 28 L62 22 M60 40 L70 40 M55 52 L62 58 M40 60 L40 70 M25 52 L18 58 M20 40 L10 40 M25 28 L18 22" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'signaling-gprotein',
    name: 'G-Protein Complex',
    category: 'Signaling',
    tags: ['g protein', 'GPCR', 'signal transduction', 'GTP', 'trimeric', 'subunit'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="30" cy="36" rx="17" ry="15" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/> <circle cx="54" cy="28" r="14" fill="#ddd6fe" stroke="#6d28d9" stroke-width="2"/> <circle cx="50" cy="54" r="11" fill="#c4b5fd" stroke="#5b21b6" stroke-width="2"/> <circle cx="24" cy="28" r="5" fill="#a78bfa" stroke="#5b21b6" stroke-width="1.5"/> <path d="M40 64 C40 70 44 74 44 74" fill="none" stroke="#6d28d9" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'signaling-camp',
    name: 'Second Messenger (cAMP)',
    category: 'Signaling',
    tags: ['cAMP', 'second messenger', 'cyclic AMP', 'signal', 'nucleotide'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="46" r="16" fill="#cffafe" stroke="#0891b2" stroke-width="2"/> <path d="M28 56 C28 64 36 66 40 62 C44 66 52 64 52 56" fill="none" stroke="#0e7490" stroke-width="2.5" stroke-linecap="round"/> <circle cx="40" cy="60" r="5" fill="#a5f3fc" stroke="#0e7490" stroke-width="1.5"/> <line x1="40" y1="30" x2="40" y2="18" stroke="#0891b2" stroke-width="2" stroke-linecap="round"/> <polygon points="40,8 48,13 48,21 40,26 32,21 32,13" fill="#67e8f9" stroke="#0e7490" stroke-width="1.5"/> <circle cx="52" cy="42" r="3" fill="#a5f3fc" stroke="#0e7490" stroke-width="1"/> </svg>`,
  },
  {
    id: 'signaling-phosphate',
    name: 'Phosphate Group',
    category: 'Signaling',
    tags: ['phosphate', 'phosphorylation', 'PO4', 'oxygen', 'functional group'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="42" r="13" fill="#ffedd5" stroke="#ea580c" stroke-width="2.5"/> <line x1="40" y1="30" x2="40" y2="16" stroke="#c2410c" stroke-width="2" stroke-linecap="round"/> <line x1="29" y1="50" x2="18" y2="58" stroke="#c2410c" stroke-width="2" stroke-linecap="round"/> <line x1="51" y1="50" x2="62" y2="58" stroke="#c2410c" stroke-width="2" stroke-linecap="round"/> <circle cx="40" cy="12" r="7" fill="#fdba74" stroke="#c2410c" stroke-width="1.5"/> <circle cx="14" cy="62" r="7" fill="#fdba74" stroke="#c2410c" stroke-width="1.5"/> <circle cx="66" cy="62" r="7" fill="#fed7aa" stroke="#c2410c" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'signaling-ubiquitin',
    name: 'Ubiquitin Tag',
    category: 'Signaling',
    tags: ['ubiquitin', 'ubiquitination', 'protein degradation', 'proteasome', 'tag'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="28" cy="48" r="20" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/> <path d="M42 34 C46 30 50 28 52 26" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round"/> <circle cx="56" cy="22" r="9" fill="#fecaca" stroke="#b91c1c" stroke-width="1.5"/> <path d="M62 16 C64 13 65 12 66 11" fill="none" stroke="#b91c1c" stroke-width="1.5" stroke-linecap="round"/> <circle cx="68" cy="9" r="6" fill="#fca5a5" stroke="#991b1b" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'signaling-ion-channel',
    name: 'Ion Channel',
    category: 'Signaling',
    tags: ['ion channel', 'membrane pore', 'transport', 'ions', 'transmembrane'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="34" width="72" height="12" rx="2" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.5"/> <path d="M30 12 C24 20 24 30 30 40 C24 50 24 60 30 68 L50 68 C56 60 56 50 50 40 C56 30 56 20 50 12 Z" fill="#c7d2fe" stroke="#4338ca" stroke-width="2" stroke-linejoin="round"/> <ellipse cx="40" cy="40" rx="6" ry="26" fill="#eef2ff" stroke="#4f46e5" stroke-width="1.5"/> <circle cx="40" cy="20" r="3.5" fill="#818cf8" stroke="#3730a3" stroke-width="1"/> <circle cx="40" cy="40" r="3.5" fill="#818cf8" stroke="#3730a3" stroke-width="1"/> <circle cx="40" cy="60" r="3.5" fill="#818cf8" stroke="#3730a3" stroke-width="1"/> </svg>`,
  },
  {
    id: 'signaling-growth-factor',
    name: 'Growth Factor',
    category: 'Signaling',
    tags: ['growth factor', 'ligand', 'dimer', 'signaling molecule', 'peptide hormone'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="30" cy="34" rx="18" ry="14" fill="#ecfccb" stroke="#65a30d" stroke-width="2"/> <ellipse cx="50" cy="48" rx="18" ry="14" fill="#d9f99d" stroke="#4d7c0f" stroke-width="2"/> <path d="M22 20 C18 14 20 8 26 6" fill="none" stroke="#4d7c0f" stroke-width="2" stroke-linecap="round"/> <path d="M58 62 C62 68 60 74 54 76" fill="none" stroke="#365314" stroke-width="2" stroke-linecap="round"/> <circle cx="40" cy="41" r="5" fill="#bef264" stroke="#4d7c0f" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'signaling-antigen',
    name: 'Antigen',
    category: 'Signaling',
    tags: ['antigen', 'epitope', 'immune', 'foreign particle', 'marker'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M40 10 C54 8 66 18 68 32 C70 46 62 58 50 64 C38 70 22 66 14 54 C6 42 10 26 22 18 C28 14 34 11 40 10 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/> <polygon points="60,20 68,14 66,24" fill="#f87171" stroke="#b91c1c" stroke-width="1.5"/> <circle cx="24" cy="26" r="5" fill="#fde047" stroke="#a16207" stroke-width="1.5"/> <circle cx="50" cy="54" r="5" fill="#fde047" stroke="#a16207" stroke-width="1.5"/> <polygon points="20,58 12,64 16,54" fill="#f87171" stroke="#b91c1c" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'signaling-mhc',
    name: 'MHC Complex',
    category: 'Signaling',
    tags: ['MHC', 'antigen presentation', 'peptide', 'immune', 'membrane complex'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="6" y="58" width="68" height="10" rx="2" fill="#f3e8ff" stroke="#9333ea" stroke-width="1.5"/> <path d="M20 58 C20 44 24 34 24 34 M32 58 C32 46 30 38 30 34" fill="none" stroke="#7e22ce" stroke-width="2.5" stroke-linecap="round"/> <path d="M60 58 C60 44 56 34 56 34 M48 58 C48 46 50 38 50 34" fill="none" stroke="#7e22ce" stroke-width="2.5" stroke-linecap="round"/> <path d="M24 30 C24 22 32 18 40 18 C48 18 56 22 56 30 L56 34 L24 34 Z" fill="#e9d5ff" stroke="#7e22ce" stroke-width="2" stroke-linejoin="round"/> <rect x="30" y="20" width="20" height="7" rx="3.5" fill="#f0abfc" stroke="#a21caf" stroke-width="1.5"/> </svg>`,
  },

  // ── Organisms ────────────────────────────────────────────────────────────
  {
    id: 'organism-bacteria',
    name: 'Bacterium',
    category: 'Organisms',
    tags: ['bacteria', 'prokaryote', 'microorganism', 'pathogen', 'flagella', 'infection'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="22" ry="14" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
      <path d="M62 34 C70 26 74 20 72 14" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M62 40 C72 40 76 36 76 30" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M62 46 C70 54 74 60 72 66" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M18 36 C8 30 4 24 6 18" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M18 44 C8 50 4 56 6 62" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="34" cy="38" r="3" fill="#fde047" stroke="#a16207" stroke-width="1"/>
      <circle cx="46" cy="42" r="2" fill="#fde047" stroke="#a16207" stroke-width="1"/>
    </svg>`,
  },
  {
    id: 'organism-virus',
    name: 'Virus',
    category: 'Organisms',
    tags: ['virus', 'pathogen', 'infection', 'capsid', 'spike protein', 'viral'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="18" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <path d="M40 22 L40 14 M52 28 L58 22 M58 40 L66 40 M52 52 L58 58 M40 58 L40 66 M28 52 L22 58 M22 40 L14 40 M28 28 L22 22" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="40" cy="22" r="3" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
      <circle cx="58" cy="40" r="3" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
      <circle cx="40" cy="58" r="3" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
      <circle cx="22" cy="40" r="3" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
      <circle cx="40" cy="40" r="8" fill="#fecaca"/>
    </svg>`,
  },
  {
    id: 'organism-cell-outline',
    name: 'Generic Cell',
    category: 'Organisms',
    tags: ['cell', 'generic', 'outline', 'biology'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="32" fill="#f0fdf4" stroke="#22c55e" stroke-width="2.5"/>
      <circle cx="40" cy="40" r="10" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'organism-yeast',
    name: 'Yeast (Fungus)',
    category: 'Organisms',
    tags: ['yeast', 'fungus', 'budding', 'cell', 'microorganism'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="32" cy="46" rx="22" ry="19" fill="#fde68a" stroke="#b45309" stroke-width="2"/> <ellipse cx="60" cy="24" rx="12" ry="11" fill="#fef3c7" stroke="#d97706" stroke-width="2"/> <path d="M48 34 C50 30 52 28 54 26" fill="none" stroke="#b45309" stroke-width="3"/> <circle cx="32" cy="46" r="5" fill="#92400e"/> <circle cx="60" cy="24" r="3" fill="#92400e"/> <circle cx="20" cy="58" r="2" fill="none" stroke="#b45309" stroke-width="1"/> <circle cx="42" cy="58" r="2" fill="none" stroke="#b45309" stroke-width="1"/> </svg>`,
  },
  {
    id: 'organism-parasite',
    name: 'Parasite (Protozoan)',
    category: 'Organisms',
    tags: ['parasite', 'protozoan', 'flagella', 'pathogen', 'microorganism'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M20 40 C20 24 34 14 46 16 C58 18 64 30 60 42 C56 54 42 62 30 58 C22 55 20 48 20 40 Z" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/> <ellipse cx="38" cy="36" rx="10" ry="7" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1.5"/> <circle cx="38" cy="36" r="3" fill="#6d28d9"/> <path d="M60 40 C68 42 74 46 78 52" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/> <path d="M58 48 C64 54 68 60 70 68" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/> <path d="M24 52 C18 58 14 62 10 62" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'organism-mouse',
    name: 'Mouse',
    category: 'Organisms',
    tags: ['mouse', 'rodent', 'model organism', 'animal', 'mammal'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="42" cy="46" rx="26" ry="16" fill="#e5e7eb" stroke="#4b5563" stroke-width="2"/> <circle cx="18" cy="38" r="14" fill="#e5e7eb" stroke="#4b5563" stroke-width="2"/> <ellipse cx="10" cy="26" rx="6" ry="7" fill="#fecdd3" stroke="#be123c" stroke-width="1.5"/> <ellipse cx="22" cy="24" rx="6" ry="7" fill="#fecdd3" stroke="#be123c" stroke-width="1.5"/> <circle cx="12" cy="36" r="2" fill="#1f2937"/> <circle cx="6" cy="42" r="2" fill="#fb7185"/> <path d="M66 50 C76 46 78 34 72 26" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'organism-plant',
    name: 'Plant / Seedling',
    category: 'Organisms',
    tags: ['plant', 'seedling', 'sprout', 'botany', 'organism'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="40" cy="68" rx="30" ry="8" fill="#d6d3c4" stroke="#78716c" stroke-width="2"/> <path d="M40 68 L40 30" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/> <path d="M40 48 C28 44 20 34 22 22 C34 24 42 32 40 48 Z" fill="#bbf7d0" stroke="#15803d" stroke-width="2" stroke-linejoin="round"/> <path d="M40 42 C52 38 60 28 58 16 C46 18 38 26 40 42 Z" fill="#86efac" stroke="#15803d" stroke-width="2" stroke-linejoin="round"/> <path d="M40 30 C42 24 46 20 50 18" fill="none" stroke="#166534" stroke-width="1.5" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'organism-insect',
    name: 'Insect',
    category: 'Organisms',
    tags: ['insect', 'bug', 'arthropod', 'model organism', 'entomology'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="44" cy="46" rx="20" ry="14" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/> <circle cx="22" cy="36" r="10" fill="#fdba74" stroke="#c2410c" stroke-width="2"/> <circle cx="10" cy="24" r="6" fill="#fed7aa" stroke="#c2410c" stroke-width="1.5"/> <path d="M10 20 L4 10 M10 20 L16 10" fill="none" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/> <path d="M30 40 L14 34 M34 46 L14 46 M38 54 L20 62 M52 40 L66 30 M56 48 L72 46 M52 56 L64 66" fill="none" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/> <circle cx="10" cy="24" r="1.5" fill="#7c2d12"/> </svg>`,
  },

  // ── Organs ───────────────────────────────────────────────────────────────
  {
    id: 'organ-brain',
    name: 'Brain',
    category: 'Organs',
    tags: ['brain', 'cortex', 'neuroscience', 'cns', 'central nervous system', 'cognition'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 70 C26 70 14 60 12 48 C10 38 14 30 20 26 C16 20 20 12 28 12 C30 8 36 6 40 6 C44 6 50 8 52 12 C60 12 64 20 60 26 C66 30 70 38 68 48 C66 60 54 70 40 70 Z" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
      <path d="M40 12 C40 20 36 24 40 32 C44 40 40 44 40 52" fill="none" stroke="#be185d" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M26 30 C32 32 36 36 34 42" fill="none" stroke="#be185d" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M54 30 C48 32 44 36 46 42" fill="none" stroke="#be185d" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M22 50 C28 48 34 52 36 56" fill="none" stroke="#be185d" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M58 50 C52 48 46 52 44 56" fill="none" stroke="#be185d" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'organ-heart',
    name: 'Heart',
    category: 'Organs',
    tags: ['heart', 'cardiac', 'cardiology', 'cardiovascular', 'pump', 'blood'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 70 C40 70 10 52 10 32 C10 20 20 12 30 12 C34 12 38 14 40 18 C42 14 46 12 50 12 C60 12 70 20 70 32 C70 52 40 70 40 70 Z" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5"/>
      <path d="M40 60 C40 60 20 48 18 34" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M40 60 C40 60 60 48 62 34" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'organ-liver',
    name: 'Liver',
    category: 'Organs',
    tags: ['liver', 'hepatic', 'hepatocyte', 'metabolism', 'detoxification'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 40 C10 24 22 10 38 10 C50 10 64 16 68 28 C72 40 68 60 56 66 C44 72 28 68 20 60 C14 54 12 48 12 40 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <path d="M24 30 C32 24 44 22 52 28" fill="none" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M18 44 C24 40 36 38 46 42 C56 46 62 50 60 58" fill="none" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'organ-lung',
    name: 'Lung',
    category: 'Organs',
    tags: ['lung', 'pulmonary', 'respiratory', 'alveoli', 'breathing', 'bronchi'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 12 L36 28 C36 28 20 30 16 40 C12 50 16 64 26 68 C34 72 40 66 40 58 C40 66 46 72 54 68 C64 64 68 50 64 40 C60 30 44 28 44 28 L44 12 Z" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
      <path d="M36 12 L44 12" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M36 28 C30 32 22 36 20 44" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M44 28 C50 32 58 36 60 44" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'organ-kidney',
    name: 'Kidney',
    category: 'Organs',
    tags: ['kidney', 'renal', 'organ', 'urinary', 'nephron'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M50 10 C64 10 72 22 72 40 C72 58 64 70 50 70 C36 70 26 64 24 55 Q34 40 24 25 C26 16 36 10 50 10 Z" fill="#fca5a5" stroke="#b91c1c" stroke-width="2"/> <path d="M48 20 C58 20 64 28 64 40 C64 52 58 60 48 60 C40 60 34 56 32 50 Q38 40 32 30 C34 24 40 20 48 20 Z" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/> <path d="M26 40 C20 46 18 56 20 68" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round"/> <circle cx="27" cy="38" r="3" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/> </svg>`,
  },
  {
    id: 'organ-pancreas',
    name: 'Pancreas',
    category: 'Organs',
    tags: ['pancreas', 'organ', 'digestive', 'endocrine', 'gland'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M10 42 C10 34 18 30 26 32 C36 34 46 26 58 24 C66 23 70 30 66 36 C60 42 48 46 34 48 C22 50 10 50 10 42 Z" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/> <path d="M16 40 C30 38 44 34 60 28" fill="none" stroke="#9a3412" stroke-width="1.5" stroke-linecap="round"/> <circle cx="24" cy="40" r="3.5" fill="#fdba74" stroke="#c2410c" stroke-width="1"/> <circle cx="38" cy="36" r="3" fill="#fdba74" stroke="#c2410c" stroke-width="1"/> <circle cx="52" cy="30" r="3" fill="#fdba74" stroke="#c2410c" stroke-width="1"/> </svg>`,
  },
  {
    id: 'organ-stomach',
    name: 'Stomach',
    category: 'Organs',
    tags: ['stomach', 'organ', 'digestive', 'gastric', 'gut'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M33 8 L33 20" fill="none" stroke="#be185d" stroke-width="6" stroke-linecap="round"/> <path d="M33 18 C22 20 16 30 16 42 C16 58 26 68 40 68 C54 68 64 60 64 48 C64 40 58 34 50 34 C54 26 46 18 33 18 Z" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/> <circle cx="58" cy="50" r="4" fill="#f9a8d4" stroke="#9d174d" stroke-width="1.5"/> <path d="M26 44 C32 40 38 40 44 44" fill="none" stroke="#9d174d" stroke-width="1.5" stroke-linecap="round"/> <path d="M26 52 C32 48 38 48 46 52" fill="none" stroke="#9d174d" stroke-width="1.5" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'organ-intestine',
    name: 'Intestine',
    category: 'Organs',
    tags: ['intestine', 'gut', 'coiled', 'digestive', 'bowel', 'organ'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M12 24 C20 12 36 12 40 24 C44 36 60 36 64 24" fill="none" stroke="#8b5cf6" stroke-width="9" stroke-linecap="round"/> <path d="M12 42 C20 30 36 30 40 42 C44 54 60 54 64 42" fill="none" stroke="#7c3aed" stroke-width="9" stroke-linecap="round"/> <path d="M14 60 C22 50 36 50 40 60 C44 68 54 68 60 60" fill="none" stroke="#6d28d9" stroke-width="8" stroke-linecap="round"/> <circle cx="12" cy="24" r="4.5" fill="#ddd6fe" stroke="#5b21b6" stroke-width="1.5"/> <circle cx="60" cy="60" r="4.5" fill="#ddd6fe" stroke="#5b21b6" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'organ-skin',
    name: 'Skin',
    category: 'Organs',
    tags: ['skin', 'epidermis', 'dermis', 'cross-section', 'layers', 'organ'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="16" width="60" height="14" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/> <rect x="10" y="30" width="60" height="20" fill="#fbbf24" stroke="#92400e" stroke-width="1.5"/> <rect x="10" y="50" width="60" height="16" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/> <path d="M40 16 C38 8 34 6 32 4" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/> <path d="M40 16 C42 26 40 40 42 50" fill="none" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/> <circle cx="56" cy="58" r="4" fill="#fef9c3" stroke="#d97706" stroke-width="1.5"/> <circle cx="22" cy="58" r="3" fill="#fef9c3" stroke="#d97706" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'organ-bone',
    name: 'Bone',
    category: 'Organs',
    tags: ['bone', 'skeleton', 'skeletal', 'femur', 'organ'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="14" y="34" width="52" height="12" rx="5" fill="#f5f5f4" stroke="#78716c" stroke-width="2"/> <circle cx="14" cy="28" r="9" fill="#fafaf9" stroke="#78716c" stroke-width="1.5"/> <circle cx="14" cy="52" r="9" fill="#fafaf9" stroke="#78716c" stroke-width="1.5"/> <circle cx="66" cy="28" r="9" fill="#fafaf9" stroke="#78716c" stroke-width="1.5"/> <circle cx="66" cy="52" r="9" fill="#fafaf9" stroke="#78716c" stroke-width="1.5"/> <line x1="24" y1="40" x2="56" y2="40" stroke="#a8a29e" stroke-width="1.5" stroke-dasharray="3,3"/> </svg>`,
  },
  {
    id: 'organ-muscle',
    name: 'Muscle Fiber',
    category: 'Organs',
    tags: ['muscle', 'fiber', 'tissue', 'myofiber', 'organ'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M8 40 C20 20 60 20 72 40 C60 60 20 60 8 40 Z" fill="#fecdd3" stroke="#e11d48" stroke-width="2"/> <path d="M16 32 C32 26 48 26 64 32" fill="none" stroke="#be123c" stroke-width="1.5" stroke-linecap="round"/> <path d="M13 40 C30 34 50 34 67 40" fill="none" stroke="#be123c" stroke-width="1.5" stroke-linecap="round"/> <path d="M16 48 C32 54 48 54 64 48" fill="none" stroke="#be123c" stroke-width="1.5" stroke-linecap="round"/> <ellipse cx="8" cy="40" rx="4" ry="11" fill="#fda4af" stroke="#9f1239" stroke-width="1.5"/> <ellipse cx="72" cy="40" rx="4" ry="11" fill="#fda4af" stroke="#9f1239" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'organ-spleen',
    name: 'Spleen',
    category: 'Organs',
    tags: ['spleen', 'organ', 'lymphatic', 'immune', 'abdomen'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="40" cy="40" rx="27" ry="21" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/> <ellipse cx="44" cy="40" rx="18" ry="13" fill="#f3e8ff" stroke="#7e22ce" stroke-width="1.5"/> <circle cx="30" cy="33" r="3" fill="#c084fc" stroke="#6b21a8" stroke-width="1"/> <circle cx="48" cy="29" r="2.5" fill="#c084fc" stroke="#6b21a8" stroke-width="1"/> <circle cx="37" cy="50" r="3" fill="#c084fc" stroke="#6b21a8" stroke-width="1"/> </svg>`,
  },
  {
    id: 'organ-eye',
    name: 'Eye',
    category: 'Organs',
    tags: ['eye', 'vision', 'iris', 'pupil', 'organ', 'sensory'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M6 40 C18 20 62 20 74 40 C62 60 18 60 6 40 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/> <circle cx="40" cy="40" r="14" fill="#86efac" stroke="#15803d" stroke-width="2"/> <circle cx="40" cy="40" r="6" fill="#0f172a" stroke="#020617" stroke-width="1"/> <circle cx="36" cy="36" r="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.5"/> <path d="M8 40 C20 26 60 26 72 40" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'organ-blood-vessel',
    name: 'Blood Vessel',
    category: 'Organs',
    tags: ['artery', 'blood-vessel', 'vein', 'circulatory', 'cross-section', 'organ'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="40" r="32" fill="#fecaca" stroke="#ef4444" stroke-width="2"/> <circle cx="40" cy="40" r="23" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/> <circle cx="40" cy="40" r="14" fill="#ffe4e6" stroke="#be123c" stroke-width="1.5"/> <circle cx="35" cy="38" r="3" fill="#f87171" stroke="#7f1d1d" stroke-width="1"/> <circle cx="44" cy="43" r="3" fill="#f87171" stroke="#7f1d1d" stroke-width="1"/> <circle cx="40" cy="34" r="2.5" fill="#f87171" stroke="#7f1d1d" stroke-width="1"/> </svg>`,
  },

  // ── Process / Flow ───────────────────────────────────────────────────────
  {
    id: 'process-apoptosis',
    name: 'Apoptosis',
    category: 'Processes',
    tags: ['apoptosis', 'cell death', 'programmed death', 'caspase', 'fragmentation'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="28" ry="24" fill="#fee2e2" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,3"/>
      <circle cx="26" cy="32" r="7" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/>
      <circle cx="54" cy="28" r="5" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/>
      <circle cx="50" cy="52" r="6" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/>
      <circle cx="30" cy="54" r="4" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/>
      <path d="M32 32 L48 28 M52 32 L50 46 M46 52 L34 54 M28 50 L26 38" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="2,2"/>
    </svg>`,
  },
  {
    id: 'process-mitosis',
    name: 'Cell Division / Mitosis',
    category: 'Processes',
    tags: ['mitosis', 'cell division', 'proliferation', 'chromosome', 'spindle'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="40" rx="16" ry="20" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
      <ellipse cx="58" cy="40" rx="16" ry="20" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
      <path d="M38 30 L42 30 M38 40 L42 40 M38 50 L42 50" stroke="#6b7280" stroke-width="1.5" stroke-dasharray="2,2"/>
      <ellipse cx="22" cy="40" rx="6" ry="8" fill="#93c5fd" stroke="#2563eb" stroke-width="1"/>
      <ellipse cx="58" cy="40" rx="6" ry="8" fill="#93c5fd" stroke="#2563eb" stroke-width="1"/>
    </svg>`,
  },
  {
    id: 'process-meiosis',
    name: 'Meiosis',
    category: 'Processes',
    tags: ['meiosis', 'chromosome pairing', 'homologous', 'gametes', 'cell division'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="22" cy="40" rx="17" ry="20" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/> <ellipse cx="58" cy="40" rx="17" ry="20" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/> <path d="M14 30 L30 50 M30 30 L14 50" fill="none" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"/> <path d="M50 30 L66 50 M66 30 L50 50" fill="none" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"/> <circle cx="22" cy="40" r="3" fill="#c4b5fd" stroke="#6d28d9" stroke-width="1.5"/> <circle cx="58" cy="40" r="3" fill="#c4b5fd" stroke="#6d28d9" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'process-autophagy',
    name: 'Autophagy',
    category: 'Processes',
    tags: ['autophagy', 'autophagosome', 'self-digestion', 'organelle recycling', 'lysosome'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="40" cy="40" rx="36" ry="30" fill="#ecfccb" stroke="#65a30d" stroke-width="2"/> <circle cx="40" cy="42" r="17" fill="none" stroke="#4d7c0f" stroke-width="2"/> <circle cx="40" cy="42" r="13" fill="#d9f99d" stroke="#365314" stroke-width="1.5"/> <ellipse cx="40" cy="42" rx="7" ry="5" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/> <circle cx="30" cy="24" r="2.5" fill="#fde047" stroke="#a16207" stroke-width="1"/> <circle cx="50" cy="20" r="2" fill="#fde047" stroke="#a16207" stroke-width="1"/> </svg>`,
  },
  {
    id: 'process-phagocytosis',
    name: 'Phagocytosis',
    category: 'Processes',
    tags: ['phagocytosis', 'engulfment', 'macrophage', 'immune cell', 'pathogen'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="36" cy="40" rx="28" ry="25" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/> <path d="M22 18 C 44 6 66 14 70 30" fill="none" stroke="#c2410c" stroke-width="4" stroke-linecap="round"/> <path d="M22 62 C 44 74 66 66 70 50" fill="none" stroke="#c2410c" stroke-width="4" stroke-linecap="round"/> <ellipse cx="58" cy="40" rx="8" ry="7" fill="#fecaca" stroke="#dc2626" stroke-width="2"/> <circle cx="55" cy="37" r="1.8" fill="#fca5a5" stroke="#b91c1c" stroke-width="1"/> <circle cx="61" cy="43" r="1.8" fill="#fca5a5" stroke="#b91c1c" stroke-width="1"/> </svg>`,
  },
  {
    id: 'process-inflammation',
    name: 'Inflammation',
    category: 'Processes',
    tags: ['inflammation', 'immune response', 'swelling', 'redness', 'leukocyte'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="40" cy="44" rx="32" ry="24" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/> <circle cx="26" cy="36" r="6" fill="#fca5a5" stroke="#991b1b" stroke-width="1.5"/> <circle cx="52" cy="48" r="5" fill="#fca5a5" stroke="#991b1b" stroke-width="1.5"/> <circle cx="40" cy="30" r="4" fill="#fca5a5" stroke="#991b1b" stroke-width="1.5"/> <path d="M28 12 L32 20 M40 8 L40 16 M52 12 L48 20" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'process-angiogenesis',
    name: 'Angiogenesis',
    category: 'Processes',
    tags: ['angiogenesis', 'blood vessel', 'vasculature', 'sprouting', 'capillary'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M4 42 C 18 36 26 48 40 42 C 54 36 62 48 76 42" fill="none" stroke="#dc2626" stroke-width="6" stroke-linecap="round"/> <path d="M28 42 C 32 28 38 20 46 12" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/> <path d="M50 42 C 54 56 60 62 68 68" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/> <circle cx="46" cy="12" r="4" fill="#fecaca" stroke="#991b1b" stroke-width="1.5"/> <circle cx="68" cy="68" r="4" fill="#fecaca" stroke="#991b1b" stroke-width="1.5"/> <circle cx="28" cy="42" r="3" fill="#fee2e2" stroke="#991b1b" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'process-metastasis',
    name: 'Metastasis',
    category: 'Processes',
    tags: ['metastasis', 'cancer', 'tumor spread', 'invasion', 'cell migration'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="24" cy="30" r="14" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/> <circle cx="34" cy="20" r="9" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/> <circle cx="16" cy="18" r="7" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/> <path d="M36 38 C 44 46 50 52 56 58" fill="none" stroke="#7e22ce" stroke-width="1.5" stroke-dasharray="3,3"/> <circle cx="60" cy="62" r="5" fill="#e9d5ff" stroke="#7e22ce" stroke-width="1.5"/> <circle cx="70" cy="70" r="7" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/> </svg>`,
  },
  {
    id: 'process-differentiation',
    name: 'Cell Differentiation',
    category: 'Processes',
    tags: ['differentiation', 'stem cell', 'specialization', 'development', 'cell fate'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="16" cy="40" r="11" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/> <path d="M26 34 C 38 22 48 16 58 13" fill="none" stroke="#6366f1" stroke-width="2"/> <path d="M27 40 C 42 40 52 40 60 40" fill="none" stroke="#6366f1" stroke-width="2"/> <path d="M26 46 C 38 58 48 64 58 67" fill="none" stroke="#6366f1" stroke-width="2"/> <circle cx="62" cy="12" r="7" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/> <circle cx="65" cy="40" r="7" fill="#fed7aa" stroke="#c2410c" stroke-width="1.5"/> <circle cx="62" cy="68" r="7" fill="#fecdd3" stroke="#e11d48" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'process-endocytosis',
    name: 'Endocytosis',
    category: 'Processes',
    tags: ['endocytosis', 'membrane invagination', 'vesicle', 'uptake', 'particle'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="42" cy="42" rx="34" ry="29" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/> <path d="M14 18 C 30 22 30 34 44 40 C 30 46 30 58 14 62" fill="none" stroke="#0369a1" stroke-width="3" stroke-linecap="round"/> <ellipse cx="34" cy="40" rx="6" ry="5" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/> <circle cx="54" cy="40" r="5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="2,2"/> <circle cx="18" cy="26" r="2" fill="#7dd3fc" stroke="#0369a1" stroke-width="1"/> <circle cx="18" cy="54" r="2" fill="#7dd3fc" stroke="#0369a1" stroke-width="1"/> </svg>`,
  },
  {
    id: 'process-dna-repair',
    name: 'DNA Repair',
    category: 'Processes',
    tags: ['dna repair', 'double helix', 'break repair', 'enzyme', 'genome'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M12 12 C 26 22 26 36 14 40 C 26 44 26 58 12 68" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/> <path d="M68 12 C 54 22 54 36 66 40 C 54 44 54 58 68 68" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/> <path d="M16 18 L64 18 M20 26 L60 26 M22 32 L58 32" fill="none" stroke="#94a3b8" stroke-width="1.5"/> <path d="M22 48 L58 48 M20 54 L60 54 M16 62 L64 62" fill="none" stroke="#94a3b8" stroke-width="1.5"/> <ellipse cx="40" cy="40" rx="11" ry="9" fill="#99f6e4" stroke="#0d9488" stroke-width="2"/> <circle cx="40" cy="40" r="4" fill="#5eead4" stroke="#0f766e" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'process-necrosis',
    name: 'Necrosis',
    category: 'Processes',
    tags: ['necrosis', 'cell death', 'rupture', 'membrane damage', 'tissue injury'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M40 8 C 54 10 66 20 68 34 L 78 40 L 66 44 C 68 56 58 68 44 70 C 30 72 16 64 12 50 L 4 46 L 14 42 C 10 30 18 16 32 10 Z" fill="#e7e5e4" stroke="#78350f" stroke-width="2.5" stroke-linejoin="round"/> <circle cx="78" cy="40" r="4" fill="#fca5a5" stroke="#dc2626" stroke-width="1.5"/> <circle cx="4" cy="46" r="3.5" fill="#fca5a5" stroke="#dc2626" stroke-width="1.5"/> <circle cx="66" cy="44" r="3" fill="#fca5a5" stroke="#dc2626" stroke-width="1.5"/> <path d="M40 38 L44 34 M46 40 L50 36" fill="none" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/> </svg>`,
  },

  // ── Lab Equipment ────────────────────────────────────────────────────────
  {
    id: 'labequip-microscope',
    name: 'Microscope',
    category: 'Lab Equipment',
    tags: ['microscope', 'optics', 'lens', 'lab', 'imaging'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="20" y="66" width="34" height="6" rx="2" fill="#e2e8f0" stroke="#475569" stroke-width="2"/> <path d="M30 66 C28 50 30 38 42 30" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/> <rect x="38" y="20" width="10" height="14" rx="2" fill="#cbd5e1" stroke="#334155" stroke-width="2"/> <circle cx="43" cy="16" r="6" fill="#94a3b8" stroke="#334155" stroke-width="2"/> <ellipse cx="30" cy="52" rx="10" ry="4" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/> <circle cx="30" cy="58" r="4" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'labequip-centrifuge',
    name: 'Centrifuge',
    category: 'Lab Equipment',
    tags: ['centrifuge', 'rotor', 'spin', 'lab', 'separation'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="12" y="46" width="56" height="24" rx="4" fill="#ede9fe" stroke="#6d28d9" stroke-width="2"/> <circle cx="40" cy="34" r="26" fill="#ddd6fe" stroke="#6d28d9" stroke-width="2"/> <circle cx="40" cy="34" r="15" fill="#c4b5fd" stroke="#5b21b6" stroke-width="1.5"/> <circle cx="40" cy="21" r="4" fill="#a78bfa" stroke="#5b21b6" stroke-width="1"/> <circle cx="52" cy="41" r="4" fill="#a78bfa" stroke="#5b21b6" stroke-width="1"/> <circle cx="28" cy="41" r="4" fill="#a78bfa" stroke="#5b21b6" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-pipette',
    name: 'Pipette',
    category: 'Lab Equipment',
    tags: ['pipette', 'liquid', 'transfer', 'lab', 'volume'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="30" y="8" width="16" height="14" rx="3" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/> <path d="M32 22 L48 22 L44 50 L36 50 Z" fill="#fdba74" stroke="#c2410c" stroke-width="2" stroke-linejoin="round"/> <rect x="37" y="50" width="6" height="14" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/> <path d="M38 64 L42 64 L40 74 Z" fill="#fed7aa" stroke="#9a3412" stroke-width="1.5" stroke-linejoin="round"/> <circle cx="38" cy="14" r="2" fill="#9a3412" stroke="#7c2d12" stroke-width="0.5"/> </svg>`,
  },
  {
    id: 'labequip-petri-dish',
    name: 'Petri Dish',
    category: 'Lab Equipment',
    tags: ['petri dish', 'culture', 'agar', 'colony', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="40" cy="30" rx="30" ry="10" fill="#d1fae5" stroke="#059669" stroke-width="2"/> <ellipse cx="40" cy="46" rx="32" ry="12" fill="#a7f3d0" stroke="#047857" stroke-width="2"/> <ellipse cx="40" cy="45" rx="26" ry="9" fill="#6ee7b7" stroke="#047857" stroke-width="1.5"/> <circle cx="32" cy="44" r="3" fill="#34d399" stroke="#065f46" stroke-width="1"/> <circle cx="46" cy="48" r="2.5" fill="#34d399" stroke="#065f46" stroke-width="1"/> <circle cx="40" cy="41" r="2" fill="#34d399" stroke="#065f46" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-test-tube',
    name: 'Test Tube',
    category: 'Lab Equipment',
    tags: ['test tube', 'sample', 'glassware', 'liquid', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M32 10 L48 10 L48 54 C48 64 32 64 32 54 Z" fill="#fce7f3" stroke="#be185d" stroke-width="2"/> <path d="M32 40 L48 40 L48 54 C48 64 32 64 32 54 Z" fill="#f9a8d4" stroke="#be185d" stroke-width="2"/> <rect x="30" y="8" width="20" height="5" rx="2" fill="#fbcfe8" stroke="#9d174d" stroke-width="1.5"/> <circle cx="37" cy="46" r="2" fill="#fbcfe8" stroke="#9d174d" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-erlenmeyer-flask',
    name: 'Erlenmeyer Flask',
    category: 'Lab Equipment',
    tags: ['flask', 'erlenmeyer', 'glassware', 'chemistry', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M34 10 L46 10 L46 30 L60 66 C62 70 58 74 52 74 L28 74 C22 74 18 70 20 66 L34 30 Z" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round"/> <path d="M24 58 L56 58 L60 66 C62 70 58 74 52 74 L28 74 C22 74 18 70 20 66 Z" fill="#93c5fd" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round"/> <rect x="33" y="8" width="14" height="5" rx="1.5" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/> <circle cx="40" cy="66" r="2.5" fill="#60a5fa" stroke="#1e40af" stroke-width="1"/> <circle cx="32" cy="68" r="1.8" fill="#60a5fa" stroke="#1e40af" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-syringe',
    name: 'Syringe',
    category: 'Lab Equipment',
    tags: ['syringe', 'needle', 'injection', 'lab', 'liquid'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="20" y="34" width="38" height="16" rx="2" fill="#cffafe" stroke="#0e7490" stroke-width="2"/> <rect x="24" y="37" width="18" height="10" fill="#67e8f9" stroke="#0e7490" stroke-width="1"/> <rect x="6" y="38" width="14" height="8" rx="2" fill="#a5f3fc" stroke="#155e75" stroke-width="1.5"/> <path d="M58 40 L74 42 L58 44 Z" fill="#0e7490" stroke="#164e63" stroke-width="1"/> <line x1="10" y1="42" x2="10" y2="30" stroke="#0e7490" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },
  {
    id: 'labequip-pcr-thermocycler',
    name: 'PCR Thermocycler',
    category: 'Lab Equipment',
    tags: ['pcr', 'thermocycler', 'dna', 'amplification', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="30" width="60" height="38" rx="4" fill="#f1f5f9" stroke="#334155" stroke-width="2"/> <rect x="16" y="16" width="48" height="18" rx="3" fill="#fecaca" stroke="#b91c1c" stroke-width="2"/> <circle cx="24" cy="25" r="3" fill="#fca5a5" stroke="#991b1b" stroke-width="1"/> <circle cx="34" cy="25" r="3" fill="#fca5a5" stroke="#991b1b" stroke-width="1"/> <circle cx="44" cy="25" r="3" fill="#fca5a5" stroke="#991b1b" stroke-width="1"/> <circle cx="54" cy="25" r="3" fill="#fca5a5" stroke="#991b1b" stroke-width="1"/> <rect x="18" y="42" width="20" height="14" rx="2" fill="#f1f5f9" stroke="#475569" stroke-width="1.5"/> <circle cx="54" cy="49" r="7" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/> </svg>`,
  },
  {
    id: 'labequip-gel-electrophoresis',
    name: 'Gel Electrophoresis',
    category: 'Lab Equipment',
    tags: ['gel', 'electrophoresis', 'dna', 'bands', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="8" y="20" width="64" height="40" rx="4" fill="#ccfbf1" stroke="#0f766e" stroke-width="2"/> <rect x="18" y="26" width="44" height="28" rx="2" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/> <rect x="22" y="28" width="6" height="4" fill="#134e4a" stroke="#042f2e" stroke-width="1"/> <rect x="37" y="28" width="6" height="4" fill="#134e4a" stroke="#042f2e" stroke-width="1"/> <rect x="52" y="28" width="6" height="4" fill="#134e4a" stroke="#042f2e" stroke-width="1"/> <rect x="22" y="38" width="6" height="2.5" fill="#facc15" stroke="#a16207" stroke-width="1"/> <rect x="37" y="44" width="6" height="2.5" fill="#fde047" stroke="#a16207" stroke-width="1"/> <rect x="52" y="34" width="6" height="2.5" fill="#facc15" stroke="#a16207" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-microplate',
    name: 'Microplate',
    category: 'Lab Equipment',
    tags: ['microplate', '96-well', 'plate', 'assay', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="8" y="16" width="64" height="48" rx="4" fill="#e0f2fe" stroke="#0369a1" stroke-width="2"/> <circle cx="20" cy="28" r="4" fill="#bae6fd" stroke="#0369a1" stroke-width="1"/> <circle cx="34" cy="28" r="4" fill="#bae6fd" stroke="#0369a1" stroke-width="1"/> <circle cx="48" cy="28" r="4" fill="#bae6fd" stroke="#0369a1" stroke-width="1"/> <circle cx="62" cy="28" r="4" fill="#bae6fd" stroke="#0369a1" stroke-width="1"/> <circle cx="20" cy="42" r="4" fill="#7dd3fc" stroke="#0369a1" stroke-width="1"/> <circle cx="34" cy="42" r="4" fill="#7dd3fc" stroke="#0369a1" stroke-width="1"/> <circle cx="48" cy="42" r="4" fill="#7dd3fc" stroke="#0369a1" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-cryo-box',
    name: 'Cryo Box',
    category: 'Lab Equipment',
    tags: ['freezer', 'cryo', 'storage', 'vials', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="18" width="60" height="46" rx="4" fill="#e0e7ff" stroke="#3730a3" stroke-width="2"/> <rect x="10" y="18" width="60" height="10" rx="4" fill="#c7d2fe" stroke="#3730a3" stroke-width="2"/> <line x1="30" y1="28" x2="30" y2="64" stroke="#4338ca" stroke-width="1.5"/> <line x1="50" y1="28" x2="50" y2="64" stroke="#4338ca" stroke-width="1.5"/> <line x1="10" y1="46" x2="70" y2="46" stroke="#4338ca" stroke-width="1.5"/> <circle cx="20" cy="37" r="3" fill="#a5b4fc" stroke="#3730a3" stroke-width="1"/> <circle cx="40" cy="55" r="3" fill="#a5b4fc" stroke="#3730a3" stroke-width="1"/> </svg>`,
  },
  {
    id: 'labequip-incubator',
    name: 'Incubator',
    category: 'Lab Equipment',
    tags: ['incubator', 'culture', 'temperature', 'cabinet', 'lab'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="14" y="10" width="52" height="60" rx="4" fill="#fef3c7" stroke="#92400e" stroke-width="2"/> <rect x="20" y="16" width="40" height="34" rx="2" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/> <line x1="20" y1="33" x2="60" y2="33" stroke="#b45309" stroke-width="1"/> <circle cx="52" cy="58" r="5" fill="#fbbf24" stroke="#92400e" stroke-width="1.5"/> <rect x="20" y="56" width="16" height="6" rx="1.5" fill="#fde68a" stroke="#92400e" stroke-width="1"/> </svg>`,
  },

  // ── Pharmacology ─────────────────────────────────────────────────────────
  {
    id: 'pharma-pill',
    name: 'Pill / Tablet',
    category: 'Pharmacology',
    tags: ['pill', 'tablet', 'medication', 'drug', 'dose'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="40" r="26" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/> <line x1="40" y1="15" x2="40" y2="65" stroke="#1d4ed8" stroke-width="2"/> <path d="M24 24 C21 30 21 34 23 39" fill="none" stroke="#93c5fd" stroke-width="3" stroke-linecap="round"/> <ellipse cx="30" cy="27" rx="6" ry="3" fill="#eff6ff"/> </svg>`,
  },
  {
    id: 'pharma-capsule',
    name: 'Capsule',
    category: 'Pharmacology',
    tags: ['capsule', 'medication', 'pill', 'drug', 'granules'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M40 26 L21 26 A12 12 0 0 0 21 54 L40 54 Z" fill="#fda4af" stroke="#e11d48" stroke-width="2"/> <path d="M40 26 L59 26 A12 12 0 0 1 59 54 L40 54 Z" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/> <circle cx="47" cy="34" r="2.2" fill="#f59e0b" stroke="#b45309" stroke-width="1"/> <circle cx="53" cy="41" r="2.2" fill="#f59e0b" stroke="#b45309" stroke-width="1"/> <circle cx="46" cy="47" r="2.2" fill="#f59e0b" stroke="#b45309" stroke-width="1"/> </svg>`,
  },
  {
    id: 'pharma-iv-drip',
    name: 'IV Drip / Infusion Bag',
    category: 'Pharmacology',
    tags: ['iv', 'infusion', 'drip', 'bag', 'intravenous', 'hospital'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <path d="M34 12 Q40 4 46 12" fill="none" stroke="#0e7490" stroke-width="2.5" stroke-linecap="round"/> <rect x="22" y="12" width="36" height="34" rx="6" fill="#cffafe" stroke="#0e7490" stroke-width="2.5"/> <line x1="24" y1="28" x2="56" y2="28" stroke="#67e8f9" stroke-width="2"/> <line x1="40" y1="46" x2="40" y2="58" stroke="#0e7490" stroke-width="2.5"/> <ellipse cx="40" cy="61" rx="6" ry="8" fill="#ecfeff" stroke="#0e7490" stroke-width="2"/> <line x1="40" y1="69" x2="40" y2="75" stroke="#0e7490" stroke-width="2.5"/> <circle cx="40" cy="60" r="2.3" fill="#22d3ee"/> </svg>`,
  },
  {
    id: 'pharma-inhaler',
    name: 'Inhaler',
    category: 'Pharmacology',
    tags: ['inhaler', 'asthma', 'respiratory', 'spray', 'medication'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"> <rect x="28" y="14" width="22" height="34" rx="6" fill="#ede9fe" stroke="#7c3aed" stroke-width="2.5"/> <rect x="33" y="7" width="12" height="8" rx="2" fill="#ddd6fe" stroke="#6d28d9" stroke-width="2"/> <rect x="26" y="48" width="26" height="16" rx="5" fill="#c4b5fd" stroke="#6d28d9" stroke-width="2"/> <path d="M54 54 Q62 52 67 47" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/> <path d="M54 60 Q63 61 69 57" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/> </svg>`,
  },

  // ── Shapes ───────────────────────────────────────────────────────────────
  // Rectangle outline
  { id: 'shape-rect', name: 'Rectangle', category: 'Shapes', tags: ['rectangle', 'box', 'outline', 'shape', 'background'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="72" height="72" fill="none" stroke="#374151" stroke-width="3"/></svg>` },

  // Rounded rectangle
  { id: 'shape-rect-rounded', name: 'Rounded Rectangle', category: 'Shapes', tags: ['rectangle', 'rounded', 'box', 'shape', 'background'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="72" height="72" rx="12" fill="none" stroke="#374151" stroke-width="3"/></svg>` },

  // Circle
  { id: 'shape-circle', name: 'Circle', category: 'Shapes', tags: ['circle', 'ellipse', 'round', 'shape', 'background'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="40" rx="36" ry="36" fill="none" stroke="#374151" stroke-width="3"/></svg>` },

  // Triangle
  { id: 'shape-triangle', name: 'Triangle', category: 'Shapes', tags: ['triangle', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,4 76,76 4,76" fill="none" stroke="#374151" stroke-width="3" stroke-linejoin="round"/></svg>` },

  // Diamond
  { id: 'shape-diamond', name: 'Diamond', category: 'Shapes', tags: ['diamond', 'rhombus', 'shape', 'decision'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#374151" stroke-width="3" stroke-linejoin="round"/></svg>` },

  // Hexagon
  { id: 'shape-hexagon', name: 'Hexagon', category: 'Shapes', tags: ['hexagon', 'hex', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="none" stroke="#374151" stroke-width="3" stroke-linejoin="round"/></svg>` },

  // Arrow right
  { id: 'shape-arrow-right', name: 'Arrow', category: 'Shapes', tags: ['arrow', 'direction', 'flow', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M4 30 L52 30 L52 18 L76 40 L52 62 L52 50 L4 50 Z" fill="#374151" stroke="none"/></svg>` },

  // Cylinder (database)
  { id: 'shape-cylinder', name: 'Cylinder', category: 'Shapes', tags: ['cylinder', 'database', 'storage', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="16" rx="30" ry="10" fill="none" stroke="#374151" stroke-width="2.5"/><line x1="10" y1="16" x2="10" y2="64" stroke="#374151" stroke-width="2.5"/><line x1="70" y1="16" x2="70" y2="64" stroke="#374151" stroke-width="2.5"/><path d="M10 64 Q40 78 70 64" fill="none" stroke="#374151" stroke-width="2.5"/></svg>` },

  // Cloud
  { id: 'shape-cloud', name: 'Cloud', category: 'Shapes', tags: ['cloud', 'network', 'internet', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M62 54 C68 54 74 48 74 41 C74 34 68 28 61 28 C60 21 54 16 46 16 C38 16 31 22 30 30 C24 31 18 37 18 44 C18 51 24 56 31 56 Z" fill="none" stroke="#374151" stroke-width="2.5" stroke-linejoin="round"/></svg>` },

  // Bracket / Group box
  { id: 'shape-bracket', name: 'Bracket', category: 'Shapes', tags: ['bracket', 'group', 'frame', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M20 8 L8 8 L8 72 L20 72" fill="none" stroke="#374151" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 8 L72 8 L72 72 L60 72" fill="none" stroke="#374151" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },

  // Blocked / knockout X — extremely common in biology figures to mark
  // inhibition, gene knockout, or absence of a component
  { id: 'shape-x-mark', name: 'Blocked / Knockout X', category: 'Shapes', tags: ['x', 'blocked', 'knockout', 'inhibition', 'deletion', 'absent', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><line x1="16" y1="16" x2="64" y2="64" stroke="#374151" stroke-width="6" stroke-linecap="round"/><line x1="64" y1="16" x2="16" y2="64" stroke="#374151" stroke-width="6" stroke-linecap="round"/></svg>` },

  // Star — highlighting a key finding, e.g. in graphical abstracts
  { id: 'shape-star', name: 'Star', category: 'Shapes', tags: ['star', 'highlight', 'key finding', 'new', 'shape'], source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,4 48.8,28 76,28 54.4,45.6 63.2,72.8 40,56 16.8,72.8 25.6,45.6 4,28 31.2,28" fill="none" stroke="#374151" stroke-width="3" stroke-linejoin="round"/></svg>` },
  {
    id: 'shape-arrow-bidirectional',
    name: 'Bidirectional Arrow',
    category: 'Shapes',
    tags: ['arrow', 'bidirectional', 'double-headed', 'exchange', 'equilibrium', 'shape'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M28 30 L52 30 L52 18 L76 40 L52 62 L52 50 L28 50 L28 62 L4 40 L28 18 Z" fill="#374151" stroke="none"/></svg>`,
  },
  {
    id: 'shape-box-dashed',
    name: 'Dashed Box',
    category: 'Shapes',
    tags: ['dashed', 'box', 'rectangle', 'optional', 'hypothetical', 'shape'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="68" height="68" fill="none" stroke="#374151" stroke-width="3" stroke-dasharray="10 7" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'shape-plus',
    name: 'Plus / Cross',
    category: 'Shapes',
    tags: ['plus', 'cross', 'add', 'combination', 'positive', 'shape'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="10" x2="40" y2="70" stroke="#374151" stroke-width="6" stroke-linecap="round"/><line x1="10" y1="40" x2="70" y2="40" stroke="#374151" stroke-width="6" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'shape-question-mark',
    name: 'Question Mark',
    category: 'Shapes',
    tags: ['question', 'unknown', 'hypothetical', 'mechanism', 'uncertain', 'shape'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M22 26 C22 12 32 4 42 4 C54 4 62 13 62 24 C62 35 54 39 47 44 C41 48 39 51 39 58" fill="none" stroke="#374151" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="39" cy="72" r="6" fill="#374151" stroke="none"/></svg>`,
  },
  {
    id: 'shape-pentagon',
    name: 'Pentagon',
    category: 'Shapes',
    tags: ['pentagon', 'five-sided', 'polygon', 'shape'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,4 74,29 61,69 19,69 6,29" fill="none" stroke="#374151" stroke-width="3" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'shape-chevron',
    name: 'Chevron',
    category: 'Shapes',
    tags: ['chevron', 'arrowhead', 'angle', 'bracket', 'direction', 'shape'],
    source: 'custom',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polyline points="24,10 62,40 24,70" fill="none" stroke="#374151" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
]

export function getAllIcons(): Icon[] {
  return ICONS
}

export function getCategories(): string[] {
  return [...new Set(ICONS.map((icon) => icon.category))]
}

export default ICONS
