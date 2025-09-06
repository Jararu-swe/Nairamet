"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { UserStorage } from "@/lib/user-storage"

interface User {
  email: string
  name: string
  tier: "free" | "premium"
  trialEndsAt?: Date
}

interface AuthContextType {
  user: User | null
  login: (user: Omit<User, "tier" | "trialEndsAt">) => void
  logout: () => void
  isAuthenticated: boolean
  isPremium: boolean
  isOnTrial: boolean
  upgradeToPremium: () => void
  startTrial: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = UserStorage.getUser()
    if (savedUser) {
      setUser({
        email: savedUser.email,
        name: savedUser.name,
        tier: savedUser.tier || "free",
        trialEndsAt: savedUser.trialEndsAt ? new Date(savedUser.trialEndsAt) : undefined,
      })
    }
  }, [])

  const login = (userData: Omit<User, "tier" | "trialEndsAt">) => {
    const fullUserData = UserStorage.saveUser({
      ...userData,
      tier: "free",
    })
    setUser({
      email: fullUserData.email,
      name: fullUserData.name,
      tier: fullUserData.tier || "free",
      trialEndsAt: fullUserData.trialEndsAt ? new Date(fullUserData.trialEndsAt) : undefined,
    })
  }

  const logout = () => {
    setUser(null)
    UserStorage.removeUser()
  }

  const isPremium = user?.tier === "premium"
  const isOnTrial = user?.trialEndsAt ? new Date() < user.trialEndsAt : false

  const upgradeToPremium = () => {
    if (user) {
      const updatedUser = { ...user, tier: "premium" as const, trialEndsAt: undefined }
      UserStorage.saveUser(updatedUser)
      setUser(updatedUser)
    }
  }

  const startTrial = () => {
    if (user && user.tier === "free") {
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + 7) // 7-day trial
      const updatedUser = { ...user, trialEndsAt: trialEnd }
      UserStorage.saveUser(updatedUser)
      setUser(updatedUser)
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
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
