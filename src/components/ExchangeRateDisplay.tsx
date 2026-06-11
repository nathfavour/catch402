'use client'

import React from 'react'
import { useExchangeRate } from '@/contexts/ExchangeRateContext'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExchangeRateDisplayProps {
  className?: string
  showRefresh?: boolean
}

export function ExchangeRateDisplay({ className = '', showRefresh = false }: ExchangeRateDisplayProps) {
  const { rates, isLoading, lastUpdated, refreshRates, formatPriceChange } = useExchangeRate()

  const handleRefresh = () => {
    refreshRates()
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never'
    const now = new Date()
    const diff = now.getTime() - lastUpdated.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return lastUpdated.toLocaleDateString()
  }

  return (
    <div className={cn(
      "bg-bedrock border border-hairline rounded p-6 space-y-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Market Rates</h3>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-neutral-600 uppercase">
            {formatLastUpdated()}
          </span>
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1 text-neutral-500 hover:text-white disabled:animate-spin transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {Object.values(rates).slice(0, 6).map((rate) => {
          if (!rate?.price_usd) return null
          const priceChange = formatPriceChange(rate.price_change_24h)
          const isPositive = rate.price_change_24h >= 0

          return (
            <div key={rate.tokenId} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-chrome border border-hairline flex items-center justify-center text-white text-xs font-bold group-hover:border-primary/50 transition-colors">
                  {rate.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">{rate.symbol}</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-tighter">{rate.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white tracking-tight">
                  ${rate.price_usd.toLocaleString(undefined, { 
                    minimumFractionDigits: rate.price_usd < 1 ? 4 : 2,
                    maximumFractionDigits: rate.price_usd < 1 ? 6 : 2 
                  })}
                </div>
                <div className={cn(
                  "text-[10px] font-bold flex items-center justify-end",
                  isPositive ? "text-success" : "text-error"
                )}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {priceChange.text}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isLoading && (
        <div className="text-center text-[10px] text-neutral-500 uppercase tracking-widest animate-pulse">
          Syncing with global rails...
        </div>
      )}
    </div>
  )
}

interface TokenSelectProps {
  selectedToken: string
  onTokenSelect: (tokenId: string) => void
  className?: string
  label?: string
}

export function TokenSelect({ selectedToken, onTokenSelect, className = '', label }: TokenSelectProps) {
  const { rates, getRate, formatUsdValue } = useExchangeRate()

  const availableTokens = Object.keys(rates)

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <select
        value={selectedToken}
        onChange={(e) => onTokenSelect(e.target.value)}
        className="w-full bg-chrome border border-hairline rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
      >
        <option value="">Select Asset</option>
        {availableTokens.map((tokenId) => {
          const rate = getRate(tokenId)
          return (
            <option key={tokenId} value={tokenId}>
              {rate?.symbol} ({formatUsdValue(rate?.price_usd || 0)})
            </option>
          )
        })}
      </select>
    </div>
  )
}
