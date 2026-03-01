import { TradingPair } from '@/lib/types'

interface PairSelectorProps {
  value: TradingPair
  onChange: (pair: TradingPair) => void
}

const PAIRS: TradingPair[] = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT']

export default function PairSelector({ value, onChange }: PairSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Trading Pair</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TradingPair)}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 min-w-[150px]"
      >
        {PAIRS.map((pair) => (
          <option key={pair} value={pair}>
            {pair}
          </option>
        ))}
      </select>
    </div>
  )
}
