# WEB Interactive Study System

An interactive Web Engineering study site for the IIUI course material. The app turns the chapter PDFs into a cleaner learning experience with readable notes, cheat sheets, examples, live demos, diagrams, and quizzes.

The current UI direction combines a **Vercel-like neutral dark/light palette**, **Nothing-inspired sharp geometry**, and a **Swiss/utilitarian information layout**. The goal is simple: make dense course content easier to scan, practice, and remember on both desktop and mobile.

Live deployment: [https://web001-swart.vercel.app/](https://web001-swart.vercel.app/)

---

## What It Covers

- **Chapter 11:** JavaScript objects, strings, dates, browser storage, traps, examples, and quiz practice.
- **Chapter 12:** Document Object Model, selectors, nodes, DOM mutation, style/class manipulation, and live DOM demos.
- **Chapter 13:** Browser events, propagation, delegation, forms, keyboard/mouse events, and event-flow demos.
- **Chapter 16:** Ajax, JSON, APIs, request lifecycle, async behavior, and data handling.
- **Bonus Module:** Security, deployment, containers, cloud hosting, architecture, REST, cheat sheets, practice lab, and quiz.

---

## Key Features

- **Readable chapter structure:** Consistent chapter headers, section headers, callouts, reference tables, and exercise cards.
- **Live demos:** Interactive components for DOM operations, event behavior, strings, forms, storage, Ajax, and related concepts.
- **Examples-first teaching:** Concepts are paired with code snippets, common mistakes, and practical "when to use this" notes.
- **Practice mode content:** Exercise cards and the Bonus Practice Lab give assignment-style prompts instead of passive reading only.
- **Responsive UI:** Layouts are tuned for desktop and mobile, with wide tables protected by horizontal scroll wrappers.
- **Theme support:** Dark and light modes use shared CSS tokens so content stays readable across the app.
- **Fast loading:** Chapters are lazy-loaded through React Suspense.

---

## Design System

The app uses a strict token-based visual system in `src/index.css`.

- **Dark mode:** Vercel-style true black and near-black neutrals.
- **Light mode:** Soft grey-white surfaces instead of harsh pure white.
- **Shape language:** Sharp, squared edges with small technical corner details.
- **Typography:** Dot-style hero titles, compact mono labels, and readable body text.
- **Color discipline:** Mostly neutral UI with limited red/green/yellow/blue semantic accents.
- **Information density:** Clean, teacher-friendly layouts that avoid clutter while still keeping reference material complete.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- Framer Motion
- Lucide React
- Vanilla CSS / CSS modules

---

## Project Structure

```text
WEB_ENG/
|-- src/
|   |-- components/
|   |   |-- layout/       # App shell, sidebar, topbar
|   |   |-- simulations/  # Interactive learning demos
|   |   `-- ui/           # Shared UI primitives
|   |-- lib/              # Store and utilities
|   |-- pages/            # Chapter modules
|   |-- App.tsx           # Main app routing shell
|   |-- index.css         # Global design tokens and layout system
|   `-- main.tsx          # React entry point
|-- public/
|-- Chapter 11.pdf
|-- Chapter 12.pdf
|-- Chapter 13.pdf
|-- Chapter 16.pdf
`-- package.json
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Current UI Notes

The visible XP/progress/level UI has been removed because it was not helping the course experience. The app now focuses on clear navigation, readable learning material, practical examples, and exercises.

Some legacy state-management code may still exist internally, but the user-facing experience is intentionally study-first rather than game-first.

---

## Next Improvements

- Convert the remaining inline demo diagrams into reusable theme-aware components.
- Normalize every table to shared table classes so light mode is fully consistent.
- Add a search/jump palette for concepts, methods, and examples.
- Add more guided practice tasks with revealable solutions.
- Add visual regression checks for desktop and mobile layouts.
