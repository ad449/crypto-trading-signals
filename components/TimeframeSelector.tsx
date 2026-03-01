import { Timeframe } from '@/lib/types'

interface TimeframeSelectorProps {
  value: Timeframe
  onChange: (timeframe: Timeframe) => void
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D']

export default function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Timeframe</label>
      <div className="flex gap-2">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => onChange(tf)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              value === tf
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  )
}
