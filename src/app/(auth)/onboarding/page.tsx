'use client'

// ================================================
// app/(auth)/onboarding/page.tsx
// Role selection — shown once after first login
// ================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSetRoleMutation } from '@/hooks/useApi'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui'
import { ShoppingCart, Package, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

type Role = 'SELLER' | 'BUYER' | 'BOTH'

const ROLES = [
  {
    value: 'BUYER' as Role,
    icon: ShoppingCart,
    title: 'I want to buy',
    subtitle: 'Source wholesale products from verified Indian exporters',
    points: ['Browse 48,000+ verified sellers', 'Post requirements (RFQ)', 'Pay securely with escrow'],
  },
  {
    value: 'SELLER' as Role,
    icon: Package,
    title: 'I want to sell',
    subtitle: 'List your products and reach buyers in 150+ countries',
    points: ['List products for free', 'Receive orders + payments', 'Get GST invoices auto-generated'],
  },
  {
    value: 'BOTH' as Role,
    icon: ArrowRight,
    title: 'Both — buy & sell',
    subtitle: 'Access both buyer and seller dashboards',
    points: ['Full marketplace access', 'Switch between roles', 'Best for traders & distributors'],
  },
]

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Role | null>(null)
  const [loading,  setLoading]  = useState(false)
  const { setAuth, user, token } = useAuthStore()
  const setRoleMutation = useSetRoleMutation()
  const router = useRouter()

  const handleContinue = async () => {
    if (!selected) { toast.error('Please select your role'); return }
    setLoading(true)
    try {
      const data = await setRoleMutation.mutateAsync(selected)
      setAuth(data.user, data.token)
      toast.success('Welcome to TradeX!')
      // Go to business registration
      router.push('/onboarding/business')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">TX</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to TradeX</h1>
          <p className="text-gray-500">How do you plan to use TradeX?</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setSelected(role.value)}
              className={cn(
                'text-left p-5 rounded-2xl border-2 transition-all duration-150',
                selected === role.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-100 bg-white hover:border-gray-300'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
                selected === role.value ? 'bg-green-100' : 'bg-gray-50'
              )}>
                <role.icon className={cn(
                  'w-5 h-5',
                  selected === role.value ? 'text-green-600' : 'text-gray-400'
                )} />
              </div>
              <h3 className={cn(
                'font-semibold mb-1 text-sm',
                selected === role.value ? 'text-green-700' : 'text-gray-900'
              )}>
                {role.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{role.subtitle}</p>
              <ul className="space-y-1">
                {role.points.map((point) => (
                  <li key={point} className="flex items-start gap-1.5 text-xs text-gray-500">
                    <span className={cn(
                      'text-base leading-none',
                      selected === role.value ? 'text-green-500' : 'text-gray-300'
                    )}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Continue button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            loading={loading}
            disabled={!selected}
            size="lg"
            className="px-12"
          >
            Continue
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            You can change this later in your account settings
          </p>
        </div>
      </div>
    </div>
  )
}
