import type { DiagramExport } from '../types'

export interface Template {
  name: string
  description: string
  spec: DiagramExport
}

export const TEMPLATES: Template[] = [
  {
    name: 'Central Dogma',
    description: 'DNA → mRNA → Protein',
    spec: {
      title: 'Central Dogma of Molecular Biology',
      nodes: [
        { id: 'n1', iconId: 'molecule-dna', label: 'DNA', x: 60, y: 200 },
        { id: 'n2', iconId: 'molecule-mrna', label: 'mRNA', x: 280, y: 200 },
        { id: 'n3', iconId: 'organelle-ribosome', label: 'Ribosome', x: 500, y: 200 },
        { id: 'n4', iconId: 'molecule-protein', label: 'Protein', x: 720, y: 200 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'transcription', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'translation', style: 'arrow' },
      ],
    },
  },
  {
    name: 'Signal Transduction',
    description: 'Ligand → Receptor → Kinase → TF',
    spec: {
      title: 'Signal Transduction Cascade',
      nodes: [
        { id: 'n1', iconId: 'signaling-cytokine', label: 'Growth Factor', x: 200, y: 40 },
        { id: 'n2', iconId: 'signaling-receptor', label: 'Receptor', x: 200, y: 210 },
        { id: 'n3', iconId: 'signaling-kinase', label: 'Kinase', x: 200, y: 380 },
        { id: 'n4', iconId: 'signaling-transcription-factor', label: 'Transcription Factor', x: 200, y: 550 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'binds', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'activates', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'phosphorylates', style: 'arrow' },
      ],
    },
  },
  {
    name: 'Humoral Immunity',
    description: 'Virus → Antibody-mediated clearance',
    spec: {
      title: 'Humoral Immune Response',
      nodes: [
        { id: 'n1', iconId: 'organism-virus', label: 'Pathogen', x: 60, y: 210 },
        { id: 'n2', iconId: 'molecule-antibody', label: 'Antibody (IgG)', x: 310, y: 100 },
        { id: 'n3', iconId: 'molecule-antibody', label: 'Antibody (IgM)', x: 310, y: 320 },
        { id: 'n4', iconId: 'signaling-cytokine', label: 'Pro-inflammatory\nCytokines', x: 560, y: 210 },
      ],
      edges: [
        { id: 'e1', from: 'n2', to: 'n1', label: 'neutralises', style: 'blunt' },
        { id: 'e2', from: 'n3', to: 'n1', label: 'opsonises', style: 'blunt' },
        { id: 'e3', from: 'n1', to: 'n4', label: 'induces', style: 'dashed' },
      ],
    },
  },
  {
    name: 'Apoptosis',
    description: 'Intrinsic apoptosis pathway',
    spec: {
      title: 'Intrinsic Apoptosis Pathway',
      nodes: [
        { id: 'n1', iconId: 'molecule-small', label: 'Apoptotic Signal', x: 240, y: 40 },
        { id: 'n2', iconId: 'organelle-mitochondria', label: 'Mitochondria', x: 240, y: 220 },
        { id: 'n3', iconId: 'signaling-enzyme', label: 'Caspase-9', x: 60, y: 400 },
        { id: 'n4', iconId: 'signaling-enzyme', label: 'Caspase-3', x: 240, y: 400 },
        { id: 'n5', iconId: 'process-apoptosis', label: 'Apoptotic Cell', x: 420, y: 400 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'triggers', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'cytochrome c release', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'activates', style: 'arrow' },
        { id: 'e4', from: 'n4', to: 'n5', label: 'executes', style: 'arrow' },
      ],
    },
  },

  // ── Pathway ──────────────────────────────────────────────────────────────
  {
    name: 'Mitosis Overview',
    description: 'Interphase → mitosis → two daughter cells',
    spec: {
      title: 'Mitosis Overview',
      nodes: [
        { id: 'n1', iconId: 'organelle-nucleus', label: 'Interphase', x: 50, y: 200 },
        { id: 'n2', iconId: 'process-mitosis', label: 'Mitosis', x: 240, y: 200 },
        { id: 'n3', iconId: 'cell-generic', label: 'Daughter Cell 1', x: 430, y: 100 },
        { id: 'n4', iconId: 'cell-generic', label: 'Daughter Cell 2', x: 430, y: 300 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'DNA replication', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'cytokinesis', style: 'arrow' },
        { id: 'e3', from: 'n2', to: 'n4', label: 'cytokinesis', style: 'arrow' },
      ],
    },
  },
  {
    name: 'Innate Immune Response',
    description: 'Pathogen → phagocytosis → cytokine release → inflammation',
    spec: {
      title: 'Innate Immune Response',
      nodes: [
        { id: 'n1', iconId: 'organism-bacteria', label: 'Pathogen', x: 50, y: 200 },
        { id: 'n2', iconId: 'cell-generic', label: 'Macrophage', x: 240, y: 200 },
        { id: 'n3', iconId: 'signaling-cytokine', label: 'Cytokines', x: 430, y: 200 },
        { id: 'n4', iconId: 'organ-lung', label: 'Inflamed Tissue', x: 620, y: 200 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'phagocytosis', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'releases', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'recruits immune cells', style: 'arrow' },
      ],
    },
  },
  {
    name: 'RTK–MAPK Signaling',
    description: 'Growth factor → receptor → kinase cascade → gene expression',
    spec: {
      title: 'RTK–MAPK Signaling Cascade',
      nodes: [
        { id: 'n1', iconId: 'signaling-cytokine', label: 'Growth Factor (EGF)', x: 50, y: 50 },
        { id: 'n2', iconId: 'signaling-receptor', label: 'RTK', x: 50, y: 200 },
        { id: 'n3', iconId: 'signaling-kinase', label: 'RAS/RAF/MEK/ERK', x: 50, y: 350 },
        { id: 'n4', iconId: 'signaling-transcription-factor', label: 'Nuclear TF', x: 50, y: 500 },
        { id: 'n5', iconId: 'molecule-protein', label: 'Gene Expression', x: 50, y: 650 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'binds', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'activates', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'phosphorylates', style: 'arrow' },
        { id: 'e4', from: 'n4', to: 'n5', label: 'induces', style: 'arrow' },
      ],
    },
  },
  {
    name: 'Protein Secretory Pathway',
    description: 'Ribosome → ER/Golgi → secreted protein',
    spec: {
      title: 'Protein Secretory Pathway',
      nodes: [
        { id: 'n1', iconId: 'organelle-ribosome', label: 'Ribosome', x: 50, y: 200 },
        { id: 'n2', iconId: 'organelle-golgi', label: 'ER / Golgi', x: 240, y: 200 },
        { id: 'n3', iconId: 'molecule-protein', label: 'Secreted Protein', x: 430, y: 200 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'co-translational transport', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'processing & secretion', style: 'arrow' },
      ],
    },
  },
  {
    name: 'Viral Replication Cycle',
    description: 'Entry → uncoating → replication → assembly → release',
    spec: {
      title: 'Viral Replication Cycle',
      nodes: [
        { id: 'n1', iconId: 'organism-virus', label: 'Virus', x: 50, y: 200 },
        { id: 'n2', iconId: 'cell-generic', label: 'Host Cell Entry', x: 240, y: 200 },
        { id: 'n3', iconId: 'molecule-dna', label: 'Genome Replication', x: 430, y: 200 },
        { id: 'n4', iconId: 'molecule-protein', label: 'Viral Proteins', x: 620, y: 200 },
        { id: 'n5', iconId: 'organism-virus', label: 'New Virions', x: 810, y: 200 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'entry', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'uncoating', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'translation', style: 'arrow' },
        { id: 'e4', from: 'n4', to: 'n5', label: 'assembly', style: 'arrow' },
        { id: 'e5', from: 'n5', to: 'n1', label: 'release & spread', style: 'dashed' },
      ],
    },
  },
  {
    name: 'Multi-Organ Signaling',
    description: 'A circulating signal reaching several target organs',
    spec: {
      title: 'Multi-Organ Signaling Overview',
      nodes: [
        { id: 'n1', iconId: 'signaling-cytokine', label: 'Circulating Hormone', x: 50, y: 200 },
        { id: 'n2', iconId: 'organ-brain', label: 'Brain', x: 240, y: 50 },
        { id: 'n3', iconId: 'organ-heart', label: 'Heart', x: 240, y: 200 },
        { id: 'n4', iconId: 'organ-liver', label: 'Liver', x: 240, y: 350 },
        { id: 'n5', iconId: 'organ-lung', label: 'Lung', x: 240, y: 500 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', style: 'dashed' },
        { id: 'e2', from: 'n1', to: 'n3', style: 'dashed' },
        { id: 'e3', from: 'n1', to: 'n4', style: 'dashed' },
        { id: 'e4', from: 'n1', to: 'n5', style: 'dashed' },
      ],
    },
  },

  // ── Timeline ─────────────────────────────────────────────────────────────
  {
    name: 'Cell Cycle Timeline',
    description: 'G1 → S → G2 → M, repeating',
    spec: {
      title: 'Cell Cycle Timeline',
      nodes: [
        { id: 'n1', iconId: 'shape-circle', label: 'G1', x: 50, y: 300 },
        { id: 'n2', iconId: 'shape-circle', label: 'S', x: 240, y: 300 },
        { id: 'n3', iconId: 'shape-circle', label: 'G2', x: 430, y: 300 },
        { id: 'n4', iconId: 'shape-circle', label: 'M', x: 620, y: 300 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', style: 'arrow' },
        { id: 'e4', from: 'n4', to: 'n1', label: 'repeats', style: 'dashed' },
      ],
    },
  },
  {
    name: 'Preclinical Study Timeline',
    description: 'Baseline → treatment → assessment → endpoint',
    spec: {
      title: 'Preclinical Study Timeline',
      nodes: [
        { id: 'n1', iconId: 'shape-diamond', label: 'Baseline', x: 50, y: 300 },
        { id: 'n2', iconId: 'shape-diamond', label: 'Treatment Start', x: 240, y: 300 },
        { id: 'n3', iconId: 'shape-diamond', label: 'Mid-point Assessment', x: 430, y: 300 },
        { id: 'n4', iconId: 'shape-diamond', label: 'Endpoint', x: 620, y: 300 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'Day 0', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'Day 7', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'Day 14', style: 'arrow' },
      ],
    },
  },

  // ── Protocol / Flowchart ─────────────────────────────────────────────────
  {
    name: 'Cell Culture Protocol',
    description: 'Seed → incubate → passage → harvest',
    spec: {
      title: 'Cell Culture Protocol',
      nodes: [
        { id: 'n1', iconId: 'cell-generic', label: '1. Seed Cells', x: 240, y: 50 },
        { id: 'n2', iconId: 'shape-rect-rounded', label: '2. Incubate 37°C', x: 240, y: 200 },
        { id: 'n3', iconId: 'cell-generic', label: '3. Passage', x: 240, y: 350 },
        { id: 'n4', iconId: 'shape-circle', label: '4. Harvest', x: 240, y: 500 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', style: 'arrow' },
      ],
    },
  },
  {
    name: 'PCR Workflow',
    description: 'Template → amplification → gel → results',
    spec: {
      title: 'PCR Workflow',
      nodes: [
        { id: 'n1', iconId: 'molecule-dna', label: 'Template DNA', x: 50, y: 200 },
        { id: 'n2', iconId: 'shape-rect', label: 'Thermocycler', x: 240, y: 200 },
        { id: 'n3', iconId: 'shape-rect-rounded', label: 'Gel Electrophoresis', x: 430, y: 200 },
        { id: 'n4', iconId: 'shape-diamond', label: 'Bands Present?', x: 620, y: 200 },
        { id: 'n5', iconId: 'molecule-dna', label: 'Amplified DNA', x: 810, y: 50 },
        { id: 'n6', iconId: 'shape-x-mark', label: 'No Product', x: 810, y: 350 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'amplification', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'load samples', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', style: 'arrow' },
        { id: 'e4', from: 'n4', to: 'n5', label: 'yes', style: 'arrow' },
        { id: 'e5', from: 'n4', to: 'n6', label: 'no', style: 'blunt' },
      ],
    },
  },
  {
    name: 'Cell Fate Decision',
    description: 'DNA damage → repair or apoptosis',
    spec: {
      title: 'Cell Fate Decision Flowchart',
      nodes: [
        { id: 'n1', iconId: 'signaling-cytokine', label: 'Stress Signal', x: 240, y: 50 },
        { id: 'n2', iconId: 'shape-diamond', label: 'DNA Damage\nRepairable?', x: 240, y: 200 },
        { id: 'n3', iconId: 'cell-generic', label: 'Cell Survival', x: 50, y: 400 },
        { id: 'n4', iconId: 'process-apoptosis', label: 'Apoptosis', x: 430, y: 400 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'yes — repair', style: 'arrow' },
        { id: 'e3', from: 'n2', to: 'n4', label: 'no — irreparable', style: 'blunt' },
      ],
    },
  },

  // ── Graphical abstract ───────────────────────────────────────────────────
  {
    name: 'Graphical Abstract: Infection → Inflammation',
    description: 'Two-panel abstract with a highlighted key finding',
    spec: {
      title: 'Infection Drives Tissue Inflammation',
      nodes: [
        { nodeType: 'text', id: 'panel1', text: 'Infection', x: 10, y: 10, width: 380, height: 180, bgColor: '#eff6ff', borderColor: '#bfdbfe', fontSize: 12, fontWeight: 'bold', zIndex: -1 },
        { id: 'n1', iconId: 'organism-bacteria', label: 'Pathogen', x: 50, y: 50 },
        { id: 'n2', iconId: 'cell-generic', label: 'Host Cell', x: 240, y: 50 },
        { nodeType: 'text', id: 'panel2', text: 'Immune Response', x: 390, y: 10, width: 380, height: 180, bgColor: '#f0fdf4', borderColor: '#bbf7d0', fontSize: 12, fontWeight: 'bold', zIndex: -1 },
        { id: 'n3', iconId: 'signaling-cytokine', label: 'Cytokine Release', x: 430, y: 50 },
        { id: 'n4', iconId: 'cell-generic', label: 'Immune Cell', x: 620, y: 50 },
        { nodeType: 'text', id: 'callout1', text: '↑ Inflammation drives tissue damage', x: 10, y: 210, width: 760, height: 60, bgColor: '#fecaca', textAlign: 'center', fontWeight: 'bold', zIndex: 2 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'invades', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'triggers', style: 'arrow' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'recruits', style: 'arrow' },
      ],
    },
  },
  {
    name: 'Graphical Abstract: Drug Mechanism of Action',
    description: 'Two-panel abstract: target binding to cellular effect',
    spec: {
      title: 'Targeted Drug Mechanism of Action',
      nodes: [
        { nodeType: 'text', id: 'panel1', text: 'Drug Administration', x: 10, y: 10, width: 380, height: 180, bgColor: '#eff6ff', borderColor: '#bfdbfe', fontSize: 12, fontWeight: 'bold', zIndex: -1 },
        { id: 'n1', iconId: 'molecule-small', label: 'Drug', x: 50, y: 50 },
        { id: 'n2', iconId: 'signaling-receptor', label: 'Target Receptor', x: 240, y: 50 },
        { nodeType: 'text', id: 'panel2', text: 'Cellular Effect', x: 390, y: 10, width: 380, height: 180, bgColor: '#faf5ff', borderColor: '#e9d5ff', fontSize: 12, fontWeight: 'bold', zIndex: -1 },
        { id: 'n3', iconId: 'signaling-enzyme', label: 'Downstream Enzyme', x: 430, y: 50 },
        { id: 'n4', iconId: 'process-apoptosis', label: 'Cancer Cell Death', x: 620, y: 50 },
        { nodeType: 'text', id: 'callout1', text: 'Selective binding induces targeted cell death', x: 10, y: 210, width: 760, height: 60, bgColor: '#fecaca', textAlign: 'center', fontWeight: 'bold', zIndex: 2 },
      ],
      edges: [
        { id: 'e1', from: 'n1', to: 'n2', label: 'binds', style: 'arrow' },
        { id: 'e2', from: 'n2', to: 'n3', label: 'inhibits', style: 'blunt' },
        { id: 'e3', from: 'n3', to: 'n4', label: 'induces', style: 'arrow' },
      ],
    },
  },
]
