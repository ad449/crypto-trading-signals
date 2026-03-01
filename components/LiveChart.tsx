'use client'

import { useEffect, useRef } from 'react'
import { TradingPair, Timeframe } from '@/lib/types'

interface LiveChartProps {
  pair: TradingPair
  timeframe: Timeframe
}

// Convert our timeframe format to TradingView interval format
function timeframeToTradingViewInterval(timeframe: Timeframe): string {
  const mapping: Record<Timeframe, string> = {
    '1m': '1',
    '5m': '5',
    '15m': '15',
    '1h': '60',
    '4h': '240',
    '1D': 'D',
  }
  return mapping[timeframe]
}

export default function LiveChart({ pair, timeframe }: LiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Convert pair format for TradingView (BTC/USDT -> BTCUSDT)
    const symbol = pair.replace('/', '')
    
    // Convert timeframe to TradingView interval
    const interval = timeframeToTradingViewInterval(timeframe)

    // Clear previous widget
    containerRef.current.innerHTML = ''

    // Create TradingView widget script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1f2937',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: 'tradingview_chart',
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
            'BB@tv-basicstudies'
          ]
        })
      }
    }

    const chartContainer = document.createElement('div')
    chartContainer.id = 'tradingview_chart'
    chartContainer.style.height = '100%'
    chartContainer.style.width = '100%'
    
    containerRef.current.appendChild(chartContainer)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [pair, timeframe])

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700">
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>📈</span>
          <span>{pair}</span>
          <span className="text-gray-500">•</span>
          <span className="text-blue-400">{timeframe}</span>
        </h3>
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span>Live Chart</span>
        </div>
      </div>
      <div ref={containerRef} style={{ height: '500px' }} className="w-full" />
    </div>
  )
}
