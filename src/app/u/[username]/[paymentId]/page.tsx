'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { findUserByUsername, getPaymentRequest } from '@/lib/appwrite'
import type { Users, PaymentRequests } from '@/types/appwrite.d'
import { Copy, Check, AlertCircle } from 'lucide-react'

export default function PaymentRequestPage() {
  const params = useParams()
  const router = useRouter()
  const username = Array.isArray(params?.username) ? params.username[0] : params?.username
  const paymentId = Array.isArray(params?.paymentId) ? params.paymentId[0] : params?.paymentId
  
  const [user, setUser] = useState<Users | null>(null)
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequests | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)
  const [buttonPressed, setButtonPressed] = useState<string | null>(null)

  // Tilt coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!username || !paymentId) return
    setLoading(true)
    findUserByUsername(username)
      .then((u) => {
        if (!u) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setUser(u as Users)
        getPaymentRequest(paymentId)
          .then((pr) => {
            if (pr && pr.fromUserId === (u as Users).userId) {
              setPaymentRequest(pr as PaymentRequests)
              setNotFound(false)
            } else {
              setPaymentRequest(null)
              setNotFound(true)
            }
          })
          .finally(() => setLoading(false))
      })
  }, [username, paymentId])

  // Mouse move tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 50
      const y = (window.innerHeight / 2 - e.pageY) / 50
      setTilt({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const simulatePress = (btnName: string, action: () => void) => {
    setButtonPressed(btnName)
    setTimeout(() => {
      setButtonPressed(null)
      action()
    }, 150)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141312] text-[#e6e1df]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8800]"></div>
      </div>
    )
  }

  if (notFound || !user || !paymentRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141312] text-[#e6e1df] p-4 text-center">
        <div className="bg-[#2b2a28] border border-[#574335] rounded-xl p-8 max-w-sm">
          <AlertCircle className="h-12 w-12 text-[#ff8800] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Challenge Not Found</h2>
          <p className="text-sm text-neutral-400 mb-6">The requested payment routing spec could not be retrieved from the ledger.</p>
          <button onClick={() => router.push('/')} className="px-6 py-2 bg-[#ff8800] text-black font-bold rounded hover:bg-[#ffb781] transition-all">
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const derivedAddress = paymentRequest.paymentTxId || '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')

  const manifestJson = {
    status: 402,
    challenge: "x402_L1_CHALLENGE",
    amount: paymentRequest.amount?.toString() || "0.00",
    currency: paymentRequest.tokenId?.toUpperCase() || "USDC",
    timestamp: Math.floor(Date.now() / 1000),
    target: user.username || username
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#141312] text-[#e6e1df] overflow-hidden relative font-sans">
      {/* Background Canvas Mockup */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-20 pointer-events-none px-10 py-12">
        <div className="grid grid-cols-12 gap-6 h-full w-full">
          <div className="col-span-8 bg-[#1d1b1a] rounded-xl border border-[#574335]"></div>
          <div className="col-span-4 bg-[#1d1b1a] rounded-xl border border-[#574335]"></div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 z-10 bg-[#141312]/80 backdrop-blur-sm"></div>

      {/* Challenge Modal Container */}
      <div 
        className="relative z-20 w-full max-w-[560px] px-6 md:px-0 transition-transform duration-75 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`
        }}
      >
        <div className="bg-[#2b2a28] border border-[#574335] rounded-xl p-6 flex flex-col gap-6"
             style={{
               boxShadow: '1px 1px 0px #23211F, 2px 2px 0px #141211'
             }}>
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#363433] border border-[#574335] rounded-lg flex items-center justify-center text-[#ff8800]">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">Payment Required</h1>
              <p className="text-xs uppercase tracking-widest text-[#a58c7b] mt-1 font-mono">Status Code 402 challenge</p>
            </div>
          </div>

          {/* Challenge Content */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#a58c7b] uppercase tracking-tighter font-mono">Payload Manifest v1.4.2</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#ff8800] animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[#363433]"></div>
              </div>
            </div>

            {/* JSON Code Block */}
            <div className="bg-[#0f0e0d] border border-[#23211F] rounded-lg p-4 overflow-hidden relative">
              <pre className="text-xs text-[#10B981] overflow-x-auto leading-relaxed font-mono">
                <code>{JSON.stringify(manifestJson, null, 2)}</code>
              </pre>
              <div className="absolute top-2 right-2 flex gap-1.5">
                <div className="w-1 h-4 bg-[#574335]/30"></div>
                <div className="w-1 h-4 bg-[#574335]/30"></div>
              </div>
            </div>

            {/* Address Bar */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[#a58c7b] uppercase tracking-tighter ml-1 font-mono">Destination Hash</span>
              <div className="flex items-center gap-2 bg-[#0f0e0d] border border-[#574335] p-2 rounded-lg">
                <div className="flex-grow px-2 py-1 text-xs text-white truncate font-mono">
                  {derivedAddress}
                </div>
                <button 
                  onClick={() => handleCopy(derivedAddress)}
                  className="flex items-center justify-center p-2 rounded-md hover:bg-[#1E1B19] text-[#ffb781] transition-colors focus:outline-none"
                >
                  {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => simulatePress('auth', () => alert('Mock Authentication Successful'))}
              className={`flex-grow bg-[#ff8800] text-black font-bold py-4 rounded-lg transition-all text-xs tracking-wider uppercase ${
                buttonPressed === 'auth' ? 'translate-x-[2px] translate-y-[2px] shadow-none' : 'hover:bg-[#ffb781]'
              }`}
              style={{
                boxShadow: buttonPressed === 'auth' ? 'none' : '1px 1px 0px #23211F, 2px 2px 0px #141211'
              }}
            >
              AUTHENTICATE TRANSACTION
            </button>
            <button 
              onClick={() => simulatePress('close', () => router.push('/'))}
              className={`px-6 border border-[#574335] text-white font-bold py-4 rounded-lg transition-all text-xs tracking-wider uppercase ${
                buttonPressed === 'close' ? 'translate-x-[2px] translate-y-[2px] shadow-none' : 'hover:bg-[#363433]'
              }`}
              style={{
                boxShadow: buttonPressed === 'close' ? 'none' : '1px 1px 0px #23211F, 2px 2px 0px #141211'
              }}
            >
              CLOSE
            </button>
          </div>

          {/* Sub-Technical Info */}
          <div className="flex justify-between border-t border-[#574335] pt-2.5 mt-1 font-mono text-[11px] text-[#a58c7b]">
            <div className="flex gap-4">
              <span>LATENCY: 12ms</span>
              <span>GATEWAY: AMB-01</span>
            </div>
            <span className="text-[#ff8800]/60">ENCRYPTED SESSION</span>
          </div>
        </div>
      </div>
    </div>
  )
}
