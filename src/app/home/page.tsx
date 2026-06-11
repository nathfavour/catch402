'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWallet } from '@/contexts/WalletContext'
import { useTransaction } from '@/contexts/TransactionContext'
import { usePaymentRequest } from '@/contexts/PaymentRequestContext'
import { useExchangeRate } from '@/contexts/ExchangeRateContext'
import { ExchangeRateDisplay } from '@/components/ExchangeRateDisplay'
import { 
  Send, 
  Download, 
  Plus, 
  ArrowRight, 
  RefreshCw, 
  Check, 
  Terminal, 
  User, 
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { account, userProfile, isAuthenticated, isLoading, refreshProfile } = useAuth()
  const { wallets, defaultWallet, isLoading: walletsLoading, error: walletsError } = useWallet()
  const { transactions, isLoading: transactionsLoading, error: transactionsError } = useTransaction()
  const { getActiveRequests, isLoading: paymentRequestsLoading } = usePaymentRequest()
  const { calculateUsdValue, formatUsdValue } = useExchangeRate()
  const [totalBalance, setTotalBalance] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    refreshProfile()
  }, [])

  useEffect(() => {
    if (isAuthenticated && wallets.length > 0) {
      let totalUsd = 0
      wallets.forEach(wallet => {
        const balance = parseFloat(wallet.balance?.toString() || '0')
        if (balance > 0) {
          const usdValue = calculateUsdValue(balance, wallet.blockchain)
          totalUsd += usdValue
        }
      })
      setTotalBalance(totalUsd)
    }
  }, [wallets, calculateUsdValue, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {userProfile?.displayName || userProfile?.email?.split('@')[0] || account?.name || 'User'}
        </h1>
        <p className="text-neutral-500 text-sm">
          Everything is running smoothly on the agentic rails.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 p-8 bg-chrome border border-hairline rounded flex flex-col justify-between">
          <div className="flex items-center justify-between">
             <span className="text-neutral-500 text-xs font-medium uppercase tracking-widest">Total Portfolio</span>
             <button onClick={() => window.location.reload()} className="p-2 hover:bg-focus rounded transition-colors">
               <RefreshCw className="h-4 w-4 text-neutral-500" />
             </button>
          </div>
          
          <div className="mt-4">
            {walletsLoading ? (
               <div className="h-12 w-48 bg-focus animate-pulse rounded" />
            ) : (
              <div className="text-5xl font-bold tracking-tighter text-white">
                {formatUsdValue(totalBalance)}
              </div>
            )}
            <p className="text-neutral-500 text-sm mt-2">
              Across {wallets.length} active wallets
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/send" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <Send className="h-4 w-4" /> Send
            </Link>
            <Link href="/receive" className="px-4 py-2 bg-focus border border-hairline text-white text-sm font-bold rounded flex items-center gap-2 hover:bg-chrome transition-colors">
              <Download className="h-4 w-4" /> Receive
            </Link>
          </div>
        </div>

        {/* Quick Actions / Activity Info */}
        <div className="p-6 bg-bedrock border border-hairline rounded space-y-4">
           <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Quick Actions</h3>
           <div className="grid grid-cols-1 gap-2">
              <Link href="/requests/create" className="p-3 bg-chrome border border-hairline rounded flex items-center justify-between hover:bg-focus transition-colors group">
                <span className="text-sm font-medium">Request Payment</span>
                <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/wallets/create" className="p-3 bg-chrome border border-hairline rounded flex items-center justify-between hover:bg-focus transition-colors group">
                <span className="text-sm font-medium">Add New Wallet</span>
                <Plus className="h-4 w-4 text-neutral-500 group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/settings" className="p-3 bg-chrome border border-hairline rounded flex items-center justify-between hover:bg-focus transition-colors group">
                <span className="text-sm font-medium">Engine Settings</span>
                <Settings className="h-4 w-4 text-neutral-500 group-hover:text-primary transition-colors" />
              </Link>
           </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Transactions Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Recent Activity</h2>
            <Link href="/transactions" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>

          <div className="bg-chrome border border-hairline rounded divide-y divide-hairline">
            {transactionsLoading ? (
              <div className="p-8 text-center text-neutral-500 text-sm">Loading ledger...</div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-neutral-500 text-sm">No transactions recorded yet.</p>
                <Link href="/send" className="inline-flex text-sm text-primary font-bold">Initiate first transfer →</Link>
              </div>
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <div key={tx.$id} className="p-4 flex items-center justify-between hover:bg-focus/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded border border-hairline bg-void",
                      tx.type === 'send' ? "text-neutral-400" : "text-success"
                    )}>
                      {tx.type === 'send' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white capitalize">{tx.type}</div>
                      <div className="text-xs text-neutral-500 truncate max-w-[120px] md:max-w-xs">{tx.description || 'System Transaction'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-bold",
                      tx.type === 'send' ? "text-white" : "text-success"
                    )}>
                      {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.tokenId.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest">{tx.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exchange Rates Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight">Market Rates</h2>
          <ExchangeRateDisplay showRefresh={false} />
        </div>
      </div>
    </div>
  )
}
