import { NextRequest, NextResponse } from 'next/server'
import { generateSignal } from '@/lib/services/signalGenerator'
import { saveSignal } from '@/lib/database/supabase'
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

    // Generate signal
    const signal = await generateSignal(pair, timeframe)

    // Try to save to database (non-blocking)
    try {
      await saveSignal(signal)
    } catch (dbError) {
      console.error('Failed to save signal to database:', dbError)
      // Continue anyway - signal generation succeeded
    }

    // Return signal
    return NextResponse.json(signal, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    console.error('Error generating signal:', error)

    return NextResponse.json(
      {
        error: error.message || 'Failed to generate signal',
        code: 'SIGNAL_GENERATION_ERROR',
        timestamp: Date.now(),
      },
      { status: 500 }
    )
  }
}
