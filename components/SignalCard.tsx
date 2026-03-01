import { Signal } from '@/lib/types'

interface SignalCardProps {
  signal: Signal
}

export default function SignalCard({ signal }: SignalCardProps) {
  const signalColors = {
    BUY: 'from-green-900/50 to-green-800/30 border-green-500',
    SELL: 'from-red-900/50 to-red-800/30 border-red-500',
    NO_TRADE: 'from-gray-800/50 to-gray-700/30 border-gray-600',
  }

  const signalTextColors = {
    BUY: 'text-green-400',
    SELL: 'text-red-400',
    NO_TRADE: 'text-gray-400',
  }

  const signalBadgeColors = {
    BUY: 'bg-green-500/20 text-green-300 border-green-500',
    SELL: 'bg-red-500/20 text-red-300 border-red-500',
    NO_TRADE: 'bg-gray-500/20 text-gray-300 border-gray-500',
  }

  const riskColors = {
    LOW: 'text-green-400 bg-green-500/10',
    MEDIUM: 'text-yellow-400 bg-yellow-500/10',
    HIGH: 'text-red-400 bg-red-500/10',
  }

  return (
    <div className={`rounded-2xl border-2 p-6 bg-gradient-to-br ${signalColors[signal.signalType]} backdrop-blur-sm shadow-2xl transform transition-all hover:scale-[1.02]`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {signal.pair}
          </h2>
          <p className="text-gray-400 text-sm">
            📅 {new Date(signal.timestamp).toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            ⏱️ {signal.timeframe} • {signal.tradeType} Trade
          </p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-black ${signalTextColors[signal.signalType]} animate-pulse`}>
            {signal.signalType}
          </div>
          <div className={`inline-block mt-2 px-4 py-1 rounded-full border ${signalBadgeColors[signal.signalType]} text-sm font-semibold`}>
            {signal.trend}
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${riskColors[signal.riskLevel]} font-bold`}>
          <span>⚠️</span>
          <span>Risk: {signal.riskLevel}</span>
        </div>
      </div>

      {/* Price Levels */}
      {signal.signalType !== 'NO_TRADE' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="text-xs text-gray-400 mb-1 font-semibold">💰 ENTRY</div>
            <div className="text-xl font-bold text-blue-400">${signal.entryPrice.toFixed(2)}</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-red-500 transition-colors">
            <div className="text-xs text-gray-400 mb-1 font-semibold">🛑 STOP LOSS</div>
            <div className="text-xl font-bold text-red-400">
              ${signal.stopLoss.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors">
            <div className="text-xs text-gray-400 mb-1 font-semibold">🎯 TARGET 1</div>
            <div className="text-xl font-bold text-green-400">
              ${signal.takeProfit1.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors">
            <div className="text-xs text-gray-400 mb-1 font-semibold">🚀 TARGET 2</div>
            <div className="text-xl font-bold text-green-400">
              ${signal.takeProfit2.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      {signal.signalType !== 'NO_TRADE' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30">
            <div className="text-sm text-purple-300 mb-2 font-semibold">📊 Risk/Reward</div>
            <div className="text-3xl font-black text-purple-400">{signal.riskRewardRatio.toFixed(2)}x</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-xl p-5 border border-blue-500/30">
            <div className="text-sm text-blue-300 mb-2 font-semibold">🎲 Win Probability</div>
            <div className="text-3xl font-black text-blue-400">{signal.winProbability}%</div>
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 mb-4 border border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 font-semibold">
          <span>🤖</span>
          <span>AI Analysis</span>
        </div>
        <p className="text-gray-200 leading-relaxed">{signal.analysisSummary}</p>
      </div>

      {/* Confirmations */}
      {signal.indicatorConfirmations.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 font-semibold">
            <span>✅</span>
            <span>Confirmations ({signal.indicatorConfirmations.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {signal.indicatorConfirmations.map((confirmation, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300 bg-green-500/10 px-3 py-2 rounded-lg">
                <span className="text-green-400 text-lg">✓</span>
                <span>{confirmation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
