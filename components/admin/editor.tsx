"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

interface EditorProps {
  initialContent?: string
  onChange: (content: string) => void
}

export default function Editor({ initialContent = "", onChange }: EditorProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange(newContent)
  }

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          Rich Text Editor (Markdown supported)
        </div>
      </div>
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content here... You can use Markdown formatting."
        className="min-h-[400px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}
