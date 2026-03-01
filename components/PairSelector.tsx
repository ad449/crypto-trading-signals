'use client'

import { useState, useRef, useEffect } from 'react'
import { TradingPair } from '@/lib/types'

interface PairSelectorProps {
  value: TradingPair
  onChange: (pair: TradingPair) => void
}

// Comprehensive list of popular trading pairs
const ALL_PAIRS: TradingPair[] = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT',
  'XRP/USDT', 'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'MATIC/USDT',
  'LINK/USDT', 'UNI/USDT', 'ATOM/USDT', 'LTC/USDT', 'ETC/USDT',
  'XLM/USDT', 'ALGO/USDT', 'VET/USDT', 'FIL/USDT', 'TRX/USDT',
  'AAVE/USDT', 'SAND/USDT', 'MANA/USDT', 'AXS/USDT', 'THETA/USDT',
  'FTM/USDT', 'NEAR/USDT', 'APE/USDT', 'GALA/USDT', 'CHZ/USDT',
]

export default function PairSelector({ value, onChange }: PairSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter pairs based on search query
  const filteredPairs = ALL_PAIRS.filter(pair =>
    pair.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (pair: TradingPair) => {
    onChange(pair)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact Selected Pair Button - Bybit Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 hover:border-gray-600 transition-colors flex items-center gap-2 min-w-[140px]"
      >
        <span className="font-bold text-white">{value.split('/')[0]}</span>
        <span className="text-gray-500 text-sm">/USDT</span>
        <svg
          className={`w-4 h-4 ml-auto transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Compact Dropdown - Bybit Style */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-72 bg-gray-800 border border-gray-700 rounded shadow-2xl">
          {/* Compact Search Bar */}
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              autoFocus
            />
          </div>

          {/* Compact Pairs List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {filteredPairs.length > 0 ? (
              <div className="py-1">
                {filteredPairs.map((pair) => (
                  <button
                    key={pair}
                    onClick={() => handleSelect(pair)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                      pair === value
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{pair.split('/')[0]}</span>
                    <span className="text-gray-500 text-xs">/USDT</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  )
}
