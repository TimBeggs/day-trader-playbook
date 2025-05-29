import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import ArticleList from "@/components/article-list"
import Sidebar from "@/components/sidebar"
import { getArticles } from "@/lib/articles"

export default async function Home() {
  const articles = await getArticles()

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 flex-grow w-full">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Latest Trading Analysis</h3>
            <div className="text-sm text-gray-500">Updated daily at market close</div>
          </div>

          <ArticleList articles={articles} />
        </div>
        <Sidebar />
      </div>
      <Footer />
    </main>
  )
}
