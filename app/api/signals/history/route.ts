import { NextRequest, NextResponse } from 'next/server'
import { getSignalHistory } from '@/lib/database/supabase'
import { TradingPair, Timeframe } from '@/lib/types'

const VALID_PAIRS: TradingPair[] = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT']
const VALID_TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D']

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const pair = searchParams.get('pair') as TradingPair
    const timeframe = searchParams.get('timeframe') as Timeframe
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 50

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

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: 'Invalid limit parameter (must be between 1 and 100)',
          code: 'INVALID_LIMIT',
          timestamp: Date.now(),
        },
        { status: 400 }
      )
    }

    // Get signal history
    const signals = await getSignalHistory(pair, timeframe, limit)

    return NextResponse.json(signals, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (error: any) {
    console.error('Error fetching signal history:', error)

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
        error: error.message || 'Failed to fetch signal history',
        code: 'HISTORY_FETCH_ERROR',
        timestamp: Date.now(),
      },
      { status: 500 }
    )
  }
}
