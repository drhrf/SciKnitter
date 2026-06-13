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
]
