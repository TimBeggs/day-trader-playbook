import type { Article, Indicator } from "@/lib/types"

interface AdminStatsProps {
  articles?: Article[]
  indicators?: Indicator[]
}

export default function AdminStats({ articles = [], indicators = [] }: AdminStatsProps) {
  const publishedArticles = articles.filter((a) => a.status === "published").length
  const draftArticles = articles.filter((a) => a.status === "draft").length
  const publishedIndicators = indicators.filter((i) => i.status === "published").length
  const draftIndicators = indicators.filter((i) => i.status === "draft").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Articles</p>
            <p className="text-3xl font-bold text-gray-900">{articles.length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">{publishedArticles} published</span>
          <span className="text-gray-500 mx-2">•</span>
          <span className="text-amber-600 font-medium">{draftArticles} drafts</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Indicators</p>
            <p className="text-3xl font-bold text-gray-900">{indicators.length}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">{publishedIndicators} published</span>
          <span className="text-gray-500 mx-2">•</span>
          <span className="text-amber-600 font-medium">{draftIndicators} drafts</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-3xl font-bold text-gray-900">
              {
                articles.filter((a) => {
                  const articleDate = new Date(a.createdAt)
                  const now = new Date()
                  return articleDate.getMonth() === now.getMonth() && articleDate.getFullYear() === now.getFullYear()
                }).length
              }
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">Articles created this month</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Views</p>
            <p className="text-3xl font-bold text-gray-900">12.4k</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
        <div className="mt-4 text-sm text-green-600 font-medium">+12% from last month</div>
      </div>
    </div>
  )
}
