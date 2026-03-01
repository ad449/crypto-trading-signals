import { fetchOHLCV, getCurrentPrice } from './marketData'
import { calculateRSI, calculateMACD, calculateEMA, calculateBollingerBands } from './technicalAnalysis'
import { identifySupportResistance, analyzeVolume, detectTrend, detectBreakout } from './patternRecognition'
import { analyzeMarket } from './aiAnalysis'
import { Signal, TradingPair, Timeframe, SignalType, RiskLevel, TradeType, IndicatorData } from '../types'

/**
 * Check if BUY confluence conditions are met
 * Requires at least 3 of 6 indicators to agree
 */
function checkBuyConfluence(
  rsi: number,
  macd: { histogram: number },
  currentPrice: number,
  ema20: number,
  ema50: number,
  bollingerBands: { lower: number },
  volumeSpike: boolean,
  breakout: string | null,
  resistance: number[]
): { count: number; confirmations: string[] } {
  const confirmations: string[] = []
  
  // 1. RSI < 40 (oversold)
  if (rsi < 40) {
    confirmations.push('RSI oversold (<40)')
  }
  
  // 2. MACD histogram positive and increasing
  if (macd.histogram > 0) {
    confirmations.push('MACD bullish momentum')
  }
  
  // 3. Price above EMA 20 or EMA 20 crossing above EMA 50
  if (currentPrice > ema20 || ema20 > ema50) {
    confirmations.push('EMA alignment bullish')
  }
  
  // 4. Price near lower Bollinger Band
  const distanceToLower = Math.abs(currentPrice - bollingerBands.lower) / currentPrice
  if (distanceToLower < 0.02) { // Within 2%
    confirmations.push('Price near lower Bollinger Band')
  }
  
  // 5. Volume spike detected
  if (volumeSpike) {
    confirmations.push('Volume spike detected')
  }
  
  // 6. Price breaking above recent resistance
  if (breakout === 'RESISTANCE_BREAKOUT') {
    confirmations.push('Resistance breakout')
  }
  
  return { count: confirmations.length, confirmations }
}

/**
 * Check if SELL confluence conditions are met
 * Requires at least 3 of 6 indicators to agree
 */
function checkSellConfluence(
  rsi: number,
  macd: { histogram: number },
  currentPrice: number,
  ema20: number,
  ema50: number,
  bollingerBands: { upper: number },
  volumeSpike: boolean,
  breakout: string | null,
  support: number[]
): { count: number; confirmations: string[] } {
  const confirmations: string[] = []
  
  // 1. RSI > 60 (overbought)
  if (rsi > 60) {
    confirmations.push('RSI overbought (>60)')
  }
  
  // 2. MACD histogram negative and decreasing
  if (macd.histogram < 0) {
    confirmations.push('MACD bearish momentum')
  }
  
  // 3. Price below EMA 20 or EMA 20 crossing below EMA 50
  if (currentPrice < ema20 || ema20 < ema50) {
    confirmations.push('EMA alignment bearish')
  }
  
  // 4. Price near upper Bollinger Band
  const distanceToUpper = Math.abs(currentPrice - bollingerBands.upper) / currentPrice
  if (distanceToUpper < 0.02) { // Within 2%
    confirmations.push('Price near upper Bollinger Band')
  }
  
  // 5. Volume spike detected
  if (volumeSpike) {
    confirmations.push('Volume spike detected')
  }
  
  // 6. Price breaking below recent support
  if (breakout === 'SUPPORT_BREAKDOWN') {
    confirmations.push('Support breakdown')
  }
  
  return { count: confirmations.length, confirmations }
}

/**
 * Determine signal type based on confluence count
 */
function determineSignalType(
  buyCount: number,
  sellCount: number,
  minConfluence: number = 3
): SignalType {
  if (buyCount >= minConfluence && buyCount > sellCount) {
    return 'BUY'
  }
  
  if (sellCount >= minConfluence && sellCount > buyCount) {
    return 'SELL'
  }
  
  return 'NO_TRADE'
}

/**
 * Calculate stop loss price
 */
function calculateStopLoss(entryPrice: number, signalType: SignalType): number {
  const stopLossPercent = 0.025 // 2.5%
  
  if (signalType === 'BUY') {
    return entryPrice * (1 - stopLossPercent)
  } else if (signalType === 'SELL') {
    return entryPrice * (1 + stopLossPercent)
  }
  
  return entryPrice
}

/**
 * Calculate take profit levels
 */
function calculateTakeProfits(
  entryPrice: number,
  stopLoss: number,
  signalType: SignalType
): { tp1: number; tp2: number } {
  const riskDistance = Math.abs(entryPrice - stopLoss)
  
  if (signalType === 'BUY') {
    return {
      tp1: entryPrice + (riskDistance * 1.5),
      tp2: entryPrice + (riskDistance * 3),
    }
  } else if (signalType === 'SELL') {
    return {
      tp1: entryPrice - (riskDistance * 1.5),
      tp2: entryPrice - (riskDistance * 3),
    }
  }
  
  return { tp1: entryPrice, tp2: entryPrice }
}

/**
 * Calculate risk-reward ratio
 */
function calculateRiskRewardRatio(
  entryPrice: number,
  stopLoss: number,
  takeProfit2: number,
  signalType: SignalType
): number {
  const risk = Math.abs(entryPrice - stopLoss)
  const reward = Math.abs(takeProfit2 - entryPrice)
  
  if (risk === 0) return 0
  
  return reward / risk
}

/**
 * Calculate win probability based on confirmations
 */
function calculateWinProbability(confirmationCount: number): number {
  const minConfluence = 3
  const baseProb = 50
  const bonusPerConfirmation = 5
  
  const bonus = (confirmationCount - minConfluence) * bonusPerConfirmation
  return Math.min(baseProb + bonus, 100)
}

/**
 * Determine risk level
 */
function determineRiskLevel(
  confirmationCount: number,
  riskRewardRatio: number
): RiskLevel {
  if (confirmationCount >= 5 && riskRewardRatio > 2.5) {
    return 'LOW'
  }
  
  if (confirmationCount >= 3 && riskRewardRatio >= 1.5) {
    return 'MEDIUM'
  }
  
  return 'HIGH'
}

/**
 * Determine trade type based on timeframe
 */
function determineTradeType(timeframe: Timeframe): TradeType {
  if (timeframe === '1m' || timeframe === '5m') {
    return 'SCALP'
  }
  
  if (timeframe === '15m' || timeframe === '1h' || timeframe === '4h') {
    return 'SWING'
  }
  
  return 'POSITION'
}

/**
 * Generate trading signal for a given pair and timeframe
 */
export async function generateSignal(
  pair: TradingPair,
  timeframe: Timeframe
): Promise<Signal> {
  // Fetch market data
  const ohlcv = await fetchOHLCV(pair, timeframe, 200)
  const currentPrice = await getCurrentPrice(pair)
  
  // Extract price and volume data
  const closePrices = ohlcv.map(c => c.close)
  const volumes = ohlcv.map(c => c.volume)
  
  // Calculate technical indicators
  const rsi = calculateRSI(closePrices, 14)
  const macd = calculateMACD(closePrices)
  const ema20 = calculateEMA(closePrices, 20)
  const ema50 = calculateEMA(closePrices, 50)
  const ema200 = calculateEMA(closePrices, 200)
  const bollingerBands = calculateBollingerBands(closePrices, 20, 2)
  
  // Pattern recognition
  const supportResistance = identifySupportResistance(ohlcv, 50)
  const volumeAnalysis = analyzeVolume(volumes, 20)
  const trend = detectTrend(ema20, ema50)
  
  // Detect breakout (compare current price with previous)
  const previousPrice = closePrices[closePrices.length - 2]
  const breakout = detectBreakout(currentPrice, supportResistance, previousPrice)
  
  // Check confluence for BUY and SELL
  const buyConfluence = checkBuyConfluence(
    rsi,
    macd,
    currentPrice,
    ema20,
    ema50,
    bollingerBands,
    volumeAnalysis.isVolumeSpike,
    breakout,
    supportResistance.resistance
  )
  
  const sellConfluence = checkSellConfluence(
    rsi,
    macd,
    currentPrice,
    ema20,
    ema50,
    bollingerBands,
    volumeAnalysis.isVolumeSpike,
    breakout,
    supportResistance.support
  )
  
  // Determine signal type
  const signalType = determineSignalType(buyConfluence.count, sellConfluence.count)
  
  // Get confirmations based on signal type
  const confirmations = signalType === 'BUY' 
    ? buyConfluence.confirmations 
    : signalType === 'SELL' 
    ? sellConfluence.confirmations 
    : []
  
  const confirmationCount = confirmations.length
  
  // Calculate risk parameters
  const entryPrice = currentPrice
  const stopLoss = calculateStopLoss(entryPrice, signalType)
  const { tp1, tp2 } = calculateTakeProfits(entryPrice, stopLoss, signalType)
  const riskRewardRatio = calculateRiskRewardRatio(entryPrice, stopLoss, tp2, signalType)
  const winProbability = calculateWinProbability(confirmationCount)
  const riskLevel = determineRiskLevel(confirmationCount, riskRewardRatio)
  const tradeType = determineTradeType(timeframe)
  
  // Get AI analysis
  const indicatorData: IndicatorData = {
    rsi,
    macd,
    ema20,
    ema50,
    ema200,
    bollingerBands,
    trend,
    volumeAnalysis,
  }
  
  const aiAnalysis = await analyzeMarket(indicatorData)
  
  // Construct signal
  const signal: Signal = {
    pair,
    timeframe,
    timestamp: Date.now(),
    trend,
    signalType,
    entryPrice,
    stopLoss,
    takeProfit1: tp1,
    takeProfit2: tp2,
    riskRewardRatio,
    winProbability,
    analysisSummary: aiAnalysis.summary,
    indicatorConfirmations: confirmations,
    riskLevel,
    tradeType,
  }
  
  return signal
}
