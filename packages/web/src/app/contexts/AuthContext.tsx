"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authAPI } from "../api"

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  imageLoaded: boolean
  login: (userData: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  const login = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    
    // 아바타 이미지 프리로딩
    if (userData.avatar) {
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(false)
      img.src = userData.avatar
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setIsLoggedIn(false)
    setImageLoaded(false)
  }

  const refreshUser = async () => {
    if (!authAPI.isLoggedIn()) {
      setIsLoggedIn(false)
      setUser(null)
      setImageLoaded(false)
      setIsLoading(false)
      return
    }

    try {
      const userData = await authAPI.getMe()
      setUser(userData)
      setIsLoggedIn(true)
      
      // 아바타 이미지 프리로딩
      if (userData.avatar) {
        const img = new Image()
        img.onload = () => setImageLoaded(true)
        img.onerror = () => setImageLoaded(false)
        img.src = userData.avatar
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      authAPI.logout()
      setIsLoggedIn(false)
      setUser(null)
      setImageLoaded(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value = {
    user,
    isLoggedIn,
    isLoading,
    imageLoaded,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}