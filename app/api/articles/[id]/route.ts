import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "@/lib/auth"

// Get article by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
    }

    const article = await db.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

// Update article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
    }

    const { title, content, excerpt, tags, status } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Check if article exists and user has permission
    const existingArticle = await db.article.findUnique({
      where: { id },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Only allow the author or admin to update
    if (existingArticle.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to update this article" }, { status: 403 })
    }

    const updatedArticle = await db.article.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        tags,
        status,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ article: updatedArticle })
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

// Delete article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
    }

    // Check if article exists and user has permission
    const existingArticle = await db.article.findUnique({
      where: { id },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Only allow the author or admin to delete
    if (existingArticle.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to delete this article" }, { status: 403 })
    }

    await db.article.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
