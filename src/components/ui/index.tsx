// ================================================
// components/ui/index.tsx
// All reusable UI components in one file
// Import: import { Button, Input, Badge } from '@/components/ui'
// ================================================

import { cn } from '@/lib/utils'
import { Loader2, X } from 'lucide-react'
import { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'

// ── BUTTON ───────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary:   'bg-green-600 text-white hover:bg-green-700 border-transparent',
      secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200',
      danger:    'bg-red-600 text-white hover:bg-red-700 border-transparent',
      ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg border font-medium',
          'active:scale-95 transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ── INPUT ────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  error?:    string
  hint?:     string
  prefix?:   string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-gray-400 text-sm select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full border rounded-lg px-3 py-2.5 text-sm bg-white',
              'focus:ring-2 focus:ring-green-500 focus:border-transparent',
              'placeholder:text-gray-400 transition-all duration-150',
              error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200',
              prefix && 'pl-8',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── SELECT ───────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string
  error?:   string
  options:  { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full border rounded-lg px-3 py-2.5 text-sm bg-white',
            'focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'transition-all duration-150',
            error ? 'border-red-400' : 'border-gray-200',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// ── BADGE ────────────────────────────────────────

interface BadgeProps {
  variant?: 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'purple'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const variants = {
    green:  'bg-green-50 text-green-700',
    blue:   'bg-blue-50 text-blue-700',
    amber:  'bg-amber-50 text-amber-700',
    red:    'bg-red-50 text-red-700',
    gray:   'bg-gray-100 text-gray-600',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

// ── SPINNER ──────────────────────────────────────

export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <Loader2 className={cn('animate-spin text-green-600', sizes[size], className)} />
  )
}

// ── CARD ─────────────────────────────────────────

interface CardProps {
  children:  React.ReactNode
  className?: string
  hover?:    boolean
  onClick?:  () => void
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-gray-100 rounded-xl p-5',
        hover && 'hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── STAT CARD ────────────────────────────────────

interface StatCardProps {
  label:   string
  value:   string | number
  trend?:  string
  trendUp?: boolean
}

export function StatCard({ label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {trend && (
        <p className={cn('text-xs mt-1', trendUp ? 'text-green-600' : 'text-gray-400')}>
          {trend}
        </p>
      )}
    </div>
  )
}

// ── EMPTY STATE ──────────────────────────────────

interface EmptyStateProps {
  title:       string
  description: string
  action?:     React.ReactNode
  icon?:       React.ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

// ── PAGE LOADER ──────────────────────────────────

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

// ── DIVIDER ──────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-gray-100 my-6" />
  return (
    <div className="flex items-center gap-4 my-6">
      <hr className="flex-1 border-gray-100" />
      <span className="text-xs text-gray-400">{label}</span>
      <hr className="flex-1 border-gray-100" />
    </div>
  )
}
