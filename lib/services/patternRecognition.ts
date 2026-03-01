import { OHLCV, SupportResistance, VolumeAnalysis, Trend } from '../types'

/**
 * Identify support and resistance levels from OHLCV data
 * @param ohlcv Array of OHLCV candles
 * @param lookback Number of candles to analyze (default: 50)
 * @returns Support and resistance levels
 */
export function identifySupportResistance(
  ohlcv: OHLCV[],
  lookback: number = 50
): SupportResistance {
  if (ohlcv.length < 3) {
    return { support: [], resistance: [] }
  }

  const dataToAnalyze = ohlcv.slice(-Math.min(lookback, ohlcv.length))
  const support: number[] = []
  const resistance: number[] = []

  // Find local minima (support) and maxima (resistance)
  for (let i = 1; i < dataToAnalyze.length - 1; i++) {
    const prev = dataToAnalyze[i - 1]
    const current = dataToAnalyze[i]
    const next = dataToAnalyze[i + 1]

    // Local minimum (support)
    if (current.low < prev.low && current.low < next.low) {
      support.push(current.low)
    }

    // Local maximum (resistance)
    if (current.high > prev.high && current.high > next.high) {
      resistance.push(current.high)
    }
  }

  // Remove duplicates and sort
  const uniqueSupport = Array.from(new Set(support)).sort((a, b) => b - a)
  const uniqueResistance = Array.from(new Set(resistance)).sort((a, b) => b - a)

  // Return top 3 most recent levels
  return {
    support: uniqueSupport.slice(0, 3),
    resistance: uniqueResistance.slice(0, 3),
  }
}

/**
 * Analyze volume patterns and detect spikes
 * @param volumes Array of volume values
 * @param lookback Number of periods to calculate average (default: 20)
 * @returns Volume analysis result
 */
export function analyzeVolume(
  volumes: number[],
  lookback: number = 20
): VolumeAnalysis {
  if (volumes.length === 0) {
    return {
      averageVolume: 0,
      currentVolume: 0,
      isVolumeSpike: false,
    }
  }

  const currentVolume = volumes[volumes.length - 1]
  
  if (volumes.length < lookback) {
    // Not enough data for proper analysis
    return {
      averageVolume: currentVolume,
      currentVolume: currentVolume,
      isVolumeSpike: false,
    }
  }

  // Calculate average volume over lookback period (excluding current)
  const recentVolumes = volumes.slice(-lookback - 1, -1)
  const averageVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length

  // Volume spike if current volume > 2x average
  const isVolumeSpike = currentVolume > averageVolume * 2

  return {
    averageVolume,
    currentVolume,
    isVolumeSpike,
  }
}

/**
 * Detect trend based on EMA positions
 * @param ema20 20-period EMA
 * @param ema50 50-period EMA
 * @returns Trend direction
 */
export function detectTrend(ema20: number, ema50: number): Trend {
  const tolerance = 0.001 // 0.1% tolerance for neutral

  const diff = (ema20 - ema50) / ema50

  if (Math.abs(diff) < tolerance) {
    return 'NEUTRAL'
  }

  return diff > 0 ? 'BULLISH' : 'BEARISH'
}

/**
 * Detect breakout conditions
 * @param currentPrice Current price
 * @param supportResistance Support and resistance levels
 * @param previousPrice Previous price
 * @returns Breakout type or null
 */
export function detectBreakout(
  currentPrice: number,
  supportResistance: SupportResistance,
  previousPrice: number
): 'RESISTANCE_BREAKOUT' | 'SUPPORT_BREAKDOWN' | null {
  const { support, resistance } = supportResistance

  // Check resistance breakout (price crosses above resistance)
  for (const resistanceLevel of resistance) {
    if (previousPrice <= resistanceLevel && currentPrice > resistanceLevel) {
      return 'RESISTANCE_BREAKOUT'
    }
  }

  // Check support breakdown (price crosses below support)
  for (const supportLevel of support) {
    if (previousPrice >= supportLevel && currentPrice < supportLevel) {
      return 'SUPPORT_BREAKDOWN'
    }
  }

  return null
}
