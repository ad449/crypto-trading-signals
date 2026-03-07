/**
 * API Communication Module
 * Handles all backend API interactions
 */

const API_BASE = '/api';

/**
 * Generate a trading signal for the given pair and timeframe
 * @param {string} pair - Trading pair (e.g., 'BTC/USDT')
 * @param {string} timeframe - Timeframe (e.g., '1h')
 * @returns {Promise<Object>} Signal data
 */
export async function generateSignal(pair, timeframe) {
    try {
        const params = new URLSearchParams({ pair, timeframe });
        const response = await fetch(`${API_BASE}/signals/generate?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error generating signal:', error);
        throw error;
    }
}

/**
 * Get signal history for the given pair and timeframe
 * @param {string} pair - Trading pair (e.g., 'BTC/USDT')
 * @param {string} timeframe - Timeframe (e.g., '1h')
 * @returns {Promise<Array>} Array of historical signals
 */
export async function getSignalHistory(pair, timeframe) {
    try {
        const params = new URLSearchParams({ pair, timeframe });
        const response = await fetch(`${API_BASE}/signals/history?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching signal history:', error);
        throw error;
    }
}

/**
 * Get performance metrics
 * @param {string} pair - Trading pair (optional)
 * @param {string} timeframe - Timeframe (optional)
 * @returns {Promise<Object>} Performance metrics data
 */
export async function getMetrics(pair = null, timeframe = null) {
    try {
        const params = new URLSearchParams();
        if (pair) params.append('pair', pair);
        if (timeframe) params.append('timeframe', timeframe);
        
        const queryString = params.toString();
        const url = queryString ? `${API_BASE}/metrics?${queryString}` : `${API_BASE}/metrics`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error;
    }
}

/**
 * Validate pair and timeframe parameters
 * @param {string} pair - Trading pair
 * @param {string} timeframe - Timeframe
 * @throws {Error} If parameters are invalid
 */
export function validateParameters(pair, timeframe) {
    if (!pair || typeof pair !== 'string') {
        throw new Error('Invalid pair parameter');
    }
    
    if (!timeframe || typeof timeframe !== 'string') {
        throw new Error('Invalid timeframe parameter');
    }
    
    const validTimeframes = ['1m', '5m', '15m', '1h', '4h', '1D'];
    if (!validTimeframes.includes(timeframe)) {
        throw new Error(`Invalid timeframe: ${timeframe}`);
    }
}

export const API = {
    generateSignal,
    getSignalHistory,
    getMetrics,
    validateParameters
};
