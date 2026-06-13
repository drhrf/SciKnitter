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
]

export function getAllIcons(): Icon[] {
  return ICONS
}

export function getCategories(): string[] {
  return [...new Set(ICONS.map((icon) => icon.category))]
}

export default ICONS
