# AGENTS.md - Coding Guidelines for SettleDaddy

## Build/Test/Lint Commands
- **Dev**: `npm run dev` (Next.js with Turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `npx tsc --noEmit`

## 🏗️ Architectural Mandates (SettleDaddy Core)

### 🚫 IMMUTABLE FILES & API STRATEGY
- **No internal APIs**: DO NOT introduce new HTTP API routes/endpoints (`src/app/api/*`, `route.ts`) for in-app flows. SettleDaddy keeps zero extra attack surface and no unnecessary latency.
- **Prefer Internal Methods**: Use existing in-process functions, Server Actions, and SDK helpers instead of exposing new API surfaces.
- **Data Consolidation**: When returning shaped payloads to hydrate multiple UI widgets, use Server Actions or consolidated internal service methods.

### 🛑 MANDATORY SOURCE CONTROL RESTRICTIONS
- **NO GIT COMMITS**: DO NOT run `git commit`, `git add`, `git stage`, `git push`, or `git merge`. You are strictly forbidden from altering the repository index or history.
- **ZERO STAGING**: Never stage changes. All modifications must remain in the working directory only.

### ⚡ Development Standards
- **Next.js & React**: Implement against Next.js 15+ and React 19+.
- **Tailwind CSS v4**: Use Tailwind CSS v4 for all styling. Follow the CSS-first configuration model.
- **OpenBricks 2.0 Design**: Follow the "Pitch-Dark Sanctuary" design system. No glassmorphism, no gradients on chrome, no light mode.
- **Global Unmount Policy**: Strictly use conditional rendering (`{isOpen && <Component />}`) for all overlays (drawers, modals, sidebars). Physically remove the component from the DOM when closed.
- **Layman-First Copy**: Prohibit technical jargon in all UI copy. Use simple, direct, layman-friendly English.
- **Terminology Mandate (STRICT)**: Use **"Table"** instead of "Collection" and **"Row"** instead of "Document" in all code, comments, logs, and internal documentation.

## Code Style Guidelines
- **Language**: TypeScript with strict mode enabled.
- **Imports**: Use `@/` alias for src imports. Organize: React → libraries → local.
- **Components**: PascalCase (e.g., `PaymentInterface`). Export both named and default exports.
- **State Management**: Zustand for global state, React Context for scoped states.
- **Validation**: Zod for all input validation schemas.

## Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities/hooks.
- **Functions**: camelCase with descriptive names (e.g., `processPayment`).
- **Types**: PascalCase interfaces, camelCase or snake_case for database fields (prefer camelCase for consistency with TypeScript).
- **Constants**: UPPER_SNAKE_CASE.

## Key Dependencies
- **Auth/Backend**: Appwrite (node-appwrite, appwrite).
- **Styling**: tailwindcss (v4), framer-motion, clsx, tailwind-merge.
- **Utils**: zod, lucide-react.
