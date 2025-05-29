"use client"

import { useState } from "react"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ArticleListProps {
  articles: Article[]
}

export default function ArticleList({ articles: initialArticles }: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedCount, setDisplayedCount] = useState(6)

  // Filter articles based on search query
  const filteredArticles = initialArticles.filter((article) => {
    const query = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  const displayedArticles = filteredArticles.slice(0, displayedCount)
  const hasMore = displayedCount < filteredArticles.length

  const loadMore = () => {
    setDisplayedCount((prev) => prev + 6)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <Input
            className="pl-10"
            placeholder="Search articles by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500">
            Found {filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"} matching "{searchQuery}"
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => (
          <Link href={`/articles/${article.id}`} key={article.id}>
            <div className="bg-white rounded-xl shadow border border-gray-100 p-7 h-full hover:shadow-lg hover:translate-y-[-2px] transition-all">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 mb-5">{article.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-md border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button onClick={loadMore}>Load More Articles</Button>
        </div>
      )}
    </div>
  )
}
