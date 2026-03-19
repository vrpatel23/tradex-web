'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, Package, Search, Bell, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { user, isLoggedIn, clearAuth } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">TradeX</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/browse',            label: 'Browse'       },
              { href: '/rfq',               label: 'RFQ Board'    },
              { href: '/browse?export=true', label: 'Export Ready' },
              { href: '/categories',         label: 'Categories'  },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/browse" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {isLoggedIn && user ? (
              <>
                <Link href="/" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </Link>

                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.[0]?.toUpperCase() ?? user.phone?.slice(-2) ?? '?'}
                    </div>
                    <span className="text-sm text-gray-700 hidden md:block">
                      {user.name || 'Account'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.phone}</p>
                      </div>
                      {user.role !== 'BUYER' && (
                        <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          Seller dashboard
                        </Link>
                      )}
                      {user.role !== 'SELLER' && (
                        <Link href="/buyer/dashboard" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                          My orders
                        </Link>
                      )}
                      <Link href="/seller/listings" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="w-4 h-4" />
                        My listings
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => { clearAuth(); setMenuOpen(false) }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
                <Link href="/login"><Button size="sm">Start selling</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </nav>
  )
}
