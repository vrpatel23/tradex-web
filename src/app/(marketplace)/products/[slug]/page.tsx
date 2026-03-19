'use client'

// ================================================
// app/(marketplace)/products/[slug]/page.tsx
// Single product detail page
// ================================================

import { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Badge, Button, Spinner, PageLoader } from '@/components/ui'
import { useListing, useCreateOrderMutation } from '@/hooks/useApi'
import { useAuthStore } from '@/store/authStore'
import {
  ShieldCheck, Globe, Star, MessageCircle,
  Package, Clock, ChevronRight, AlertCircle,
} from 'lucide-react'
import {
  formatCurrency, getCurrencySymbol,
  formatDate, formatNumber,
} from '@/lib/utils'
import toast from 'react-hot-toast'
import type { PaymentTerms, Incoterm } from '@/types'

const PAYMENT_TERM_LABELS: Record<PaymentTerms, string> = {
  ADVANCE_100:               '100% advance',
  ADVANCE_50_DELIVERY_50:    '50% advance + 50% on delivery',
  ADVANCE_30_DELIVERY_70:    '30% advance + 70% on delivery',
  NET_30:                    'Net 30 days',
  NET_60:                    'Net 60 days',
  LC_AT_SIGHT:               'LC at sight',
  ESCROW:                    'Escrow (recommended)',
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const router   = useRouter()
  const { isLoggedIn, user } = useAuthStore()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity,      setQuantity]      = useState<number>(0)
  const [paymentTerms,  setPaymentTerms]  = useState<PaymentTerms>('ADVANCE_50_DELIVERY_50')
  const [incoterm,      setIncoterm]      = useState<Incoterm>('FOB')
  const [ordering,      setOrdering]      = useState(false)

  const { data: listing, isLoading, error } = useListing(slug)
  const createOrder = useCreateOrderMutation()

  // Set quantity to MOQ when listing loads
  if (listing && quantity === 0) setQuantity(listing.moq)

  if (isLoading) return <PageLoader />
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-lg font-medium text-gray-900 mb-2">Product not found</h1>
          <p className="text-sm text-gray-500">This listing may have been removed or is no longer active.</p>
        </div>
      </div>
    )
  }

  // Calculate price based on quantity
  const getPrice = (qty: number) => {
    if (!listing.priceTiers?.length) return listing.pricePerUnit
    const sorted = [...listing.priceTiers].sort((a, b) => b.minQty - a.minQty)
    return sorted.find(t => qty >= t.minQty)?.price ?? listing.pricePerUnit
  }

  const pricePerUnit = getPrice(quantity)
  const totalPrice   = pricePerUnit * quantity

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    if (quantity < listing.moq) {
      toast.error(`Minimum order quantity is ${listing.moq} ${listing.unit}`)
      return
    }
    setOrdering(true)
    try {
      const order = await createOrder.mutateAsync({
        listingId:    listing.id,
        quantity,
        paymentTerms,
        incoterm,
      })
      toast.success('Order placed successfully!')
      router.push(`/orders/${order.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to place order')
    } finally {
      setOrdering(false)
    }
  }

  const handleRequestSample = async () => {
    if (!isLoggedIn) { router.push('/login'); return }
    setOrdering(true)
    try {
      const order = await createOrder.mutateAsync({
        listingId:    listing.id,
        quantity:     1,
        paymentTerms: 'ADVANCE_100',
        isSampleOrder: true,
      })
      toast.success('Sample request sent!')
      router.push(`/orders/${order.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to request sample')
    } finally {
      setOrdering(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => router.push('/browse')}>
            Browse
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-gray-600 cursor-pointer"
            onClick={() => router.push(`/browse?category=${listing.category.slug}`)}>
            {listing.category.name}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-600 truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Images + Details */}
          <div className="lg:col-span-2 space-y-5">

            {/* Images */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Main image */}
              <div className="relative h-80 bg-gray-50">
                {listing.images?.[selectedImage] ? (
                  <Image
                    src={listing.images[selectedImage].url}
                    alt={listing.title}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-5xl opacity-20">📦</div>
                )}
              </div>
              {/* Thumbnails */}
              {listing.images?.length > 1 && (
                <div className="flex gap-2 p-4 border-t border-gray-50 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? 'border-green-500' : 'border-gray-100'
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Product details</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing.origin && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Origin</p>
                    <p className="text-sm font-medium text-gray-900">{listing.origin}</p>
                  </div>
                )}
                {listing.grade && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Grade</p>
                    <p className="text-sm font-medium text-gray-900">{listing.grade}</p>
                  </div>
                )}
                {listing.hsCode && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">HS code</p>
                    <p className="text-sm font-medium text-gray-900">{listing.hsCode}</p>
                  </div>
                )}
                {listing.leadTimeDays && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Lead time</p>
                    <p className="text-sm font-medium text-gray-900">{listing.leadTimeDays} days</p>
                  </div>
                )}
                {/* Custom fields */}
                {listing.customFields && Object.entries(listing.customFields).map(([key, val]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm font-medium text-gray-900">{String(val)}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Price tiers */}
              {listing.priceTiers && listing.priceTiers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bulk pricing</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400">
                          <th className="text-left pb-2">Quantity</th>
                          <th className="text-left pb-2">Price / {listing.unit}</th>
                          <th className="text-left pb-2">Savings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {listing.priceTiers.map((tier, i) => (
                          <tr key={i} className={quantity >= tier.minQty ? 'bg-green-50' : ''}>
                            <td className="py-2 text-gray-700">
                              {tier.minQty.toLocaleString()}
                              {tier.maxQty ? ` – ${tier.maxQty.toLocaleString()}` : '+'} {listing.unit}
                            </td>
                            <td className="py-2 font-medium text-gray-900">
                              {getCurrencySymbol(listing.currency)}{tier.price.toLocaleString()}
                            </td>
                            <td className="py-2 text-green-600 text-xs">
                              {listing.pricePerUnit > tier.price
                                ? `Save ${Math.round((1 - tier.price / listing.pricePerUnit) * 100)}%`
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Incoterms accepted */}
              {listing.acceptedIncoterms?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Accepted incoterms</p>
                  <div className="flex gap-2 flex-wrap">
                    {listing.acceptedIncoterms.map((term) => (
                      <Badge key={term} variant="blue">{term}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">About the seller</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  {listing.business?.logoUrl ? (
                    <Image src={listing.business.logoUrl} alt="" width={48} height={48} className="rounded-xl" />
                  ) : (
                    <span className="text-green-700 font-bold text-lg">
                      {listing.business?.name?.[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{listing.business?.name}</h3>
                    {listing.business?.isKybVerified && (
                      <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    {listing.business?.isExporter && (
                      <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {listing.business?.city}, {listing.business?.country}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {listing.business?.avgRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {listing.business.avgRating.toFixed(1)}
                      </span>
                    )}
                    <span>{listing.business?.totalOrders} orders</span>
                    <span>{listing.orderCount} orders on this listing</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 flex-shrink-0"
                  onClick={() => router.push(isLoggedIn ? `/orders/new?listing=${listing.id}` : '/login')}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Message
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT: Order panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">

              {/* Price display */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl font-semibold text-gray-900">
                    {getCurrencySymbol(listing.currency)}
                    {pricePerUnit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400">/ {listing.unit}</span>
                </div>
                <p className="text-xs text-gray-400">
                  Total: {formatCurrency(totalPrice, listing.currency)} for {quantity.toLocaleString()} {listing.unit}
                </p>
              </div>

              {/* Quantity input */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Quantity ({listing.unit})
                </label>
                <input
                  type="number"
                  value={quantity}
                  min={listing.moq}
                  onChange={(e) => setQuantity(Math.max(listing.moq, Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum: {formatNumber(listing.moq)} {listing.unit}
                  {listing.stock && ` · Available: ${formatNumber(listing.stock)}`}
                </p>
              </div>

              {/* Payment terms */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Payment terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                >
                  {(['ADVANCE_50_DELIVERY_50', 'ADVANCE_100', 'ESCROW', 'NET_30', 'NET_60', 'LC_AT_SIGHT'] as PaymentTerms[]).map(t => (
                    <option key={t} value={t}>{PAYMENT_TERM_LABELS[t]}</option>
                  ))}
                </select>
              </div>

              {/* Incoterm */}
              {listing.acceptedIncoterms?.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Incoterm</label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value as Incoterm)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  >
                    {listing.acceptedIncoterms.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* CTA buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={handlePlaceOrder}
                  loading={ordering}
                  className="w-full"
                >
                  Place order
                </Button>
                {listing.isSampleAvailable && (
                  <Button
                    variant="secondary"
                    onClick={handleRequestSample}
                    loading={ordering}
                    className="w-full"
                  >
                    Request sample
                    {listing.samplePrice
                      ? ` (${formatCurrency(listing.samplePrice)})`
                      : ''}
                  </Button>
                )}
              </div>

              {/* Trust signals */}
              <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  Payment held in escrow until delivery
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  GST invoice auto-generated
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {listing.leadTimeDays ? `${listing.leadTimeDays} day` : 'Standard'} lead time
                </div>
              </div>
            </div>

            {/* Listed date */}
            <p className="text-xs text-gray-400 text-center">
              Listed {formatDate(listing.createdAt)} · {listing.viewCount} views
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
