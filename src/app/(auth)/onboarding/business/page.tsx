'use client'

// ================================================
// app/(auth)/onboarding/business/page.tsx
// Business registration — after role selection
// ================================================

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateBusinessMutation } from '@/hooks/useApi'
import { useAuthStore } from '@/store/authStore'
import { Button, Input } from '@/components/ui'
import toast from 'react-hot-toast'

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana',
  'Uttar Pradesh','Uttarakhand','West Bengal',
]

const BUSINESS_TYPES = [
  { value: 'MANUFACTURER',  label: 'Manufacturer'  },
  { value: 'TRADER',        label: 'Trader'        },
  { value: 'WHOLESALER',    label: 'Wholesaler'    },
  { value: 'EXPORTER',      label: 'Exporter'      },
  { value: 'IMPORTER',      label: 'Importer'      },
  { value: 'PROCESSOR',     label: 'Processor'     },
  { value: 'FARMER',        label: 'Farmer / FPO'  },
  { value: 'DISTRIBUTOR',   label: 'Distributor'   },
]

const businessSchema = z.object({
  name:         z.string().min(2, 'Business name is required'),
  type:         z.string().min(1, 'Select business type'),
  description:  z.string().optional(),
  gstin:        z.string().optional(),
  iec:          z.string().optional(),
  addressLine1: z.string().optional(),
  city:         z.string().min(1, 'City is required'),
  state:        z.string().min(1, 'State is required'),
  pincode:      z.string().optional(),
  isExporter:   z.boolean().default(false),
})

type BusinessFormData = z.infer<typeof businessSchema>

export default function BusinessOnboardingPage() {
  const router = useRouter()
  const { updateUser } = useAuthStore()
  const createBusiness = useCreateBusinessMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: { isExporter: false },
  })

  const onSubmit = async (data: BusinessFormData) => {
    try {
      const business = await createBusiness.mutateAsync(data)
      updateUser({ hasBusiness: true, business })
      toast.success('Business profile created!')
      router.push('/seller/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to create business profile')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">TX</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Set up your business</h1>
          <p className="text-sm text-gray-500">This helps buyers trust you and enables B2B invoicing</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Business name */}
            <Input
              label="Business name"
              required
              placeholder="e.g. Rajesh Exports Pvt Ltd"
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Business type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select type</option>
                {BUSINESS_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
            </div>

            {/* GSTIN */}
            <Input
              label="GSTIN (GST number)"
              placeholder="e.g. 27AAPFU0939F1ZV"
              hint="15-character GST number — gets a verified badge on your profile"
              {...register('gstin')}
            />

            {/* IEC */}
            <Input
              label="IEC code (for exports)"
              placeholder="e.g. XXXXXXXXXX"
              hint="10-digit Import Export Code from DGFT — required to receive international orders"
              {...register('iec')}
            />

            {/* Address */}
            <Input
              label="Address"
              placeholder="Shop/office address"
              {...register('addressLine1')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                required
                placeholder="e.g. Surat"
                error={errors.city?.message}
                {...register('city')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('state')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <Input
              label="PIN code"
              placeholder="e.g. 395003"
              {...register('pincode')}
            />

            {/* Exporter checkbox */}
            <label className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                {...register('isExporter')}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">I export internationally</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Enable export features — multi-currency pricing, export docs, global buyer discovery
                </p>
              </div>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Create business profile
            </Button>

            <button
              type="button"
              onClick={() => router.push('/seller/dashboard')}
              className="w-full text-sm text-gray-400 hover:text-gray-600 text-center py-2"
            >
              Skip for now — I&apos;ll add this later
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Your data is encrypted and only shared with buyers you transact with.
        </p>
      </div>
    </div>
  )
}
