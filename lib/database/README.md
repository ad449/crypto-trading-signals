# Database Setup Guide

This project uses Supabase as the database backend.

## Setup Instructions

### 1. Create a Supabase Account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project

### 2. Run the Schema
1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `schema.sql`
3. Paste and run the SQL to create tables and indexes

### 3. Get Your Credentials
1. Go to Project Settings > API
2. Copy your Project URL
3. Copy your `anon` public API key

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Database Schema

### Signals Table
Stores all generated trading signals with their parameters and outcomes.

**Columns:**
- `id`: UUID primary key
- `pair`: Trading pair (e.g., 'BTC/USDT')
- `timeframe`: Timeframe (e.g., '1h')
- `timestamp`: When the signal was generated
- `trend`: Market trend (BULLISH/BEARISH/NEUTRAL)
- `signal_type`: Signal type (BUY/SELL/NO_TRADE)
- `entry_price`: Entry price for the trade
- `stop_loss`: Stop loss price
- `take_profit_1`: First take profit target
- `take_profit_2`: Second take profit target
- `risk_reward_ratio`: Risk-reward ratio
- `win_probability`: Estimated win probability (%)
- `analysis_summary`: AI/rule-based analysis text
- `indicator_confirmations`: Array of confirming indicators (JSONB)
- `risk_level`: Risk level (LOW/MEDIUM/HIGH)
- `trade_type`: Trade type (SCALP/SWING/POSITION)
- `outcome`: Trade outcome (WIN/LOSS/BREAKEVEN/OPEN) - nullable
- `close_price`: Price when trade was closed - nullable
- `close_timestamp`: When trade was closed - nullable
- `created_at`: Record creation timestamp

### Performance Metrics Table
Aggregated performance statistics per pair and timeframe.

**Columns:**
- `id`: UUID primary key
- `pair`: Trading pair
- `timeframe`: Timeframe
- `total_signals`: Total number of signals
- `winning_signals`: Number of winning trades
- `losing_signals`: Number of losing trades
- `win_rate`: Win rate percentage
- `average_rr`: Average risk-reward ratio
- `last_updated`: Last update timestamp

## Usage

```typescript
import { saveSignal, getSignalHistory, getPerformanceMetrics } from '@/lib/database/supabase'

// Save a signal
const signalId = await saveSignal(signal)

// Get history
const history = await getSignalHistory('BTC/USDT', '1h', 50)

// Get metrics
const metrics = await getPerformanceMetrics('BTC/USDT', '1h')
```

## Notes

- The free tier of Supabase includes 500MB database space and 2GB bandwidth
- Signals older than 90 days can be archived or deleted to save space
- Performance metrics are calculated on-demand and cached in the metrics table
