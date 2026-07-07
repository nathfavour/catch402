# CLIENT.md — Catch402 Platform-Agnostic Frontend Specification

## 1. Systemic Design System (The Amber Sanctuary)

The client implements a dark-mode-only visual design based on OpenBricks 2.0 principles. Layouts represent a physical, machine-milled workspace using solid, opaque surfaces, eliminating blurry drop shadows and high-contrast glowing elements.

### 1.1 Color Tokens & The Outline Mandate
- **Level 0 (The Void):** `#000000` (Universal viewport background).
- **Level 1 (The Bedrock):** `#0A0908` (Base panels, structural gutters).
- **Level 2 (The Chrome):** `#141211` (Component containers, cards, tables).
- **Level 3 (The Focus):** `#1E1B19` (Hover fills, selectable indices).
- **The Hairline:** `#23211F` (Volcanic Slate. Mandatory single source of truth for borders and dividers).
- **Primary (Tactile Amber):** `#FF8800` (High-character warm orange, used exclusively for active accents and state highlights).
- **Success:** `#10B981` (Muted emerald).
- **Error:** `#EF4444` (Muted crimson).

### 1.2 Layout Metrics & Bevel Physics
- **Grid Gutters:** Exactly `24px` (Desktop) / `16px` (Mobile).
- **Border Radius:** `16px` for primary components, `28px` for slide-up bottom sheets.
- **Elevation Shadows:** Zero blur filters. Outlines mimic solid skeuomorphic offsets:
  `box-shadow: 1px 1px 0px #23211F, 2px 2px 0px #141211`
- **Typography Hierarchy (Outfit Display + Space Grotesk Inputs):**
  - Displays / Headers: `Outfit` (Bold geometric sans)
  - Inputs & Code Blocks: `Space Grotesk` (Brutalist curve characteristics)
  - Body Copy: `Satoshi` (High-legibility sans)
  - Technical Data / Hashes: `JetBrains Mono`

---

## 2. Ingress paywall Flow (x402 Spec Implementation)

### 2.1 The Intercept Trigger
When a client requests a watched route resource without authentication tokens or on-chain transaction logs, the application edge intercepts the request, blocks execution, and launches the standard **HTTP 402 Paywall Modal**.

```
[ Inbound Request ] ──► [ Check Auth / Logs ] ──(Missing/Unpaid)──► [ Mount Paywall Panel ]
```

### 2.2 Visual Presentation of Challenge (Deterministic Layout)
1. **Header Block:**
   - Left side: Lucide `AlertCircle` in Tactile Amber (`#FF8800`).
   - Right side: Title: "Payment Required" (18px, Satoshi Bold) + Subtitle: "Status Code 402 challenge" (11px, Space Grotesk, `#23211F` color offset).
2. **Challenge Payload JSON Inspector:**
   - Display a read-only, dark code editor module styled in `#000000` background.
   - Text color: `#10B981` (Success Green).
   - Contains the exact paywall spec payload.
3. **Deterministic Address Display:**
   - Shows the derived destination deposit address.
   - Truncated display format: `0xDerivedAddress...Last6Digits` with a Lucide `Copy` button.
   - Interactive hover state: background changes to `#1E1B19` on copy icon.

---

## 3. Developer Administration Console

### 3.1 Global Navigation Frame (GlobalShell)
- **TopBar Layout:**
  - Height: `64px`.
  - Background: `#0A0908` with a bottom border of `1px solid #23211F`.
  - Left: Logomark (C4 initials in `#FF8800` bg block) + "Catch402" branding.
  - Right: Verified cryptographic public identity indicator showing `npub1...` truncated + Credit Ledger showing remaining compute balance.
- **Sidebar Layout:**
  - Width: `256px`.
  - Links: Dashboard (`/home`), Route Watches (`/watches`), Logs (`/history`), Configuration (`/settings`).
  - Active Link Styling: Background `#1E1B19`, left vertical border indicator of `2px solid #FF8800`.

### 3.2 Ingress telemetry Watches Table (`/home`)
- **Table Structure:**
  - Header Row: Background `#0A0908`, borders `#23211F`, uppercase metadata labels.
  - Columns: `Resource Path` (mono font, bold), `Derivation Index` (mono font, `#FF8800`), `Derived Coordinates` (copyable address), `Target Amount` (bold, `#10B981`), `Telemetric Status` (inline state badge).
- **Telemetry Status Badges:**
  - `pending`: Background `#FF8800/10`, text `#FF8800`, border `1px solid #FF8800/20`.
  - `verified`: Background `#10B981/10`, text `#10B981`, border `1px solid #10B981/20`.

### 3.3 Register Watch Overlay (Global Unmount Policy)
- **Mount Rule:** Strictly conditional rendering (`{isOpen && <WatchModal />}`). Absolutely no visibility toggle classes.
- **Interactive Form Fields:**
  - **xPub input field:** `Space Grotesk` typography, border `#23211F`. Focused border transitions to `#FF8800`.
  - **Derivation Index:** Numeric input starting at last active watch index + 1.
  - **Price target input:** Default suffix label "USDC".

---

## 4. Egress Telemetry Settings (Mode A / Mode B)

### 4.1 Interface Layout Configuration
Split panel layout inside the Settings panel:
- **Panel A (Mode A: Webhooks):**
  - Input label: "Webhook Endpoint Target".
  - Field value: Complete absolute endpoint URL.
- **Panel B (Mode B: Nostr Relay WebSocket):**
  - Textarea field allowing one socket URI per line (e.g. `wss://relay.damus.io`).

### 4.2 Playback Sandbox Testbed
An interactive emulator console allowing developers to:
1. Select a watched resource path.
2. Hit a "Generate 402 Paywall spec" simulator button.
3. Paste a mock hex transaction hash (`0x...`).
4. Watch status change from `pending` to `verified` in real-time, simulating the Alchemy webhook block-catch event.
