# API Testing Guide

## Test the API Routes

Once the app is running, you can test the API endpoints:

### 1. Generate Signal
```bash
curl "http://localhost:3000/api/signals/generate?pair=BTC/USDT&timeframe=1h"
```

### 2. Get Signal History
```bash
curl "http://localhost:3000/api/signals/history?pair=BTC/USDT&timeframe=1h&limit=10"
```

### 3. Get Performance Metrics
```bash
curl "http://localhost:3000/api/metrics?pair=BTC/USDT&timeframe=1h"
```

## Error Testing

### Invalid Pair
```bash
curl "http://localhost:3000/api/signals/generate?pair=INVALID&timeframe=1h"
```

### Invalid Timeframe
```bash
curl "http://localhost:3000/api/signals/generate?pair=BTC/USDT&timeframe=invalid"
```

### Missing Parameters
```bash
curl "http://localhost:3000/api/signals/generate"
```

## Expected Responses

### Success (200)
```json
{
  "pair": "BTC/USDT",
  "timeframe": "1h",
  "timestamp": 1234567890,
  "trend": "BULLISH",
  "signalType": "BUY",
  ...
}
```

### Error (400)
```json
{
  "error": "Invalid or missing pair parameter",
  "code": "INVALID_PAIR",
  "details": {
    "validPairs": ["BTC/USDT", "ETH/USDT", ...]
  },
  "timestamp": 1234567890
}
```

### Error (500)
```json
{
  "error": "Failed to generate signal",
  "code": "SIGNAL_GENERATION_ERROR",
  "timestamp": 1234567890
}
```
