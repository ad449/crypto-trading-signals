import { PerformanceMetrics } from '@/lib/types'

interface PerformanceMetricsProps {
  metrics: PerformanceMetrics
}

export default function PerformanceMetricsDisplay({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>

      <div className="space-y-4">
        <div className="bg-gray-700/50 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Total Signals</div>
          <div className="text-2xl font-bold">{metrics.totalSignals}</div>
        </div>

        <div className="bg-gray-700/50 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Win Rate</div>
          <div className={`text-2xl font-bold ${
            metrics.winRate >= 60 ? 'text-green-400' :
            metrics.winRate >= 50 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {metrics.winRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {metrics.winningSignals}W / {metrics.losingSignals}L
          </div>
        </div>

        <div className="bg-gray-700/50 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Avg Risk/Reward</div>
          <div className="text-2xl font-bold text-blue-400">
            {metrics.averageRR.toFixed(2)}x
          </div>
        </div>
      </div>
    </div>
  )
}
