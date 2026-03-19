'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Search, ArrowRight, ShieldCheck, Package, Globe, Zap } from 'lucide-react'

const CATEGORIES = [
  { name: 'Cotton & Textile',  slug: 'cotton-textile',         icon: '🧵' },
  { name: 'Spices',            slug: 'spices-condiments',      icon: '🌶' },
  { name: 'Grains & Rice',     slug: 'grains-rice-pulses',     icon: '🌾' },
  { name: 'Seafood',           slug: 'seafood-marine',         icon: '🐟' },
  { name: 'Chemicals',         slug: 'chemicals-pharma',       icon: '⚗️' },
  { name: 'Engineering',       slug: 'engineering-industrial', icon: '⚙️' },
  { name: 'Handicrafts',       slug: 'handicrafts-home-decor', icon: '🏺' },
  { name: 'Gems & Jewellery',  slug: 'gems-jewellery-leather', icon: '💎' },
]

const STATS = [
  { value: '48,000+',    label: 'Verified sellers' },
  { value: '150+',       label: 'Countries buying' },
  { value: '₹2,400 Cr', label: 'GMV traded'        },
  { value: '12',         label: 'Languages'         },
]

const FEATURES = [
  { icon: ShieldCheck, title: 'Verified sellers only', desc: 'Every seller GST verified and KYB checked. No fake listings.' },
  { icon: Package,     title: 'Real transactions',     desc: 'Full order flow — quote, pay, ship, invoice — all on one platform.' },
  { icon: Globe,       title: 'Export-ready',          desc: 'Commercial invoice, packing list, certificate of origin auto-generated.' },
  { icon: Zap,         title: 'WhatsApp-native',       desc: 'Every order event triggers a WhatsApp message. Built for Indian traders.' },
]

export default function HomeClient() {
  const router = useRouter()
  const [searchQ, setSearchQ] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) router.push('/browse?q=' + encodeURIComponent(searchQ))
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full text-xs text-green-700 font-medium mb-6">
              <Globe className="w-3.5 h-3.5" />
              India → 150+ countries · Verified B2B only
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-4">
              Buy & sell wholesale{' '}
              <span className="text-green-600">directly, globally</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Connect with verified Indian manufacturers and exporters across all
              industries. Real transactions, not just phone numbers.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search products... e.g. Basmati rice, Cotton fabric"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700">
                Search
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {['Cotton fabric', 'Basmati rice', 'Turmeric powder', 'Shrimp frozen'].map((tag) => (
                <button key={tag} onClick={() => router.push('/browse?q=' + tag)}
                  className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:border-green-400 hover:text-green-700 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Browse by category</h2>
          <Link href="/browse" className="text-sm text-green-600 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={'/browse?category=' + cat.slug}
              className="flex flex-col items-center gap-2 p-5 border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50 transition-all">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-xl font-semibold text-gray-900 mb-10">Why TradeX is different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ready to start trading?</h2>
        <p className="text-gray-500 mb-6">Join thousands of verified Indian exporters reaching global buyers.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
            Start selling free
          </Link>
          <Link href="/browse" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Browse products
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="text-sm font-medium text-gray-900">TradeX</span>
            </div>
            <p className="text-xs text-gray-400">© 2025 TradeX. All rights reserved.</p>
            <div className="flex gap-4">
              {['About', 'Terms', 'Privacy', 'Contact'].map((link) => (
                <Link key={link} href={'/' + link.toLowerCase()} className="text-xs text-gray-400 hover:text-gray-600">{link}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
