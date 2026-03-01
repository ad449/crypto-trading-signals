-- Signals table
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair VARCHAR(20) NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  trend VARCHAR(10) NOT NULL,
  signal_type VARCHAR(10) NOT NULL,
  entry_price DECIMAL(20, 8) NOT NULL,
  stop_loss DECIMAL(20, 8) NOT NULL,
  take_profit_1 DECIMAL(20, 8) NOT NULL,
  take_profit_2 DECIMAL(20, 8) NOT NULL,
  risk_reward_ratio DECIMAL(5, 2) NOT NULL,
  win_probability INTEGER NOT NULL,
  analysis_summary TEXT NOT NULL,
  indicator_confirmations JSONB NOT NULL,
  risk_level VARCHAR(10) NOT NULL,
  trade_type VARCHAR(10) NOT NULL,
  outcome VARCHAR(20),
  close_price DECIMAL(20, 8),
  close_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_signals_pair_timeframe ON signals(pair, timeframe);
CREATE INDEX IF NOT EXISTS idx_signals_timestamp ON signals(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_signals_outcome ON signals(outcome) WHERE outcome IS NOT NULL;

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair VARCHAR(20) NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  total_signals INTEGER NOT NULL,
  winning_signals INTEGER NOT NULL,
  losing_signals INTEGER NOT NULL,
  win_rate DECIMAL(5, 2) NOT NULL,
  average_rr DECIMAL(5, 2) NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pair, timeframe)
);

-- Disable RLS for public access (this is a demo app)
ALTER TABLE signals DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics DISABLE ROW LEVEL SECURITY;
