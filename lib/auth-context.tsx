"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { gasClient, type AuthUser } from "./google-apps-script-client"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updatePreferences: (preferences: Partial<AuthUser["preferences"]>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const cachedUser = gasClient.getCachedUser()
        if (cachedUser && gasClient.isAuthenticated()) {
          // Try to refresh the session
          const result = await gasClient.refreshSession()
          if (result.success && result.data) {
            setUser(result.data.user)
          } else {
            // Clear invalid session
            await gasClient.logout()
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const result = await gasClient.login(email, password)

      if (result.success && result.data) {
        setUser(result.data.user)
        return { success: true }
      } else {
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const result = await gasClient.register({ email, password, name })

      if (result.success && result.data) {
        setUser(result.data.user)
        return { success: true }
      } else {
        return { success: false, error: result.error || "Registration failed" }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Network error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await gasClient.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      // Clear local state even if API call fails
      setUser(null)
    }
  }

  const updatePreferences = async (preferences: Partial<AuthUser["preferences"]>): Promise<void> => {
    if (!user) return

    try {
      const result = await gasClient.updateUserPreferences(preferences)
      if (result.success) {
        setUser((prev) => (prev ? { ...prev, preferences: { ...prev.preferences, ...preferences } } : null))
      }
    } catch (error) {
      console.error("Update preferences error:", error)
    }
  }

  const refreshUser = async (): Promise<void> => {
    if (!gasClient.isAuthenticated()) return

    try {
      const result = await gasClient.getUserProfile()
      if (result.success && result.data) {
        setUser(result.data)
      }
    } catch (error) {
      console.error("Refresh user error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updatePreferences,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
