import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Signal, PerformanceMetrics, TradingPair, Timeframe, Outcome } from '../types'

let supabase: SupabaseClient | null = null

/**
 * Initialize Supabase client
 */
function getSupabaseClient(): SupabaseClient {
  if (supabase) {
    return supabase
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key length:', supabaseKey?.length)

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not set')
  }

  supabase = createClient(supabaseUrl, supabaseKey)
  return supabase
}

/**
 * Save a signal to the database
 */
export async function saveSignal(signal: Signal): Promise<string> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('signals')
    .insert({
      pair: signal.pair,
      timeframe: signal.timeframe,
      timestamp: new Date(signal.timestamp).toISOString(),
      trend: signal.trend,
      signal_type: signal.signalType,
      entry_price: signal.entryPrice,
      stop_loss: signal.stopLoss,
      take_profit_1: signal.takeProfit1,
      take_profit_2: signal.takeProfit2,
      risk_reward_ratio: signal.riskRewardRatio,
      win_probability: signal.winProbability,
      analysis_summary: signal.analysisSummary,
      indicator_confirmations: signal.indicatorConfirmations,
      risk_level: signal.riskLevel,
      trade_type: signal.tradeType,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to save signal: ${error.message}`)
  }

  return data.id
}

/**
 * Get signal history for a pair and timeframe
 */
export async function getSignalHistory(
  pair: TradingPair,
  timeframe: Timeframe,
  limit: number = 50
): Promise<Signal[]> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('signals')
    .select('*')
    .eq('pair', pair)
    .eq('timeframe', timeframe)
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch signal history: ${error.message}`)
  }

  // Transform database records to Signal objects
  return data.map((record: any) => ({
    pair: record.pair,
    timeframe: record.timeframe,
    timestamp: new Date(record.timestamp).getTime(),
    trend: record.trend,
    signalType: record.signal_type,
    entryPrice: parseFloat(record.entry_price),
    stopLoss: parseFloat(record.stop_loss),
    takeProfit1: parseFloat(record.take_profit_1),
    takeProfit2: parseFloat(record.take_profit_2),
    riskRewardRatio: parseFloat(record.risk_reward_ratio),
    winProbability: record.win_probability,
    analysisSummary: record.analysis_summary,
    indicatorConfirmations: record.indicator_confirmations,
    riskLevel: record.risk_level,
    tradeType: record.trade_type,
  }))
}

/**
 * Update signal outcome when trade is closed
 */
export async function updateSignalOutcome(
  signalId: string,
  outcome: Outcome,
  closePrice: number
): Promise<void> {
  const client = getSupabaseClient()

  const { error } = await client
    .from('signals')
    .update({
      outcome,
      close_price: closePrice,
      close_timestamp: new Date().toISOString(),
    })
    .eq('id', signalId)

  if (error) {
    throw new Error(`Failed to update signal outcome: ${error.message}`)
  }
}

/**
 * Get performance metrics for a pair and timeframe
 */
export async function getPerformanceMetrics(
  pair: TradingPair,
  timeframe: Timeframe
): Promise<PerformanceMetrics | null> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('performance_metrics')
    .select('*')
    .eq('pair', pair)
    .eq('timeframe', timeframe)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found
      return null
    }
    throw new Error(`Failed to fetch performance metrics: ${error.message}`)
  }

  return {
    totalSignals: data.total_signals,
    winningSignals: data.winning_signals,
    losingSignals: data.losing_signals,
    winRate: parseFloat(data.win_rate),
    averageRR: parseFloat(data.average_rr),
  }
}

/**
 * Update performance metrics for a pair and timeframe
 */
export async function updatePerformanceMetrics(
  pair: TradingPair,
  timeframe: Timeframe
): Promise<void> {
  const client = getSupabaseClient()

  // Calculate metrics from signals
  const { data: signals, error: signalsError } = await client
    .from('signals')
    .select('outcome, risk_reward_ratio')
    .eq('pair', pair)
    .eq('timeframe', timeframe)
    .not('outcome', 'is', null)

  if (signalsError) {
    throw new Error(`Failed to fetch signals for metrics: ${signalsError.message}`)
  }

  if (!signals || signals.length === 0) {
    return
  }

  const totalSignals = signals.length
  const winningSignals = signals.filter((s: any) => s.outcome === 'WIN').length
  const losingSignals = signals.filter((s: any) => s.outcome === 'LOSS').length
  const winRate = (winningSignals / totalSignals) * 100
  const averageRR =
    signals.reduce((sum: number, s: any) => sum + parseFloat(s.risk_reward_ratio), 0) /
    totalSignals

  // Upsert metrics
  const { error: upsertError } = await client
    .from('performance_metrics')
    .upsert(
      {
        pair,
        timeframe,
        total_signals: totalSignals,
        winning_signals: winningSignals,
        losing_signals: losingSignals,
        win_rate: winRate,
        average_rr: averageRR,
        last_updated: new Date().toISOString(),
      },
      {
        onConflict: 'pair,timeframe',
      }
    )

  if (upsertError) {
    throw new Error(`Failed to update performance metrics: ${upsertError.message}`)
  }
}
