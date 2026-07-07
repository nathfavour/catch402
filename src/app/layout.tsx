import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { AuthProvider } from '@/contexts/AuthContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { TransactionProvider } from '@/contexts/TransactionContext'
import { PaymentRequestProvider } from '@/contexts/PaymentRequestContext'
import { ExchangeRateProvider } from '@/contexts/ExchangeRateContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { CapitalProvider } from '@/contexts/CapitalContext'
import LayoutClient from './layoutClient'

export const metadata: Metadata = {
  title: 'Catch402',
  description: 'Decentralized serverless transaction telemetry router.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className="antialiased">
        <AuthProvider>
          <ExchangeRateProvider>
            <WalletProvider>
              <TransactionProvider>
                <PaymentRequestProvider>
                  <CapitalProvider>
                    <SidebarProvider>
                      <Providers>
                        <LayoutClient>{children}</LayoutClient>
                      </Providers>
                    </SidebarProvider>
                  </CapitalProvider>
                </PaymentRequestProvider>
              </TransactionProvider>
            </WalletProvider>
          </ExchangeRateProvider>
        </AuthProvider>
      </body>
    </html>
  )
}