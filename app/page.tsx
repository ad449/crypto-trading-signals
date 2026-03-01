'use client'

import { useState, useEffect } from 'react'
import { Signal, PerformanceMetrics, TradingPair, Timeframe } from '@/lib/types'
import SignalCard from '@/components/SignalCard'
import PairSelector from '@/components/PairSelector'
import TimeframeSelector from '@/components/TimeframeSelector'
import PerformanceMetricsDisplay from '@/components/PerformanceMetrics'
import Disclaimer from '@/components/Disclaimer'
import LiveChart from '@/components/LiveChart'

export default function Home() {
  const [pair, setPair] = useState<TradingPair>('BTC/USDT')
  const [timeframe, setTimeframe] = useState<Timeframe>('1h')
  const [signal, setSignal] = useState<Signal | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch signal
  const fetchSignal = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/signals/generate?pair=${encodeURIComponent(pair)}&timeframe=${encodeURIComponent(timeframe)}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch signal')
      }

      const data = await response.json()
      setSignal(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching signal:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch(
        `/api/metrics?pair=${encodeURIComponent(pair)}&timeframe=${encodeURIComponent(timeframe)}`
      )

      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (err) {
      console.error('Error fetching metrics:', err)
    }
  }

  // Fetch on mount and when pair/timeframe changes
  useEffect(() => {
    fetchSignal()
    fetchMetrics()
  }, [pair, timeframe])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignal()
      fetchMetrics()
    }, 60000)

    return () => clearInterval(interval)
  }, [pair, timeframe])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {/* Compact Header - Bybit Style */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AD AI Crypto Trading
            </h1>
            <div className="text-sm text-gray-400">
              Real-time AI Signals
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-4">
        {/* Compact Controls Bar - Bybit Style */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 mb-4 border border-gray-700">
          <div className="flex flex-wrap items-center gap-3">
            <PairSelector value={pair} onChange={setPair} />
            <TimeframeSelector value={timeframe} onChange={setTimeframe} />
            <button
              onClick={fetchSignal}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-sm">
            <p className="text-red-200">⚠️ {error}</p>
          </div>
        )}

        {/* Live Chart */}
        <div className="mb-4">
          <LiveChart pair={pair} timeframe={timeframe} />
        </div>

        {/* Signal and Metrics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Signal Card */}
          <div className="xl:col-span-2">
            {loading && !signal ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 animate-pulse border border-gray-700">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-24 bg-gray-700 rounded"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ) : signal ? (
              <SignalCard signal={signal} />
            ) : null}
          </div>

          {/* Performance Metrics */}
          <div className="xl:col-span-1">
            {metrics && <PerformanceMetricsDisplay metrics={metrics} />}
          </div>
        </div>

        {/* Compact Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-sm font-bold mb-1">Technical Analysis</h3>
            <p className="text-gray-400 text-xs">RSI, MACD, EMA, Bollinger Bands</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-sm font-bold mb-1">AI-Powered</h3>
            <p className="text-gray-400 text-xs">Advanced market analysis</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-sm font-bold mb-1">Real-Time Data</h3>
            <p className="text-gray-400 text-xs">Updates every 60 seconds</p>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-6">
        <div className="container mx-auto px-4 py-4">
          <Disclaimer />
          
          <div className="mt-4 text-center text-gray-500 text-xs space-y-1">
            <p>Powered by CryptoCompare API • Technical Indicators • AI Analysis</p>
            <p>© 2026 AD AI Crypto Trading</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
