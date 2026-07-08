# 🧬 SciKnitter

> *A scientific diagram editor. Completely vibe coded. No ragrets.*

**[➜ Open the App](https://drhrf.github.io/SciKnitter/)**

---

## What is this?

SciKnitter is a browser-based drag-and-drop diagram editor for scientists who are tired of fighting with PowerPoint, paying for BioRender, or explaining to their PI why the pathway figure looks "a little rough."

You drag icons. You connect them with arrows. You export a beautiful SVG or PNG. You submit the paper. You win.

It was built entirely by telling an AI what to do and hoping for the best. Every single line of code was vibe coded using [Claude Code](https://claude.ai/code) in a series of increasingly ambitious requests that somehow all worked out. There was no plan. There was only vibes.

---

## Features

### 🎨 Three icon libraries

| Library | Icons | Source |
|---|---|---|
| **Built-in** | ~30 hand-crafted SVGs | Custom (cells, molecules, organelles, organs, signaling…) |
| **Servier Medical Art** | ~3,000 icons | [duerrsimon/bioicons](https://github.com/duerrsimon/bioicons) (CC BY 3.0) |
| **NIH Bioart** | 567 icons | [bioart.niaid.nih.gov](https://bioart.niaid.nih.gov) (Public Domain) |

Servier and NIH Bioart icons are fetched on-demand and cached locally for 48 hours. Your browser does the heavy lifting. The server does nothing. The server is not invited.

### 🖱️ Canvas editing
- **Drag and drop** icons from the library panel onto the canvas
- **Resize** any node by grabbing its corners
- **Rotate** icons with ±90° buttons or a numeric input
- **Connect** nodes with arrows — drag from any of the 4 edge handles
- **Pan** (H key) or **Select** (V key) modes
- **Snap to grid** for when you suddenly care about alignment
- **Bring to front / Send to back** layer ordering
- **Delete** with the Delete key, or the little red ✕ button, or the Properties panel

### ✍️ Text boxes
- Add floating text annotations anywhere on the canvas
- Control font size, bold, italic, alignment, color, background, border
- Double-click to edit inline

### 🔗 Edge styles
- **Arrow** — activation, positive regulation, flow
- **Blunt** ⊣ — inhibition, negative regulation
- **Dashed** — indirect relationship, unknown mechanism
- **Bidirectional** ↔ — for when causality is complicated

### 🤖 LLM Workflow
Describe your pathway in plain English. Copy the generated prompt (with all available icon IDs pre-loaded). Paste it into Claude, GPT-4, or whichever LLM your institution hasn't blocked yet. Paste the JSON back. Watch your diagram appear. Feel powerful.

### 📦 Export
- **SVG** — scalable, publication-ready, opens in Illustrator
- **PNG** — 2× resolution, ready for slides
- **JSON** — save and reload your diagram later

### 📋 Templates
Pre-built diagrams to get you started or to copy shamelessly.

---

## How to use it

1. Go to **[drhrf.github.io/SciKnitter](https://drhrf.github.io/SciKnitter/)**
2. Drag icons from the left panel onto the canvas
3. Drag from a node's edge handle to another node to connect them
4. Click a node or edge to edit it in the Properties panel on the right
5. Use **LLM Workflow** to generate entire diagrams from a text description
6. Click **Export SVG** or **Export PNG** when you're done
7. Cite appropriately (Servier = CC BY 3.0, NIH Bioart = Public Domain, built-ins = also fine)

---

## Run it locally

```bash
git clone https://github.com/drhrf/SciKnitter.git
cd SciKnitter
npm install
npm run dev
```

Requires Node 20+. That's it. No backend. No database. No environment variables. No Docker. Nothing to configure. It just works, which is frankly suspicious.

---

## Tech stack

| Thing | What it does |
|---|---|
| **React 18 + TypeScript** | The front end. The whole front end. There is no back end. |
| **Vite** | Builds and serves the app at ludicrous speed |
| **@xyflow/react** | The canvas, nodes, edges — the whole diagram engine |
| **Tailwind CSS** | Styling, via increasingly creative class names |
| **lucide-react** | UI icons (not the scientific ones — the little buttons) |
| **GitHub Actions** | Deploys to GitHub Pages on every push to `main` |
| **GitHub API** | Fetches the Servier icon index at runtime |
| **NIH Bioart API** | Fetches NIH illustrations at runtime |
| **localStorage** | Caches icon indexes so we don't hammer the APIs |
| **Canvas API** | PNG export via SVG → canvas → blob |
| **Claude Code** | Wrote literally everything else |

---

## How it was built

This entire application was written through a series of conversations with [Claude Code](https://claude.ai/code). The development process looked roughly like this:

1. "Build me a scientific diagram editor"
2. "Now add Servier icons"
3. "The icons are broken, fix them"
4. "Add text boxes"
5. "The GitHub Pages deployment returns 403"
6. "The Servier repo was deleted, find another one"
7. "Add rotation, transparency, PNG export, remove the title, add NIH Bioart, add layer ordering, fix the SVG export bug"
8. "The SVG export is still broken"
9. "The viewBox was hardcoded to 0 0 80 80 the whole time??"
10. "The NIH Bioart tab returns 404"
11. "Oh the vite-env.d.ts was missing this whole time"
12. *(writes README)*

At no point was there a design document. At no point was there a sprint. There was a vision, a chat window, and an unreasonable amount of trust in a language model.

The result is a fully functional scientific diagramming tool that has been tested in anger and mostly works. If something is broken, it was almost certainly introduced in step 7.

---

## Icon credits

- **Servier Medical Art** — © Servier, licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Served via [duerrsimon/bioicons](https://github.com/duerrsimon/bioicons).
- **NIH Bioart** — Created by NIAID Visual and Medical Arts, released as Public Domain. Served from [bioart.niaid.nih.gov](https://bioart.niaid.nih.gov).
- **Built-in icons** — Custom SVGs, free to use.

---

## Contributing

Found a bug? Open an issue. Want a feature? Open an issue. Want to submit a PR written by your own AI assistant? Extremely on-brand, go ahead.

---

*Built with Claude Code. Powered by vibes. Dedicated to every scientist who has ever spent three hours moving a protein diagram 2 pixels to the left in PowerPoint.*
