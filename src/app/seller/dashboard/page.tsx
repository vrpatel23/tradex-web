// src/app/seller/dashboard/page.tsx
"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import Link from "next/link";
import { Plus, Package, TrendingUp, ShoppingCart, MessageSquare, ChevronRight } from "lucide-react";

const MOCK_STATS = [
  { label: "This month GMV", value: "₹14.2L", trend: "+23%", positive: true },
  { label: "Active orders",  value: "38",     trend: "12 pending dispatch", positive: true },
  { label: "New RFQs today", value: "7",      trend: "3 from UAE", positive: true },
  { label: "Payments due",   value: "₹3.8L",  trend: "Due in 5 days", positive: false },
];

const MOCK_ORDERS = [
  { id: "1", orderNumber: "TRX202501001", buyer: "Al Noor Trading, UAE", product: "Kashmiri Chilli", qty: "2,000 kg", value: 640000, status: "DISPATCHED", date: "2025-01-12" },
  { id: "2", orderNumber: "TRX202501002", buyer: "Metro Fabrics, Delhi", product: "Poplin 40s",      qty: "5,000 m",  value: 440000, status: "IN_PRODUCTION", date: "2025-01-11" },
  { id: "3", orderNumber: "TRX202501003", buyer: "Spice World, UK",     product: "Turmeric Powder", qty: "500 kg",   value: 120000, status: "SAMPLE_REQUESTED", date: "2025-01-10" },
  { id: "4", orderNumber: "TRX202501004", buyer: "Grains Co., Nigeria", product: "Basmati Rice",    qty: "10 MT",    value: 920000, status: "COMPLETED", date: "2025-01-08" },
];

const STATUS_COLOR_MAP: Record<string, "green" | "blue" | "amber" | "red" | "gray" | "purple"> = {
  COMPLETED: "green", DISPATCHED: "blue", IN_PRODUCTION: "amber",
  SAMPLE_REQUESTED: "purple", CANCELLED: "red",
};

export default function SellerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Seller dashboard</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {user?.business?.name || "Your business"} · GST verified
            </p>
          </div>
          <Link href="/seller/listings/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {MOCK_STATS.map((stat) => (
            <Card key={stat.label} className="p-5">
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{stat.value}</p>
              <p className={"text-xs mt-1 " + (stat.positive ? "text-green-600" : "text-amber-600")}>
                {stat.trend}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Orders table */}
          <div className="lg:col-span-2">
            <Card>
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="font-medium text-neutral-900">Recent orders</h2>
                <Link href="/seller/orders" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      {["Order", "Buyer", "Product", "Value", "Status"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-neutral-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ORDERS.map((order, i) => (
                      <tr key={order.id} className={"hover:bg-neutral-50 transition-colors " + (i < MOCK_ORDERS.length - 1 ? "border-b border-neutral-50" : "")}>
                        <td className="px-5 py-3.5">
                          <Link href={"/orders/" + order.id} className="text-brand-600 hover:underline font-mono text-xs">
                            #{order.orderNumber.slice(-5)}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-neutral-700 max-w-32 truncate">{order.buyer}</td>
                        <td className="px-5 py-3.5 text-neutral-700">{order.product}</td>
                        <td className="px-5 py-3.5 font-medium text-neutral-900">
                          {formatCurrency(order.value)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={STATUS_COLOR_MAP[order.status] || "gray"}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-medium text-neutral-900 mb-4">Quick actions</h3>
              <div className="space-y-2">
                {[
                  { href: "/seller/listings/new", icon: Plus, label: "Add new listing" },
                  { href: "/rfq", icon: MessageSquare, label: "View RFQ board" },
                  { href: "/seller/orders", icon: ShoppingCart, label: "Manage orders" },
                  { href: "/seller/analytics", icon: TrendingUp, label: "View analytics" },
                  { href: "/seller/documents", icon: Package, label: "My documents" },
                ].map((action) => (
                  <Link key={action.href} href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors group">
                    <action.icon className="w-4 h-4 text-neutral-400 group-hover:text-brand-600 transition-colors" />
                    <span className="text-sm text-neutral-700">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-brand-50 border-brand-100">
              <h3 className="font-medium text-brand-900 mb-1">Reach global buyers</h3>
              <p className="text-xs text-brand-700 mb-3">Mark your listings as export ready to appear in international search results.</p>
              <Link href="/seller/listings">
                <Button size="sm" className="bg-brand-600 text-white text-xs">
                  Update listings
                </Button>
              </Link>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
