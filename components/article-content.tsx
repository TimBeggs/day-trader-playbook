import type { Article } from "@/lib/types"

interface ArticleContentProps {
  article: Article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="flex-1 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <a href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
          Home
        </a>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-700">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{article.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            By {article.author?.name || "Admin"}
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            5 min read
          </div>
        </div>

        {article.excerpt && <p className="text-xl text-gray-600 leading-relaxed">{article.excerpt}</p>}
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }} />
      </article>
    </div>
  )
}
