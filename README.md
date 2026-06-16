# WEB Interactive Study System

A comprehensive, gamified, and highly interactive learning platform built for the IIUI Web Engineering syllabus. This system transforms traditional textbook chapters into a self-contained web experience featuring real-time code simulations, detailed method reference tables, and instant-feedback quizzes.

Designed with the brutalist, monochrome **Nothing Design Language** aesthetics.

**Live Deployment:** [https://web001-swart.vercel.app/](https://web001-swart.vercel.app/)

---

## Table of Contents

1. [Key Features](#key-features)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Gamification & State Management](#gamification--state-management)
7. [Design System](#design-system)

---

## Key Features

- **Interactive Simulations:** Native React components that demonstrate core concepts in real-time (e.g., live String Method consoles, visual DOM Tree surgeons, Event bubbling radars).
- **Comprehensive Reference Guides:** Every chapter acts as a dense, self-contained reference manual completely replacing the need for textbooks. Includes explicit warnings for common developer "traps".
- **Built-in Gamification:** A global Zustand store tracks user XP, Levels, and login streaks, automatically persisting progress to `localStorage`.
- **Chapter Summaries & Quizzes:** Auto-grading 5-question quizzes at the end of every chapter.
- **Lazy Loading:** Massive chapter components are split and lazily loaded via React Suspense to guarantee instant initial renders.

---

## System Architecture

The application follows a client-side Single Page Application (SPA) architecture with global state management for persistence.

```mermaid
graph TD
    %% Core Architecture Diagram
    User([User]) --> AppRouter
    
    subgraph Client Application [React + Vite SPA]
        AppRouter[App Layout & Routing Shell]
        
        subgraph State Management [Zustand Store]
            Store[(Local Storage Sync)]
            Gamification[XP / Level / Streak State]
            ChapterState[Completion Tracking]
            
            Gamification --- Store
            ChapterState --- Store
        end
        
        subgraph Content Modules [Lazy Loaded Chapters]
            Ch11[Ch 11: JS Objects]
            Ch12[Ch 12: DOM]
            Ch13[Ch 13: Events]
            Ch16[Ch 16: Ajax/JSON]
            Bonus[Bonus: Security/DevOps]
            
            Simulations[[Interactive Simulations]]
            Quizzes[[Chapter Quizzes]]
            
            Ch11 --- Simulations
            Ch12 --- Simulations
            Ch13 --- Simulations
            Ch16 --- Simulations
            Bonus --- Simulations
            
            Ch11 --- Quizzes
            Ch12 --- Quizzes
        end
        
        AppRouter -->|Reads/Writes| State Management
        AppRouter -->|Renders| Content Modules
    end
```

---

## Tech Stack

- **Core:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Vanilla CSS / CSS Modules (Strict adherence to Nothing design principles)
- **State Management:** Zustand (with persist middleware)
- **Icons:** Lucide React
- **Animations:** Framer Motion (used for premium UI micro-interactions)

---

## Project Structure

```text
WEB_ENG/
├── src/
│   ├── components/
│   │   ├── layout/         # Sidebar, Topbar, App shell
│   │   ├── simulations/    # Interactive components (DOM Surgeon, Event Radar, etc.)
│   │   └── ui/             # Reusable primitives (Buttons, Cards, DotText)
│   ├── lib/
│   │   ├── store.ts        # Zustand gamification store
│   │   └── utils.ts        # Classname merging utilities
│   ├── pages/              # Lazy-loaded chapter content components
│   ├── App.tsx             # Main router and Suspense boundary
│   ├── index.css           # Global Nothing Design CSS tokens
│   └── main.tsx            # React root
├── public/                 # Static assets
└── package.json            # Dependencies
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd WEB_ENG
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

---

## Gamification & State Management

Progress is automatically saved directly in the user's browser via `localStorage` under the key `web-study-storage`. 

- **XP Generation:** Reading lessons, completing quizzes, and finishing interactive simulations awards XP.
- **Leveling Curve:** Every 100 XP grants a new Level.
- **Streak Tracking:** The application checks the system date on initialization to manage daily login streaks.
- **Resetting Progress:** Users can reset their state entirely from the bottom left corner of the Sidebar navigation.

---

## Design System

The application strictly enforces the **Nothing** brand aesthetics. All styling relies heavily on CSS variables defined in `index.css`:

- **Color Palette:** Strictly monochrome. Pure black backgrounds (`#000000`), deep grey surfaces (`#0a0a0a`), and stark white text. Accents are restricted to bright red (`#d71921`) for warnings or traps.
- **Typography:** 
  - `Doto` (Dot-Matrix) for massive headers and branding.
  - `Space Grotesk` for display titles.
  - `Inter` for highly readable body text.
  - `Monospace` (system defaults) for code and UI element labels.
- **Textures:** The application uses pure CSS pseudo-elements to overlay dot-grid patterns and CRT scanline effects seamlessly onto the background.