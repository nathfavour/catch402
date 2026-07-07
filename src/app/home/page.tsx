'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Plus, 
  RefreshCw, 
  Terminal, 
  Activity,
  Cpu,
  Key,
  Radio,
  Database,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Watch {
  id: string
  xpubIndex: number
  derivedAddress: string
  resourcePath: string
  amountRequired: string
  network: string
  status: 'pending' | 'verified'
  txHash?: string
}

export default function HomePage() {
  const { account, userProfile, isAuthenticated, isLoading, refreshProfile } = useAuth()
  const router = useRouter()
  
  // Active state for watches
  const [watches, setWatches] = useState<Watch[]>([
    {
      id: 'watch-1',
      xpubIndex: 0,
      derivedAddress: '0x3aE19A62b66D807567702f2Cc8C1cf262274b7F2',
      resourcePath: '/api/v1/compute-vision',
      amountRequired: '0.05',
      network: 'base-mainnet',
      status: 'verified',
      txHash: '0x8f7c6b5a4d3c2b1a09876543210fedcba9876543210fedcba9876543210fedcb'
    },
    {
      id: 'watch-2',
      xpubIndex: 1,
      derivedAddress: '0x992B19F4bB19cf2Cc8C1cf2266D807567702f82A',
      resourcePath: '/api/v1/agent-text-gen',
      amountRequired: '0.02',
      network: 'base-mainnet',
      status: 'pending'
    }
  ])

  // Form states for creating a new watch
  const [showAddModal, setShowAddModal] = useState(false)
  const [xpubInput, setXpubInput] = useState('xpub661MyMwAqRbcFtxFhs3sQ1YLS17a...')
  const [derivIndex, setDerivIndex] = useState(2)
  const [resourcePath, setResourcePath] = useState('/api/v1/analytics')
  const [amountRequired, setAmountRequired] = useState('0.10')
  const [network, setNetwork] = useState('base-mainnet')

  // Egress parameters
  const [webhookUrl, setWebhookUrl] = useState('https://agent-backend.local/api/payment-callback')
  const [nostrRelays, setNostrRelays] = useState('wss://relay.damus.io\nwss://nos.lol')

  // Interactive playground state
  const [playgroundPath, setPlaygroundPath] = useState('/api/v1/compute-vision')
  const [challengeResponse, setChallengeResponse] = useState<any>(null)
  const [inputTxHash, setInputTxHash] = useState('')
  const [playgroundStatus, setPlaygroundStatus] = useState<string>('idle')

  // Credits state
  const [credits, setCredits] = useState(9842)
  const [npub, setNpub] = useState('npub17fc6879ecd343f1917d1bf69bfbd01e')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  const handleCreateWatch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Deterministic mock derived address for visualization
    const derived = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
    
    const newWatch: Watch = {
      id: `watch-${Date.now()}`,
      xpubIndex: derivIndex,
      derivedAddress: derived,
      resourcePath,
      amountRequired,
      network,
      status: 'pending'
    }

    setWatches([newWatch, ...watches])
    setDerivIndex(derivIndex + 1)
    setShowAddModal(false)
    setCredits(prev => Math.max(0, prev - 1)) // 1 credit for watch creation
  }

  const triggerChallengePlayground = () => {
    const targetWatch = watches.find(w => w.resourcePath === playgroundPath)
    if (targetWatch) {
      setChallengeResponse({
        status: 402,
        error: "Payment Required",
        payTo: targetWatch.derivedAddress,
        maxAmountRequired: targetWatch.amountRequired,
        asset: "USDC-ERC20",
        network: targetWatch.network,
        resource: targetWatch.resourcePath
      })
      setPlaygroundStatus('challenged')
    } else {
      setChallengeResponse({ error: "Resource path not watched" })
      setPlaygroundStatus('error')
    }
  }

  const submitTransactionPlayground = () => {
    if (!inputTxHash.startsWith('0x') || inputTxHash.length < 10) {
      alert('Please enter a valid hex transaction hash')
      return
    }
    setPlaygroundStatus('verifying')
    
    setTimeout(() => {
      // Find and update watch status
      setWatches(prev => prev.map(w => {
        if (w.resourcePath === playgroundPath) {
          return { ...w, status: 'verified', txHash: inputTxHash }
        }
        return w
      }))
      setPlaygroundStatus('verified')
      setCredits(prev => Math.max(0, prev - 7)) // 2 for verification + 5 for delivery = 7
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catch402 Protocol Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Telemetry Router for serverless machine-to-machine settlements.
          </p>
        </div>
        
        {/* Identity & Credits */}
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-2 bg-chrome border border-hairline rounded flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-500 block uppercase">Nostr Identity</span>
              <span className="text-xs font-mono text-neutral-300 font-bold">{npub.slice(0, 12)}...{npub.slice(-8)}</span>
            </div>
          </div>
          
          <div className="px-4 py-2 bg-chrome border border-hairline rounded flex items-center gap-2">
            <Database className="h-4 w-4 text-green-400" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-500 block uppercase">Compute Credits</span>
              <span className="text-sm font-bold text-green-400">{credits.toLocaleString()} / 10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Watches & Telemetry Ingress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              Active Telemetry Watches
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded flex items-center gap-1.5 hover:bg-primary/90 transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Watch Route
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-chrome border border-hairline rounded overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bedrock border-b border-hairline text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4">Resource Path</th>
                  <th className="p-4">Index</th>
                  <th className="p-4">Derived Address</th>
                  <th className="p-4">USDC Target</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {watches.map(w => (
                  <tr key={w.id} className="hover:bg-focus/35 transition-colors text-xs">
                    <td className="p-4 font-mono font-bold text-white">{w.resourcePath}</td>
                    <td className="p-4 text-neutral-400 font-mono">m/44'/60'/0'/0/{w.xpubIndex}</td>
                    <td className="p-4 text-neutral-400 font-mono">
                      {w.derivedAddress.slice(0, 8)}...{w.derivedAddress.slice(-6)}
                    </td>
                    <td className="p-4 font-bold text-green-400">{w.amountRequired} USDC</td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        w.status === 'verified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                      }`}>
                        {w.status === 'verified' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Egress Setup */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            Egress Channels
          </h2>

          <div className="p-6 bg-chrome border border-hairline rounded space-y-6">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-2">
                Mode A: HTTP Webhook Callback URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-2">
                Mode B: Ephemeral Nostr Relays
              </label>
              <textarea
                value={nostrRelays}
                onChange={(e) => setNostrRelays(e.target.value)}
                rows={3}
                className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            
            <button
              onClick={() => alert('Egress configurations saved.')}
              className="w-full px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors"
            >
              Update Settings
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Playground Section */}
      <section className="border-t border-hairline pt-8">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 mb-6">
          <Terminal className="h-5 w-5 text-primary" />
          x402 Protocol & DVM Emulator
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Challenge Emulator */}
          <div className="p-6 bg-chrome border border-hairline rounded space-y-4">
            <h3 className="text-sm font-bold">1. Ingress Request & Challenge</h3>
            <p className="text-xs text-neutral-400">
              Select an active watched resource route path to simulate an un-authenticated request challenge response loop.
            </p>
            
            <div className="flex gap-2">
              <select
                value={playgroundPath}
                onChange={(e) => {
                  setPlaygroundPath(e.target.value)
                  setChallengeResponse(null)
                  setPlaygroundStatus('idle')
                }}
                className="flex-1 bg-void border border-hairline rounded px-3 py-2 text-xs text-white focus:outline-none"
              >
                {watches.map(w => (
                  <option key={w.id} value={w.resourcePath}>{w.resourcePath}</option>
                ))}
              </select>
              
              <button
                onClick={triggerChallengePlayground}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                Trigger Challenge <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {challengeResponse && (
              <pre className="p-4 bg-void border border-hairline rounded text-[11px] text-green-400 overflow-x-auto font-mono">
                {JSON.stringify(challengeResponse, null, 2)}
              </pre>
            )}
          </div>

          {/* Verification Simulator */}
          <div className="p-6 bg-chrome border border-hairline rounded space-y-4">
            <h3 className="text-sm font-bold">2. Transaction Latching & Block Settlement</h3>
            <p className="text-xs text-neutral-400">
              Simulate your autonomous client wallet pushing a transaction hash and verifying blockchain telemetry.
            </p>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Transaction Hash (e.g. 0x8f7c6b5a...)"
                value={inputTxHash}
                onChange={(e) => setInputTxHash(e.target.value)}
                disabled={playgroundStatus !== 'challenged'}
                className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
              />
              
              <button
                onClick={submitTransactionPlayground}
                disabled={playgroundStatus !== 'challenged'}
                className="w-full px-4 py-2 bg-green-500 text-black text-xs font-bold rounded hover:bg-green-400 transition-colors disabled:opacity-50"
              >
                {playgroundStatus === 'verifying' ? 'Verifying Block Telemetry...' : 'Latch & Verify Transaction'}
              </button>
            </div>

            {playgroundStatus === 'verified' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded flex items-center gap-3 text-xs text-green-400">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Telemetry Verified successfully!</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Egress notification dispatched to Webhook and signed as kind: 27235 event to Nostr relays.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Register Watch Modal (Conditional Mount Pattern) */}
      {showAddModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out cursor-default"
            onClick={() => setShowAddModal(false)}
          />
          
          {/* Modal Container */}
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] md:max-h-[80vh] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-[#141211] border border-hairline rounded-t-[28px] md:rounded-[16px] z-[100] text-white p-6 md:p-8 flex flex-col gap-6 animate-slide-up overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white text-lg font-black tracking-tight leading-tight">Watch Route</h3>
                <p className="text-neutral-500 text-[11px] font-bold mt-1">Register path with xPub address derivation</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateWatch} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-500 uppercase font-bold">xPub Key String</label>
                <input
                  type="text"
                  required
                  value={xpubInput}
                  onChange={(e) => setXpubInput(e.target.value)}
                  className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase font-bold">Derivation Index</label>
                  <input
                    type="number"
                    required
                    value={derivIndex}
                    onChange={(e) => setDerivIndex(Number(e.target.value))}
                    className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase font-bold">Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="base-mainnet">base-mainnet</option>
                    <option value="ethereum-mainnet">ethereum-mainnet</option>
                    <option value="arbitrum-one">arbitrum-one</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase font-bold">Resource Path</label>
                  <input
                    type="text"
                    required
                    value={resourcePath}
                    onChange={(e) => setResourcePath(e.target.value)}
                    className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase font-bold">Price required (USDC)</label>
                  <input
                    type="text"
                    required
                    value={amountRequired}
                    onChange={(e) => setAmountRequired(e.target.value)}
                    className="w-full bg-void border border-hairline rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-void border border-hairline text-neutral-400 hover:text-white rounded font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white rounded font-bold hover:bg-primary/95 transition-colors"
                >
                  Establish Watch
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
