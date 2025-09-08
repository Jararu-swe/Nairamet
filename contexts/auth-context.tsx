"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import prisma from "@/lib/prisma"

interface User {
  id: string
  email: string
  name: string | null
  tier: "free" | "premium"
  trialEndsAt?: Date
}

interface AuthContextType {
  user: User | null
  login: (user: Omit<User, "tier" | "trialEndsAt" | "id">) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isPremium: boolean
  isOnTrial: boolean
  upgradeToPremium: () => Promise<void>
  startTrial: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for user session on client-side
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const session = await response.json()
          if (session?.user) {
            setUser(session.user as User)
          }
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
      }
    }
    
    checkSession()
  }, [])

  const login = async (userData: Omit<User, "tier" | "trialEndsAt" | "id">) => {
    try {
      // This would typically be handled by your API
      // For now, we're simulating the login process
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (response.ok) {
        const user = await response.json()
        setUser(user)
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isPremium = user?.tier === "premium"
  const isOnTrial = user?.trialEndsAt ? new Date() < user.trialEndsAt : false

  const upgradeToPremium = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.id}/upgrade`, {
          method: 'POST',
        })
        
        if (response.ok) {
          const updatedUser = await response.json()
          setUser(updatedUser)
        }
      } catch (error) {
        console.error('Failed to upgrade user:', error)
      }
    }
  }

  const startTrial = async () => {
    if (user && user.tier === "free") {
      try {
        const response = await fetch(`/api/users/${user.id}/trial`, {
          method: 'POST',
        })
        
        if (response.ok) {
          const updatedUser = await response.json()
          setUser(updatedUser)
        }
      } catch (error) {
        console.error('Failed to start trial:', error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isPremium: isPremium || isOnTrial,
        isOnTrial,
        upgradeToPremium,
        startTrial,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
