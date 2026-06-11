'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Bot, 
  Globe, 
  Terminal,
  ChevronRight,
  Fingerprint
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
              <span className="font-bold text-sm">SD</span>
            </div>
            <span className="font-bold text-lg tracking-tight">SettleDaddy</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/home" className="text-sm font-medium px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors">
                Dashboard
              </Link>
            ) : (
              <button onClick={redirectToAuth} className="text-sm font-medium px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors">
                Connect
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
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            V1.0 is now live for the agentic era
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8"
          >
            Payment rails for <br />
            <span className="text-neutral-500">the agentic era.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            A high-performance payment engine designed to be the foundation for 
            autonomous agents and human-led commerce. No stress, no complexity.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={redirectToAuth}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all group"
            >
              Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/pitch"
              className="w-full sm:w-auto px-8 py-4 bg-chrome border border-hairline text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-focus transition-all"
            >
              View Pitch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-bedrock/50 border-t border-hairline">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Agent Native',
                description: 'Designed first for LLMs and autonomous agents to trigger and manage settlements.',
                icon: Bot
              },
              {
                title: 'Zero Latency',
                description: 'Optimized internal engine ensures near-instant confirmation and settlement.',
                icon: Zap
              },
              {
                title: 'Passkey Auth',
                description: 'Secure, biometric, passwordless entry that works anywhere in the world.',
                icon: Fingerprint
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

      {/* Built on Stack */}
      <section className="py-20 px-6 border-t border-hairline">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-12">The Modern Stack.</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-2xl font-bold">Next.js</div>
             <div className="flex items-center gap-2 text-2xl font-bold">Appwrite</div>
             <div className="flex items-center gap-2 text-2xl font-bold">Tailwind v4</div>
             <div className="flex items-center gap-2 text-2xl font-bold">Zustand</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-hairline bg-void text-neutral-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">SD</span>
            </div>
            <span className="font-bold text-white tracking-tight">SettleDaddy</span>
          </div>
          
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Twitter</Link>
            <Link href="#" className="hover:text-white">GitHub</Link>
            <Link href="#" className="hover:text-white">Docs</Link>
          </div>
          
          <div>© 2026 SettleDaddy. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
