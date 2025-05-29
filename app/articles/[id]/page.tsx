import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleContent from "@/components/article-content"
import ArticleSidebar from "@/components/article-sidebar"
import { getArticleById, getRelatedArticles } from "@/lib/articles"
import { notFound } from "next/navigation"

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(Number.parseInt(params.id))

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id, article.tags)

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 flex-grow w-full">
        <ArticleContent article={article} />
        <ArticleSidebar relatedArticles={relatedArticles} />
      </div>
      <Footer />
    </main>
  )
}
