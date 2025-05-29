import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import AdminStats from "@/components/admin/stats"
import { getArticles } from "@/lib/articles"
import { getIndicators } from "@/lib/indicators"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const articles = await getArticles()
  const indicators = await getIndicators()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/articles/new">
              <Button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Article
              </Button>
            </Link>
            <Link href="/admin/indicators/new">
              <Button variant="outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Indicator
              </Button>
            </Link>
          </div>
        </div>

        <AdminStats articles={articles} indicators={indicators} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Articles</h2>
              <Link href="/admin/articles" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
            <div className="p-6">
              {articles.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{article.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      article.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Indicators */}
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Indicators</h2>
              <Link href="/admin/indicators" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
            <div className="p-6">
              {indicators.slice(0, 5).map((indicator) => (
                <div
                  key={indicator.id}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{indicator.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(indicator.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      indicator.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {indicator.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
