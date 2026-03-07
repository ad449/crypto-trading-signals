/**
 * Chart Module
 * Manages TradingView widget integration
 */

export class ChartManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.widget = null;
    }
    
    /**
     * Initialize TradingView widget
     * @param {string} pair - Trading pair (e.g., 'BTC/USDT')
     * @param {string} timeframe - Timeframe (e.g., '1h')
     */
    initialize(pair, timeframe) {
        try {
            const tvTimeframe = this.convertTimeframe(timeframe);
            const symbol = this.formatSymbol(pair);
            
            // Update chart title
            this.updateChartTitle(pair, timeframe);
            
            // Check if TradingView is available
            if (typeof TradingView === 'undefined') {
                console.error('TradingView library not loaded');
                return;
            }
            
            // Create TradingView widget
            this.widget = new TradingView.widget({
                container_id: this.containerId,
                symbol: symbol,
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
                width: "100%",
                studies: [
                    "RSI@tv-basicstudies",
                    "MACD@tv-basicstudies",
                    "BB@tv-basicstudies"
                ]
            });
        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }
    
    /**
     * Update chart with new pair and timeframe
     * @param {string} pair - Trading pair
     * @param {string} timeframe - Timeframe
     */
    update(pair, timeframe) {
        try {
            // Clear existing widget
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = '';
            }
            
            // Initialize new widget
            this.initialize(pair, timeframe);
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }
    
    /**
     * Convert timeframe to TradingView format
     * @param {string} timeframe - Timeframe (e.g., '1h')
     * @returns {string} TradingView timeframe format
     */
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
    
    /**
     * Format trading pair for TradingView
     * @param {string} pair - Trading pair (e.g., 'BTC/USDT')
     * @returns {string} Formatted symbol for TradingView
     */
    formatSymbol(pair) {
        // Remove slash and format for TradingView
        // Example: 'BTC/USDT' -> 'BTCUSDT'
        return pair.replace('/', '');
    }
    
    /**
     * Update chart title
     * @param {string} pair - Trading pair
     * @param {string} timeframe - Timeframe
     */
    updateChartTitle(pair, timeframe) {
        const titleElement = document.getElementById('chart-title');
        if (titleElement) {
            titleElement.textContent = `Live Chart - ${pair} (${timeframe})`;
        }
    }
}
