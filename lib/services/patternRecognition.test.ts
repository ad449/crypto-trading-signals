import fc from 'fast-check'
import {
  identifySupportResistance,
  analyzeVolume,
  detectTrend,
  detectBreakout,
} from './patternRecognition'
import { OHLCV } from '../types'

// Generator for OHLCV data
const ohlcvArb = fc.array(
  fc.record({
    timestamp: fc.integer({ min: 1000000000000, max: 2000000000000 }),
    open: fc.float({ min: 1, max: 100000, noNaN: true }),
    high: fc.float({ min: 1, max: 100000, noNaN: true }),
    low: fc.float({ min: 1, max: 100000, noNaN: true }),
    close: fc.float({ min: 1, max: 100000, noNaN: true }),
    volume: fc.float({ min: 0, max: 1000000, noNaN: true }),
  }).map(candle => ({
    ...candle,
    high: Math.max(candle.open, candle.close, candle.high),
    low: Math.min(candle.open, candle.close, candle.low),
  })),
  { minLength: 3, maxLength: 100 }
)

// Generator for volume arrays
const volumeArrayArb = fc.array(
  fc.float({ min: 0, max: 1000000, noNaN: true }),
  { minLength: 1, maxLength: 100 }
)

// Feature: crypto-trading-signals, Property 9: Support and Resistance Identification
describe('Property 9: Support and Resistance Identification', () => {
  test('support levels should be local minima', () => {
    fc.assert(
      fc.property(ohlcvArb, (ohlcv) => {
        const sr = identifySupportResistance(ohlcv)
        
        // Support and resistance should be arrays
        expect(Array.isArray(sr.support)).toBe(true)
        expect(Array.isArray(sr.resistance)).toBe(true)
        
        // All values should be positive numbers
        sr.support.forEach(level => {
          expect(typeof level).toBe('number')
          expect(level).toBeGreaterThan(0)
          expect(isFinite(level)).toBe(true)
        })
        
        sr.resistance.forEach(level => {
          expect(typeof level).toBe('number')
          expect(level).toBeGreaterThan(0)
          expect(isFinite(level)).toBe(true)
        })
      }),
      { numRuns: 100 }
    )
  })

  test('should return empty arrays for insufficient data', () => {
    const result = identifySupportResistance([])
    expect(result.support).toEqual([])
    expect(result.resistance).toEqual([])
  })
})

// Feature: crypto-trading-signals, Property 10: Volume Spike Detection
describe('Property 10: Volume Spike Detection', () => {
  test('volume spike should be detected when current > 2x average', () => {
    fc.assert(
      fc.property(volumeArrayArb, (volumes) => {
        if (volumes.length >= 20) {
          const analysis = analyzeVolume(volumes, 20)
          
          expect(typeof analysis.averageVolume).toBe('number')
          expect(typeof analysis.currentVolume).toBe('number')
          expect(typeof analysis.isVolumeSpike).toBe('boolean')
          expect(analysis.averageVolume).toBeGreaterThanOrEqual(0)
          expect(analysis.currentVolume).toBeGreaterThanOrEqual(0)
          
          // If spike is detected, current should be > 2x average
          if (analysis.isVolumeSpike) {
            expect(analysis.currentVolume).toBeGreaterThan(analysis.averageVolume * 2)
          }
        }
      }),
      { numRuns: 100 }
    )
  })

  test('should handle empty volume array', () => {
    const result = analyzeVolume([])
    expect(result.averageVolume).toBe(0)
    expect(result.currentVolume).toBe(0)
    expect(result.isVolumeSpike).toBe(false)
  })

  test('should detect volume spike correctly', () => {
    // Create volumes where last is 3x average
    const volumes = Array(20).fill(100)
    volumes.push(300)
    
    const analysis = analyzeVolume(volumes, 20)
    expect(analysis.isVolumeSpike).toBe(true)
    expect(analysis.currentVolume).toBe(300)
    expect(analysis.averageVolume).toBe(100)
  })
})

// Feature: crypto-trading-signals, Property 11: Trend Detection Consistency
describe('Property 11: Trend Detection Consistency', () => {
  test('trend should be BULLISH when EMA20 > EMA50', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 10000, noNaN: true }),
        fc.integer({ min: 2, max: 50 }),
        (ema50, diffPercent) => {
          const ema20 = ema50 * (1 + diffPercent / 100)
          const trend = detectTrend(ema20, ema50)
          
          if (diffPercent > 1) {
            expect(trend).toBe('BULLISH')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('trend should be BEARISH when EMA20 < EMA50', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 10000, noNaN: true }),
        fc.integer({ min: 2, max: 50 }),
        (ema50, diffPercent) => {
          const ema20 = ema50 * (1 - diffPercent / 100)
          const trend = detectTrend(ema20, ema50)
          
          if (diffPercent > 1) {
            expect(trend).toBe('BEARISH')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('trend should be NEUTRAL when EMAs are approximately equal', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 10000, noNaN: true }),
        (ema) => {
          const trend = detectTrend(ema, ema)
          expect(trend).toBe('NEUTRAL')
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: crypto-trading-signals, Property 12: Breakout Detection
describe('Property 12: Breakout Detection', () => {
  test('should detect resistance breakout when price crosses above', () => {
    const sr = {
      support: [100],
      resistance: [200],
    }
    
    const breakout = detectBreakout(205, sr, 195)
    expect(breakout).toBe('RESISTANCE_BREAKOUT')
  })

  test('should detect support breakdown when price crosses below', () => {
    const sr = {
      support: [100],
      resistance: [200],
    }
    
    const breakout = detectBreakout(95, sr, 105)
    expect(breakout).toBe('SUPPORT_BREAKDOWN')
  })

  test('should return null when no breakout occurs', () => {
    const sr = {
      support: [100],
      resistance: [200],
    }
    
    const breakout = detectBreakout(150, sr, 145)
    expect(breakout).toBeNull()
  })

  test('should handle empty support/resistance arrays', () => {
    const sr = {
      support: [],
      resistance: [],
    }
    
    const breakout = detectBreakout(150, sr, 145)
    expect(breakout).toBeNull()
  })
})
