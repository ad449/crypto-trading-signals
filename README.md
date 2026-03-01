# Crypto Trading Signals Generator

A real-time cryptocurrency trading signals generator powered by technical analysis and AI. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Real-time Market Data**: Fetches live cryptocurrency prices from Binance API
- **Technical Analysis**: Calculates RSI, MACD, EMA, Bollinger Bands, and more
- **Pattern Recognition**: Identifies support/resistance levels, trends, and breakouts
- **AI-Powered Analysis**: Uses Groq AI for market insights (with rule-based fallback)
- **Signal Generation**: Generates BUY/SELL/NO_TRADE signals with confluence rules
- **Risk Management**: Calculates stop loss, take profit levels, and risk-reward ratios
- **Performance Tracking**: Stores signals and tracks win rates in Supabase
- **Responsive UI**: Clean, professional trading terminal interface

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Groq API key (optional, free tier)

### Installation

1. Install dependencies: `npm install`
2. Create `.env.local` with Supabase and Groq credentials
3. Run Supabase schema from `lib/database/schema.sql`
4. Start dev server: `npm run dev`
5. Open http://localhost:3000

## API Endpoints

- `GET /api/signals/generate?pair=BTC/USDT&timeframe=1h`
- `GET /api/signals/history?pair=BTC/USDT&timeframe=1h&limit=50`
- `GET /api/metrics?pair=BTC/USDT&timeframe=1h`

## Testing

Run tests: `npm test`

## Disclaimer

⚠️ For educational purposes only. Trading involves significant risk.
