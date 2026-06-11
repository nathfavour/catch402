'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useWallet } from '@/contexts/WalletContext'
import { useTransaction } from '@/contexts/TransactionContext'
import { useExchangeRate } from '@/contexts/ExchangeRateContext'
import { 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Wallet as WalletIcon
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function SendPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { wallets, defaultWallet } = useWallet()
  const { sendTransaction } = useTransaction()
  const { calculateUsdValue, formatUsdValue } = useExchangeRate()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    fromWalletId: defaultWallet?.walletId || '',
    toAddress: '',
    amount: '',
    tokenId: 'btc',
    description: ''
  })

  const selectedWallet = wallets.find(w => w.walletId === formData.fromWalletId)

  const usdEquivalent = selectedWallet && formData.amount 
    ? calculateUsdValue(formData.amount, selectedWallet.blockchain)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedWallet) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const transaction = await sendTransaction({
        toAddress: formData.toAddress,
        tokenId: formData.tokenId,
        amount: formData.amount,
        description: formData.description,
        fromWalletId: formData.fromWalletId,
        type: 'send', // Should be 'send' for outgoing
        status: 'pending',
        fromUserId: '',
        fromAddress: '',
        feeAmount: '',
        confirmations: 0
      })

      setSuccess(`Transaction broadcasted. Ledger ID: ${transaction.transactionId}`)
      
      setFormData({
        fromWalletId: defaultWallet?.walletId || '',
        toAddress: '',
        amount: '',
        tokenId: 'btc',
        description: ''
      })

      setTimeout(() => {
        router.push('/home')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to initiate transaction')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAddress = (address: string, blockchain: string) => {
    if (!address) return false
    switch (blockchain) {
      case 'bitcoin':
        return address.length > 20
      case 'ethereum':
      case 'polygon':
      case 'bsc':
        return address.startsWith('0x') && address.length === 42
      default:
        return true
    }
  }

  const isValidForm = () => {
    return (
      formData.fromWalletId &&
      formData.toAddress &&
      formData.amount &&
      parseFloat(formData.amount) > 0 &&
      selectedWallet &&
      validateAddress(formData.toAddress, selectedWallet.blockchain)
    )
  }

  const getTokenOptions = (blockchain: string) => {
    const tokens: Record<string, Array<{id: string, name: string, symbol: string}>> = {
      bitcoin: [{ id: 'btc', name: 'Bitcoin', symbol: 'BTC' }],
      ethereum: [
        { id: 'eth', name: 'Ethereum', symbol: 'ETH' },
        { id: 'usdt', name: 'Tether USD', symbol: 'USDT' },
        { id: 'usdc', name: 'USD Coin', symbol: 'USDC' }
      ],
      polygon: [
        { id: 'matic', name: 'Polygon', symbol: 'MATIC' },
        { id: 'usdc', name: 'USD Coin', symbol: 'USDC' }
      ],
      bsc: [
        { id: 'bnb', name: 'BNB', symbol: 'BNB' },
        { id: 'usdt', name: 'Tether USD', symbol: 'USDT' }
      ]
    }
    return tokens[blockchain] || []
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/home"
          className="inline-flex items-center text-neutral-500 hover:text-white text-sm font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Initiate Settlement</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Broadcast a transaction to the network rails.
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error shrink-0" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/20 rounded p-4 mb-8 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          <p className="text-sm text-success">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From Wallet */}
        <div className="p-6 bg-bedrock border border-hairline rounded space-y-4">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest block">
            Source Wallet
          </label>
          <div className="relative">
            <WalletIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <select
              value={formData.fromWalletId}
              onChange={(e) => setFormData({ ...formData, fromWalletId: e.target.value })}
              className="w-full pl-10 pr-3 py-2 bg-chrome border border-hairline rounded text-sm text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-colors"
              required
            >
              <option value="">Select source</option>
              {wallets.map((wallet) => (
                <option key={wallet.walletId} value={wallet.walletId}>
                  {wallet.walletName} ({wallet.blockchain}) — {wallet.balance} {wallet.blockchain === 'bitcoin' ? 'BTC' : 'ETH'}
                </option>
              ))}
            </select>
          </div>
          {selectedWallet && (
            <p className="text-[10px] text-neutral-600 font-mono break-all uppercase">
              {selectedWallet.walletAddress}
            </p>
          )}
        </div>

        {/* To Address */}
        <div className="p-6 bg-bedrock border border-hairline rounded space-y-4">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest block">
            Destination Address
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              required
              value={formData.toAddress}
              onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
              placeholder={selectedWallet ? `Enter ${selectedWallet.blockchain} address` : '0x... or bc1...'}
              className="w-full pl-10 pr-3 py-2 bg-chrome border border-hairline rounded text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {formData.toAddress && selectedWallet && !validateAddress(formData.toAddress, selectedWallet.blockchain) && (
            <p className="text-xs text-error font-medium">
              Invalid address format for {selectedWallet.blockchain}
            </p>
          )}
        </div>

        {/* Amount & Token */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 bg-bedrock border border-hairline rounded space-y-4">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest block">
              Amount
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-chrome border border-hairline rounded px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
            {usdEquivalent > 0 && (
              <p className="text-xs text-neutral-500 font-medium">
                ≈ {formatUsdValue(usdEquivalent)}
              </p>
            )}
          </div>

          <div className="p-6 bg-bedrock border border-hairline rounded space-y-4">
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest block">
              Asset
            </label>
            <select
              value={formData.tokenId}
              onChange={(e) => setFormData({ ...formData, tokenId: e.target.value })}
              className="w-full bg-chrome border border-hairline rounded px-3 py-2 h-[46px] text-sm text-white font-bold focus:outline-none focus:border-primary/50 appearance-none cursor-pointer transition-colors"
              required
              disabled={!selectedWallet}
            >
              {selectedWallet ? (
                getTokenOptions(selectedWallet.blockchain).map((token) => (
                  <option key={token.id} value={token.id}>
                    {token.symbol}
                  </option>
                ))
              ) : (
                <option value="">-</option>
              )}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 bg-bedrock border border-hairline rounded space-y-4">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest block">
            Memo (Internal)
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What is this settlement for?"
            className="w-full bg-chrome border border-hairline rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Link
            href="/home"
            className="flex-1 px-6 py-3 bg-chrome border border-hairline text-neutral-400 font-bold rounded hover:bg-focus hover:text-white transition-all text-center"
          >
            Discard
          </Link>
          <button
            type="submit"
            disabled={isLoading || !isValidForm()}
            className="flex-[2] px-6 py-3 bg-primary text-white font-bold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              'Broadcasting...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Confirm Settlement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
