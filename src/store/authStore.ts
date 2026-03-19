'use client'

import { create } from 'zustand'

export interface Business {
  id: string
  name: string
  type: string
  city?: string
  state?: string
  country: string
  isGstVerified: boolean
  isKybVerified: boolean
  isExporter: boolean
  avgRating: number
  totalOrders: number
}

export interface User {
  id: string
  phone: string
  name?: string
  email?: string
  role: 'SELLER' | 'BUYER' | 'BOTH' | 'ADMIN'
  status: string
  preferredLang: string
  hasBusiness: boolean
  business?: Business
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradex_token', token)
    }
    set({ user, token, isLoggedIn: true })
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradex_token')
    }
    set({ user: null, token: null, isLoggedIn: false })
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}))

export const useUser = () => useAuthStore((s) => s.user)
export const useIsLoggedIn = () => useAuthStore((s) => s.isLoggedIn)
export const useIsSeller = () => useAuthStore((s) => s.user?.role === 'SELLER' || s.user?.role === 'BOTH')
export const useIsBuyer = () => useAuthStore((s) => s.user?.role === 'BUYER' || s.user?.role === 'BOTH')
