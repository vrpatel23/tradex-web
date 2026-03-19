// src/types/index.ts
// All TypeScript types shared across the frontend

export type UserRole = "SELLER" | "BUYER" | "BOTH" | "ADMIN";
export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
export type BusinessType =
  | "MANUFACTURER" | "TRADER" | "WHOLESALER" | "EXPORTER"
  | "IMPORTER" | "PROCESSOR" | "FARMER" | "DISTRIBUTOR" | "RETAILER";

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  preferredLang: string;
  hasBusiness: boolean;
  business?: Business;
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  description?: string;
  city?: string;
  state?: string;
  country: string;
  gstin?: string;
  isGstVerified: boolean;
  isKybVerified: boolean;
  isExporter: boolean;
  avgRating: number;
  totalOrders: number;
  totalGmv: number;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  parentId?: string;
  children?: Category[];
}

export interface PriceTier {
  minQty: number;
  price: number;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: string;
  pricePerUnit: number;
  currency: string;
  unit: string;
  moq: number;
  stock?: number;
  leadTimeDays?: number;
  priceTiers?: PriceTier[];
  origin?: string;
  grade?: string;
  hsCode?: string;
  isSampleAvailable: boolean;
  samplePrice?: number;
  isExportReady: boolean;
  acceptedIncoterms: string[];
  exportMarkets: string[];
  tags: string[];
  viewCount: number;
  orderCount: number;
  isFeatured: boolean;
  createdAt: string;
  category: Pick<Category, "id" | "name" | "slug">;
  business: Pick<Business, "id" | "name" | "city" | "country" | "avgRating" | "isKybVerified">;
  images: ListingImage[];
}

export interface ListingImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description?: string;
  status: string;
  quantity: number;
  unit: string;
  targetPrice?: number;
  currency: string;
  deliveryCountry?: string;
  deliveryPort?: string;
  requiredByDate?: string;
  isGlobal: boolean;
  quoteCount: number;
  createdAt: string;
  expiresAt?: string;
  buyer: Pick<User, "id" | "name">;
  category?: Pick<Category, "name" | "slug">;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  pricePerUnit: number;
  currency: string;
  totalAmount: number;
  leadTimeDays: number;
  paymentTerms: string;
  notes?: string;
  validUntil: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentTerms: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  advanceAmount: number;
  balanceAmount: number;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  buyerNotes?: string;
  isSampleOrder: boolean;
  items: OrderItem[];
  buyer: Pick<User, "id" | "name" | "phone">;
  seller: Pick<Business, "id" | "name" | "city" | "country">;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  listing?: Pick<Listing, "id" | "slug" | "images">;
}

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: Pick<User, "id" | "name" | "role">;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Filter types
export interface ListingFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  country?: string;
  isExportReady?: boolean;
  sortBy?: "newest" | "price_low" | "price_high" | "popular";
  page?: number;
  limit?: number;
}
