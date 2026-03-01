import { RSI, MACD, EMA, BollingerBands } from 'technicalindicators'
import { OHLCV, MACDResult, BollingerBands as BollingerBandsType } from '../types'

/**
 * Calculate RSI (Relative Strength Index)
 * @param prices Array of closing prices
 * @param period Period for RSI calculation (default: 14)
 * @returns RSI value between 0 and 100
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period) {
    throw new Error(`Insufficient data: need ${period} prices, have ${prices.length}`)
  }

  const rsiValues = RSI.calculate({
    values: prices,
    period: period,
  })

  if (rsiValues.length === 0) {
    // If RSI calculation fails (e.g., all prices are the same), return neutral 50
    return 50
  }

  return rsiValues[rsiValues.length - 1]
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * @param prices Array of closing prices
 * @returns MACD result with macd, signal, and histogram values
 */
export function calculateMACD(prices: number[]): MACDResult {
  const minLength = 26 + 9
  
  if (prices.length < minLength) {
    throw new Error(`Insufficient data: need ${minLength} prices, have ${prices.length}`)
  }

  const macdValues = MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  })

  if (macdValues.length === 0) {
    // If MACD calculation fails, return neutral values
    return { macd: 0, signal: 0, histogram: 0 }
  }

  const latest = macdValues[macdValues.length - 1]
  
  return {
    macd: latest.MACD || 0,
    signal: latest.signal || 0,
    histogram: latest.histogram || 0,
  }
}

/**
 * Calculate EMA (Exponential Moving Average)
 * @param prices Array of closing prices
 * @param period Period for EMA calculation
 * @returns EMA value
 */
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) {
    throw new Error(`Insufficient data: need ${period} prices, have ${prices.length}`)
  }

  const emaValues = EMA.calculate({
    values: prices,
    period: period,
  })

  if (emaValues.length === 0) {
    // If EMA calculation fails, return the average of prices
    return prices.reduce((a, b) => a + b, 0) / prices.length
  }

  return emaValues[emaValues.length - 1]
}

/**
 * Calculate Bollinger Bands
 * @param prices Array of closing prices
 * @param period Period for SMA calculation (default: 20)
 * @param stdDev Number of standard deviations (default: 2)
 * @returns Bollinger Bands with upper, middle, and lower values
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): BollingerBandsType {
  if (prices.length < period) {
    throw new Error(`Insufficient data: need ${period} prices, have ${prices.length}`)
  }

  const bbValues = BollingerBands.calculate({
    values: prices,
    period: period,
    stdDev: stdDev,
  })

  if (bbValues.length === 0) {
    // If BB calculation fails, return neutral bands
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    return { upper: avg, middle: avg, lower: avg }
  }

  const latest = bbValues[bbValues.length - 1]
  
  return {
    upper: latest.upper,
    middle: latest.middle,
    lower: latest.lower,
  }
}

/**
 * Validate that there is sufficient data for indicator calculation
 * @param dataLength Length of available data
 * @param requiredLength Minimum required length
 * @param indicatorName Name of the indicator for error message
 */
export function validateDataLength(
  dataLength: number,
  requiredLength: number,
  indicatorName: string
): void {
  if (dataLength < requiredLength) {
    throw new Error(
      `Insufficient data for ${indicatorName}: need ${requiredLength} data points, have ${dataLength}`
    )
  }
}
