import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import IndicatorTable from "@/components/admin/indicator-table"
import { getIndicators } from "@/lib/indicators"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminIndicatorsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const indicators = await getIndicators()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Indicators</h1>
          <Link href="/admin/indicators/new">
            <Button>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Indicator
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-gray-900">{indicators.length}</div>
            <div className="text-sm text-gray-500">Total Indicators</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-gray-900">
              {indicators.filter((i) => i.status === "published").length}
            </div>
            <div className="text-sm text-gray-500">Published</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-gray-900">
              {indicators.filter((i) => i.status === "draft").length}
            </div>
            <div className="text-sm text-gray-500">Drafts</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-gray-900">
              {indicators.filter((i) => i.complexity === "beginner").length}
            </div>
            <div className="text-sm text-gray-500">Beginner Level</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Indicators</h2>
          </div>
          <IndicatorTable indicators={indicators} />
        </div>
      </div>
    </div>
  )
}
