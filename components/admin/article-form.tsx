"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Article } from "@/lib/types"
import { createArticle, updateArticle } from "@/lib/articles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Editor } from "@/components/admin/editor"

interface ArticleFormProps {
  article?: Article
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const isEditing = !!article
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    tags: article?.tags || [],
    status: article?.status || "draft",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing && article) {
        await updateArticle(article.id, formData)
        toast({
          title: "Article updated",
          description: "Your article has been successfully updated.",
        })
      } else {
        await createArticle(formData)
        toast({
          title: "Article created",
          description: "Your article has been successfully created.",
        })
      }
      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the article. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief description that appears in article cards and meta description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-white">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-500 hover:text-blue-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tags..."
                    className="border-0 flex-1 min-w-[100px] p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <p className="text-xs text-gray-500">Press Enter to add a tag</p>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Editor initialContent={formData.content} onChange={handleContentChange} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <strong>Created:</strong>{" "}
                  {isEditing ? new Date(article.createdAt).toLocaleString() : "Not created yet"}
                </p>
                {isEditing && (
                  <p>
                    <strong>Last Modified:</strong> {new Date(article.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setFormData((prev) => ({ ...prev, status: "draft" }))}
                >
                  Save as Draft
                </Button>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEditing ? "Update Article" : "Publish Article"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
