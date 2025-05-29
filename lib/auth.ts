import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "./db"
import type { User, Session } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(payload: any): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export async function verifyToken(token: string): Promise<any> {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error }
    }

    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

export async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Server-only function for getting session from cookies
export async function getServerSession(cookieHeader?: string): Promise<Session | null> {
  try {
    // This function should only be called from server components or API routes
    const { cookies } = await import("next/headers")
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Verify user still exists in database
    const stmt = db.prepare("SELECT id, email, name, role FROM users WHERE id = ?")
    const user = stmt.get(payload.id) as User | undefined

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

// Client-side session management
export function useClientSession() {
  // This would typically use a context provider or state management
  // For now, we'll use localStorage for client-side session tracking
  if (typeof window === "undefined") return null

  try {
    const session = localStorage.getItem("user_session")
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

export function setClientSession(user: any) {
  if (typeof window === "undefined") return
  localStorage.setItem("user_session", JSON.stringify(user))
}

export function clearClientSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem("user_session")
}
