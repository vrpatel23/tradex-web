// ================================================
// components/marketplace/ListingCard.tsx
// Product card shown on browse / search pages
// ================================================

import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Globe } from 'lucide-react'
import { Badge } from '@/components/ui'
import { formatCurrency, getCurrencySymbol } from '@/lib/utils'
import type { Listing } from '@/types'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const primaryImage = listing.images?.find(i => i.isPrimary) ?? listing.images?.[0]

  // Calculate lowest tier price if tiers exist
  const lowestPrice = listing.priceTiers?.length
    ? Math.min(...listing.priceTiers.map(t => t.price))
    : listing.pricePerUnit

  const hasDiscount = lowestPrice < listing.pricePerUnit

  return (
    <Link href={`/products/${listing.slug}`}>
      <div className={cn(
        'group bg-white border border-gray-100 rounded-xl overflow-hidden',
        'hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer',
        className
      )}>

        {/* Image */}
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-4xl opacity-20">📦</div>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {listing.isExportReady && (
              <span className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                <Globe className="w-2.5 h-2.5" /> Export
              </span>
            )}
            {listing.isFeatured && (
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-400 mb-1 truncate">{listing.category?.name}</p>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
            {listing.title}
          </h3>

          {/* Seller */}
          <div className="flex items-center gap-1.5 mb-3">
            <p className="text-xs text-gray-400 truncate">
              {listing.business?.name}
            </p>
            {listing.business?.isKybVerified && (
              <ShieldCheck className="w-3 h-3 text-green-500 flex-shrink-0" />
            )}
            <span className="text-xs text-gray-300">·</span>
            <p className="text-xs text-gray-400 flex-shrink-0">
              {listing.business?.city}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-lg font-semibold text-gray-900">
              {getCurrencySymbol(listing.currency)}
              {lowestPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400">/ {listing.unit}</span>
            {hasDiscount && (
              <span className="text-xs text-green-600 font-medium">
                (bulk discount)
              </span>
            )}
          </div>

          {/* MOQ */}
          <p className="text-xs text-gray-400 mb-3">
            MOQ: {listing.moq.toLocaleString()} {listing.unit}
            {listing.leadTimeDays && ` · ${listing.leadTimeDays} days lead time`}
          </p>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            {listing.grade && (
              <Badge variant="gray">{listing.grade}</Badge>
            )}
            {listing.isSampleAvailable && (
              <Badge variant="green">Sample available</Badge>
            )}
            {listing.origin && (
              <Badge variant="gray">{listing.origin}</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
