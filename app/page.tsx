'use client'

import { useState, useEffect } from 'react'
import { Signal, PerformanceMetrics, TradingPair, Timeframe } from '@/lib/types'
import SignalCard from '@/components/SignalCard'
import PairSelector from '@/components/PairSelector'
import TimeframeSelector from '@/components/TimeframeSelector'
import PerformanceMetricsDisplay from '@/components/PerformanceMetrics'
import Disclaimer from '@/components/Disclaimer'

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
    <main className="min-h-screen bg-gray-900 text-white">
      <Disclaimer />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Crypto Trading Signals
        </h1>

        {/* Selectors */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <PairSelector value={pair} onChange={setPair} />
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          <button
            onClick={fetchSignal}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh Signal'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Signal Card */}
          <div className="lg:col-span-2">
            {loading && !signal ? (
              <div className="bg-gray-800 rounded-lg p-8 animate-pulse">
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            ) : signal ? (
              <SignalCard signal={signal} />
            ) : null}
          </div>

          {/* Performance Metrics */}
          <div>
            {metrics && <PerformanceMetricsDisplay metrics={metrics} />}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Data updates every 60 seconds</p>
          <p className="mt-2">
            Powered by Binance API, Technical Indicators, and AI Analysis
          </p>
        </div>
      </div>
    </main>
  )
}
