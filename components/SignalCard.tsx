import { Signal } from '@/lib/types'

interface SignalCardProps {
  signal: Signal
}

export default function SignalCard({ signal }: SignalCardProps) {
  const signalColors = {
    BUY: 'bg-green-900/50 border-green-500',
    SELL: 'bg-red-900/50 border-red-500',
    NO_TRADE: 'bg-gray-800 border-gray-600',
  }

  const signalTextColors = {
    BUY: 'text-green-400',
    SELL: 'text-red-400',
    NO_TRADE: 'text-gray-400',
  }

  const riskColors = {
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-red-400',
  }

  return (
    <div className={`rounded-lg border-2 p-6 ${signalColors[signal.signalType]}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {signal.pair} <span className="text-gray-400 text-xl">({signal.timeframe})</span>
          </h2>
          <p className="text-gray-400">
            {new Date(signal.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${signalTextColors[signal.signalType]}`}>
            {signal.signalType}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {signal.tradeType} Trade
          </div>
        </div>
      </div>

      {/* Trend and Risk */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Trend</div>
          <div className="text-xl font-semibold">{signal.trend}</div>
        </div>
        <div className="bg-gray-800/50 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Risk Level</div>
          <div className={`text-xl font-semibold ${riskColors[signal.riskLevel]}`}>
            {signal.riskLevel}
          </div>
        </div>
      </div>

      {/* Price Levels */}
      {signal.signalType !== 'NO_TRADE' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded p-4">
            <div className="text-sm text-gray-400 mb-1">Entry</div>
            <div className="text-lg font-semibold">${signal.entryPrice.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-4">
            <div className="text-sm text-gray-400 mb-1">Stop Loss</div>
            <div className="text-lg font-semibold text-red-400">
              ${signal.stopLoss.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded p-4">
            <div className="text-sm text-gray-400 mb-1">TP1</div>
            <div className="text-lg font-semibold text-green-400">
              ${signal.takeProfit1.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded p-4">
            <div className="text-sm text-gray-400 mb-1">TP2</div>
            <div className="text-lg font-semibold text-green-400">
              ${signal.takeProfit2.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      {signal.signalType !== 'NO_TRADE' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded p-4">
            <div className="text-sm text-gray-400 mb-1">Risk/Reward Ratio</div>
            <div className="text-2xl font-bold">{signal.riskRewardRatio.toFixed(2)}x</div>
          </div>
          <div className="bg-gray-800/50 rounded p-4">
            <div className="text-sm text-gray-400 mb-1">Win Probability</div>
            <div className="text-2xl font-bold">{signal.winProbability}%</div>
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="bg-gray-800/50 rounded p-4 mb-4">
        <div className="text-sm text-gray-400 mb-2">Analysis</div>
        <p className="text-gray-200">{signal.analysisSummary}</p>
      </div>

      {/* Confirmations */}
      {signal.indicatorConfirmations.length > 0 && (
        <div className="bg-gray-800/50 rounded p-4">
          <div className="text-sm text-gray-400 mb-2">
            Confirmations ({signal.indicatorConfirmations.length})
          </div>
          <ul className="space-y-1">
            {signal.indicatorConfirmations.map((confirmation, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                {confirmation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
