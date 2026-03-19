// ================================================
// hooks/useApi.ts
// React Query hooks for all API calls
//
// HOW REACT QUERY WORKS:
// Instead of writing useEffect + fetch in every component,
// you call a hook like useListings() and it handles:
// - Loading state (isLoading)
// - Error state (error)
// - Caching (same data doesn't re-fetch for 60 seconds)
// - Background refresh
// - Pagination
// ================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api'
import type {
  User, Business, Category, Listing, Order,
  RFQ, AuthResponse, ListingFilters, PaginatedResponse,
} from '@/types'

// ── AUTH ─────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn:  () => apiGet<User>('/auth/me'),
    retry: false, // Don't retry if not logged in
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idToken: string) =>
      apiPost<AuthResponse>('/auth/login', { idToken }),
    onSuccess: () => {
      // Refresh the 'me' query after login
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useSetRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (role: string) =>
      apiPost<AuthResponse>('/auth/role', { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useCreateBusinessMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Business>) =>
      apiPost<Business>('/auth/business', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ── CATEGORIES ───────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  () => apiGet<Category[]>('/categories'),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn:  () => apiGet<Category>(`/categories/${slug}`),
    enabled:  !!slug,
  })
}

// ── LISTINGS ─────────────────────────────────────

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn:  () => apiGet<PaginatedResponse<Listing>>('/listings', filters),
  })
}

export function useListing(slug: string) {
  return useQuery({
    queryKey: ['listings', slug],
    queryFn:  () => apiGet<Listing>(`/listings/${slug}`),
    enabled:  !!slug,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn:  () => apiGet<Listing[]>('/listings/mine'),
  })
}

export function useCreateListingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData | object) =>
      apiPost<Listing>('/listings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useUpdateListingMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Listing>) =>
      apiPatch<Listing>(`/listings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}

export function useDeleteListingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/listings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}

// ── RFQ ──────────────────────────────────────────

export function useRFQs(filters = {}) {
  return useQuery({
    queryKey: ['rfqs', filters],
    queryFn:  () => apiGet<PaginatedResponse<RFQ>>('/rfq', filters),
  })
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: ['rfqs', id],
    queryFn:  () => apiGet<RFQ>(`/rfq/${id}`),
    enabled:  !!id,
  })
}

export function useMyRFQs() {
  return useQuery({
    queryKey: ['my-rfqs'],
    queryFn:  () => apiGet<RFQ[]>('/rfq/my'),
  })
}

export function useCreateRFQMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: object) => apiPost<RFQ>('/rfq', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['my-rfqs'] })
    },
  })
}

// ── ORDERS ───────────────────────────────────────

export function useBuyerOrders(filters = {}) {
  return useQuery({
    queryKey: ['buyer-orders', filters],
    queryFn:  () => apiGet<PaginatedResponse<Order>>('/orders', { role: 'buyer', ...filters }),
  })
}

export function useSellerOrders(filters = {}) {
  return useQuery({
    queryKey: ['seller-orders', filters],
    queryFn:  () => apiGet<PaginatedResponse<Order>>('/orders', { role: 'seller', ...filters }),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn:  () => apiGet<Order>(`/orders/${id}`),
    enabled:  !!id,
    // Poll every 30 seconds for status updates
    refetchInterval: 30 * 1000,
  })
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: object) => apiPost<Order>('/orders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-orders'] })
    },
  })
}

export function useUpdateOrderStatusMutation(orderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ status, note }: { status: string; note?: string }) =>
      apiPatch(`/orders/${orderId}/status`, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
      queryClient.invalidateQueries({ queryKey: ['buyer-orders'] })
    },
  })
}

// ── PAYMENTS ─────────────────────────────────────

export function useCreatePaymentMutation() {
  return useMutation({
    mutationFn: ({ orderId, amount }: { orderId: string; amount: number }) =>
      apiPost('/payments/create', { orderId, amount }),
  })
}

export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: object) => apiPost('/payments/verify', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
