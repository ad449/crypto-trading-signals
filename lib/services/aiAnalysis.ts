import { IndicatorData, AIAnalysis } from '../types'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const REQUEST_TIMEOUT = 10000 // 10 seconds
const CACHE_TTL = 300000 // 5 minutes
const MAX_REQUESTS_PER_MINUTE = 30

interface CacheEntry {
  analysis: AIAnalysis
  timestamp: number
}

interface QueuedRequest {
  execute: () => Promise<AIAnalysis>
  resolve: (value: AIAnalysis) => void
  reject: (error: any) => void
}

const cache = new Map<string, CacheEntry>()
const requestQueue: QueuedRequest[] = []
let isProcessingQueue = false
let requestCount = 0
let lastResetTime = Date.now()

/**
 * Generate cache key from indicator data
 */
function generateCacheKey(indicators: IndicatorData): string {
  return JSON.stringify({
    rsi: Math.round(indicators.rsi),
    macd: Math.round(indicators.macd.histogram * 100) / 100,
    trend: indicators.trend,
    volumeSpike: indicators.volumeAnalysis.isVolumeSpike,
  })
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Process request queue with rate limiting
 */
async function processQueue(): Promise<void> {
  if (isProcessingQueue || requestQueue.length === 0) {
    return
  }

  isProcessingQueue = true

  while (requestQueue.length > 0) {
    // Reset counter every minute
    const now = Date.now()
    if (now - lastResetTime >= 60000) {
      requestCount = 0
      lastResetTime = now
    }

    // Wait if rate limit reached
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      const waitTime = 60000 - (now - lastResetTime)
      await sleep(waitTime)
      requestCount = 0
      lastResetTime = Date.now()
    }

    const request = requestQueue.shift()
    if (request) {
      try {
        const result = await request.execute()
        request.resolve(result)
        requestCount++
      } catch (error) {
        request.reject(error)
      }

      // Small delay between requests
      if (requestQueue.length > 0) {
        await sleep(2000)
      }
    }
  }

  isProcessingQueue = false
}

/**
 * Queue AI request with rate limiting
 */
function queueRequest(execute: () => Promise<AIAnalysis>): Promise<AIAnalysis> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ execute, resolve, reject })
    processQueue()
  })
}

/**
 * Generate rule-based analysis as fallback
 */
function generateRuleBasedAnalysis(indicators: IndicatorData): AIAnalysis {
  const keyPoints: string[] = []
  let confidence = 50

  // RSI analysis
  if (indicators.rsi > 70) {
    keyPoints.push('RSI indicates overbought conditions')
    confidence += 10
  } else if (indicators.rsi < 30) {
    keyPoints.push('RSI indicates oversold conditions')
    confidence += 10
  }

  // MACD analysis
  if (indicators.macd.histogram > 0) {
    keyPoints.push('MACD shows bullish momentum')
    confidence += 5
  } else if (indicators.macd.histogram < 0) {
    keyPoints.push('MACD shows bearish momentum')
    confidence += 5
  }

  // Trend analysis
  keyPoints.push(`Market trend is ${indicators.trend.toLowerCase()}`)
  confidence += 10

  // Volume analysis
  if (indicators.volumeAnalysis.isVolumeSpike) {
    keyPoints.push('Significant volume spike detected')
    confidence += 10
  }

  // EMA analysis
  if (indicators.ema20 > indicators.ema50) {
    keyPoints.push('Short-term momentum is positive (EMA20 > EMA50)')
  } else {
    keyPoints.push('Short-term momentum is negative (EMA20 < EMA50)')
  }

  const summary = `Market analysis based on technical indicators. ${keyPoints.join('. ')}.`

  return {
    summary,
    confidence: Math.min(confidence, 100),
    keyPoints,
  }
}

/**
 * Call Groq API for market analysis
 */
async function callGroqAPI(indicators: IndicatorData): Promise<AIAnalysis> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable not set')
  }

  const prompt = `Analyze the following cryptocurrency market indicators and provide a concise trading analysis:

RSI: ${indicators.rsi.toFixed(2)}
MACD: ${indicators.macd.macd.toFixed(2)} (Signal: ${indicators.macd.signal.toFixed(2)}, Histogram: ${indicators.macd.histogram.toFixed(2)})
EMA 20: ${indicators.ema20.toFixed(2)}
EMA 50: ${indicators.ema50.toFixed(2)}
EMA 200: ${indicators.ema200.toFixed(2)}
Bollinger Bands: Upper ${indicators.bollingerBands.upper.toFixed(2)}, Middle ${indicators.bollingerBands.middle.toFixed(2)}, Lower ${indicators.bollingerBands.lower.toFixed(2)}
Trend: ${indicators.trend}
Volume Spike: ${indicators.volumeAnalysis.isVolumeSpike ? 'Yes' : 'No'}

Provide:
1. A brief summary (2-3 sentences)
2. 3-5 key points about the market condition
3. Your confidence level (0-100)

Format your response as JSON with fields: summary, keyPoints (array), confidence (number).`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a professional cryptocurrency trading analyst. Provide concise, actionable analysis.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in Groq API response')
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content)
      return {
        summary: parsed.summary || content,
        confidence: parsed.confidence || 70,
        keyPoints: parsed.keyPoints || [content],
      }
    } catch {
      // If not JSON, use content as summary
      return {
        summary: content,
        confidence: 70,
        keyPoints: [content],
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * Analyze market using AI with fallback to rule-based analysis
 * @param indicators Technical indicator data
 * @param ohlcv OHLCV data (not used in current implementation)
 * @returns AI analysis result
 */
export async function analyzeMarket(
  indicators: IndicatorData
): Promise<AIAnalysis> {
  // Check cache first
  const cacheKey = generateCacheKey(indicators)
  const cached = cache.get(cacheKey)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.analysis
  }

  // Try AI analysis with queue
  try {
    const analysis = await queueRequest(() => callGroqAPI(indicators))

    // Update cache
    cache.set(cacheKey, {
      analysis,
      timestamp: now,
    })

    return analysis
  } catch (error) {
    console.warn('AI analysis failed, using rule-based fallback:', error)

    // Fallback to rule-based analysis
    const analysis = generateRuleBasedAnalysis(indicators)

    // Cache fallback result too
    cache.set(cacheKey, {
      analysis,
      timestamp: now,
    })

    return analysis
  }
}
