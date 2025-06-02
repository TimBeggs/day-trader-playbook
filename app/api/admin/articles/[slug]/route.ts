import { NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Article } from "@/types"

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth()
    const { slug } = await context.params

    const article = db
      .prepare(`
        SELECT id, title, excerpt, content, tags, status, views, slug,
               created_at, updated_at, published_at
        FROM articles
        WHERE slug = ?
      `)
      .get(slug) as Article | undefined

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Parse tags JSON
    article.tags = JSON.parse(article.tags as unknown as string)

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth()
    const { slug } = await context.params
    
    const article = await request.json()
    const now = new Date().toISOString()
    
    // Update the article
    const result = db
      .prepare(`
        UPDATE articles
        SET title = @title,
            excerpt = @excerpt,
            content = @content,
            tags = @tags,
            status = @status,
            updated_at = @updated_at,
            published_at = @published_at
        WHERE slug = ?
        RETURNING id
      `)
      .get(
        {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          tags: JSON.stringify(article.tags),
          status: article.status,
          updated_at: now,
          published_at: article.status === 'published' ? now : article.published_at
        },
        slug
      ) as { id: number } | undefined

    if (!result) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Fetch the updated article
    const updatedArticle = db
      .prepare(`
        SELECT id, title, excerpt, content, tags, status, views, slug,
               created_at, updated_at, published_at
        FROM articles
        WHERE id = ?
      `)
      .get(result.id) as Article

    // Parse tags before sending response
    updatedArticle.tags = JSON.parse(updatedArticle.tags as unknown as string)

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAuth()
    const { slug } = await context.params

    // Delete the article
    const result = db
      .prepare("DELETE FROM articles WHERE slug = ? RETURNING id")
      .get(slug) as { id: number } | undefined

    if (!result) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
} 