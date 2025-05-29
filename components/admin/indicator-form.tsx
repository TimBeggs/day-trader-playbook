"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Indicator } from "@/lib/types"
import { createIndicator, updateIndicator } from "@/lib/indicators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Editor } from "@/components/admin/editor"

interface IndicatorFormProps {
  indicator?: Indicator
}

export default function IndicatorForm({ indicator }: IndicatorFormProps) {
  const isEditing = !!indicator
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: indicator?.name || "",
    slug: indicator?.slug || "",
    description: indicator?.description || "",
    content: indicator?.content || "",
    categories: indicator?.categories || [],
    complexity: indicator?.complexity || "beginner",
    status: indicator?.status || "draft",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryInput, setCategoryInput] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && categoryInput.trim()) {
      e.preventDefault()
      if (!formData.categories.includes(categoryInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          categories: [...prev.categories, categoryInput.trim()],
        }))
      }
      setCategoryInput("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((category) => category !== categoryToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing && indicator) {
        await updateIndicator(indicator.id, formData)
        toast({
          title: "Indicator updated",
          description: "Your indicator has been successfully updated.",
        })
      } else {
        await createIndicator(formData)
        toast({
          title: "Indicator created",
          description: "Your indicator has been successfully created.",
        })
      }
      router.push("/admin/indicators")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the indicator. Please try again.",
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
              <CardTitle>Indicator Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Indicator Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Cumulative TICK Indicator"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g., cumulative-tick-indicator"
                  required
                />
                <p className="text-xs text-gray-500">This will create: /indicators/{formData.slug}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description that appears in search results and page previews"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-white">
                  {formData.categories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="text-blue-500 hover:text-blue-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Input
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={handleCategoryKeyDown}
                    placeholder="Add categories..."
                    className="border-0 flex-1 min-w-[100px] p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <p className="text-xs text-gray-500">Press Enter to add a category</p>
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
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complexity">Complexity Level</Label>
                <select
                  id="complexity"
                  name="complexity"
                  value={formData.complexity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

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
                </select>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <strong>Created:</strong>{" "}
                  {isEditing ? new Date(indicator.createdAt).toLocaleString() : "Not created yet"}
                </p>
                {isEditing && (
                  <p>
                    <strong>Last Modified:</strong> {new Date(indicator.updatedAt).toLocaleString()}
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
                  {isSubmitting ? "Saving..." : isEditing ? "Update Indicator" : "Publish Indicator"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
