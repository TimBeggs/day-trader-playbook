import { db } from "./db"
import type { Article } from "./types"

export async function getArticles(options: { status?: string; limit?: number } = {}): Promise<Article[]> {
  try {
    let query = `
      SELECT 
        a.*,
        u.id as author_id,
        u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
    `

    const params: any[] = []

    if (options.status) {
      query += " WHERE a.status = ?"
      params.push(options.status)
    }

    query += " ORDER BY a.created_at DESC"

    if (options.limit) {
      query += " LIMIT ?"
      params.push(options.limit)
    }

    const stmt = db.prepare(query)
    const rows = stmt.all(...params) as any[]

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      tags: row.tags ? JSON.parse(row.tags) : [],
      status: row.status,
      authorId: row.author_id,
      author: {
        id: row.author_id,
        name: row.author_name,
      },
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

export async function getArticleById(id: number): Promise<Article | null> {
  try {
    const stmt = db.prepare(`
      SELECT 
        a.*,
        u.id as author_id,
        u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `)

    const row = stmt.get(id) as any

    if (!row) return null

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      tags: row.tags ? JSON.parse(row.tags) : [],
      status: row.status,
      authorId: row.author_id,
      author: {
        id: row.author_id,
        name: row.author_name,
      },
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

export async function getRelatedArticles(articleId: number, tags: string[]): Promise<Article[]> {
  try {
    // Simple related articles based on shared tags
    const articles = await getArticles({ status: "published" })

    return articles
      .filter((article) => article.id !== articleId)
      .filter((article) => article.tags.some((tag) => tags.includes(tag)))
      .slice(0, 4)
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}

export async function createArticle(data: {
  title: string
  content: string
  excerpt?: string
  tags: string[]
  status: string
}): Promise<Article> {
  try {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-")

    const stmt = db.prepare(`
      INSERT INTO articles (title, slug, content, excerpt, tags, status, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.title,
      slug,
      data.content,
      data.excerpt || "",
      JSON.stringify(data.tags),
      data.status,
      1, // Default to admin user
    )

    const article = await getArticleById(result.lastInsertRowid as number)
    if (!article) throw new Error("Failed to create article")

    return article
  } catch (error) {
    console.error("Error creating article:", error)
    throw error
  }
}

export async function updateArticle(
  id: number,
  data: {
    title: string
    content: string
    excerpt?: string
    tags: string[]
    status: string
  },
): Promise<Article> {
  try {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-")

    const stmt = db.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, content = ?, excerpt = ?, tags = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    stmt.run(data.title, slug, data.content, data.excerpt || "", JSON.stringify(data.tags), data.status, id)

    const article = await getArticleById(id)
    if (!article) throw new Error("Failed to update article")

    return article
  } catch (error) {
    console.error("Error updating article:", error)
    throw error
  }
}

export async function deleteArticle(id: number): Promise<void> {
  try {
    const stmt = db.prepare("DELETE FROM articles WHERE id = ?")
    stmt.run(id)
  } catch (error) {
    console.error("Error deleting article:", error)
    throw error
  }
}
