# 🚀 SettleDaddy

**The payment rails for the agentic era.**

![SettleDaddy Dashboard](https://placehold.co/1200x600/000000/FFFFFF?text=SettleDaddy)

SettleDaddy is a professional-grade payment engine designed to fix cross-border payment delays, high transaction fees, and complex payment flows for the agentic era. Built entirely on the Next.js and Appwrite stack, it provides an API-first, secure architecture for instant, low-fee transfers, designed to be as powerful as products like BTCPayServer but without the unnecessary complexity.

---

## ✨ Features

-   🌐 **Agentic Rails:** Built-in support for AI agents to trigger and manage payments autonomously.
-   ⚡ **Settle Fast:** Instant settlements using modern payment protocols.
-   🔒 **Secure:** Passkey-first authentication and advanced security logs.
-   🪄 **OpenBricks Design:** A beautiful, pitch-dark, tactile UI built with Tailwind v4.
-   🛡️ **Robust Backend:** Powered by Appwrite for real-time updates and secure data management.
-   📱 **Fully Responsive:** Works seamlessly on all devices.

---

## Quickstart

```bash
# 1. Clone the repo
$ git clone https://github.com/nathfavour/Settle-Daddy-Core.git
$ cd Settle-Daddy-Core

# 2. Install dependencies
$ npm install

# 3. Copy and edit your .env
$ cp env.sample .env

# 4. Start the dev server
$ npm run dev
```

---

## Tech Stack

-   **Next.js 15** + **React 19**
-   **Appwrite** (Auth, DB, Storage, Realtime)
-   **Tailwind CSS v4** + **Framer Motion**
-   **TypeScript**
-   **Zustand** (state management)

---

## Architecture Mandates

SettleDaddy follows strict architectural principles inspired by [Kylrix](https://github.com/kylrix/kylrix):

-   **No internal APIs:** We use Server Actions and internal service methods to minimize attack surface and latency.
-   **Terminology:** We use **"Table"** instead of "Collection" and **"Row"** instead of "Document" to align with a more intuitive database mental model.
-   **Pitch-Dark Sanctuary:** A dark-mode-only system using the OpenBricks 2.0 design framework.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## License

MIT © [nathfavour](https://github.com/nathfavour)
