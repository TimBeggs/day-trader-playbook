import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import AdminHeader from "@/components/admin/header"
import ArticleForm from "@/components/admin/article-form"

export default async function NewArticlePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        </div>

        <ArticleForm />
      </div>
    </div>
  )
}
