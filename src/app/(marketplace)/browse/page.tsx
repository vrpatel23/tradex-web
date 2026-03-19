'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ListingCard } from '@/components/marketplace/ListingCard'
import { Spinner, EmptyState, Button } from '@/components/ui'
import { useListings, useCategories } from '@/hooks/useApi'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { ListingFilters } from '@/types'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'price_low',  label: 'Price: low → high' },
  { value: 'price_high', label: 'Price: high → low' },
  { value: 'popular',    label: 'Most popular' },
]

const COUNTRIES = [
  'India', 'UAE', 'Saudi Arabia', 'Nigeria', 'USA', 'UK', 'Germany', 'Bangladesh'
]

function BrowseContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ListingFilters>({
    search:        searchParams.get('search')   ?? undefined,
    categorySlug:  searchParams.get('category') ?? undefined,
    isExportReady: searchParams.get('export') === 'true' ? true : undefined,
    sortBy:        (searchParams.get('sort') as any) ?? 'newest',
    page: 1, limit: 24,
  })
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  const { data, isLoading, isFetching } = useListings(filters)
  const { data: categories } = useCategories()

  const listings   = data?.data ?? []
  const total      = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const updateFilter = (key: keyof ListingFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ sortBy: 'newest', page: 1, limit: 24 })
    setSearchInput('')
  }

  const hasActiveFilters = !!(
    filters.search || filters.categorySlug || filters.isExportReady ||
    filters.minPrice || filters.maxPrice || filters.country
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', searchInput || undefined)
  }

  const topCategories = categories?.filter(c => !c.parentId) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Browse listings</h1>
            <p className="text-sm text-gray-500">{total.toLocaleString()} products available</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filters.sortBy ?? 'newest'}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 text-sm px-3 py-2 border rounded-lg transition-colors md:hidden',
                showFilters ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={cn('w-56 flex-shrink-0', showFilters ? 'block' : 'hidden md:block')}>
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-6 sticky top-20">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Search</p>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </form>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category</p>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('categorySlug', undefined)}
                    className={cn('w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                      !filters.categorySlug ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    All categories
                  </button>
                  {topCategories.map((cat) => (
                    <button key={cat.id} onClick={() => updateFilter('categorySlug', cat.slug)}
                      className={cn('w-full text-left text-sm px-3 py-2 rounded-lg transition-colors truncate',
                        filters.categorySlug === cat.slug ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Trade type</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!filters.isExportReady}
                    onChange={(e) => updateFilter('isExportReady', e.target.checked ? true : undefined)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Export ready only</span>
                </label>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Price range (₹)</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice ?? ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-green-500"
                  />
                  <input type="number" placeholder="Max" value={filters.maxPrice ?? ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Seller country</p>
                <select value={filters.country ?? ''}
                  onChange={(e) => updateFilter('country', e.target.value || undefined)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All countries</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600">
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-24"><Spinner size="lg" /></div>
            ) : listings.length === 0 ? (
              <EmptyState
                title="No listings found"
                description="Try adjusting your filters or search term"
                action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
              />
            ) : (
              <div className={cn('grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', isFetching && 'opacity-60')}>
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24 text-gray-400">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  )
}

