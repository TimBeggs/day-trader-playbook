import Link from "next/link"
import type { Article } from "@/lib/types"

interface ArticleSidebarProps {
  relatedArticles: Article[]
}

export default function ArticleSidebar({ relatedArticles }: ArticleSidebarProps) {
  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
          <div className="space-y-4">
            {relatedArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`}>
                <div className="group cursor-pointer">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get the latest NQ trading insights and market analysis delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Trading Resources */}
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Resources</h3>
        <div className="space-y-3">
          <Link
            href="/indicators"
            className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
            </svg>
            Market Indicators
          </Link>
          <Link href="/contact" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact
          </Link>
        </div>
      </div>
    </aside>
  )
}
