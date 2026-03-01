import fc from 'fast-check'
import {
  calculateRSI,
  calculateMACD,
  calculateEMA,
  calculateBollingerBands,
  validateDataLength,
} from './technicalAnalysis'

const priceArrayArb = (minLength: number, maxLength: number = 200) =>
  fc.array(fc.float({ min: 1, max: 100000, noNaN: true }), {
    minLength,
    maxLength,
  })

describe('Property 4: RSI Calculation Correctness', () => {
  test('RSI should be between 0 and 100 for any valid price series', () => {
    fc.assert(
      fc.property(priceArrayArb(14, 100), (prices) => {
        const rsi = calculateRSI(prices, 14)
        
        expect(rsi).toBeGreaterThanOrEqual(0)
        expect(rsi).toBeLessThanOrEqual(100)
        expect(isFinite(rsi)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  test('RSI should throw error with insufficient data', () => {
    fc.assert(
      fc.property(priceArrayArb(1, 13), (prices) => {
        expect(() => calculateRSI(prices, 14)).toThrow('Insufficient data')
      }),
      { numRuns: 50 }
    )
  })
})

describe('Property 5: MACD Calculation Correctness', () => {
  test('MACD histogram should equal MACD line minus signal line', () => {
    fc.assert(
      fc.property(priceArrayArb(35, 100), (prices) => {
        const macd = calculateMACD(prices)
        
        const expectedHistogram = macd.macd - macd.signal
        
        expect(Math.abs(macd.histogram - expectedHistogram)).toBeLessThan(0.0001)
        expect(isFinite(macd.macd)).toBe(true)
        expect(isFinite(macd.signal)).toBe(true)
        expect(isFinite(macd.histogram)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  test('MACD should throw error with insufficient data', () => {
    fc.assert(
      fc.property(priceArrayArb(1, 34), (prices) => {
        expect(() => calculateMACD(prices)).toThrow('Insufficient data')
      }),
      { numRuns: 50 }
    )
  })
})

describe('Property 6: EMA Calculation Correctness', () => {
  test('EMA should be a valid finite number for any valid price series', () => {
    fc.assert(
      fc.property(
        priceArrayArb(20, 100),
        fc.constantFrom(20, 50, 200),
        (prices, period) => {
          if (prices.length >= period) {
            const ema = calculateEMA(prices, period)
            
            expect(isFinite(ema)).toBe(true)
            expect(ema).toBeGreaterThan(0)
            
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            expect(ema).toBeGreaterThanOrEqual(minPrice * 0.5)
            expect(ema).toBeLessThanOrEqual(maxPrice * 1.5)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('EMA should throw error with insufficient data', () => {
    fc.assert(
      fc.property(
        priceArrayArb(1, 19),
        fc.constantFrom(20, 50),
        (prices, period) => {
          if (prices.length < period) {
            expect(() => calculateEMA(prices, period)).toThrow('Insufficient data')
          }
        }
      ),
      { numRuns: 50 }
    )
  })
})

describe('Property 7: Bollinger Bands Calculation Correctness', () => {
  test('Bollinger Bands should have upper > middle > lower', () => {
    fc.assert(
      fc.property(priceArrayArb(20, 100), (prices) => {
        const bb = calculateBollingerBands(prices, 20, 2)
        
        expect(bb.upper).toBeGreaterThanOrEqual(bb.middle)
        expect(bb.middle).toBeGreaterThanOrEqual(bb.lower)
        expect(isFinite(bb.upper)).toBe(true)
        expect(isFinite(bb.middle)).toBe(true)
        expect(isFinite(bb.lower)).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  test('Bollinger Bands should throw error with insufficient data', () => {
    fc.assert(
      fc.property(priceArrayArb(1, 19), (prices) => {
        expect(() => calculateBollingerBands(prices, 20, 2)).toThrow('Insufficient data')
      }),
      { numRuns: 50 }
    )
  })
})

describe('Property 8: Insufficient Data Validation', () => {
  test('validateDataLength should throw error when data is insufficient', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        fc.integer({ min: 51, max: 100 }),
        (dataLength, requiredLength) => {
          expect(() =>
            validateDataLength(dataLength, requiredLength, 'TestIndicator')
          ).toThrow('Insufficient data')
        }
      ),
      { numRuns: 100 }
    )
  })

  test('validateDataLength should not throw when data is sufficient', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (dataLength, requiredLength) => {
          expect(() =>
            validateDataLength(dataLength, requiredLength, 'TestIndicator')
          ).not.toThrow()
        }
      ),
      { numRuns: 100 }
    )
  })
})
