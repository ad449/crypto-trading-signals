# Implementation Plan: Vanilla Frontend Conversion

## Overview

This plan converts the crypto trading signals frontend from React/Next.js to vanilla HTML, CSS, and JavaScript. The implementation follows a modular approach with clear separation between structure (HTML), styling (CSS + CDN frameworks), and logic (JavaScript modules). All existing backend API routes remain unchanged.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create directory structure (css/, js/, assets/)
  - Create index.html with semantic structure and CDN links
  - Add Tailwind CSS CDN link
  - Add TradingView widget script tag
  - Set up basic HTML sections: controls, chart, signal, metrics
  - _Requirements: 9.1, 9.2, 9.3, 9.5, 7.1_

- [ ] 2. Implement API communication module
  - [-] 2.1 Create api.js with API functions
    - Implement generateSignal() function for /api/signals/generate
    - Implement getSignalHistory() function for /api/signals/history
    - Implement getMetrics() function for /api/metrics
    - Add error handling for all API calls
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 2.2 Write property test for API parameter correctness
    - **Property 3: API calls include correct parameters**
    - **Validates: Requirements 1.5, 2.3, 2.5, 8.1**
  
  - [ ] 2.3 Write unit tests for API module
    - Test API endpoint URLs are correct
    - Test error handling for failed requests
    - Test request body formatting
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 3. Implement UI rendering module
  - [ ] 3.1 Create ui.js with rendering functions
    - Implement renderPairSelector() with search functionality
    - Implement renderTimeframeSelector() with button group
    - Implement renderSignalCard() with all signal fields
    - Implement renderMetrics() with performance stats
    - Implement showLoading() and hideLoading() functions
    - Implement showError() function
    - _Requirements: 1.1, 1.2, 2.1, 4.1, 4.2, 4.3, 4.4, 5.2, 8.4_
  
  - [ ] 3.2 Write property test for pair search filtering
    - **Property 1: Pair search filtering**
    - **Validates: Requirements 1.2**
  
  - [ ] 3.3 Write property test for UI state reflection
    - **Property 4: UI reflects application state**
    - **Validates: Requirements 1.4, 2.4**
  
  - [ ] 3.4 Write property test for signal card fields
    - **Property 5: Signal card displays all required fields**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ] 3.5 Write property test for metrics display fields
    - **Property 7: Metrics display all required fields**
    - **Validates: Requirements 5.2**
  
  - [ ] 3.6 Write property test for loading indicators
    - **Property 9: Loading indicators during API calls**
    - **Validates: Requirements 8.4**
  
  - [ ] 3.7 Write unit tests for UI module
    - Test that 30 pairs are rendered (Req 1.1)
    - Test that 6 timeframes are rendered (Req 2.1)
    - Test empty signal state displays message (Req 4.3)
    - _Requirements: 1.1, 2.1, 4.3_

- [ ] 4. Implement chart integration module
  - [ ] 4.1 Create chart.js with ChartManager class
    - Implement initialize() method for TradingView widget creation
    - Implement update() method for chart updates
    - Implement convertTimeframe() helper for timeframe mapping
    - Handle widget cleanup and re-initialization
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 4.2 Write property test for chart updates
    - **Property 2: Chart updates on state changes**
    - **Validates: Requirements 1.3, 2.2, 3.2, 3.3**
  
  - [ ] 4.3 Write unit tests for chart module
    - Test TradingView widget initialization (Req 3.1, 3.4)
    - Test timeframe conversion mapping
    - Test widget cleanup on update
    - _Requirements: 3.1, 3.4_

- [ ] 5. Checkpoint - Verify module implementations
  - Ensure all modules are created and export correct functions
  - Verify no syntax errors in JavaScript files
  - Ask the user if questions arise

- [ ] 6. Implement main application module
  - [ ] 6.1 Create app.js with TradingSignalsApp class
    - Initialize application state with pairs and timeframes
    - Implement initialize() method to set up UI and load data
    - Implement handlePairChange() for pair selection
    - Implement handleTimeframeChange() for timeframe selection
    - Implement loadSignal() to fetch and display signals
    - Implement loadMetrics() to fetch and display metrics
    - Wire up event handlers for user interactions
    - _Requirements: 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5, 4.5, 5.1, 5.5_
  
  - [ ] 6.2 Write property test for error message display
    - **Property 6: Error messages displayed to user**
    - **Validates: Requirements 4.4, 8.5**
  
  - [ ] 6.3 Write property test for metrics UI updates
    - **Property 8: Metrics UI updates with data**
    - **Validates: Requirements 5.5**
  
  - [ ] 6.4 Write unit tests for app module
    - Test app initialization
    - Test state management
    - Test event handler wiring
    - _Requirements: 1.3, 2.2, 5.1_

- [ ] 7. Implement custom CSS styling
  - [ ] 7.1 Create main.css with base styles
    - Define CSS custom properties for colors and spacing
    - Add utility classes for common patterns
    - Implement responsive breakpoints
    - Add loading spinner animation
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 7.2 Create components.css with component styles
    - Style signal card with color-coded sections
    - Style metrics cards with visual hierarchy
    - Add hover and active states for interactive elements
    - Ensure touch-friendly sizing for mobile (min 44px)
    - _Requirements: 7.4, 6.5_
  
  - [ ] 7.3 Write property test for interactive element feedback
    - **Property 10: Interactive elements have visual feedback**
    - **Validates: Requirements 7.4**
  
  - [ ] 7.4 Write unit tests for responsive design
    - Test mobile viewport layout (Req 6.2)
    - Test tablet viewport layout (Req 6.3)
    - Test touch-friendly element sizing (Req 6.5)
    - _Requirements: 6.2, 6.3, 6.5_

- [ ] 8. Integration and error handling
  - [ ] 8.1 Add comprehensive error handling
    - Add try-catch blocks around all API calls
    - Implement user-friendly error messages
    - Add error recovery and retry mechanisms
    - Handle TradingView widget load failures
    - _Requirements: 4.4, 5.4, 8.5_
  
  - [ ] 8.2 Add input validation and sanitization
    - Sanitize search input to prevent XSS
    - Validate pair and timeframe before API calls
    - Validate API response structure
    - _Requirements: 1.2, 8.1_
  
  - [ ] 8.3 Write integration tests
    - Test complete user flow: select pair → select timeframe → view signal
    - Test error recovery flows
    - Test metrics loading and display
    - _Requirements: 10.1, 10.2_

- [ ] 9. Final checkpoint and verification
  - Ensure all tests pass
  - Verify all 30 trading pairs are available
  - Verify all 6 timeframes work correctly
  - Test in multiple browsers (Chrome, Firefox, Safari)
  - Verify responsive design on different screen sizes
  - Ask the user if questions arise

## Notes

- Each task references specific requirements for traceability
- The implementation uses ES6 modules for JavaScript organization
- No build process required - files can be served directly
- TradingView widget is loaded from their CDN
- Tailwind CSS is loaded from CDN for styling
- All backend API routes remain unchanged
