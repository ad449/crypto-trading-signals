import { generateSignal } from './signalGenerator'
import { TradingPair, Timeframe } from '../types'

// Note: These tests will make real API calls and may take time
// In production, you'd want to mock the external dependencies

describe('Signal Generator Integration Tests', () => {
  test('should generate valid signal for BTC/USDT 1h', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    // Validate structure
    expect(signal).toHaveProperty('pair')
    expect(signal).toHaveProperty('timeframe')
    expect(signal).toHaveProperty('timestamp')
    expect(signal).toHaveProperty('trend')
    expect(signal).toHaveProperty('signalType')
    expect(signal).toHaveProperty('entryPrice')
    expect(signal).toHaveProperty('stopLoss')
    expect(signal).toHaveProperty('takeProfit1')
    expect(signal).toHaveProperty('takeProfit2')
    expect(signal).toHaveProperty('riskRewardRatio')
    expect(signal).toHaveProperty('winProbability')
    expect(signal).toHaveProperty('analysisSummary')
    expect(signal).toHaveProperty('indicatorConfirmations')
    expect(signal).toHaveProperty('riskLevel')
    expect(signal).toHaveProperty('tradeType')
    
    // Validate types
    expect(signal.pair).toBe('BTC/USDT')
    expect(signal.timeframe).toBe('1h')
    expect(typeof signal.timestamp).toBe('number')
    expect(['BULLISH', 'BEARISH', 'NEUTRAL']).toContain(signal.trend)
    expect(['BUY', 'SELL', 'NO_TRADE']).toContain(signal.signalType)
    expect(typeof signal.entryPrice).toBe('number')
    expect(typeof signal.stopLoss).toBe('number')
    expect(typeof signal.takeProfit1).toBe('number')
    expect(typeof signal.takeProfit2).toBe('number')
    expect(typeof signal.riskRewardRatio).toBe('number')
    expect(typeof signal.winProbability).toBe('number')
    expect(typeof signal.analysisSummary).toBe('string')
    expect(Array.isArray(signal.indicatorConfirmations)).toBe(true)
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(signal.riskLevel)
    expect(['SCALP', 'SWING', 'POSITION']).toContain(signal.tradeType)
    
    // Validate values
    expect(signal.entryPrice).toBeGreaterThan(0)
    expect(signal.riskRewardRatio).toBeGreaterThanOrEqual(0)
    expect(signal.winProbability).toBeGreaterThanOrEqual(0)
    expect(signal.winProbability).toBeLessThanOrEqual(100)
  }, 30000)

  test('should generate SWING trade type for 1h timeframe', async () => {
    const signal = await generateSignal('ETH/USDT', '1h')
    expect(signal.tradeType).toBe('SWING')
  }, 30000)

  test('should generate SCALP trade type for 5m timeframe', async () => {
    const signal = await generateSignal('BTC/USDT', '5m')
    expect(signal.tradeType).toBe('SCALP')
  }, 30000)

  test('should have valid stop loss for BUY signal', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    if (signal.signalType === 'BUY') {
      // Stop loss should be below entry price
      expect(signal.stopLoss).toBeLessThan(signal.entryPrice)
      
      // Stop loss should be approximately 2.5% below entry
      const distance = (signal.entryPrice - signal.stopLoss) / signal.entryPrice
      expect(distance).toBeCloseTo(0.025, 1)
    }
  }, 30000)

  test('should have valid take profit levels', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    if (signal.signalType === 'BUY') {
      // TP1 and TP2 should be above entry
      expect(signal.takeProfit1).toBeGreaterThan(signal.entryPrice)
      expect(signal.takeProfit2).toBeGreaterThan(signal.takeProfit1)
      
      // Validate multipliers
      const risk = signal.entryPrice - signal.stopLoss
      const reward1 = signal.takeProfit1 - signal.entryPrice
      const reward2 = signal.takeProfit2 - signal.entryPrice
      
      expect(reward1 / risk).toBeCloseTo(1.5, 1)
      expect(reward2 / risk).toBeCloseTo(3, 1)
    } else if (signal.signalType === 'SELL') {
      // TP1 and TP2 should be below entry
      expect(signal.takeProfit1).toBeLessThan(signal.entryPrice)
      expect(signal.takeProfit2).toBeLessThan(signal.takeProfit1)
    }
  }, 30000)

  test('should have valid risk-reward ratio', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    if (signal.signalType !== 'NO_TRADE') {
      expect(signal.riskRewardRatio).toBeGreaterThan(0)
      
      // Manually calculate and verify
      const risk = Math.abs(signal.entryPrice - signal.stopLoss)
      const reward = Math.abs(signal.takeProfit2 - signal.entryPrice)
      const expectedRR = reward / risk
      
      expect(signal.riskRewardRatio).toBeCloseTo(expectedRR, 1)
    }
  }, 30000)

  test('should have win probability between 50-100 for valid signals', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    if (signal.signalType !== 'NO_TRADE') {
      expect(signal.winProbability).toBeGreaterThanOrEqual(50)
      expect(signal.winProbability).toBeLessThanOrEqual(100)
    }
  }, 30000)

  test('should have at least 3 confirmations for BUY/SELL signals', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    if (signal.signalType === 'BUY' || signal.signalType === 'SELL') {
      expect(signal.indicatorConfirmations.length).toBeGreaterThanOrEqual(3)
    }
  }, 30000)

  test('should generate analysis summary', async () => {
    const signal = await generateSignal('BTC/USDT', '1h')
    
    expect(signal.analysisSummary).toBeTruthy()
    expect(signal.analysisSummary.length).toBeGreaterThan(0)
  }, 30000)
})
