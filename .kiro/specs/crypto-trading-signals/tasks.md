# Implementation Plan: Crypto Trading Signals Generator

## Overview

This implementation plan breaks down the crypto trading signals generator into discrete, incremental coding tasks. The approach follows a bottom-up strategy: first building core services (market data, technical analysis), then the signal generation logic, followed by database integration, and finally the web interface. Each task builds on previous work, with testing integrated throughout to catch errors early.

## Tasks

- [x] 1. Project setup and configuration
  - Initialize Next.js 14 project with TypeScript and Tailwind CSS
  - Configure environment variables for API keys (Groq, Supabase, Binance)
  - Install dependencies: technicalindicators, @supabase/supabase-js, fast-check, jest
  - Set up project structure with folders: /lib/services, /lib/types, /lib/utils, /app/api
  - Create TypeScript types for core data models (OHLCV, Signal, TradingPair, Timeframe)
  - _Requirements: 10.3_

- [ ] 2. Implement Market Data Service
  - [x] 2.1 Create Market Data Service with Binance API integration
    - Implement fetchOHLCV function to fetch candlestick data from Binance API
    - Implement getCurrentPrice function to fetch current price
    - Implement getVolume function to extract volume data
    - Add request caching with TTL based on timeframe
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [-] 2.2 Add error handling and fallback to CoinGecko API
    - Implement retry logic with exponential backoff (1s, 2s, 4s)
    - Add CoinGecko API as fallback data source
    - Implement rate limiting with request queue
    - _Requirements: 1.4, 1.5_
  
  - [ ] 2.3 Write property tests for Market Data Service
    - **Property 1: Market Data Fetching Across Pairs and Timeframes**
    - **Property 2: API Retry with Exponential Backoff**
    - **Property 3: Rate Limiting and Request Queuing**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [ ] 3. Implement Technical Analysis Engine
  - [ ] 3.1 Create indicator calculation functions
    - Implement calculateRSI using technicalindicators library
    - Implement calculateMACD using technicalindicators library
    - Implement calculateEMA for periods 20, 50, 200
    - Implement calculateBollingerBands using technicalindicators library
    - Add input validation to ensure sufficient data points
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 3.2 Implement pattern recognition functions
    - Implement identifySupportResistance to find local minima/maxima
    - Implement analyzeVolume to detect volume spikes
    - Implement detectTrend based on EMA positions
    - Implement detectBreakout for support/resistance crossings
    - _Requirements: 2.6, 2.7, 3.1, 3.2_
  
  - [ ] 3.3 Write property tests for indicator calculations
    - **Property 4: RSI Calculation Correctness**
    - **Property 5: MACD Calculation Correctness**
    - **Property 6: EMA Calculation Correctness**
    - **Property 7: Bollinger Bands Calculation Correctness**
    - **Property 8: Insufficient Data Validation**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
  
  - [ ] 3.4 Write property tests for pattern recognition
    - **Property 9: Support and Resistance Identification**
    - **Property 10: Volume Spike Detection**
    - **Property 11: Trend Detection Consistency**
    - **Property 12: Breakout Detection**
    - **Validates: Requirements 2.6, 2.7, 3.1, 3.2**

- [ ] 4. Checkpoint - Ensure core analysis functions work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement AI Analysis Service
  - [ ] 5.1 Create AI Analysis Service with Groq API integration
    - Implement analyzeMarket function to call Groq API
    - Create prompt template for market analysis with indicator data
    - Implement response parsing to extract summary and key points
    - Add 10-second timeout for AI requests
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 5.2 Add fallback and rate limiting
    - Implement rule-based analysis summary as fallback
    - Add request queuing for rate limit compliance (30 req/min)
    - Implement response caching with 5-minute TTL
    - _Requirements: 4.4, 4.5_
  
  - [ ] 5.3 Write property tests for AI Analysis Service
    - **Property 13: AI Service Fallback Behavior**
    - **Property 14: AI Analysis Response Structure**
    - **Validates: Requirements 4.2, 4.3, 4.4**

- [ ] 6. Implement Signal Generator
  - [ ] 6.1 Create confluence rule engine
    - Implement checkBuyConfluence to evaluate 6 BUY indicators
    - Implement checkSellConfluence to evaluate 6 SELL indicators
    - Implement determineSignalType based on confluence count (min 3)
    - _Requirements: 5.1, 5.2_
  
  - [ ] 6.2 Implement risk calculation functions
    - Implement calculateStopLoss (2.5% from entry)
    - Implement calculateTakeProfits (1.5x and 3x risk distance)
    - Implement calculateRiskRewardRatio
    - Implement calculateWinProbability based on confirmations
    - Implement determineRiskLevel based on confirmations and RR
    - Implement determineTradeType based on timeframe
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ] 6.3 Implement main generateSignal function
    - Integrate Market Data Service to fetch current data
    - Integrate Technical Analysis Engine to calculate indicators
    - Integrate AI Analysis Service for market summary
    - Apply confluence rules to determine signal type
    - Calculate all risk parameters
    - Construct complete Signal object with all required fields
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.1-6.10_
  
  - [ ] 6.4 Write property tests for signal generation
    - **Property 15: Confluence Rule for Signal Generation**
    - **Property 16: Entry Price Equals Current Price**
    - **Property 17: Stop Loss Distance Validation**
    - **Property 18: Take Profit Multiplier Validation**
    - **Property 19: Risk-Reward Ratio Calculation**
    - **Property 20: Win Probability Calculation**
    - **Property 21: Complete Signal Structure**
    - **Property 22: Trade Type Derivation from Timeframe**
    - **Validates: Requirements 5.1-5.7, 6.1-6.10**

- [ ] 7. Checkpoint - Ensure signal generation works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement Database Service with Supabase
  - [ ] 8.1 Set up Supabase schema and migrations
    - Create signals table with all required columns
    - Create performance_metrics table
    - Add indexes for efficient queries (pair, timeframe, timestamp, outcome)
    - Initialize Supabase client with environment variables
    - _Requirements: 7.1, 7.4, 7.5_
  
  - [ ] 8.2 Implement Database Service functions
    - Implement saveSignal to insert signals into database
    - Implement getSignalHistory to retrieve past signals
    - Implement updateSignalOutcome to update closed trades
    - Implement getPerformanceMetrics to calculate win rate and avg RR
    - Implement updatePerformanceMetrics to refresh metrics table
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 8.3 Write property tests for database operations
    - **Property 23: Signal Persistence Round Trip**
    - **Property 24: Signal Outcome Updates**
    - **Property 25: Performance Metrics Calculation**
    - **Property 26: Signal Retention Period**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.6**

- [ ] 9. Create API routes for backend logic
  - [ ] 9.1 Create /api/signals/generate endpoint
    - Accept pair and timeframe as query parameters
    - Call Signal Generator to create signal
    - Save signal to database
    - Return signal as JSON response
    - Add error handling for all failure scenarios
    - _Requirements: 5.1-5.7, 9.1, 9.2, 9.4_
  
  - [ ] 9.2 Create /api/signals/history endpoint
    - Accept pair and timeframe as query parameters
    - Retrieve signal history from database
    - Return signals as JSON array
    - _Requirements: 7.1_
  
  - [ ] 9.3 Create /api/metrics endpoint
    - Accept pair and timeframe as query parameters
    - Retrieve performance metrics from database
    - Return metrics as JSON response
    - _Requirements: 7.3_
  
  - [ ] 9.4 Add CORS configuration and error handling
    - Configure CORS headers for API routes
    - Implement consistent error response format
    - Add request validation for all endpoints
    - _Requirements: 9.2, 9.4, 10.5_
  
  - [ ] 9.5 Write property tests for API validation
    - **Property 27: API Response Validation**
    - **Property 28: Error Message Clarity**
    - **Validates: Requirements 9.2, 9.4**

- [ ] 10. Implement Web Interface components
  - [ ] 10.1 Create SignalCard component
    - Display all signal fields prominently
    - Use color coding for BUY (green), SELL (red), NO_TRADE (gray)
    - Show entry, stop loss, and take profit levels
    - Display risk-reward ratio and win probability
    - Show analysis summary and indicator confirmations
    - _Requirements: 8.1, 6.1-6.10_
  
  - [ ] 10.2 Create PairSelector and TimeframeSelector components
    - Implement dropdown for trading pair selection
    - Implement button group for timeframe selection
    - Handle selection changes and trigger signal refresh
    - _Requirements: 8.2, 8.3_
  
  - [ ] 10.3 Create SignalHistory component
    - Display table of past signals with key fields
    - Implement pagination for large datasets
    - Add sorting by timestamp
    - _Requirements: 8.5_
  
  - [ ] 10.4 Create PerformanceMetrics component
    - Display total signals, win rate, and average RR as cards
    - Use visual indicators for performance (colors, icons)
    - _Requirements: 8.6_
  
  - [ ] 10.5 Create Disclaimer component
    - Display prominent disclaimer about trading risks
    - Include all required legal text
    - Make disclaimer always visible (non-dismissible)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 11. Implement main dashboard page
  - [ ] 11.1 Create main page layout with all components
    - Integrate PairSelector and TimeframeSelector at top
    - Display SignalCard prominently in center
    - Show PerformanceMetrics in sidebar or below signal
    - Display SignalHistory at bottom
    - Add Disclaimer banner at top or bottom
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_
  
  - [ ] 11.2 Implement data fetching and state management
    - Fetch signal on component mount and when pair/timeframe changes
    - Implement polling to refresh signal every 60 seconds
    - Fetch signal history and performance metrics
    - Handle loading states with skeleton loaders
    - Handle error states with user-friendly messages
    - _Requirements: 8.1, 8.4_
  
  - [ ] 11.3 Apply responsive styling with Tailwind CSS
    - Implement mobile-first responsive layout
    - Use dark theme with trading-appropriate colors
    - Ensure readable typography and proper spacing
    - Test on mobile, tablet, and desktop viewports
    - _Requirements: 8.7, 8.8_

- [ ] 12. Checkpoint - Test complete application flow
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Deployment preparation
  - [ ] 13.1 Configure environment variables for production
    - Set up Vercel environment variables for API keys
    - Configure Supabase connection for production
    - Verify all secrets are properly secured
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 13.2 Optimize for Vercel deployment
    - Configure next.config.js for optimal serverless function settings
    - Implement proper caching headers for static assets
    - Test cold start performance of API routes
    - _Requirements: 10.4_
  
  - [ ] 13.3 Create deployment documentation
    - Document environment variables required
    - Document Supabase setup steps
    - Document API rate limits and free tier constraints
    - Create README with setup instructions

- [ ] 14. Final checkpoint - End-to-end testing
  - Test complete user flow: select pair → view signal → check history → view metrics
  - Verify all error scenarios are handled gracefully
  - Confirm disclaimers are visible and non-dismissible
  - Test on multiple devices and browsers
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties with 100+ iterations each
- The implementation uses TypeScript for type safety throughout
- All external API calls include error handling and fallback mechanisms
- The system is designed to work within free tier limits of all services
