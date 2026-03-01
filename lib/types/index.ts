// Core data models for crypto trading signals

// Trading pair configuration
export type TradingPair = 'BTC/USDT' | 'ETH/USDT' | 'BNB/USDT' | 'SOL/USDT' | 'ADA/USDT'

// Timeframe options
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D'

// Signal types
export type SignalType = 'BUY' | 'SELL' | 'NO_TRADE'

// Trend types
export type Trend = 'BULLISH' | 'BEARISH' | 'NEUTRAL'

// Risk levels
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

// Trade types
export type TradeType = 'SCALP' | 'SWING' | 'POSITION'

// Signal outcome
export type Outcome = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN'

// OHLCV data structure
export interface OHLCV {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// MACD calculation result
export interface MACDResult {
  macd: number
  signal: number
  histogram: number
}

// Bollinger Bands result
export interface BollingerBands {
  upper: number
  middle: number
  lower: number
}

// Support and resistance levels
export interface SupportResistance {
  support: number[]
  resistance: number[]
}

// Volume analysis result
export interface VolumeAnalysis {
  averageVolume: number
  currentVolume: number
  isVolumeSpike: boolean
}

// Indicator data for AI analysis
export interface IndicatorData {
  rsi: number
  macd: MACDResult
  ema20: number
  ema50: number
  ema200: number
  bollingerBands: BollingerBands
  trend: Trend
  volumeAnalysis: VolumeAnalysis
}

// AI analysis result
export interface AIAnalysis {
  summary: string
  confidence: number
  keyPoints: string[]
}

// Trading signal
export interface Signal {
  pair: string
  timeframe: string
  timestamp: number
  trend: Trend
  signalType: SignalType
  entryPrice: number
  stopLoss: number
  takeProfit1: number
  takeProfit2: number
  riskRewardRatio: number
  winProbability: number
  analysisSummary: string
  indicatorConfirmations: string[]
  riskLevel: RiskLevel
  tradeType: TradeType
}

// Performance metrics
export interface PerformanceMetrics {
  totalSignals: number
  winningSignals: number
  losingSignals: number
  winRate: number
  averageRR: number
}
