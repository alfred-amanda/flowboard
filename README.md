# Flowboard

> Your work, moving forward.

A minimal, fast Kanban board for individuals and small teams who want clarity without complexity. Built as a Trello MVP.

## Features

- **Boards** — One board with an editable title. Everything persists in your browser.
- **Lists** — Create, rename, and delete lists. Drag lists to reorder them.
- **Cards** — Add cards to any list, edit titles and descriptions, drag between lists or reorder within a list.
- **Card Modal** — Click any card to open a full edit modal with title, description, and delete.
- **Drag & Drop** — Smooth card and list reordering using @dnd-kit.
- **Local Storage** — All state persists automatically in your browser.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| State | Zustand (with localStorage persistence) |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
flowboard/
├── app/
│   ├── layout.tsx       # Root layout with Inter font
│   ├── page.tsx          # Main board page with DnD context
│   └── globals.css       # Tailwind + custom CSS variables
├── components/
│   ├── TopNav.tsx        # Logo + editable board title
│   ├── BoardCanvas.tsx   # Horizontal scrolling board container
│   ├── ListColumn.tsx    # Individual list with cards + CRUD
│   ├── CardComponent.tsx # Draggable card with grip handle
│   └── CardModal.tsx     # Card view/edit modal
├── lib/
│   ├── types.ts          # TypeScript interfaces (Card, List, Board)
│   └── boardStore.ts    # Zustand store with all mutations
└── SPEC.md              # Full design + feature specification
```

## Design

- **Aesthetic**: Calm productivity — warm neutrals, no clutter
- **Background**: `#F5F3EE` (warm off-white)
- **Accent**: `#3D6FE8` (focus blue)
- **Cards lift** on hover and drag with subtle shadow and rotation

## License

MIT — use it however you want.