import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-6">
        <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          My Trading Indicators
        </h4>

        <div className="border-l-4 border-blue-600 pl-4 mb-4">
          <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            Cumulative TICK
          </div>
          <div className="text-sm text-gray-500 mt-1">NYSE TICK cumulative indicator for market sentiment</div>
        </div>

        <div className="border-l-4 border-blue-600 pl-4 mb-4">
          <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            Advance/Decline
          </div>
          <div className="text-sm text-gray-500 mt-1">NYSE advancing vs declining issues ratio</div>
        </div>

        <div className="border-l-4 border-blue-600 pl-4 mb-4">
          <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            Volume Profile
          </div>
          <div className="text-sm text-gray-500 mt-1">Price level volume analysis for key levels</div>
        </div>

        <div className="border-l-4 border-blue-600 pl-4 mb-4">
          <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            Market Internals
          </div>
          <div className="text-sm text-gray-500 mt-1">Comprehensive market breadth indicators</div>
        </div>

        <Link href="/indicators">
          <Button className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200">View All Indicators</Button>
        </Link>
      </div>
    </aside>
  )
}
