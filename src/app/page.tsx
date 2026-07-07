'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Cpu, 
  Key, 
  Radio, 
  Database,
  Terminal,
  Activity,
  Code
} from 'lucide-react'

export default function LandingPage() {
  const { isAuthenticated, redirectToAuth } = useAuth()

  return (
    <div className="min-h-screen bg-void text-white selection:bg-primary selection:text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-void/80 backdrop-blur-md border-b border-hairline">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <span className="font-bold text-sm">C4</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Catch402</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/home" className="text-sm font-medium px-4 py-2 bg-chrome border border-hairline text-white rounded hover:bg-focus transition-colors">
                Dashboard
              </Link>
            ) : (
              <button onClick={redirectToAuth} className="text-sm font-medium px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors">
                Connect npub
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hairline bg-bedrock text-neutral-400 text-xs font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Catch402: Stateless Transaction Telemetry Router
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8"
          >
            Non-Custodial Webhooks <br />
            <span className="text-neutral-500">for the Agent Economy.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Bridge blockchain finality into real-time, firewall-proof webhooks and signed Nostr events. 
            0% custody, zero-VPS footprint, and native NIP-98 cryptographic public key authorization.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Link
                href="/home"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all group"
              >
                Enter Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button 
                onClick={redirectToAuth}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all group"
              >
                Get Started (Nostr Auth) <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <a 
              href="#protocol"
              className="w-full sm:w-auto px-8 py-4 bg-chrome border border-hairline text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-focus transition-all"
            >
              Read Specification
            </a>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-bedrock/50 border-t border-hairline" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '0% Asset Custody',
                description: 'We derive addresses using your xPub. The platform has zero capability to touch user funds or sign transactions.',
                icon: Shield
              },
              {
                title: 'NIP-98 Authentication',
                description: 'Say goodbye to static API keys. Authenticate programmatically at the HTTP header layer using Nostr key pairs.',
                icon: Key
              },
              {
                title: 'Dual-Track Egress',
                description: 'Receive real-time settlement telemetry via traditional webhooks or ephemeral, signed Nostr event streams.',
                icon: Radio
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-chrome border border-hairline rounded flex flex-col items-start gap-4 group hover:bg-focus transition-colors"
              >
                <div className="p-3 bg-void border border-hairline rounded">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Spec / Architecture Section */}
      <section className="py-20 px-6 border-t border-hairline" id="protocol">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">The Catch402 Standard</h2>
          
          <div className="space-y-12">
            <div className="p-6 bg-chrome border border-hairline rounded">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-primary h-5 w-5" />
                <h3 className="font-bold text-lg">1. x402 HTTP Payload Challenge</h3>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                When an agent makes an un-funded request, Catch402 edge routers intercept the connection and return a machine-readable paywall directive:
              </p>
              <pre className="p-4 bg-void border border-hairline rounded text-xs text-green-400 overflow-x-auto font-mono">
{`{
  "status": 402,
  "error": "Payment Required",
  "payTo": "0xDerivedDepositAddress...",
  "maxAmountRequired": "0.05",
  "asset": "USDC-ERC20",
  "network": "base-mainnet",
  "resource": "/api/v1/target-endpoint"
}`}
              </pre>
            </div>

            <div className="p-6 bg-chrome border border-hairline rounded">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="text-primary h-5 w-5" />
                <h3 className="font-bold text-lg">2. Ephemeral Nostr Egress (Mode B)</h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Perfect for CLI tools and local scripts behind strict NAT firewalls. Catch402 broadcasts verified transaction proofs straight to public Nostr relays. Your client listens via standard WebSocket streams, checks the platform signature, and resumes operation instantly without hosting a server.
              </p>
            </div>

            <div className="p-6 bg-chrome border border-hairline rounded">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-primary h-5 w-5" />
                <h3 className="font-bold text-lg">3. Non-Custodial xPub Address Allocation</h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Provide your BIP32/BIP44 Extended Public Key (xPub). For every transaction watch requested, the platform derives deposit coordinates deterministically at index step <code className="text-white font-mono">m/44'/60'/0'/0/i</code>. No private keys are ever processed or stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built on Stack */}
      <section className="py-20 px-6 border-t border-hairline bg-bedrock/30">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-12">System Stack</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-2xl font-bold">Next.js Edge</div>
             <div className="flex items-center gap-2 text-2xl font-bold">Appwrite Functions</div>
             <div className="flex items-center gap-2 text-2xl font-bold">Viem / Nostr</div>
             <div className="flex items-center gap-2 text-2xl font-bold">Tailwind v4</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-hairline bg-void text-neutral-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">C4</span>
            </div>
            <span className="font-bold text-white tracking-tight">Catch402</span>
          </div>
          
          <div className="flex gap-8">
            <Link href="https://nostr.com" className="hover:text-white">Nostr</Link>
            <Link href="https://github.com" className="hover:text-white">GitHub</Link>
            <Link href="/ARCHITECTURE.md" className="hover:text-white">Protocol Specification</Link>
          </div>
          
          <div>Licensed under AGPLv3. © 2026 Catch402. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
