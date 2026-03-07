/**
 * UI Module
 * Manages DOM manipulation and rendering
 */

/**
 * Show loading overlay
 */
export function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

/**
 * Render trading pair selector with search functionality
 * @param {Array<string>} pairs - Array of trading pairs
 * @param {string} selectedPair - Currently selected pair
 * @param {Function} onSelect - Callback when pair is selected
 */
export function renderPairSelector(pairs, selectedPair, onSelect) {
    const container = document.getElementById('pair-selector-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="pair-selector">
            <label class="block text-sm font-medium text-gray-700 mb-2">Trading Pair</label>
            <input 
                type="text" 
                id="pair-search" 
                placeholder="Search pairs..." 
                class="pair-search mb-2"
            >
            <select id="pair-select" class="pair-select">
                ${pairs.map(pair => 
                    `<option value="${pair}" ${pair === selectedPair ? 'selected' : ''}>${pair}</option>`
                ).join('')}
            </select>
        </div>
    `;
    
    // Add search functionality
    const searchInput = document.getElementById('pair-search');
    const select = document.getElementById('pair-select');
    
    if (searchInput && select) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = select.querySelectorAll('option');
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
        
        select.addEventListener('change', (e) => {
            if (onSelect) onSelect(e.target.value);
        });
    }
}

/**
 * Render timeframe selector
 * @param {Array<string>} timeframes - Array of timeframes
 * @param {string} selectedTimeframe - Currently selected timeframe
 * @param {Function} onSelect - Callback when timeframe is selected
 */
export function renderTimeframeSelector(timeframes, selectedTimeframe, onSelect) {
    const container = document.getElementById('timeframe-selector-container');
    if (!container) return;
    
    container.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <div class="flex flex-wrap gap-2">
                ${timeframes.map(tf => `
                    <button 
                        class="timeframe-btn ${tf === selectedTimeframe ? 'active' : ''}" 
                        data-timeframe="${tf}"
                    >
                        ${tf}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    container.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (onSelect) onSelect(e.target.dataset.timeframe);
        });
    });
}

/**
 * Render signal card
 * @param {Object} signal - Signal data
 */
export function renderSignalCard(signal) {
    const container = document.getElementById('signal-card-container');
    if (!container) return;
    
    if (!signal || signal.error) {
        container.innerHTML = `
            <div class="empty-state fade-in">
                <p class="text-lg font-semibold">${signal?.error || 'No signal available'}</p>
                <p class="text-sm mt-2">Select a trading pair and timeframe to generate a signal</p>
            </div>
        `;
        return;
    }
    
    const signalTypeClass = signal.signalType === 'BUY' ? 'buy' : signal.signalType === 'SELL' ? 'sell' : 'no-trade';
    const signalTypeText = signal.signalType || 'NO TRADE';
    
    container.innerHTML = `
        <div class="signal-card fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-3xl font-bold text-gray-800">Trading Signal</h3>
                <span class="signal-badge ${signalTypeClass}">
                    ${signalTypeText}
                </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="signal-field entry">
                    <p class="signal-field-label">Entry Price</p>
                    <p class="signal-field-value">$${signal.entryPrice?.toFixed(6) || 'N/A'}</p>
                </div>
                
                <div class="signal-field stop-loss">
                    <p class="signal-field-label">Stop Loss</p>
                    <p class="signal-field-value">$${signal.stopLoss?.toFixed(6) || 'N/A'}</p>
                </div>
                
                <div class="signal-field take-profit">
                    <p class="signal-field-label">Take Profit 1</p>
                    <p class="signal-field-value">$${signal.takeProfit1?.toFixed(6) || 'N/A'}</p>
                </div>
                
                <div class="signal-field take-profit">
                    <p class="signal-field-label">Take Profit 2</p>
                    <p class="signal-field-value">$${signal.takeProfit2?.toFixed(6) || 'N/A'}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-600">Risk/Reward</p>
                    <p class="text-2xl font-bold text-blue-600">${signal.riskRewardRatio?.toFixed(2) || 'N/A'}</p>
                </div>
                
                <div class="text-center p-4 bg-green-50 rounded-lg">
                    <p class="text-sm text-gray-600">Win Probability</p>
                    <p class="text-2xl font-bold text-green-600">${signal.winProbability || 'N/A'}%</p>
                </div>
                
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <p class="text-sm text-gray-600">Risk Level</p>
                    <p class="text-2xl font-bold text-purple-600">${signal.riskLevel || 'N/A'}</p>
                </div>
            </div>
            
            ${signal.analysisSummary ? `
                <div class="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Analysis Summary</p>
                    <p class="text-sm text-gray-600">${signal.analysisSummary}</p>
                </div>
            ` : ''}
            
            ${signal.indicatorConfirmations && signal.indicatorConfirmations.length > 0 ? `
                <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Confirmations (${signal.indicatorConfirmations.length})</p>
                    <ul class="list-disc list-inside text-sm text-gray-600">
                        ${signal.indicatorConfirmations.map(conf => `<li>${conf}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Render performance metrics
 * @param {Object} metrics - Metrics data
 */
export function renderMetrics(metrics) {
    const container = document.getElementById('metrics-container');
    if (!container) return;
    
    if (!metrics || metrics.error) {
        container.innerHTML = '<p class="text-gray-600">No metrics available</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
            <div class="metric-card bg-blue-50">
                <p class="metric-label">Total Signals</p>
                <p class="metric-value text-blue-600">${metrics.totalSignals || 0}</p>
            </div>
            
            <div class="metric-card bg-green-50">
                <p class="metric-label">Win Rate</p>
                <p class="metric-value text-green-600">${metrics.winRate || 0}%</p>
            </div>
            
            <div class="metric-card bg-purple-50">
                <p class="metric-label">Accuracy</p>
                <p class="metric-value text-purple-600">${metrics.accuracy || 0}%</p>
            </div>
            
            <div class="metric-card bg-orange-50">
                <p class="metric-label">Avg Profit</p>
                <p class="metric-value text-orange-600">${metrics.avgProfit || 0}%</p>
            </div>
        </div>
    `;
}

/**
 * Show error message
 * @param {string} message - Error message
 */
export function showError(message) {
    const container = document.getElementById('signal-card-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-message fade-in">
            <p class="font-semibold text-lg mb-2">⚠️ Error</p>
            <p>${message}</p>
        </div>
    `;
}

export const UI = {
    showLoading,
    hideLoading,
    renderPairSelector,
    renderTimeframeSelector,
    renderSignalCard,
    renderMetrics,
    showError
};
