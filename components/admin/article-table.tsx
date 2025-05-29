"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Article } from "@/lib/types"
import { deleteArticle } from "@/lib/articles"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface ArticleTableProps {
  articles: Article[]
}

export default function ArticleTable({ articles: initialArticles }: ArticleTableProps) {
  const [articles, setArticles] = useState(initialArticles)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      try {
        await deleteArticle(id)
        setArticles(articles.filter((article) => article.id !== id))
        toast({
          title: "Article deleted",
          description: "The article has been successfully deleted.",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the article. Please try again.",
        })
      }
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-amber-100 text-amber-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="max-w-md">
                  <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">{article.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(article.status)}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                  {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{new Date(article.createdAt).toLocaleDateString()}</div>
                <div>{new Date(article.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/articles/${article.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/articles/${article.id}`} target="_blank">
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/articles/${article.id}/duplicate`}>Duplicate</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(article.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
