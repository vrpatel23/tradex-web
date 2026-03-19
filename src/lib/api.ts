// src/lib/api.ts
// Axios instance — ALL API calls go through this
import axios from "axios";

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/v1",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tradex_token");
    if (token) config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tradex_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Typed API functions ──

export const authApi = {
  login:          (idToken: string) => api.post("/auth/login", { idToken }),
  setRole:        (role: string) => api.post("/auth/role", { role }),
  createBusiness: (data: unknown) => api.post("/auth/business", data),
  getMe:          () => api.get("/auth/me"),
};

export const listingsApi = {
  browse:  (params?: Record<string, unknown>) => api.get("/listings", { params }),
  getOne:  (slug: string) => api.get("/listings/" + slug),
  create:  (data: unknown) => api.post("/listings", data),
  update:  (id: string, data: unknown) => api.put("/listings/" + id, data),
  delete:  (id: string) => api.delete("/listings/" + id),
  myList:  () => api.get("/listings/my"),
};

export const categoriesApi = {
  getAll: () => api.get("/categories"),
  getOne: (slug: string) => api.get("/categories/" + slug),
};

export const searchApi = {
  search: (q: string, filters?: Record<string, unknown>) =>
    api.get("/search", { params: { q, ...filters } }),
};

export const rfqApi = {
  getBoard:    (params?: Record<string, unknown>) => api.get("/rfq", { params }),
  getMine:     () => api.get("/rfq/my"),
  create:      (data: unknown) => api.post("/rfq", data),
  submitQuote: (rfqId: string, data: unknown) => api.post("/rfq/" + rfqId + "/quotes", data),
  acceptQuote: (quoteId: string) => api.post("/quotes/" + quoteId + "/accept"),
};

export const ordersApi = {
  create:       (data: unknown) => api.post("/orders", data),
  getMine:      (role: "buyer" | "seller") => api.get("/orders?role=" + role),
  getOne:       (id: string) => api.get("/orders/" + id),
  updateStatus: (id: string, status: string, note?: string) =>
    api.patch("/orders/" + id + "/status", { status, note }),
  sendMessage:  (id: string, content: string) =>
    api.post("/orders/" + id + "/messages", { content }),
  getMessages:  (id: string) => api.get("/orders/" + id + "/messages"),
};

export const paymentsApi = {
  createRazorpay: (orderId: string, amount: number) =>
    api.post("/payments/create", { orderId, amount, gateway: "razorpay" }),
  createStripe:   (orderId: string, amount: number, currency: string) =>
    api.post("/payments/create", { orderId, amount, currency, gateway: "stripe" }),
  verify:         (data: unknown) => api.post("/payments/verify", data),
};

export const uploadApi = {
  getPresignedUrl: (filename: string, type: string) =>
    api.post("/uploads/presign", { filename, contentType: type }),
};

export const apiGet = <T>(url: string, params?: object) =>
  api.get<T>(url, { params }).then((res) => res.data)

export const apiPost = <T>(url: string, data?: object) =>
  api.post<T>(url, data).then((res) => res.data)

export const apiPut = <T>(url: string, data?: object) =>
  api.put<T>(url, data).then((res) => res.data)

export const apiPatch = <T>(url: string, data?: object) =>
  api.patch<T>(url, data).then((res) => res.data)

export const apiDelete = <T>(url: string) =>
  api.delete<T>(url).then((res) => res.data)