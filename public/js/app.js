/**
 * Main Application Module
 * Coordinates all modules and manages application state
 */

import { API } from './api.js';
import { UI } from './ui.js';
import { ChartManager } from './chart.js';

class TradingSignalsApp {
    constructor() {
        this.state = {
            pairs: [
                'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT',
                'XRP/USDT', 'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'MATIC/USDT',
                'LINK/USDT', 'UNI/USDT', 'ATOM/USDT', 'LTC/USDT', 'ETC/USDT',
                'XLM/USDT', 'ALGO/USDT', 'VET/USDT', 'FIL/USDT', 'TRX/USDT',
                'AAVE/USDT', 'SAND/USDT', 'MANA/USDT', 'AXS/USDT', 'THETA/USDT',
                'FTM/USDT', 'NEAR/USDT', 'APE/USDT', 'GALA/USDT', 'CHZ/USDT'
            ],
            timeframes: ['1m', '5m', '15m', '1h', '4h', '1D'],
            selectedPair: 'BTC/USDT',
            selectedTimeframe: '1h',
            currentSignal: null,
            metrics: null
        };
        
        this.chartManager = new ChartManager('tradingview-widget');
    }
    
    /**
     * Initialize the application
     */
    async initialize() {
        try {
            console.log('Initializing Trading Signals App...');
            
            // Render UI components
            this.renderUI();
            
            // Initialize chart
            this.chartManager.initialize(this.state.selectedPair, this.state.selectedTimeframe);
            
            // Load initial data
            await this.loadSignal();
            await this.loadMetrics();
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            UI.showError('Failed to initialize application. Please refresh the page.');
        }
    }
    
    /**
     * Render UI components
     */
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
    
    /**
     * Handle trading pair change
     * @param {string} pair - Selected trading pair
     */
    async handlePairChange(pair) {
        try {
            console.log('Pair changed to:', pair);
            this.state.selectedPair = pair;
            
            // Update chart
            this.chartManager.update(pair, this.state.selectedTimeframe);
            
            // Re-render UI to update active states
            this.renderUI();
            
            // Load new signal
            await this.loadSignal();
        } catch (error) {
            console.error('Error handling pair change:', error);
            UI.showError('Failed to update trading pair. Please try again.');
        }
    }
    
    /**
     * Handle timeframe change
     * @param {string} timeframe - Selected timeframe
     */
    async handleTimeframeChange(timeframe) {
        try {
            console.log('Timeframe changed to:', timeframe);
            this.state.selectedTimeframe = timeframe;
            
            // Update chart
            this.chartManager.update(this.state.selectedPair, timeframe);
            
            // Re-render UI to update active states
            this.renderUI();
            
            // Load new signal
            await this.loadSignal();
        } catch (error) {
            console.error('Error handling timeframe change:', error);
            UI.showError('Failed to update timeframe. Please try again.');
        }
    }
    
    /**
     * Load trading signal from API
     */
    async loadSignal() {
        try {
            UI.showLoading();
            
            console.log(`Loading signal for ${this.state.selectedPair} ${this.state.selectedTimeframe}`);
            
            // Validate parameters
            API.validateParameters(this.state.selectedPair, this.state.selectedTimeframe);
            
            // Fetch signal
            const signal = await API.generateSignal(
                this.state.selectedPair,
                this.state.selectedTimeframe
            );
            
            this.state.currentSignal = signal;
            UI.renderSignalCard(signal);
            
            console.log('Signal loaded successfully:', signal);
        } catch (error) {
            console.error('Error loading signal:', error);
            UI.showError(`Failed to load signal: ${error.message}`);
        } finally {
            UI.hideLoading();
        }
    }
    
    /**
     * Load performance metrics from API
     */
    async loadMetrics() {
        try {
            console.log('Loading performance metrics...');
            
            const metrics = await API.getMetrics(
                this.state.selectedPair,
                this.state.selectedTimeframe
            );
            
            this.state.metrics = metrics;
            UI.renderMetrics(metrics);
            
            console.log('Metrics loaded successfully:', metrics);
        } catch (error) {
            console.error('Error loading metrics:', error);
            // Metrics are non-critical, so we don't show error to user
            UI.renderMetrics({ error: 'Unable to load metrics' });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    const app = new TradingSignalsApp();
    app.initialize();
});
