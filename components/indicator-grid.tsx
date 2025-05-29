"use client"

import { useState } from "react"
import Link from "next/link"
import type { Indicator } from "@/lib/types"

interface IndicatorGridProps {
  indicators: Indicator[]
}

export default function IndicatorGrid({ indicators }: IndicatorGridProps) {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredIndicators = indicators.filter((indicator) => {
    if (activeFilter === "all") return true
    return indicator.categories.some((category) => category.toLowerCase().includes(activeFilter.toLowerCase()))
  })

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-amber-100 text-amber-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="text-center mb-12">
        <div className="inline-flex bg-white rounded-xl p-2 shadow border border-gray-100 gap-1">
          {["all", "breadth", "sentiment", "momentum", "volume"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {filter === "all" ? "All Indicators" : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredIndicators.map((indicator) => (
          <Link href={`/indicators/${indicator.slug}`} key={indicator.id}>
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {indicator.categories[0]}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{indicator.name}</h3>
                <p className="text-gray-600 leading-relaxed">{indicator.description}</p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Key Applications</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Identify market sentiment extremes
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Confirm breakout setups
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-green-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Detect momentum divergences
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(indicator.complexity)}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                    {indicator.complexity.charAt(0).toUpperCase() + indicator.complexity.slice(1)}
                  </span>
                  <div className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17l10-10M17 7H7v10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
