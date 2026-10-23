# Mindflare Arena — Web Application

The official web platform for **Mindflare** — the DSA and Competitive Programming Society. Built with **Next.js 15**, **React 19**, **Tailwind CSS**, and custom AMOLED-optimized visual components.

---

## Repository Structure

```text
.
├── app/                  # Next.js App Router
│   ├── animations/       # Step-by-step interactive algorithmic simulations
│   ├── api/              # Internal API endpoints (beginners hub, search, auth)
│   ├── contests/         # Live contest arena and standings
│   ├── learn/            # Video curriculums, beginners hub, and concept guides
│   ├── practice/         # Problem workspace, Monaco code runner, and company sheets
│   ├── profile/          # Member profiles and multi-platform CP stats
│   ├── roadmaps/         # CP & Software engineering roadmaps
│   └── topic-list/       # Master problem directory and platform filter vaults
│
├── components/           # UI Components
│   ├── animate-ui/       # Spring animations, tooltips, and custom icons
│   ├── animations/       # Canvas & DOM algorithmic simulation engines
│   ├── beginners/        # Beginners curriculum hub, POTD calendar & AI cards
│   ├── home/             # Landing page hero, tech marquee, bento & brand banner
│   ├── practice/         # Code editor, test-case runners & split panes
│   ├── smoothui/         # Buttons, badges, and smooth tactile controls
│   └── topic-list/       # Category accordions, tables & difficulty filters
│
├── content/              # Curated educational MDX curriculum
│   ├── dsa/              # Data structures & algorithms lessons
│   ├── java/             # Core Java & concurrency deep-dives
│   └── python/           # Python syntax, OOP, and pattern-matching
│
├── data/                 # Static datasets & problem banks
│   ├── beginners/        # DSA, System Design, AI, SQL tracks & 1100+ POTD archive
│   ├── companies/        # 428 company frequency sheets & question lists
│   └── topic-list/       # Categorized problem bank metadata
│
├── lib/                  # Application core & utilities
│   ├── beginners-data.ts # Type contracts for learning tracks
│   ├── beginners-server.ts# Cached server-side loaders for curriculum data
│   └── utils.ts          # Tailwind class mergers & formatting helpers
│
└── public/               # Static media assets, platform SVGs, and brand marks
```

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (`v1.2+` or `v1.4+`) or Node.js (`v20+`)

### Development

```bash
# 1. Install dependencies
bun install

# 2. Run local development server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Check types
bun run typecheck

# Build bundle
bun run build

# Start production server
bun run start
```
