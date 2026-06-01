# Flowboard — Trello-like Kanban MVP

## 1. Concept & Vision

**Flowboard** is a minimal, fast Kanban board built for individuals and small teams who want clarity without complexity. The experience is centered on calm focus — muted tones, smooth motion, and zero clutter. It should feel like moving physical cards on a real board, not fighting software.

**Name**: Flowboard
**Tagline**: "Your work, moving forward."

---

## 2. Design Language

### Aesthetic Direction
Calm productivity — warm neutrals with a single accent color. Inspired by high-end stationery and a well-organized desk. Not corporate, not playful — just clean and intentional.

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#F5F3EE` | Page/app background (warm off-white) |
| Surface | `#FFFFFF` | Cards, modals, dropdowns |
| Border | `#E2DDD6` | Dividers, card borders, input borders |
| Text Primary | `#1A1814` | Headings, card titles |
| Text Secondary | `#7A7570` | Labels, metadata, placeholders |
| Accent | `#3D6FE8` | Primary actions, active states, links |
| Accent Hover | `#2D5FD4` | Button hover |
| Danger | `#D94F4F` | Delete actions |
| Success | `#3DA86A` | Saved, added confirmations |

### Board Background
`#E8E4DC` — slightly darker warm gray to give depth to lists.

### Typography
- **Font**: Inter (Google Fonts) — clean, highly legible, professional
- **Headings**: 600 weight
- **Body**: 400 weight
- **Scale**: 12px (labels), 14px (body), 16px (card title), 20px (list title), 24px (board title)

### Spatial System
- Base unit: 8px
- Card padding: 12px
- List padding: 12px
- List gap: 12px
- Board gap: 24px (between lists)
- Border radius: 8px (cards), 6px (inputs/buttons), 10px (modals)

### Motion Philosophy
- **Drag feedback**: Scale up 1.03 + box-shadow elevation when dragging
- **List/card entrance**: Opacity 0→1 + translateY(8px→0), 200ms ease-out, staggered 50ms
- **Add animation**: Slide down + fade in, 250ms
- **Delete**: Fade out 150ms
- **Hover**: Subtle shadow lift, 150ms ease
- No jarring snaps — everything eases

### Visual Assets
- Icons: Lucide React (consistent stroke weight, 20px default)
- No images needed for MVP
- Decorative: Subtle drop shadows, no gradients on backgrounds

---

## 3. Layout & Structure

### Page Structure
```
[Top Nav Bar]
  - Logo ("Flowboard")
  - Board title (editable)
  - Add list button (+)

[Board Canvas — horizontal scroll]
  [List 1] [List 2] [List 3] [+ Add List]
```

### Top Nav
- Height: 56px
- Left: Logo + board name
- Right: (empty for MVP, placeholder for future user menu)
- Border-bottom: 1px solid border color

### Board Canvas
- Full viewport height minus nav
- Horizontal scroll with smooth momentum
- Lists are fixed width: **280px** wide, variable height
- Gap between lists: 24px
- Padding: 24px around the canvas

### Responsive
- Desktop-first (MVP — mobile not in scope)
- Horizontal scroll on all screen sizes

---

## 4. Features & Interactions

### Boards
- One board per instance (MVP — no multi-board)
- Board title is editable inline (click to edit, blur or Enter to save)
- Board state persists in localStorage

### Lists
- Create: Click "+ Add List" → inline input appears → Enter to confirm, Escape to cancel
- Rename: Click list title → inline edit → save on blur/Enter
- Delete: Hover list → "..." menu → "Delete list" → confirmation inline ("Delete? Click again")
- Reorder: Drag by list header (future iteration — not MVP drag)
- Empty state: "No cards yet" with subtle placeholder text

### Cards
- Create: Click "+ Add card" at bottom of list → inline title input → Enter to confirm
- View/Edit: Click card → modal opens with title + description
- Delete: Inside modal → "Delete card" button at bottom
- Move between lists: Drag card from one list to another
- Reorder within list: Drag to reposition

### Card Modal
- Overlay with backdrop blur
- Title (editable inline)
- Description (textarea, placeholder: "Add a description...")
- Card ID shown at bottom (subtle)
- Close: click backdrop, Escape key, or X button

### Drag and Drop
- Drag handle: entire card (except buttons)
- Visual feedback: card lifts with shadow + slight scale
- Drop zones: highlight valid drop targets
- Smooth reordering animation

### Persistence
- All state stored in `localStorage` as JSON
- Key: `flowboard_state`
- Save on every mutation

---

## 5. Component Inventory

### `<TopNav>`
- Logo text "Flowboard" left-aligned, font-weight 600, accent color
- Board title right of logo, separated by thin divider

### `<BoardCanvas>`
- Horizontal flex container
- Renders list of `<ListColumn>` components

### `<ListColumn>`
- Header: list title + "+" add card button + "..." menu
- Body: scrollable card list
- Footer: "+ Add card" inline input area
- States: default, hover (shows delete option), editing title

### `<Card>`
- Title text (14px, primary color)
- Bottom metadata: card ID in secondary color, small
- States: default, hover (shadow lift), dragging (elevated + rotated 2deg)

### `<CardModal>`
- Backdrop: semi-transparent dark
- Modal: white, rounded, max-width 480px
- Title input (large, 18px, bold)
- Description textarea (grows with content)
- Delete button: bottom left, danger color

### `<InlineInput>`
- No visible border until focused
- On focus: bottom border appears (accent)
- Placeholder text in secondary color

### `<ConfirmDelete>`
- "Delete?" text appears inline next to delete trigger
- Second click confirms

---

## 6. Technical Approach

### Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom config (colors, fonts)
- **Drag & Drop**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **Icons**: `lucide-react`
- **State**: Zustand (lightweight, localStorage sync)
- **Fonts**: Google Fonts (Inter) via `next/font`

### Project Structure
```
flowboard/
├── app/
│   ├── layout.tsx          # Root layout with nav
│   ├── page.tsx            # Board page
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── TopNav.tsx
│   ├── BoardCanvas.tsx
│   ├── ListColumn.tsx
│   ├── CardComponent.tsx
│   ├── CardModal.tsx
│   ├── InlineInput.tsx
│   └── ConfirmDelete.tsx
├── store/
│   └── boardStore.ts       # Zustand store + localStorage
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Helpers
├── SPEC.md
└── package.json
```

### Data Model
```typescript
interface Card {
  id: string;          // nanoid
  title: string;
  description: string;
  createdAt: number;
}

interface List {
  id: string;          // nanoid
  title: string;
  cards: Card[];       // ordered array
}

interface Board {
  id: string;
  title: string;
  lists: List[];
}
```

### API Design
- No backend API for MVP — all client-side with localStorage
- Zustand store acts as single source of truth
- Persistence middleware auto-syncs to localStorage on every change

---

## Iteration Plan

| Iteration | Goal | Git Commit |
|-----------|------|------------|
| 1 | Project scaffold + SPEC | `feat: scaffold Next.js project` |
| 2 | Core store + types | `feat: add data model and Zustand store` |
| 3 | Basic UI shell (nav, board, lists) | `feat: build UI shell without drag-drop` |
| 4 | Add/delete lists and cards | `feat: implement list and card CRUD` |
| 5 | Card modal with edit | `feat: add card modal for view/edit` |
| 6 | Drag and drop | `feat: add drag-and-drop between lists` |
| 7 | Polish + animations | `feat: polish animations and edge cases` |

Each iteration is a separate, well-described git commit with clear messages.