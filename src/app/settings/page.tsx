'use client'

import React, { useState } from 'react'
import { Webhook, Radio, PlayCircle, Terminal, Fingerprint, ExternalLink } from 'lucide-react'

interface LogEntry {
  time: string
  message: string
  type?: 'default' | 'success' | 'system'
}

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/v1/egress')
  const [relayList, setRelayList] = useState('wss://relay.damus.io\nwss://nos.lol')
  const [signLocal, setSignLocal] = useState(false)

  // Sandbox variables
  const [watchedPath, setWatchedPath] = useState('/api/v1/metrics/route-02')
  const [mockTx, setMockTx] = useState('')
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([
    { time: '09:44:01', message: 'Sandbox environment initialized. Waiting for payload...', type: 'default' },
    { time: '09:44:05', message: 'Handshake with wss://relay.damus.io established.', type: 'default' }
  ])
  const [sandboxStatus, setSandboxStatus] = useState<'pending' | 'processing' | 'verified'>('pending')
  const [buttonPressed, setButtonPressed] = useState<string | null>(null)

  const addLog = (message: string, type: 'default' | 'success' | 'system' = 'default') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    setTerminalLogs(prev => [...prev, { time, message, type }])
  }

  const triggerChallenge = () => {
    setButtonPressed('generate')
    setTimeout(() => setButtonPressed(null), 100)

    addLog('Initializing payment protocol request...', 'system')
    setSandboxStatus('processing')

    setTimeout(() => {
      addLog('402 Required headers injected into watched path.')
      addLog('Simulating hex transaction confirmation...', 'system')
      
      setTimeout(() => {
        addLog('Transaction 0x7a... verified on-chain.', 'success')
        addLog(`Webhook firing for endpoint: ${webhookUrl}`)
        setSandboxStatus('verified')
      }, 2000)
    }, 1000)
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-12 text-[#e6e1df]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#23211F] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Egress Telemetry</h1>
          <p className="text-neutral-400 text-sm mt-1">Configure callback sinks and simulate 402 paywall cycles.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#ff8800] animate-pulse"></span>
          <span className="text-xs font-mono text-[#ff8800] uppercase tracking-wider">System Active</span>
        </div>
      </div>

      {/* Panel Configuration: Webhooks & Nostr */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: Webhooks */}
        <section className="bg-[#1d1b1a] p-6 rounded border border-[#574335] shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-[#ff8800]" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#e6e1df]">EGRESS PANEL A: WEBHOOKS</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-[#a58c7b] uppercase font-bold tracking-wider block font-mono">ENDPOINT URL</label>
              <input 
                type="text" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#0A0908] border border-[#23211F] rounded px-4 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#ff8800] transition-all"
                placeholder="https://api.yourdomain.com/v1/egress"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-neutral-400 font-mono">Events: payment_received, route_triggered</p>
              <button 
                onClick={() => alert('Webhook test fired!')}
                className="bg-[#2b2a28] border border-[#23211F] hover:bg-[#3b3937] text-white px-4 py-1.5 rounded text-xs font-mono font-bold"
              >
                TEST
              </button>
            </div>
          </div>
        </section>

        {/* Panel B: Nostr */}
        <section className="bg-[#1d1b1a] p-6 rounded border border-[#574335] shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-[#ff8800]" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#e6e1df]">EGRESS PANEL B: NOSTR RELAY</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-[#a58c7b] uppercase font-bold tracking-wider block font-mono">RELAY LIST (WSS://)</label>
              <textarea 
                value={relayList}
                onChange={(e) => setRelayList(e.target.value)}
                rows={2}
                className="w-full bg-[#0A0908] border border-[#23211F] rounded px-4 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#ff8800] transition-all resize-none"
                placeholder="wss://relay.damus.io"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="nostr_auth" 
                checked={signLocal}
                onChange={(e) => setSignLocal(e.target.checked)}
                className="bg-[#0A0908] border-[#23211F] text-[#ff8800] focus:ring-0 rounded h-4 w-4"
              />
              <label className="text-xs text-neutral-400 font-mono" htmlFor="nostr_auth">Sign events with local NSEC</label>
            </div>
          </div>
        </section>
      </div>

      {/* Playback Sandbox: The Machine */}
      <section className="bg-[#141211] p-6 rounded border border-[#574335] shadow-lg relative overflow-hidden">
        {/* Background Visual Element */}
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <Terminal className="h-[200px] w-[200px]" />
        </div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-[#ff8800]" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#e6e1df]">PLAYBACK SANDBOX</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Controls Column */}
            <div className="md:col-span-1 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] text-[#a58c7b] uppercase font-bold tracking-wider block font-mono">WATCHED PATH</label>
                <select 
                  value={watchedPath}
                  onChange={(e) => setWatchedPath(e.target.value)}
                  className="w-full bg-[#0A0908] border border-[#23211F] rounded px-4 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  <option>/api/v1/data/route-01</option>
                  <option>/api/v1/metrics/route-02</option>
                  <option>/ws/stream/route-03</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#a58c7b] uppercase font-bold tracking-wider block font-mono">MOCK TRANSACTION (HEX)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={mockTx}
                    onChange={(e) => setMockTx(e.target.value)}
                    className="w-full bg-[#0A0908] border border-[#23211F] rounded px-4 py-2 text-xs font-mono text-white focus:outline-none" 
                    placeholder="0x..." 
                  />
                  <span className="absolute right-3 top-2 text-[16px] text-neutral-400">
                    <Fingerprint className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <button 
                onClick={triggerChallenge}
                className={`w-full bg-[#ff8800] text-black font-bold py-3 rounded-lg text-xs tracking-wider uppercase ${
                  buttonPressed === 'generate' ? 'translate-x-[2px] translate-y-[2px] shadow-none' : 'hover:brightness-110'
                }`}
                style={{
                  boxShadow: buttonPressed === 'generate' ? 'none' : '1px 1px 0px #23211F, 2px 2px 0px #141211'
                }}
              >
                Generate 402 Paywall spec
              </button>
            </div>

            {/* Real-time Status Column */}
            <div className="md:col-span-2 bg-[#0A0908] border border-[#23211F] rounded-lg p-4 flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center border-b border-[#23211F] pb-2 mb-4">
                <span className="text-[10px] text-[#a58c7b] uppercase font-bold tracking-wider font-mono">LOGS &amp; VERIFICATION</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                  <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                  <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                </div>
              </div>
              <div className="flex-grow font-mono text-xs space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[220px]">
                {terminalLogs.map((log, index) => {
                  let colorClass = 'text-neutral-400'
                  if (log.type === 'success') colorClass = 'text-[#ff8800] font-bold'
                  if (log.type === 'system') colorClass = 'text-[#8aceff]'
                  return (
                    <div key={index} className="flex gap-2">
                      <span className="text-[#ff8800] opacity-50">[{log.time}]</span>
                      <span className={colorClass}>{log.message}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-[#23211F] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#a58c7b] uppercase font-bold tracking-wider font-mono">STATUS:</span>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold capitalize ${
                    sandboxStatus === 'processing' ? 'bg-[#ff8800]/20 text-[#ff8800] animate-pulse' :
                    sandboxStatus === 'verified' ? 'bg-[#10B981]/25 text-[#10B981]' : 'bg-[#2b2a28] text-neutral-400'
                  }`}>
                    <span>{sandboxStatus}</span>
                  </div>
                </div>
                <div className="text-neutral-400 font-mono text-xs">
                  Latency: <span className="text-[#ff8800]">12ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Data View: Recent Paywalls */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#e6e1df]">RECENT SANDBOX GENERATIONS</h4>
        <div className="overflow-x-auto bg-[#1d1b1a] rounded border border-[#574335]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#23211F] bg-[#0A0908] text-[#a58c7b] font-bold">
                <th className="p-3">ID</th>
                <th className="p-3">PATH</th>
                <th className="p-3">SATS</th>
                <th className="p-3">STATE</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#23211F] hover:bg-[#1E1B19]/50 transition-colors group">
                <td className="p-3 text-[#ff8800]">#402-9A21</td>
                <td className="p-3">/api/v1/metrics/route-02</td>
                <td className="p-3">2,100</td>
                <td className="p-3">
                  <span className="bg-[#ff8800]/10 text-[#ff8800] border border-[#ff8800]/20 px-2 py-0.5 rounded-full text-[10px] font-bold">VERIFIED</span>
                </td>
                <td className="p-3 text-right">
                  <ExternalLink className="h-4 w-4 text-neutral-500 hover:text-white cursor-pointer inline" />
                </td>
              </tr>
              <tr className="border-b border-[#23211F] hover:bg-[#1E1B19]/50 transition-colors group">
                <td className="p-3 text-[#ff8800]">#402-1B55</td>
                <td className="p-3">/ws/stream/route-03</td>
                <td className="p-3">5,500</td>
                <td className="p-3">
                  <span className="bg-neutral-600/10 text-neutral-400 border border-neutral-600/20 px-2 py-0.5 rounded-full text-[10px] font-bold">EXPIRED</span>
                </td>
                <td className="p-3 text-right">
                  <ExternalLink className="h-4 w-4 text-neutral-500 hover:text-white cursor-pointer inline" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
