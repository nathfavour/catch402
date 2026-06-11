# SettleDaddy Architecture

## Overview
SettleDaddy is a payment engine designed for the agentic era, built on Next.js 15 and Appwrite. It follows a "Payment Rails" philosophy, prioritizing low latency, high security, and autonomous agent compatibility.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Backend**: Appwrite (Database, Auth, Storage, Functions)
- **Styling**: Tailwind CSS v4 (CSS-first)
- **Design System**: OpenBricks 2.0 (Pitch-Dark Sanctuary)
- **State Management**: Zustand
- **Authentication**: Passkey-first via Appwrite

## Core Principles
1. **No Internal APIs**: All application logic is handled via Server Actions or internal service methods. We do not expose `/api/*` routes for internal state changes.
2. **Deterministic UI**: The UI is dark-mode only, using opaque surfaces and tactile edge profiles. No gradients or translucency on product chrome.
3. **Agent-Ready**: Every payment flow is designed to be triggerable by an authorized AI agent.
4. **Table/Row Mental Model**: We use SQL-inspired terminology for our NoSQL data (Tables and Rows) to maintain consistency and clarity.

## Directory Structure
- `src/app`: Next.js App Router (Pages, Layouts, Server Actions)
- `src/components`: UI components (OpenBricks compliant)
- `src/lib`: Core logic, SDK wrappers, and internal services
- `src/contexts`: React Contexts for cross-component state (Auth, Theme)
- `src/hooks`: Custom React hooks
- `src/types`: TypeScript definitions

## Data Model
- **Users Table**: Profiles, preferences, and agent permissions.
- **Transactions Table**: Immutable ledger of all payment events.
- **Tables/Rows**: All Appwrite collections/documents are referred to as Tables/Rows in code.
