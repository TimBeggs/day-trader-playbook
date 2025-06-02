import { NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Article } from "@/types"

export async function GET() {
  try {
    await requireAuth()

    const articles = db
      .prepare(`
      SELECT id, title, excerpt, content, tags, status, views, slug, created_at, updated_at, published_at
      FROM articles 
      ORDER BY created_at DESC
    `)
      .all() as Article[]

    // Parse tags JSON
    const articlesWithParsedTags = articles.map((article) => ({
      ...article,
      tags: JSON.parse(article.tags as unknown as string),
    }))

    return NextResponse.json(articlesWithParsedTags)
  } catch (error) {
    console.error("Error fetching admin articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

function generateUniqueSlug(baseSlug: string): string {
  // First try the base slug
  const existingArticle = db
    .prepare("SELECT id FROM articles WHERE slug = ?")
    .get(baseSlug)

  if (!existingArticle) {
    return baseSlug
  }

  // If base slug exists, try adding numbers until we find a unique one
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`
  
  while (db.prepare("SELECT id FROM articles WHERE slug = ?").get(newSlug)) {
    counter++
    newSlug = `${baseSlug}-${counter}`
  }

  return newSlug
}

export async function POST(request: Request) {
  try {
    await requireAuth()
    
    const article = await request.json()
    const now = new Date().toISOString()
    
    // Create a URL-friendly slug from the title
    const baseSlug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Generate a unique slug
    const slug = generateUniqueSlug(baseSlug)
    
    // Prepare the article data
    const articleData = {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: JSON.stringify(article.tags) as unknown as string,
      status: article.status,
      views: 0,
      slug,
      created_at: now,
      updated_at: now,
      published_at: article.status === 'published' ? now : null
    }

    // Insert the article into the database
    const result = db
      .prepare(`
        INSERT INTO articles (
          title, excerpt, content, tags, status, views, slug,
          created_at, updated_at, published_at
        ) VALUES (
          @title, @excerpt, @content, @tags, @status, @views, @slug,
          @created_at, @updated_at, @published_at
        )
        RETURNING id
      `)
      .get(articleData) as { id: number }

    // Fetch the created article
    const createdArticle = db
      .prepare(`
        SELECT id, title, excerpt, content, tags, status, views, slug,
               created_at, updated_at, published_at
        FROM articles
        WHERE id = ?
      `)
      .get(result.id) as Article

    // Parse tags before sending response
    createdArticle.tags = JSON.parse(createdArticle.tags as unknown as string)

    return NextResponse.json(createdArticle)
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}
