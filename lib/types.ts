export interface User {
  id: number
  email: string
  name: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: {
    id: number
    email: string
    name: string
    role: string
  }
}

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  status: string
  authorId: number
  author?: {
    id: number
    name: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Indicator {
  id: number
  name: string
  slug: string
  description: string
  content: string
  categories: string[]
  complexity: string
  status: string
  authorId: number
  author?: {
    id: number
    name: string
  }
  createdAt: Date
  updatedAt: Date
}
