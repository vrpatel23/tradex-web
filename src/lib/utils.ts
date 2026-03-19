// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },{ label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },  { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },    { label: "minute", seconds: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return count + " " + i.label + (count > 1 ? "s" : "") + " ago";
  }
  return "just now";
}

export function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
}

export function getCurrencySymbol(currency: string): string {
  const s: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "د.إ" };
  return s[currency] || currency;
}

export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));
}

export function isValidGstin(gstin: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.toUpperCase());
}

export function getStatusBadge(status: string): string {
  const m: Record<string, string> = {
    INQUIRY:"badge-gray", CONFIRMED:"badge-blue", ADVANCE_PAID:"badge-blue",
    IN_PRODUCTION:"badge-amber", DISPATCHED:"badge-amber", IN_TRANSIT:"badge-amber",
    DELIVERED:"badge-green", COMPLETED:"badge-green", DISPUTED:"badge-red", CANCELLED:"badge-red",
  };
  return m[status] || "badge-gray";
}

export function getStatusLabel(status: string): string {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export function truncate(text: string, length: number): string {
  return text.length <= length ? text : text.slice(0, length) + "...";
}

export function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") q.set(k, String(v)); });
  return q.toString();
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
