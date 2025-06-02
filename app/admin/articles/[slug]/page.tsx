"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, Globe, X } from "lucide-react"
import ContentBuilder from "@/components/ContentBuilder"
import type { Article } from "@/types"

interface EditArticlePageProps {
  params: {
    slug: string
  }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Article>({
    id: 0,
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    status: "draft",
    views: 0,
    slug: "",
    created_at: "",
    updated_at: "",
    published_at: "",
  })
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const slug = params?.slug
    if (slug) {
      fetchArticle(slug)
    }
  }, [params?.slug])

  const fetchArticle = async (slug: string) => {
    try {
      const response = await fetch(`/api/admin/articles/${slug}`)
      if (!response.ok) throw new Error("Article not found")
      const article = await response.json()
      setFormData(article)
    } catch (error) {
      console.error("Error fetching article:", error)
      router.push("/admin/articles")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/articles/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "published" }),
      })

      if (response.ok) {
        router.push("/admin/articles")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update article")
      }
    } catch (error) {
      console.error("Error updating article:", error)
      alert(error instanceof Error ? error.message : "Failed to update article")
    } finally {
      setLoading(false)
    }
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const saveDraft = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/articles/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "draft" }),
      })
      
      if (response.ok) {
        alert("Draft saved successfully!")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to save draft")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      alert(error instanceof Error ? error.message : "Failed to save draft")
    } finally {
      setSaving(false)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Main Form */}
      <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Edit Article</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={togglePreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              type="submit"
              form="article-form"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        <form id="article-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Article Details */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              Article Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., NQ Futures Breakout Strategy: How I Caught the 21470 Level"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Article Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-vertical"
                  rows={3}
                  placeholder="Brief description that appears in article cards and meta description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[48px] cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="flex-1 min-w-[100px] outline-none"
                    placeholder="Add tags..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Builder */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded"></div>
              Content Builder
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Article Content</label>
              {showPreview ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[400px]">
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <ContentBuilder
                  content={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                />
              )}
            </div>
          </div>
        </form>
      </main>

      {/* Sidebar */}
      <aside className="w-80 space-y-6">
        {/* Publication Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-slate-900">Publication Settings</div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>Created:</strong> {new Date(formData.created_at).toLocaleString()}
              </div>
              <div>
                <strong>Last Modified:</strong> {new Date(formData.updated_at).toLocaleString()}
              </div>
              {formData.published_at && (
                <div>
                  <strong>Published:</strong> {new Date(formData.published_at).toLocaleString()}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                form="article-form"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Update & Publish
              </button>
            </div>
          </div>
        </div>

        {/* SEO Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-slate-900">SEO Analysis</div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700">Title Length: Good ({formData.title.length} chars)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-yellow-700">Meta Description: Needs improvement</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700">URL Structure: Good</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-red-700">Content Length: {formData.content.length} chars</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
} 