import fc from 'fast-check'
import { analyzeMarket } from './aiAnalysis'
import { IndicatorData } from '../types'

// Generator for indicator data
const indicatorDataArb = fc.record({
  rsi: fc.float({ min: 0, max: 100, noNaN: true }),
  macd: fc.record({
    macd: fc.float({ min: -1000, max: 1000, noNaN: true }),
    signal: fc.float({ min: -1000, max: 1000, noNaN: true }),
    histogram: fc.float({ min: -1000, max: 1000, noNaN: true }),
  }),
  ema20: fc.float({ min: 1, max: 100000, noNaN: true }),
  ema50: fc.float({ min: 1, max: 100000, noNaN: true }),
  ema200: fc.float({ min: 1, max: 100000, noNaN: true }),
  bollingerBands: fc.record({
    upper: fc.float({ min: 1, max: 100000, noNaN: true }),
    middle: fc.float({ min: 1, max: 100000, noNaN: true }),
    lower: fc.float({ min: 1, max: 100000, noNaN: true }),
  }),
  trend: fc.constantFrom('BULLISH', 'BEARISH', 'NEUTRAL'),
  volumeAnalysis: fc.record({
    averageVolume: fc.float({ min: 0, max: 1000000, noNaN: true }),
    currentVolume: fc.float({ min: 0, max: 1000000, noNaN: true }),
    isVolumeSpike: fc.boolean(),
  }),
})

// Feature: crypto-trading-signals, Property 13: AI Service Fallback Behavior
describe('Property 13: AI Service Fallback Behavior', () => {
  test('should generate valid analysis even when AI is unavailable', async () => {
    // Test with invalid/missing API key to trigger fallback
    const originalKey = process.env.GROQ_API_KEY
    delete process.env.GROQ_API_KEY

    await fc.assert(
      fc.asyncProperty(indicatorDataArb, async (indicators) => {
        const analysis = await analyzeMarket(indicators)

        // Should still return valid analysis structure
        expect(analysis).toHaveProperty('summary')
        expect(analysis).toHaveProperty('confidence')
        expect(analysis).toHaveProperty('keyPoints')

        expect(typeof analysis.summary).toBe('string')
        expect(analysis.summary.length).toBeGreaterThan(0)

        expect(typeof analysis.confidence).toBe('number')
        expect(analysis.confidence).toBeGreaterThanOrEqual(0)
        expect(analysis.confidence).toBeLessThanOrEqual(100)

        expect(Array.isArray(analysis.keyPoints)).toBe(true)
        expect(analysis.keyPoints.length).toBeGreaterThan(0)
      }),
      { numRuns: 20 }
    )

    // Restore API key
    if (originalKey) {
      process.env.GROQ_API_KEY = originalKey
    }
  }, 30000)
})

// Feature: crypto-trading-signals, Property 14: AI Analysis Response Structure
describe('Property 14: AI Analysis Response Structure', () => {
  test('should return valid analysis structure for any indicator data', async () => {
    await fc.assert(
      fc.asyncProperty(indicatorDataArb, async (indicators) => {
        const analysis = await analyzeMarket(indicators)

        // Validate structure
        expect(analysis).toHaveProperty('summary')
        expect(analysis).toHaveProperty('confidence')
        expect(analysis).toHaveProperty('keyPoints')

        // Validate types
        expect(typeof analysis.summary).toBe('string')
        expect(typeof analysis.confidence).toBe('number')
        expect(Array.isArray(analysis.keyPoints)).toBe(true)

        // Validate content
        expect(analysis.summary.length).toBeGreaterThan(0)
        expect(analysis.confidence).toBeGreaterThanOrEqual(0)
        expect(analysis.confidence).toBeLessThanOrEqual(100)
        expect(analysis.keyPoints.length).toBeGreaterThan(0)

        // All key points should be non-empty strings
        analysis.keyPoints.forEach(point => {
          expect(typeof point).toBe('string')
          expect(point.length).toBeGreaterThan(0)
        })
      }),
      { numRuns: 20 }
    )
  }, 60000)
})

// Unit tests for specific scenarios
describe('AI Analysis Unit Tests', () => {
  test('should handle overbought RSI', async () => {
    const indicators: IndicatorData = {
      rsi: 75,
      macd: { macd: 10, signal: 8, histogram: 2 },
      ema20: 50000,
      ema50: 49000,
      ema200: 48000,
      bollingerBands: { upper: 51000, middle: 50000, lower: 49000 },
      trend: 'BULLISH',
      volumeAnalysis: { averageVolume: 1000, currentVolume: 1200, isVolumeSpike: false },
    }

    const analysis = await analyzeMarket(indicators)

    expect(analysis.summary).toBeTruthy()
    expect(analysis.confidence).toBeGreaterThan(0)
    expect(analysis.keyPoints.length).toBeGreaterThan(0)
  }, 15000)

  test('should handle oversold RSI', async () => {
    const indicators: IndicatorData = {
      rsi: 25,
      macd: { macd: -10, signal: -8, histogram: -2 },
      ema20: 48000,
      ema50: 49000,
      ema200: 50000,
      bollingerBands: { upper: 51000, middle: 50000, lower: 49000 },
      trend: 'BEARISH',
      volumeAnalysis: { averageVolume: 1000, currentVolume: 3000, isVolumeSpike: true },
    }

    const analysis = await analyzeMarket(indicators)

    expect(analysis.summary).toBeTruthy()
    expect(analysis.confidence).toBeGreaterThan(0)
    expect(analysis.keyPoints.length).toBeGreaterThan(0)
  }, 15000)

  test('should cache results for same indicator state', async () => {
    const indicators: IndicatorData = {
      rsi: 50,
      macd: { macd: 0, signal: 0, histogram: 0 },
      ema20: 50000,
      ema50: 50000,
      ema200: 50000,
      bollingerBands: { upper: 51000, middle: 50000, lower: 49000 },
      trend: 'NEUTRAL',
      volumeAnalysis: { averageVolume: 1000, currentVolume: 1000, isVolumeSpike: false },
    }

    const start1 = Date.now()
    const analysis1 = await analyzeMarket(indicators)
    const time1 = Date.now() - start1

    const start2 = Date.now()
    const analysis2 = await analyzeMarket(indicators)
    const time2 = Date.now() - start2

    // Second call should be faster (cached)
    expect(time2).toBeLessThan(time1)

    // Results should be the same
    expect(analysis1.summary).toBe(analysis2.summary)
    expect(analysis1.confidence).toBe(analysis2.confidence)
  }, 30000)
})
