import { db } from "./db"
import type { Indicator } from "./types"

export async function getIndicators(options: { status?: string; limit?: number } = {}): Promise<Indicator[]> {
  try {
    let query = `
      SELECT 
        i.*,
        u.id as author_id,
        u.name as author_name
      FROM indicators i
      LEFT JOIN users u ON i.author_id = u.id
    `

    const params: any[] = []

    if (options.status) {
      query += " WHERE i.status = ?"
      params.push(options.status)
    }

    query += " ORDER BY i.created_at DESC"

    if (options.limit) {
      query += " LIMIT ?"
      params.push(options.limit)
    }

    const stmt = db.prepare(query)
    const rows = stmt.all(...params) as any[]

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      content: row.content,
      categories: row.categories ? JSON.parse(row.categories) : [],
      complexity: row.complexity,
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
    console.error("Error fetching indicators:", error)
    return []
  }
}

export async function getIndicatorById(id: number): Promise<Indicator | null> {
  try {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        u.id as author_id,
        u.name as author_name
      FROM indicators i
      LEFT JOIN users u ON i.author_id = u.id
      WHERE i.id = ?
    `)

    const row = stmt.get(id) as any

    if (!row) return null

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      content: row.content,
      categories: row.categories ? JSON.parse(row.categories) : [],
      complexity: row.complexity,
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
    console.error("Error fetching indicator:", error)
    return null
  }
}

export async function getIndicatorBySlug(slug: string): Promise<Indicator | null> {
  try {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        u.id as author_id,
        u.name as author_name
      FROM indicators i
      LEFT JOIN users u ON i.author_id = u.id
      WHERE i.slug = ? AND i.status = 'published'
    `)

    const row = stmt.get(slug) as any

    if (!row) return null

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      content: row.content,
      categories: row.categories ? JSON.parse(row.categories) : [],
      complexity: row.complexity,
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
    console.error("Error fetching indicator by slug:", error)
    return null
  }
}

export async function createIndicator(data: {
  name: string
  slug: string
  description?: string
  content: string
  categories: string[]
  complexity: string
  status: string
}): Promise<Indicator> {
  try {
    const stmt = db.prepare(`
      INSERT INTO indicators (name, slug, description, content, categories, complexity, status, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.name,
      data.slug,
      data.description || "",
      data.content,
      JSON.stringify(data.categories),
      data.complexity,
      data.status,
      1, // Default to admin user
    )

    const indicator = await getIndicatorById(result.lastInsertRowid as number)
    if (!indicator) throw new Error("Failed to create indicator")

    return indicator
  } catch (error) {
    console.error("Error creating indicator:", error)
    throw error
  }
}

export async function updateIndicator(
  id: number,
  data: {
    name: string
    slug: string
    description?: string
    content: string
    categories: string[]
    complexity: string
    status: string
  },
): Promise<Indicator> {
  try {
    const stmt = db.prepare(`
      UPDATE indicators 
      SET name = ?, slug = ?, description = ?, content = ?, categories = ?, complexity = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    stmt.run(
      data.name,
      data.slug,
      data.description || "",
      data.content,
      JSON.stringify(data.categories),
      data.complexity,
      data.status,
      id,
    )

    const indicator = await getIndicatorById(id)
    if (!indicator) throw new Error("Failed to update indicator")

    return indicator
  } catch (error) {
    console.error("Error updating indicator:", error)
    throw error
  }
}

export async function deleteIndicator(id: number): Promise<void> {
  try {
    const stmt = db.prepare("DELETE FROM indicators WHERE id = ?")
    stmt.run(id)
  } catch (error) {
    console.error("Error deleting indicator:", error)
    throw error
  }
}
