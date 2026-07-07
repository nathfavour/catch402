# ARCHITECTURE.md — Catch402 Protocol Specification

## 1. Executive Summary & Systemic Scope

`Catch402` is a decentralized, serverless, and completely non-custodial transaction telemetry router built to service the high-frequency machine-to-machine economy. It acts as an open infrastructure bridge that translates low-latency blockchain finality events into real-time, firewall-proof webhooks and cryptographic message streams.

### Core System Constraints

* **0% Asset Custody:** The application layer never sees, generates, transforms, or stores cryptographic private keys or seed phrases. Financial settlement occurs natively on public distributed ledgers.
* **Zero-VPS Stateless Footprint:** All network interfaces run entirely inside ephemeral edge environments (Next.js Edge Runtime) and event-driven backend tasks (Appwrite Functions), reducing idle infrastructure overhead to exactly $0.00.
* **Agent-Native Design:** Bypasses human-facing session workflows, cookies, and visual checkout wrappers. Authorization and authentication are handled entirely at the HTTP header layer via public-key cryptographic proofs.

---

## 2. Protocol Foundations

The system coordinates three distinct open network standards to facilitate machine-to-machine resource monetization:

### 2.1 x402 "Payment Required" Protocol Compliance

`Catch402` implements the standardized HTTP 402 challenge response loop. When an un-authenticated or un-funded automated swarm requests a network resource, the edge layer intercepts the stream and responds with a machine-readable paywall specification layout:

```json
{
  "status": 402,
  "error": "Payment Required",
  "payTo": "0xDerivedDepositAddress...",
  "maxAmountRequired": "0.05",
  "asset": "USDC-ERC20",
  "network": "base-mainnet",
  "resource": "/api/v1/target-endpoint"
}
```

### 2.2 NIP-98 HTTP Cryptographic Authentication

Static, string-based API keys are entirely eliminated for programmatic routing commands. Client agents authenticate state changes and registration actions by providing a `Nostr` token inside the standard HTTP `Authorization` header.

* The token consists of a Base64-encoded ephemeral Nostr event (`kind: 27235`).
* The event payload must contain the precise absolute URL string of the target endpoint, the HTTP method utilized, and an accurate high-resolution timestamp.
* The edge server validates the Schnorr signature against the claimed public key (`npub`) entirely in-memory using `viem` primitives, skipping database authorization calls.

### 2.3 NIP-90 Data Vending Machine (DVM) Interface Alignment

Internal compute tasks, asynchronous verification loops, and fallback worker triggers are modeled after the NIP-90 design specification. Job Requests (`kind: 5xxx`) and Job Results (`kind: 6xxx`) are passed through decentralized relays, separating the system's presentation framework from the processing machinery.

---

## 3. Infrastructure & Technical Stack Map

The architecture leverages a hybrid serverless model to eliminate persistent server management and maximize raw operational velocity under tight resource constraints.

```
       [ Client / Agent Request via HTTP or Nostr ]
                           │
                           ▼
              ┌─────────────────────────┐
              │  Next.js Edge Router    │ ◄── [ Cryptographic Validation ]
              └────────────┬────────────┘
                           │  (Fast Asynchronous Write)
                           ▼
              ┌─────────────────────────┐
              │   Appwrite Collection   │ ◄── [ State Storage & Triggers ]
              └────────────┬────────────┘
                           │  (Event Broadcast)
                           ▼
              ┌─────────────────────────┐
              │   Appwrite Functions    │ ◄── [ viem Telemetry Engine ]
              └─────────────────────────┘
```

### 3.1 Next.js Edge Runtime

Acts as the global ingress firewall. The Edge layer handles high-concurrency request spikes, checks cryptographic headers, handles the fast route indexing, and drops connections into the background logging database instantly to survive serverless timeout limits.

### 3.2 Appwrite Core Backend

* **Appwrite Databases:** Serves as the central append-only log ledger. It maintains state data for active tracking watches, developer public-key metadata, and transaction processing hashes.
* **Appwrite Functions:** Operates as isolated, background execution workers triggered asynchronously by database modifications or external blockchain RPC webhooks.
* **Appwrite Security Rules:** Implements precise role-based access tokens mapping developers directly to their verified cryptographic identities (`npub`).

---

## 4. Non-Custodial Isolation (The xPub Engine)

`Catch402` achieves complete legal and mathematical isolation from user funds by using **Extended Public Keys (xPubs)** for all deposit address allocations.

### 4.1 Address Derivation Flow

1. **Ingress Registration:** The developer provides their public `xPub` string (e.g., an BIP32/BIP44 standard public derivation key) via the cryptographic dashboard.
2. **Deterministic Derivation:** When an agent or external customer initiates a payment session, the system reads the developer's unique transaction counter increment from the database.
3. **Client-Side Calculation:** Using the `viem` utility stack on the serverless edge, the platform calculates the exact downstream public address corresponding to the current index step ($m/44'/60'/0'/0/i$).
4. **Isolation Guarantee:** Because the derivation formula relies exclusively on the public portion of the key structure, the server can produce an infinite sequence of unique payment coordinates without ever possessing the mathematical capability to authorize outbound fund movement or sign transaction payloads.

---

## 5. End-to-End Execution Lifecycles

The complete transactional loop runs through four decoupled phases designed to ensure zero state dropouts.

### Phase 1: Ingress Challenge

An autonomous agent issues a request to a resource monitored by `Catch402`. The edge router captures the query, confirms the absence of valid on-chain settlement tokens, and returns the HTTP 402 structural specification matrix.

### Phase 2: Transaction Latching

1. The agent receives the 402, interfaces with its local wallet runtime, pushes a transaction directly onto the public blockchain, and retries the target API route while appending the resulting transaction hash (`tx_hash`) to the request metadata.
2. The Next.js Edge listener receives the retry, performs an isolated format validation on the hex string to confirm block format compliance, writes a new record into the Appwrite `watches` collection with a status flag of `pending`, and immediately returns an HTTP 202 Accepted confirmation packet to the client.

### Phase 3: Telemetry Processing & Block Verification

1. The platform interfaces with distributed external node indexers (Alchemy Notify / dRPC) via persistent webhook endpoints.
2. Upon block settlement, the external RPC network fires an automated payload containing transaction telemetry to `POST /api/v1/telemetry`.
3. The telemetry endpoint ingests the payload, shifts processing to an Appwrite Function background worker, and initiates a `viem` verification sequence:
* Queries block receipts to verify confirmation depth.
* Compares the transaction recipient string to the calculated xPub index address.
* Validates that the asset quantity matches the payload requirements exactly.
4. Upon successful validation, the tracking document's state property transitions from `pending` to `verified`.

### Phase 4: Egress Dissemination

A database event handler tracks the `verified` write state and executes the developer’s chosen transport delivery block.

---

## 6. Dual-Track Egress Architecture

To accommodate both legacy web architectures and sandboxed autonomous agent instances, `Catch402` routes transaction finality signals through two separate output channels.

```
                         [ Verified Event State Change ]
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐
        │  Mode A: HTTP Webhook │             │  Mode B: Nostr Relay  │
        └───────────┬───────────┘             └───────────┬───────────┘
                    │                                     │
           (Standard POST Request)                 (WebSocket Stream)
                    ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐
        │  External B2B Server  │             │  Local Firewall Agent │
        └───────────────────────┘             └───────────────────────┘
```

### 6.1 Mode A: Traditional HTTP Webhooks

The engine wraps the verified payment telemetry into a structured JSON payload, generates a signature hash using the system's platform key to prevent spoofing, and delivers a standard `POST` request to the merchant's configured callback endpoint.

### 6.2 Mode B: Ephemeral Nostr Egress Streams

For autonomous agents operating inside local terminals, mobile terminal applications (Termux), or behind strict consumer network address translation (NAT) structures, running an active HTTP server to receive callbacks is impossible.

* **The Pipeline:** The system bypasses inbound web constraints by converting the payment confirmation into an ephemeral Nostr event.
* **The Payload:** The Appwrite background worker signs a standard event containing the transaction payload using the system's private signing identity.
* **The Broadcast:** The signed block is transmitted simultaneously to a configured cluster of public Nostr relays.
* **The Ingress:** The target AI agent maintains an active, low-overhead outbound WebSocket connection to the same relays. It captures the event string, validates the platform's public key signature, and safely continues its operation without requiring a public IP address or firewall rule alterations.

---

## 7. Billing & Compute Credit Accounting System

The platform charges strictly "close to the metal" for raw compute and infrastructure usage, discarding artificial account tiers or agent limits.

### 7.1 Compute Credit Metrics

Every operational event processes charges against the user's internal credit register:

* `POST /api/v1/watch` (State initialization and address allocation) = **1 Credit**
* `Telemetry ingestion & block receipt parsing via viem` = **2 Credits**
* `Successful delivery of Egress Webhook or Nostr Event` = **5 Credits**

### 7.2 The Free Sandbox Tier

New developer registrations are allocated a permanent monthly bucket of **10,000 Compute Credits** for free. Because the system's idle serverless architecture requires no monthly runtime budget, this sandbox tier remains perpetually free to run, allowing frictionless testing of agent loops.

### 7.3 The Paid Top-Up Pipeline (Recursive Dogfooding)

To purchase additional processing capacity, developers send stablecoins or Bitcoin to the account's unique funding address. **Every $10 USD equivalent deposited translates to 1,000,000 Compute Credits.**

The platform tracks its own top-up transactions using the primary internal `Catch402` processing loops:

1. A user sends deposit funds to their unique system allocation address.
2. The engine catches the block telemetry event via its own Alchemy hook.
3. The internal `viem` helper script verifies the on-chain confirmation.
4. An Appwrite database trigger intercepts the internal transaction and increments the user's credit balance record.

---

## 8. Hard Failure Isolation & Security Guarantees

To maintain resilience across millions of concurrent agent requests, `Catch402` implements three absolute code-level guardrails:

### 8.1 Arbitrary Floating-Point Protection

Javascript's default floating-point system introduces rounding errors during big integer handling. Because blockchain assets operate at highly precise subdivisions (e.g., 18 decimals for Wei, 6 decimals for USDC), **all financial numbers, block counters, and currency calculations are stored and transmitted exclusively as native `string` objects or wrapped inside `BigInt` abstractions via `viem`.**

### 8.2 The Replay Transaction Defense

To prevent an agent from reusing a historic, confirmed transaction signature to spoof a new payment authorization, the Appwrite `watches` collection enforces a strict `unique` indexing constraint on the transaction hash string property. Any secondary attempt to write an identical hash block crashes the database ingress layer immediately, marking the action as an invalid exploit profile.

### 8.3 Asynchronous Queue Isolation

To prevent edge functions from crashing due to cloud timeout parameters during burst periods, the system operates asynchronously. Inbound telemetry routes are forbidden from processing cryptographic validations or firing outbound egress targets on the main thread. Their sole responsibility is to drop the raw message payload into the Appwrite log collection within under 50 milliseconds and terminate the network socket, passing subsequent tracking logic to background execution tasks.

---

## 9. Regulatory & Licensing Framework

### 9.1 Regulatory Exemption Strategy

Because `Catch402` operates strictly as an informational data indexer—never holding spending control over digital assets, never processing private cryptographic credentials, and never moving value between accounts—the platform maintains total immunity from global money transmitter licensing, banking regulations, and compliance audits.

### 9.2 The AGPLv3 License Armor

The repository is licensed under the **GNU Affero General Public License v3 (AGPLv3)**.

* Developers are fully authorized to clone, inspect, audit, and self-host the core tracking engine for free.
* **The Commercial Loophole Shield:** If any third-party corporation clones the codebase, modifies the telemetry loop, and executes the software over a network to run a competing cloud payment service, they are legally mandated to publish their entire modified repository infrastructure openly under the exact same AGPLv3 terms. This ensures the protection of independent open-source labor from unauthorized corporate capture.
