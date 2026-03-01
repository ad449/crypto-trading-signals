import { OHLCV, TradingPair, Timeframe } from '../types'

// Cache structure for market data
interface CacheEntry {
  data: OHLCV[]
  timestamp: number
}

// Request queue for rate limiting
interface QueuedRequest {
  execute: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
}

const requestQueue: QueuedRequest[] = []
let isProcessingQueue = false
const MAX_REQUESTS_PER_SECOND = 10
const REQUEST_INTERVAL = 1000 / MAX_REQUESTS_PER_SECOND

// Retry configuration
const RETRY_DELAYS = [1000, 2000, 4000] // 1s, 2s, 4s exponential backoff
const MAX_RETRIES = RETRY_DELAYS.length

// Cache TTL based on timeframe (in milliseconds)
const CACHE_TTL: Record<Timeframe, number> = {
  '1m': 30000,    // 30 seconds
  '5m': 300000,   // 5 minutes
  '15m': 300000,  // 5 minutes
  '1h': 300000,   // 5 minutes
  '4h': 300000,   // 5 minutes
  '1D': 300000,   // 5 minutes
}

// In-memory cache for market data
const cache = new Map<string, CacheEntry>()

// Convert timeframe to Binance interval format
function timeframeToBinanceInterval(timeframe: Timeframe): string {
  const mapping: Record<Timeframe, string> = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1D': '1d',
  }
  return mapping[timeframe]
}

// Convert trading pair to Binance symbol format (remove slash)
function pairToBinanceSymbol(pair: TradingPair): string {
  return pair.replace('/', '')
}

// Convert trading pair to CoinGecko ID format
function pairToCoinGeckoId(pair: TradingPair): string {
  const mapping: Record<TradingPair, string> = {
    'BTC/USDT': 'bitcoin',
    'ETH/USDT': 'ethereum',
    'BNB/USDT': 'binancecoin',
    'SOL/USDT': 'solana',
    'ADA/USDT': 'cardano',
  }
  return mapping[pair]
}

// Convert timeframe to CoinGecko days parameter
function timeframeToCoinGeckoDays(timeframe: Timeframe): number {
  const mapping: Record<Timeframe, number> = {
    '1m': 1,
    '5m': 1,
    '15m': 1,
    '1h': 7,
    '4h': 30,
    '1D': 90,
  }
  return mapping[timeframe]
}

// Sleep utility for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Process request queue with rate limiting
async function processQueue(): Promise<void> {
  if (isProcessingQueue || requestQueue.length === 0) {
    return
  }

  isProcessingQueue = true

  while (requestQueue.length > 0) {
    const request = requestQueue.shift()
    if (request) {
      try {
        const result = await request.execute()
        request.resolve(result)
      } catch (error) {
        request.reject(error)
      }
      
      // Wait before processing next request to respect rate limit
      if (requestQueue.length > 0) {
        await sleep(REQUEST_INTERVAL)
      }
    }
  }

  isProcessingQueue = false
}

// Add request to queue with rate limiting
function queueRequest<T>(execute: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ execute, resolve, reject })
    processQueue()
  })
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      
      const delay = RETRY_DELAYS[attempt]
      console.warn(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`)
      await sleep(delay)
    }
  }
  
  throw new Error('Max retries exceeded')
}

// Fetch OHLCV from CoinGecko API (fallback)
async function fetchOHLCVFromCoinGecko(
  pair: TradingPair,
  timeframe: Timeframe,
  limit: number
): Promise<OHLCV[]> {
  const coinId = pairToCoinGeckoId(pair)
  const days = timeframeToCoinGeckoDays(timeframe)
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usdt&days=${days}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  // Transform CoinGecko response to OHLCV format
  // CoinGecko returns: [timestamp, open, high, low, close]
  const ohlcv: OHLCV[] = data.slice(-limit).map((candle: number[]) => ({
    timestamp: candle[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
    volume: 0, // CoinGecko OHLC endpoint doesn't provide volume
  }))

  return ohlcv
}

// Fetch OHLCV from Binance API (primary)
async function fetchOHLCVFromBinance(
  pair: TradingPair,
  timeframe: Timeframe,
  limit: number
): Promise<OHLCV[]> {
  const symbol = pairToBinanceSymbol(pair)
  const interval = timeframeToBinanceInterval(timeframe)
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  // Transform Binance response to OHLCV format
  const ohlcv: OHLCV[] = data.map((candle: any[]) => ({
    timestamp: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }))

  return ohlcv
}

/**
 * Fetch OHLCV (candlestick) data from Binance API with retry and fallback
 * @param pair Trading pair (e.g., 'BTC/USDT')
 * @param timeframe Timeframe for candles (e.g., '1h')
 * @param limit Number of candles to fetch (default: 100)
 * @returns Array of OHLCV data
 */
export async function fetchOHLCV(
  pair: TradingPair,
  timeframe: Timeframe,
  limit: number = 100
): Promise<OHLCV[]> {
  // Check cache first
  const cacheKey = `${pair}-${timeframe}-${limit}`
  const cached = cache.get(cacheKey)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_TTL[timeframe]) {
    return cached.data
  }

  // Queue the request to respect rate limiting
  const ohlcv = await queueRequest(async () => {
    try {
      // Try Binance API with retry logic
      return await retryWithBackoff(() => fetchOHLCVFromBinance(pair, timeframe, limit))
    } catch (binanceError) {
      console.error('Binance API failed after retries, falling back to CoinGecko:', binanceError)
      
      // Fallback to CoinGecko API with retry logic
      try {
        return await retryWithBackoff(() => fetchOHLCVFromCoinGecko(pair, timeframe, limit))
      } catch (coinGeckoError) {
        console.error('CoinGecko API also failed:', coinGeckoError)
        
        // If both APIs fail, return cached data if available (even if stale)
        if (cached) {
          console.warn('Returning stale cached data due to API failures')
          return cached.data
        }
        
        throw new Error(`All data sources failed. Binance: ${binanceError}. CoinGecko: ${coinGeckoError}`)
      }
    }
  })

  // Update cache
  cache.set(cacheKey, {
    data: ohlcv,
    timestamp: now,
  })

  return ohlcv
}

/**
 * Get current price for a trading pair
 * @param pair Trading pair (e.g., 'BTC/USDT')
 * @returns Current price
 */
export async function getCurrentPrice(pair: TradingPair): Promise<number> {
  const symbol = pairToBinanceSymbol(pair)
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return parseFloat(data.price)
}

/**
 * Extract volume data from OHLCV array
 * @param pair Trading pair (e.g., 'BTC/USDT')
 * @param timeframe Timeframe for volume data
 * @returns Array of volume values
 */
export async function getVolume(
  pair: TradingPair,
  timeframe: Timeframe
): Promise<number[]> {
  const ohlcv = await fetchOHLCV(pair, timeframe)
  return ohlcv.map(candle => candle.volume)
}
