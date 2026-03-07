# Requirements Document

## Introduction

This document specifies the requirements for converting the crypto trading signals frontend from React/Next.js to vanilla HTML, CSS, and JavaScript. The conversion will maintain all existing functionality while using plain web technologies and CSS frameworks via CDN for styling. The backend API routes remain unchanged.

## Glossary

- **Frontend**: The client-side user interface built with HTML, CSS, and JavaScript
- **Backend_API**: The existing server-side API endpoints that provide trading signals and data
- **Trading_Pair**: A cryptocurrency pair (e.g., BTC/USDT) available for trading
- **Timeframe**: The time interval for chart data (1m, 5m, 15m, 1h, 4h, 1D)
- **Signal_Card**: The UI component displaying trading signal information
- **TradingView_Widget**: The embedded chart component from TradingView
- **CSS_Framework**: A styling library loaded via CDN (Bootstrap, Tailwind, etc.)
- **Performance_Metrics**: Statistics showing trading signal accuracy and performance

## Requirements

### Requirement 1: Trading Pair Selection

**User Story:** As a trader, I want to select from 30 different trading pairs with search functionality, so that I can analyze the cryptocurrency pair I'm interested in.

#### Acceptance Criteria

1. WHEN the application loads, THE Frontend SHALL display a dropdown or searchable list containing 30 trading pairs
2. WHEN a user types in the search field, THE Frontend SHALL filter the trading pairs list to show only matching pairs
3. WHEN a user selects a trading pair, THE Frontend SHALL update the chart and fetch new signal data from the Backend_API
4. THE Frontend SHALL persist the selected trading pair in the UI state
5. WHEN a trading pair is selected, THE Frontend SHALL call the Backend_API with the selected pair parameter

### Requirement 2: Timeframe Selection

**User Story:** As a trader, I want to select different timeframes for analysis, so that I can view trading signals across multiple time intervals.

#### Acceptance Criteria

1. THE Frontend SHALL display six timeframe options: 1m, 5m, 15m, 1h, 4h, and 1D
2. WHEN a user selects a timeframe, THE Frontend SHALL update the chart to display data for that timeframe
3. WHEN a timeframe is selected, THE Frontend SHALL fetch new signal data from the Backend_API with the timeframe parameter
4. THE Frontend SHALL visually indicate the currently selected timeframe
5. WHEN both pair and timeframe are selected, THE Frontend SHALL combine both parameters in API requests

### Requirement 3: Live Chart Integration

**User Story:** As a trader, I want to view live price charts using TradingView, so that I can see real-time market data alongside trading signals.

#### Acceptance Criteria

1. THE Frontend SHALL embed the TradingView widget using their JavaScript library
2. WHEN a trading pair is selected, THE Frontend SHALL update the TradingView_Widget to display that pair's chart
3. WHEN a timeframe is selected, THE Frontend SHALL update the TradingView_Widget to display that timeframe
4. THE TradingView_Widget SHALL load and display without requiring React or Next.js
5. THE Frontend SHALL handle TradingView widget initialization and updates using vanilla JavaScript

### Requirement 4: Signal Display

**User Story:** As a trader, I want to see detailed trading signal information in a clear card format, so that I can make informed trading decisions.

#### Acceptance Criteria

1. WHEN signal data is received from the Backend_API, THE Frontend SHALL display it in a Signal_Card component
2. THE Signal_Card SHALL display all trading information including entry price, stop loss, take profit targets, and signal strength
3. WHEN no signal is available, THE Frontend SHALL display an appropriate message
4. WHEN the Backend_API returns an error, THE Frontend SHALL display the error message to the user
5. THE Signal_Card SHALL update dynamically when new pair or timeframe selections are made

### Requirement 5: Performance Metrics Display

**User Story:** As a trader, I want to view performance metrics for the trading signals, so that I can assess the reliability of the system.

#### Acceptance Criteria

1. THE Frontend SHALL fetch performance metrics from the Backend_API endpoint /api/metrics
2. WHEN metrics data is received, THE Frontend SHALL display accuracy, win rate, total signals, and other Performance_Metrics
3. THE Frontend SHALL format metrics data in a visually clear and organized manner
4. WHEN the metrics API call fails, THE Frontend SHALL handle the error gracefully
5. THE Frontend SHALL update metrics display when relevant data changes

### Requirement 6: Responsive Design

**User Story:** As a trader, I want the application to work well on mobile, tablet, and desktop devices, so that I can access trading signals from any device.

#### Acceptance Criteria

1. THE Frontend SHALL use responsive CSS techniques to adapt to different screen sizes
2. WHEN viewed on mobile devices, THE Frontend SHALL display components in a single-column layout
3. WHEN viewed on tablet devices, THE Frontend SHALL optimize the layout for medium-sized screens
4. WHEN viewed on desktop devices, THE Frontend SHALL utilize the full screen width effectively
5. THE Frontend SHALL ensure all interactive elements are touch-friendly on mobile devices

### Requirement 7: Modern UI with CSS Frameworks

**User Story:** As a user, I want an attractive and modern interface, so that the application is pleasant to use and professionally presented.

#### Acceptance Criteria

1. THE Frontend SHALL load at least one CSS_Framework via CDN (Bootstrap, Tailwind, or similar)
2. THE Frontend SHALL apply CSS_Framework classes to create a modern, attractive design
3. THE Frontend SHALL use consistent spacing, typography, and color schemes throughout
4. THE Frontend SHALL include visual feedback for interactive elements (hover states, active states)
5. THE Frontend SHALL maintain visual consistency across all pages and components

### Requirement 8: Backend API Integration

**User Story:** As a developer, I want the frontend to communicate with existing backend APIs, so that the conversion doesn't require backend changes.

#### Acceptance Criteria

1. THE Frontend SHALL make HTTP requests to /api/signals/generate with pair and timeframe parameters
2. THE Frontend SHALL make HTTP requests to /api/signals/history to retrieve historical signal data
3. THE Frontend SHALL make HTTP requests to /api/metrics to retrieve performance statistics
4. WHEN API requests are in progress, THE Frontend SHALL display loading indicators
5. WHEN API requests fail, THE Frontend SHALL display appropriate error messages and allow retry

### Requirement 9: Static File Structure

**User Story:** As a developer, I want a simple file structure with HTML, CSS, and JavaScript files, so that the application is easy to deploy and maintain.

#### Acceptance Criteria

1. THE Frontend SHALL consist of standard HTML files that can be served by any web server
2. THE Frontend SHALL organize JavaScript code in separate .js files loaded via script tags
3. THE Frontend SHALL organize custom CSS in separate .css files loaded via link tags
4. THE Frontend SHALL not require a build process or compilation step
5. THE Frontend SHALL load all dependencies (CSS frameworks, TradingView library) via CDN links

### Requirement 10: Feature Parity

**User Story:** As a user, I want all features from the React version to work in the vanilla version, so that I don't lose any functionality.

#### Acceptance Criteria

1. THE Frontend SHALL implement all features present in the React/Next.js version
2. WHEN comparing functionality, THE Frontend SHALL provide equivalent user interactions
3. THE Frontend SHALL maintain the same API integration patterns
4. THE Frontend SHALL preserve all data display formats and information
5. THE Frontend SHALL ensure no regression in user experience or capabilities
