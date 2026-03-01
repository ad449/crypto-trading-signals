'use client'

import { Timeframe } from '@/lib/types'

interface TimeframeSelectorProps {
  value: Timeframe
  onChange: (timeframe: Timeframe) => void
}

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1D', label: '1D' },
]

export default function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded p-1 border border-gray-700">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onChange(tf.value)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
            value === tf.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  )
}
