import { NextRequest, NextResponse } from 'next/server'
import { getPerformanceMetrics } from '@/lib/database/supabase'
import { TradingPair, Timeframe } from '@/lib/types'

const VALID_PAIRS: TradingPair[] = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT']
const VALID_TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D']

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const pair = searchParams.get('pair') as TradingPair
    const timeframe = searchParams.get('timeframe') as Timeframe

    // Validate parameters
    if (!pair || !VALID_PAIRS.includes(pair)) {
      return NextResponse.json(
        {
          error: 'Invalid or missing pair parameter',
          code: 'INVALID_PAIR',
          details: { validPairs: VALID_PAIRS },
          timestamp: Date.now(),
        },
        { status: 400 }
      )
    }

    if (!timeframe || !VALID_TIMEFRAMES.includes(timeframe)) {
      return NextResponse.json(
        {
          error: 'Invalid or missing timeframe parameter',
          code: 'INVALID_TIMEFRAME',
          details: { validTimeframes: VALID_TIMEFRAMES },
          timestamp: Date.now(),
        },
        { status: 400 }
      )
    }

    // Get performance metrics
    const metrics = await getPerformanceMetrics(pair, timeframe)

    if (!metrics) {
      return NextResponse.json(
        {
          totalSignals: 0,
          winningSignals: 0,
          losingSignals: 0,
          winRate: 0,
          averageRR: 0,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=300',
          },
        }
      )
    }

    return NextResponse.json(metrics, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (error: any) {
    console.error('Error fetching performance metrics:', error)

    // Check if it's a database connection error
    if (error.message?.includes('Supabase')) {
      return NextResponse.json(
        {
          error: 'Database connection error. Please ensure Supabase is configured.',
          code: 'DATABASE_ERROR',
          timestamp: Date.now(),
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch performance metrics',
        code: 'METRICS_FETCH_ERROR',
        timestamp: Date.now(),
      },
      { status: 500 }
    )
  }
}
