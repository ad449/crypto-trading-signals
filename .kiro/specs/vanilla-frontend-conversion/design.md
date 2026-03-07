# Design Document: Vanilla Frontend Conversion

## Overview

This design describes the conversion of the crypto trading signals frontend from React/Next.js to vanilla HTML, CSS, and JavaScript. The new frontend will maintain all existing functionality while using plain web technologies, CSS frameworks via CDN, and the existing backend API routes.

The architecture follows a simple, modular approach with separation of concerns:
- HTML files for structure and layout
- CSS files for custom styling (supplementing CDN frameworks)
- JavaScript modules for application logic, API communication, and DOM manipulation
- CDN-loaded libraries for styling (Bootstrap/Tailwind) and charting (TradingView)

## Architecture

### High-Level Structure

```
vanilla-frontend/
├── index.html              # Main application page
├── css/
│   ├── main.css           # Custom styles
│   └── components.css     # Component-specific styles
├── js/
│   ├── app.js             # Application initialization
│   ├── api.js             # API communication layer
│   ├── ui.js              # UI update and rendering
│   ├── chart.js           # TradingView chart integration
│   └── utils.js           # Utility functions
└── assets/
    └── (images, icons if needed)
```

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **CSS Framework**: Tailwind CSS via CDN (or Bootstrap as alternative)
- **JavaScript (ES6+)**: Vanilla JavaScript with modules
- **TradingView Widget**: Embedded via their JavaScript library
- **Fetch API**: For HTTP requests to backend

### Design Principles

1. **No Build Process**: All files can be served directly by any web server
2. **Progressive Enhancement**: Core functionality works, enhanced with modern features
3. **Separation of Concerns**: Clear boundaries between data, logic, and presentation
4. **Modular JavaScript**: Organized into logical modules for maintainability
5. **CDN Dependencies**: External libraries loaded from CDNs for simplicity

## Components and Interfaces

### 1. HTML Structure (index.html)

The main HTML file provides the application structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto Trading Signals</title>
    
    <!-- Tailwind CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body class="bg-gray-100">
    <div id="app" class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="mb-8">
            <h1 class="text-4xl font-bold text-gray-800">Crypto Trading Signals</h1>
        </header>
        
        <!-- Controls Section -->
        <section id="controls" class="mb-6 bg-white rounded-lg shadow-md p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Trading Pair Selector -->
                <div id="pair-selector-container"></div>
                
                <!-- Timeframe Selector -->
                <div id="timeframe-selector-container"></div>
            </div>
        </section>
        
        <!-- Chart Section -->
        <section id="chart-section" class="mb-6 bg-white rounded-lg shadow-md p-6">
            <div id="tradingview-widget" style="height: 500px;"></div>
        </section>
        
        <!-- Signal Display Section -->
        <section id="signal-section" class="mb-6">
            <div id="signal-card-container"></div>
        </section>
        
        <!-- Performance Metrics Section -->
        <section id="metrics-section" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-4">Performance Metrics</h2>
            <div id="metrics-container"></div>
        </section>
        
        <!-- Loading Overlay -->
        <div id="loading-overlay" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-8">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        </div>
    </div>
    
    <!-- TradingView Widget Script -->
    <script src="https://s3.tradingview.com/tv.js"></script>
    
    <!-- Application Scripts -->
    <script type="module" src="js/app.js"></script>
</body>
</html>
```

### 2. API Communication Module (api.js)

Handles all backend API interactions:

```javascript
// api.js
const API_BASE = '/api';

export const API = {
    async generateSignal(pair, timeframe) {
        const response = await fetch(`${API_BASE}/signals/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pair, timeframe })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    },
    
    async getSignalHistory(pair, timeframe) {
        const params = new URLSearchParams({ pair, timeframe });
        const response = await fetch(`${API_BASE}/signals/history?${params}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    },
    
    async getMetrics() {
        const response = await fetch(`${API_BASE}/metrics`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    }
};
```

### 3. UI Module (ui.js)

Manages DOM manipulation and rendering:

```javascript
// ui.js
export const UI = {
    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    },
    
    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    },
    
    renderPairSelector(pairs, selectedPair, onSelect) {
        const container = document.getElementById('pair-selector-container');
        container.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Trading Pair</label>
                <input type="text" id="pair-search" placeholder="Search pairs..." 
                       class="w-full px-4 py-2 border rounded-lg mb-2">
                <select id="pair-select" class="w-full px-4 py-2 border rounded-lg">
                    ${pairs.map(pair => 
                        `<option value="${pair}" ${pair === selectedPair ? 'selected' : ''}>${pair}</option>`
                    ).join('')}
                </select>
            </div>
        `;
        
        // Add search functionality
        const searchInput = document.getElementById('pair-search');
        const select = document.getElementById('pair-select');
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = select.querySelectorAll('option');
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
        
        select.addEventListener('change', (e) => onSelect(e.target.value));
    },
    
    renderTimeframeSelector(timeframes, selectedTimeframe, onSelect) {
        const container = document.getElementById('timeframe-selector-container');
        container.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                <div class="flex flex-wrap gap-2">
                    ${timeframes.map(tf => `
                        <button class="timeframe-btn px-4 py-2 rounded-lg border ${
                            tf === selectedTimeframe 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }" data-timeframe="${tf}">
                            ${tf}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                onSelect(e.target.dataset.timeframe);
            });
        });
    },
    
    renderSignalCard(signal) {
        const container = document.getElementById('signal-card-container');
        
        if (!signal || signal.error) {
            container.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p class="text-yellow-800">${signal?.error || 'No signal available'}</p>
                </div>
            `;
            return;
        }
        
        const signalColor = signal.direction === 'LONG' ? 'green' : 'red';
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold">Trading Signal</h3>
                    <span class="px-4 py-2 rounded-lg bg-${signalColor}-100 text-${signalColor}-800 font-semibold">
                        ${signal.direction}
                    </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="border-l-4 border-blue-500 pl-4">
                        <p class="text-sm text-gray-600">Entry Price</p>
                        <p class="text-xl font-bold">${signal.entryPrice}</p>
                    </div>
                    
                    <div class="border-l-4 border-red-500 pl-4">
                        <p class="text-sm text-gray-600">Stop Loss</p>
                        <p class="text-xl font-bold">${signal.stopLoss}</p>
                    </div>
                    
                    <div class="border-l-4 border-green-500 pl-4">
                        <p class="text-sm text-gray-600">Take Profit 1</p>
                        <p class="text-xl font-bold">${signal.takeProfit1}</p>
                    </div>
                    
                    <div class="border-l-4 border-green-500 pl-4">
                        <p class="text-sm text-gray-600">Take Profit 2</p>
                        <p class="text-xl font-bold">${signal.takeProfit2}</p>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Signal Strength</span>
                        <span class="font-semibold">${signal.strength}/10</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${signal.strength * 10}%"></div>
                    </div>
                </div>
                
                ${signal.notes ? `
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p class="text-sm text-gray-700">${signal.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    renderMetrics(metrics) {
        const container = document.getElementById('metrics-container');
        
        if (!metrics) {
            container.innerHTML = '<p class="text-gray-600">No metrics available</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-600">Accuracy</p>
                    <p class="text-3xl font-bold text-blue-600">${metrics.accuracy}%</p>
                </div>
                
                <div class="text-center p-4 bg-green-50 rounded-lg">
                    <p class="text-sm text-gray-600">Win Rate</p>
                    <p class="text-3xl font-bold text-green-600">${metrics.winRate}%</p>
                </div>
                
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <p class="text-sm text-gray-600">Total Signals</p>
                    <p class="text-3xl font-bold text-purple-600">${metrics.totalSignals}</p>
                </div>
                
                <div class="text-center p-4 bg-orange-50 rounded-lg">
                    <p class="text-sm text-gray-600">Avg Profit</p>
                    <p class="text-3xl font-bold text-orange-600">${metrics.avgProfit}%</p>
                </div>
            </div>
        `;
    },
    
    showError(message) {
        const container = document.getElementById('signal-card-container');
        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <p class="text-red-800 font-semibold">Error</p>
                <p class="text-red-700">${message}</p>
            </div>
        `;
    }
};
```

### 4. Chart Module (chart.js)

Manages TradingView widget integration:

```javascript
// chart.js
export class ChartManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.widget = null;
    }
    
    initialize(pair, timeframe) {
        // Convert timeframe to TradingView format
        const tvTimeframe = this.convertTimeframe(timeframe);
        
        // Create TradingView widget
        this.widget = new TradingView.widget({
            container_id: this.containerId,
            symbol: pair.replace('/', ''),
            interval: tvTimeframe,
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            height: 500,
            width: "100%"
        });
    }
    
    update(pair, timeframe) {
        // Destroy existing widget and create new one
        if (this.widget) {
            const container = document.getElementById(this.containerId);
            container.innerHTML = '';
        }
        
        this.initialize(pair, timeframe);
    }
    
    convertTimeframe(timeframe) {
        const mapping = {
            '1m': '1',
            '5m': '5',
            '15m': '15',
            '1h': '60',
            '4h': '240',
            '1D': 'D'
        };
        
        return mapping[timeframe] || '60';
    }
}
```

### 5. Application Module (app.js)

Main application logic and state management:

```javascript
// app.js
import { API } from './api.js';
import { UI } from './ui.js';
import { ChartManager } from './chart.js';

class TradingSignalsApp {
    constructor() {
        this.state = {
            pairs: [
                'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT',
                'SOL/USDT', 'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'MATIC/USDT',
                'LINK/USDT', 'UNI/USDT', 'LTC/USDT', 'ATOM/USDT', 'ETC/USDT',
                'XLM/USDT', 'ALGO/USDT', 'VET/USDT', 'FIL/USDT', 'TRX/USDT',
                'EOS/USDT', 'AAVE/USDT', 'GRT/USDT', 'THETA/USDT', 'XTZ/USDT',
                'AXS/USDT', 'SAND/USDT', 'MANA/USDT', 'ENJ/USDT', 'CHZ/USDT'
            ],
            timeframes: ['1m', '5m', '15m', '1h', '4h', '1D'],
            selectedPair: 'BTC/USDT',
            selectedTimeframe: '1h',
            currentSignal: null,
            metrics: null
        };
        
        this.chartManager = new ChartManager('tradingview-widget');
    }
    
    async initialize() {
        // Render UI components
        this.renderUI();
        
        // Initialize chart
        this.chartManager.initialize(this.state.selectedPair, this.state.selectedTimeframe);
        
        // Load initial data
        await this.loadSignal();
        await this.loadMetrics();
    }
    
    renderUI() {
        UI.renderPairSelector(
            this.state.pairs,
            this.state.selectedPair,
            (pair) => this.handlePairChange(pair)
        );
        
        UI.renderTimeframeSelector(
            this.state.timeframes,
            this.state.selectedTimeframe,
            (timeframe) => this.handleTimeframeChange(timeframe)
        );
    }
    
    async handlePairChange(pair) {
        this.state.selectedPair = pair;
        this.chartManager.update(pair, this.state.selectedTimeframe);
        this.renderUI();
        await this.loadSignal();
    }
    
    async handleTimeframeChange(timeframe) {
        this.state.selectedTimeframe = timeframe;
        this.chartManager.update(this.state.selectedPair, timeframe);
        this.renderUI();
        await this.loadSignal();
    }
    
    async loadSignal() {
        try {
            UI.showLoading();
            const signal = await API.generateSignal(
                this.state.selectedPair,
                this.state.selectedTimeframe
            );
            this.state.currentSignal = signal;
            UI.renderSignalCard(signal);
        } catch (error) {
            console.error('Error loading signal:', error);
            UI.showError(error.message);
        } finally {
            UI.hideLoading();
        }
    }
    
    async loadMetrics() {
        try {
            const metrics = await API.getMetrics();
            this.state.metrics = metrics;
            UI.renderMetrics(metrics);
        } catch (error) {
            console.error('Error loading metrics:', error);
            // Metrics are non-critical, so we don't show error to user
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new TradingSignalsApp();
    app.initialize();
});
```

## Data Models

### Application State

```javascript
{
    pairs: string[],              // Array of trading pair strings
    timeframes: string[],         // Array of timeframe strings
    selectedPair: string,         // Currently selected trading pair
    selectedTimeframe: string,    // Currently selected timeframe
    currentSignal: Signal | null, // Current trading signal
    metrics: Metrics | null       // Performance metrics
}
```

### Signal Model

```javascript
{
    direction: 'LONG' | 'SHORT',  // Trade direction
    entryPrice: number,           // Entry price point
    stopLoss: number,             // Stop loss price
    takeProfit1: number,          // First take profit target
    takeProfit2: number,          // Second take profit target
    strength: number,             // Signal strength (0-10)
    notes?: string,               // Optional notes
    error?: string                // Error message if signal generation failed
}
```

### Metrics Model

```javascript
{
    accuracy: number,      // Accuracy percentage
    winRate: number,       // Win rate percentage
    totalSignals: number,  // Total number of signals
    avgProfit: number      // Average profit percentage
}
```

## Correctness Properties


A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Pair search filtering

*For any* search term entered in the pair search field, all visible trading pair options should contain the search term (case-insensitive).

**Validates: Requirements 1.2**

### Property 2: Chart updates on state changes

*For any* combination of trading pair and timeframe selection, the TradingView widget should update to display the selected pair and timeframe.

**Validates: Requirements 1.3, 2.2, 3.2, 3.3**

### Property 3: API calls include correct parameters

*For any* trading pair and timeframe selection, API calls to /api/signals/generate should include both the selected pair and timeframe as parameters.

**Validates: Requirements 1.5, 2.3, 2.5, 8.1**

### Property 4: UI reflects application state

*For any* selected trading pair and timeframe, the UI should visually indicate which pair and timeframe are currently selected.

**Validates: Requirements 1.4, 2.4**

### Property 5: Signal card displays all required fields

*For any* valid signal data received from the API, the rendered signal card should contain entry price, stop loss, take profit targets, and signal strength fields.

**Validates: Requirements 4.1, 4.2**

### Property 6: Error messages displayed to user

*For any* API error response, the frontend should display an error message to the user indicating what went wrong.

**Validates: Requirements 4.4, 8.5**

### Property 7: Metrics display all required fields

*For any* valid metrics data received from the API, the rendered metrics display should contain accuracy, win rate, total signals, and average profit fields.

**Validates: Requirements 5.2**

### Property 8: Metrics UI updates with data

*For any* change in metrics data, the metrics display should update to reflect the new values.

**Validates: Requirements 5.5**

### Property 9: Loading indicators during API calls

*For any* API request in progress, a loading indicator should be visible to the user.

**Validates: Requirements 8.4**

### Property 10: Interactive elements have visual feedback

*For any* interactive element (buttons, selects, inputs), CSS should define hover and/or active states that provide visual feedback.

**Validates: Requirements 7.4**

## Error Handling

### API Error Handling

All API calls should be wrapped in try-catch blocks:

1. **Network Errors**: Display user-friendly message when network is unavailable
2. **HTTP Errors**: Parse and display error messages from API responses
3. **Timeout Errors**: Implement reasonable timeouts and inform user
4. **Retry Logic**: Allow users to retry failed operations

### UI Error States

1. **Empty States**: Display helpful messages when no data is available
2. **Loading States**: Show loading indicators during async operations
3. **Error States**: Display error messages with actionable information
4. **Fallback Content**: Provide fallback UI when components fail to load

### TradingView Widget Errors

1. **Script Load Failure**: Detect if TradingView script fails to load
2. **Widget Initialization Failure**: Handle widget creation errors gracefully
3. **Symbol Not Found**: Handle cases where trading pair is not available in TradingView

### Input Validation

1. **Search Input**: Sanitize search input to prevent XSS
2. **API Parameters**: Validate pair and timeframe before sending to API
3. **Response Validation**: Verify API responses match expected structure

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across many inputs.

### Unit Testing

Unit tests should focus on:

1. **Specific Examples**:
   - Test that the app initializes with 30 specific trading pairs (Req 1.1)
   - Test that 6 specific timeframes are displayed (Req 2.1)
   - Test that TradingView widget initializes correctly (Req 3.1, 3.4)
   - Test that CSS framework is loaded via CDN (Req 7.1)
   - Test that JavaScript files are organized in separate modules (Req 9.2)
   - Test that CSS files are organized separately (Req 9.3)
   - Test that dependencies are loaded from CDN (Req 9.5)
   - Test that metrics API is called (Req 5.1)
   - Test that history API is called (Req 8.2)

2. **Edge Cases**:
   - Test that no signal available displays appropriate message (Req 4.3)
   - Test that metrics API failure is handled gracefully (Req 5.4)
   - Test responsive layout on mobile viewport (Req 6.2)
   - Test responsive layout on tablet viewport (Req 6.3)
   - Test that interactive elements are touch-friendly on mobile (Req 6.5)

3. **Integration Points**:
   - Test that API module correctly formats requests
   - Test that UI module correctly handles DOM updates
   - Test that chart module correctly converts timeframe formats
   - Test that app module correctly coordinates between modules

### Property-Based Testing

Property-based tests should be implemented using a JavaScript PBT library such as:
- **fast-check** (recommended for JavaScript/TypeScript)
- **jsverify** (alternative)

Each property test should:
- Run a minimum of 100 iterations
- Include a comment tag referencing the design property
- Tag format: `// Feature: vanilla-frontend-conversion, Property {number}: {property_text}`

Property tests should verify:

1. **Property 1**: Pair search filtering works for all search terms
2. **Property 2**: Chart updates correctly for all pair/timeframe combinations
3. **Property 3**: API calls include correct parameters for all selections
4. **Property 4**: UI state reflection works for all selections
5. **Property 5**: Signal cards display all fields for all valid signals
6. **Property 6**: Error messages display for all error responses
7. **Property 7**: Metrics display all fields for all valid metrics data
8. **Property 8**: Metrics UI updates for all data changes
9. **Property 9**: Loading indicators appear for all API calls
10. **Property 10**: Interactive elements have visual feedback states

### Test Organization

```
tests/
├── unit/
│   ├── api.test.js           # API module unit tests
│   ├── ui.test.js            # UI module unit tests
│   ├── chart.test.js         # Chart module unit tests
│   ├── app.test.js           # App module unit tests
│   └── integration.test.js   # Integration tests
└── property/
    ├── search.property.test.js      # Property 1
    ├── chart.property.test.js       # Property 2
    ├── api.property.test.js         # Properties 3, 9
    ├── ui.property.test.js          # Properties 4, 5, 7, 8, 10
    └── errors.property.test.js      # Property 6
```

### Testing Tools

- **Test Runner**: Jest or Vitest
- **DOM Testing**: jsdom or happy-dom
- **Property Testing**: fast-check
- **Mocking**: Built-in Jest/Vitest mocks for API calls
- **Coverage**: Istanbul/c8 for code coverage reporting

### Manual Testing Checklist

While automated tests cover most functionality, manual testing should verify:

1. Visual design quality and aesthetics
2. Responsive behavior across real devices
3. TradingView widget interaction and performance
4. Overall user experience and flow
5. Accessibility with screen readers
6. Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## Implementation Notes

### Browser Compatibility

Target modern browsers with ES6+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Use feature detection for critical APIs:
- Fetch API (with polyfill fallback)
- ES6 Modules (with fallback to bundled version)
- CSS Grid and Flexbox (with fallback layouts)

### Performance Considerations

1. **Lazy Loading**: Load TradingView widget only when needed
2. **Debouncing**: Debounce search input to reduce filtering operations
3. **Caching**: Cache API responses where appropriate
4. **Minimal DOM Updates**: Update only changed elements, not entire sections
5. **CSS Optimization**: Use CDN with compression and caching

### Security Considerations

1. **XSS Prevention**: Sanitize all user input before rendering
2. **CORS**: Ensure backend APIs have appropriate CORS headers
3. **CSP**: Implement Content Security Policy headers
4. **HTTPS**: Serve application over HTTPS in production
5. **API Keys**: Never expose API keys in frontend code

### Deployment

The application can be deployed to any static hosting service:
- **Netlify**: Drop folder or connect to Git
- **Vercel**: Static site deployment
- **GitHub Pages**: Free hosting for public repos
- **AWS S3 + CloudFront**: Scalable static hosting
- **Any web server**: Apache, Nginx, or any HTTP server

No build process required - just upload the files and serve them.
