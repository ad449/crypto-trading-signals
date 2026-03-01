# Requirements Document

## Introduction

This document specifies the requirements for a real-time cryptocurrency trading signals generator website. The system analyzes crypto markets using technical indicators and AI-powered analysis to generate actionable trading signals with risk management parameters. The platform leverages free-tier services (Vercel, Supabase, Groq/Together AI) to provide cost-effective market analysis.

## Glossary

- **Signal_Generator**: The core system that produces trading signals based on technical analysis and AI insights
- **Market_Data_Service**: Component responsible for fetching real-time cryptocurrency price data from external APIs
- **Technical_Analysis_Engine**: Module that calculates technical indicators and identifies patterns
- **AI_Analysis_Service**: Component that uses free AI APIs to analyze market conditions and generate insights
- **Signal**: A trading recommendation containing entry price, stop loss, take profit levels, and risk metrics
- **Trading_Pair**: A cryptocurrency pair (e.g., BTC/USDT, ETH/USDT)
- **Timeframe**: The time interval for price data analysis (1m, 5m, 15m, 1h, 4h, 1D)
- **Confluence**: Agreement between multiple technical indicators supporting the same trading direction
- **Risk_Reward_Ratio**: The ratio of potential profit to potential loss in a trade
- **Database_Service**: Supabase-based storage for signals, history, and analytics
- **Web_Interface**: The Next.js frontend dashboard for displaying signals and analytics

## Requirements

### Requirement 1: Real-Time Market Data Acquisition

**User Story:** As a trader, I want to receive real-time cryptocurrency price data, so that I can make decisions based on current market conditions.

#### Acceptance Criteria

1. WHEN the Market_Data_Service requests price data, THE System SHALL fetch data from free APIs (Binance or CoinGecko)
2. THE Market_Data_Service SHALL support multiple trading pairs including BTC/USDT, ETH/USDT, BNB/USDT, SOL/USDT, and ADA/USDT
3. THE Market_Data_Service SHALL provide data for timeframes: 1m, 5m, 15m, 1h, 4h, and 1D
4. WHEN API rate limits are approached, THE Market_Data_Service SHALL implement exponential backoff and caching
5. IF an API request fails, THEN THE Market_Data_Service SHALL retry with fallback to alternative data sources
6. THE Market_Data_Service SHALL update price data at intervals appropriate to the selected timeframe

### Requirement 2: Technical Indicator Calculation

**User Story:** As a trader, I want the system to calculate standard technical indicators, so that I can understand market momentum and trends.

#### Acceptance Criteria

1. THE Technical_Analysis_Engine SHALL calculate RSI (Relative Strength Index) with a 14-period default
2. THE Technical_Analysis_Engine SHALL calculate MACD (Moving Average Convergence Divergence) with standard parameters (12, 26, 9)
3. THE Technical_Analysis_Engine SHALL calculate Exponential Moving Averages for 20, 50, and 200 periods
4. THE Technical_Analysis_Engine SHALL calculate Bollinger Bands with 20-period SMA and 2 standard deviations
5. WHEN calculating indicators, THE Technical_Analysis_Engine SHALL require sufficient historical data points
6. THE Technical_Analysis_Engine SHALL identify support and resistance levels based on recent price action
7. THE Technical_Analysis_Engine SHALL analyze volume patterns and detect volume spikes

### Requirement 3: Pattern Recognition and Market Analysis

**User Story:** As a trader, I want the system to identify chart patterns and breakouts, so that I can spot potential trading opportunities.

#### Acceptance Criteria

1. THE Technical_Analysis_Engine SHALL detect bullish and bearish trend patterns
2. THE Technical_Analysis_Engine SHALL identify breakout conditions when price crosses significant resistance or support levels
3. THE Technical_Analysis_Engine SHALL recognize divergence patterns between price and indicators
4. WHEN multiple patterns are detected, THE Technical_Analysis_Engine SHALL prioritize based on reliability and timeframe

### Requirement 4: AI-Powered Market Analysis

**User Story:** As a trader, I want AI-enhanced analysis of market conditions, so that I can benefit from advanced pattern recognition beyond traditional indicators.

#### Acceptance Criteria

1. THE AI_Analysis_Service SHALL integrate with free AI APIs (Groq, Together AI, or Hugging Face)
2. WHEN analyzing market data, THE AI_Analysis_Service SHALL provide context about current market conditions
3. THE AI_Analysis_Service SHALL generate natural language summaries of technical indicator states
4. IF the AI API is unavailable, THEN THE System SHALL generate signals using only technical indicators
5. THE AI_Analysis_Service SHALL respect API rate limits and implement request queuing

### Requirement 5: Signal Generation with Confluence

**User Story:** As a trader, I want signals generated only when multiple indicators agree, so that I receive higher-quality trading opportunities.

#### Acceptance Criteria

1. THE Signal_Generator SHALL require at least 3 indicators to agree before generating a BUY or SELL signal
2. WHEN indicators conflict, THE Signal_Generator SHALL output NO TRADE
3. THE Signal_Generator SHALL calculate entry price based on current market price
4. THE Signal_Generator SHALL calculate stop loss at 2-3% below entry for BUY signals and 2-3% above entry for SELL signals
5. THE Signal_Generator SHALL calculate two take profit levels: TP1 at 1.5x risk distance and TP2 at 3x risk distance
6. THE Signal_Generator SHALL compute Risk_Reward_Ratio as the ratio of potential profit to potential loss
7. THE Signal_Generator SHALL estimate win probability based on indicator strength and confluence level

### Requirement 6: Signal Output Format

**User Story:** As a trader, I want signals presented in a clear, standardized format, so that I can quickly understand the trading recommendation.

#### Acceptance Criteria

1. THE Signal SHALL include the trading pair name
2. THE Signal SHALL include the timeframe analyzed
3. THE Signal SHALL include the market trend (BULLISH, BEARISH, or NEUTRAL)
4. THE Signal SHALL include the signal type (BUY, SELL, or NO TRADE)
5. THE Signal SHALL include entry price, stop loss, TP1, and TP2 values
6. THE Signal SHALL include the Risk_Reward_Ratio
7. THE Signal SHALL include estimated win probability as a percentage
8. THE Signal SHALL include an analysis summary listing which indicators confirmed the signal
9. THE Signal SHALL include risk level (LOW, MEDIUM, HIGH)
10. THE Signal SHALL include trade type (SCALP, SWING, or POSITION based on timeframe)

### Requirement 7: Database Storage and History

**User Story:** As a trader, I want historical signals stored, so that I can review past recommendations and track performance.

#### Acceptance Criteria

1. THE Database_Service SHALL store each generated signal with timestamp
2. THE Database_Service SHALL store signal outcomes when trades are closed
3. THE Database_Service SHALL track signal performance metrics including win rate and average risk-reward
4. WHEN storing signals, THE Database_Service SHALL use Supabase PostgreSQL database
5. THE Database_Service SHALL implement proper indexing for efficient signal retrieval
6. THE Database_Service SHALL retain signal history for at least 90 days

### Requirement 8: Web Interface Dashboard

**User Story:** As a trader, I want a clean, professional dashboard, so that I can easily view signals and navigate the platform.

#### Acceptance Criteria

1. THE Web_Interface SHALL display the current signal prominently with all required fields
2. THE Web_Interface SHALL provide a selector for trading pairs
3. THE Web_Interface SHALL provide a selector for timeframes
4. THE Web_Interface SHALL display real-time updates when new signals are generated
5. THE Web_Interface SHALL show a signal history table with past recommendations
6. THE Web_Interface SHALL display performance metrics including total signals, win rate, and average risk-reward
7. THE Web_Interface SHALL be responsive and functional on mobile devices
8. THE Web_Interface SHALL use a professional color scheme appropriate for trading applications

### Requirement 9: Error Handling and Reliability

**User Story:** As a trader, I want the system to handle errors gracefully, so that temporary issues don't disrupt my trading analysis.

#### Acceptance Criteria

1. WHEN an API request fails, THE System SHALL log the error and retry with exponential backoff
2. WHEN insufficient data is available, THE System SHALL display a clear message to the user
3. IF the AI service is unavailable, THEN THE System SHALL continue generating signals using technical indicators only
4. THE System SHALL validate all API responses before processing
5. WHEN rate limits are exceeded, THE System SHALL queue requests and inform the user of delays

### Requirement 10: Deployment and Configuration

**User Story:** As a developer, I want the application deployed on free-tier services, so that operating costs are minimized.

#### Acceptance Criteria

1. THE System SHALL be deployed on Vercel free tier
2. THE System SHALL use Supabase free tier for database services
3. THE System SHALL store API keys and sensitive configuration in environment variables
4. THE System SHALL use serverless functions for backend logic to optimize resource usage
5. THE System SHALL implement proper CORS configuration for API endpoints

### Requirement 11: Legal and Risk Disclaimers

**User Story:** As a platform operator, I want clear disclaimers displayed, so that users understand the risks of trading.

#### Acceptance Criteria

1. THE Web_Interface SHALL display a prominent disclaimer that signals do not guarantee profits
2. THE Web_Interface SHALL inform users that cryptocurrency trading involves significant risk
3. THE Web_Interface SHALL clarify that the platform is for educational and informational purposes only
4. THE disclaimer SHALL be visible on the main dashboard and cannot be permanently dismissed
