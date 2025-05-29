import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import AdminStats from "@/components/admin/stats"
import ArticleFilters from "@/components/admin/article-filters"
import ArticleTable from "@/components/admin/article-table"
import { getArticles } from "@/lib/articles"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminArticlesPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const articles = await getArticles()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <div className="flex gap-4">
            <Button variant="outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </Button>
            <Link href="/admin/articles/new">
              <Button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Article
              </Button>
            </Link>
          </div>
        </div>

        <AdminStats articles={articles} />

        <div className="mt-8">
          <ArticleFilters />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Articles</h2>
          </div>
          <ArticleTable articles={articles} />
        </div>
      </div>
    </div>
  )
}
