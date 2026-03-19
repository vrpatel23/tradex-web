'use client'

// ================================================
// app/seller/listings/new/page.tsx
// Add new product listing form
// ================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Input, Select } from '@/components/ui'
import { useCategories, useCreateListingMutation } from '@/hooks/useApi'
import { Plus, Trash2, Upload, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

// ── VALIDATION SCHEMA ─────────────────────────

const listingSchema = z.object({
  categoryId:         z.string().min(1, 'Select a category'),
  title:              z.string().min(3, 'Title must be at least 3 characters'),
  description:        z.string().optional(),
  pricePerUnit:       z.number().positive('Enter a valid price'),
  currency:           z.string().default('INR'),
  unit:               z.string().min(1, 'Enter the unit (kg, metre, piece...)'),
  moq:                z.number().positive('Enter minimum order quantity'),
  stock:              z.number().optional(),
  leadTimeDays:       z.number().optional(),
  origin:             z.string().optional(),
  grade:              z.string().optional(),
  hsCode:             z.string().optional(),
  isSampleAvailable:  z.boolean().default(false),
  samplePrice:        z.number().optional(),
  isExportReady:      z.boolean().default(false),
  priceTiers: z.array(z.object({
    minQty: z.number().positive(),
    price:  z.number().positive(),
  })).optional(),
  tags: z.string().optional(), // comma-separated
})

type ListingFormData = z.infer<typeof listingSchema>

const CURRENCIES = [
  { value: 'INR', label: 'INR (₹) — Indian Rupee'   },
  { value: 'USD', label: 'USD ($) — US Dollar'        },
  { value: 'EUR', label: 'EUR (€) — Euro'             },
  { value: 'AED', label: 'AED — UAE Dirham'           },
]

const COMMON_UNITS = [
  { value: 'kg',      label: 'kg (kilogram)'     },
  { value: 'quintal', label: 'quintal (100 kg)'  },
  { value: 'MT',      label: 'MT (metric tonne)' },
  { value: 'metre',   label: 'metre'             },
  { value: 'piece',   label: 'piece / unit'      },
  { value: 'dozen',   label: 'dozen (12 pcs)'    },
  { value: 'litre',   label: 'litre'             },
  { value: 'box',     label: 'box / carton'      },
]

export default function NewListingPage() {
  const router = useRouter()
  const [images,        setImages]        = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading,     setUploading]     = useState(false)
  const [step,          setStep]          = useState<1 | 2 | 3>(1)

  const { data: categories } = useCategories()
  const createListing = useCreateListingMutation()

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      currency:          'INR',
      isSampleAvailable: false,
      isExportReady:     false,
      priceTiers:        [],
    },
  })

  const { fields: tierFields, append: addTier, remove: removeTier } = useFieldArray({
    control,
    name: 'priceTiers',
  })

  const isSampleAvailable = watch('isSampleAvailable')
  const isExportReady     = watch('isExportReady')

  // Upload images to S3 via backend
  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []
    const urls: string[] = []
    for (const file of images) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'listings')
      const res = await api.post<{ url: string }>('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      urls.push(res.data.url)
    }
    return urls
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length + images.length > 8) {
      toast.error('Maximum 8 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ListingFormData) => {
    try {
      setUploading(true)
      // Upload images first
      const imageUrls = await uploadImages()

      // Create listing
      await createListing.mutateAsync({
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: imageUrls.map((url, i) => ({
          url,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      })

      toast.success('Listing created! Under review — will be live within 24 hours.')
      router.push('/seller/listings')
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to create listing')
    } finally {
      setUploading(false)
    }
  }

  // Top-level categories
  const topCategories = categories?.filter(c => !c.parentId) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg text-gray-500 hover:text-gray-700 border border-transparent hover:border-gray-200 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Add new listing</h1>
            <p className="text-sm text-gray-500">Your listing will be live after admin review (within 24 hours)</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { n: 1, label: 'Basic info'  },
            { n: 2, label: 'Pricing'     },
            { n: 3, label: 'Photos & publish' },
          ].map(({ n, label }, i, arr) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${step >= n ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step > n  ? 'bg-green-600 border-green-600 text-white' :
                  step === n ? 'border-green-600 text-green-600' :
                  'border-gray-200 text-gray-400'
                }`}>
                  {step > n ? '✓' : n}
                </div>
                <span className="text-sm hidden sm:block">{label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px w-8 ${step > n ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* STEP 1: Basic info */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900">Product information</h2>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {topCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Title */}
              <Input
                label="Product name"
                required
                placeholder="e.g. Shankar-6 Raw Cotton, Grade A, HVI Certified"
                error={errors.title?.message}
                {...register('title')}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe your product — quality, specifications, packaging, export experience..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Origin & Grade */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Origin / location"
                  placeholder="e.g. Rajkot, Gujarat"
                  {...register('origin')}
                />
                <Input
                  label="Grade / quality"
                  placeholder="e.g. Grade A, Premium, S-6"
                  {...register('grade')}
                />
              </div>

              {/* HS Code */}
              <Input
                label="HS code (for exports)"
                placeholder="e.g. 5201.00"
                hint="8-digit Harmonized System code — required for export orders"
                {...register('hsCode')}
              />

              {/* Tags */}
              <Input
                label="Tags (comma separated)"
                placeholder="e.g. organic, certified, export quality"
                hint="Helps buyers find your product in search"
                {...register('tags')}
              />

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isExportReady')}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Export ready</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isSampleAvailable')}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Sample available</span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="button" onClick={() => setStep(2)}>
                  Next: Pricing
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900">Pricing & quantity</h2>

              {/* Price + Currency + Unit */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Base price"
                  type="number"
                  required
                  placeholder="0"
                  error={errors.pricePerUnit?.message}
                  {...register('pricePerUnit', { valueAsNumber: true })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                  <select
                    {...register('currency')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('unit')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select unit</option>
                    {COMMON_UNITS.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-xs text-red-500 mt-1">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              {/* MOQ + Stock + Lead time */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Minimum order qty"
                  type="number"
                  required
                  placeholder="e.g. 100"
                  error={errors.moq?.message}
                  {...register('moq', { valueAsNumber: true })}
                />
                <Input
                  label="Available stock"
                  type="number"
                  placeholder="e.g. 500"
                  hint="Optional"
                  {...register('stock', { valueAsNumber: true })}
                />
                <Input
                  label="Lead time (days)"
                  type="number"
                  placeholder="e.g. 14"
                  {...register('leadTimeDays', { valueAsNumber: true })}
                />
              </div>

              {/* Sample price */}
              {isSampleAvailable && (
                <Input
                  label="Sample price"
                  type="number"
                  placeholder="e.g. 500"
                  hint="Courier charges for sending sample"
                  {...register('samplePrice', { valueAsNumber: true })}
                />
              )}

              {/* Price tiers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bulk pricing tiers</p>
                    <p className="text-xs text-gray-400">Offer lower prices for larger quantities</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addTier({ minQty: 0, price: 0 })}
                    className="gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add tier
                  </Button>
                </div>
                {tierFields.length > 0 && (
                  <div className="space-y-2.5">
                    {tierFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <div className="flex-1">
                          <Input
                            label={index === 0 ? 'Min qty' : ''}
                            type="number"
                            placeholder="Min qty"
                            {...register(`priceTiers.${index}.minQty`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            label={index === 0 ? 'Price / unit' : ''}
                            type="number"
                            placeholder="Price"
                            {...register(`priceTiers.${index}.price`, { valueAsNumber: true })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className={`text-red-400 hover:text-red-600 ${index === 0 ? 'mt-6' : ''}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Next: Photos
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Photos & publish */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900">Product photos</h2>

              {/* Image upload */}
              <div>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Click to upload photos</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB each · Max 8 images</p>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={preview}
                          alt=""
                          className="w-full h-20 object-cover rounded-lg border border-gray-100"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="text-xs">✕</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  First image will be the cover photo. Good photos get 3x more inquiries.
                </p>
              </div>

              {/* Summary before submit */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Before you publish</p>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Your listing will be reviewed within 24 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    You will receive a WhatsApp notification when approved
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Listing is free — we only charge 1.5% on completed orders
                  </li>
                </ul>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting || uploading}
                >
                  {uploading ? 'Uploading photos...' : 'Publish listing'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
