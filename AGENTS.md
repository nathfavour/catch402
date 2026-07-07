# AGENTS.md - Coding Guidelines for Catch402

## Build/Test/Lint Commands
- **Dev**: `npm run dev` (Next.js with Turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `npx tsc --noEmit`

## 🏗️ Architectural Mandates (Catch402 Core)

### 🚫 IMMUTABLE FILES & API STRATEGY
- **No internal APIs**: DO NOT introduce new HTTP API routes/endpoints (`src/app/api/*`, `route.ts`) for in-app flows. Catch402 keeps zero extra attack surface and no unnecessary latency.
- **Prefer Internal Methods**: Use existing in-process functions, Server Actions, and SDK helpers instead of exposing new API surfaces.
- **Data Consolidation**: When returning shaped payloads to hydrate multiple UI widgets, use Server Actions or consolidated internal service methods.

### ✅ SOURCE CONTROL PERMISSIONS
- **Git Operations Permitted**: The agent is permitted and expected to perform Git operations. After implementing any fix or feature, the agent must consolidate the modifications, perform a commit with a descriptive message, and push the changes immediately.
- **Pure Commit Messages (STRICT)**: When committing, NEVER add any co-author metadata (e.g., `Co-authored-by:` headers, names, or emails). Commit messages must contain only the pure commit message description. Leave author identification entirely to the automatic system git configuration.

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
