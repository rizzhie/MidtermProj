import axios from "axios";
import type {
  AdminUser,
  Category,
  CategoryPayload,
  CustomerUser,
  Order,
  OrderStatus,
  PlaceOrderPayload,
  Product,
  ProductPayload,
} from "@/lib/types";

const TOKEN_KEY = "angels-admin-token";
const CUSTOMER_TOKEN_KEY = "angels-customer-token";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage may be unavailable; token just won't persist.
  }
}

export function getCustomerToken() {
  try {
    return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setCustomerToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    else window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  } catch {
    // localStorage may be unavailable; token just won't persist.
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const customerApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

customerApi.interceptors.request.use((config) => {
  const token = getCustomerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface ErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

function unwrap(payload: unknown): any {
  return (payload as { data?: unknown } | null)?.data ?? payload;
}

interface RequestOptions {
  body?: unknown;
}

async function request<T>(
  method: string,
  url: string,
  { body }: RequestOptions = {}
): Promise<T> {
  return send<T>(api, method, url, body);
}

async function customerRequest<T>(
  method: string,
  url: string,
  { body }: RequestOptions = {}
): Promise<T> {
  return send<T>(customerApi, method, url, body);
}

async function send<T>(
  client: typeof api,
  method: string,
  url: string,
  body?: unknown
): Promise<T> {
  try {
    const response = await client.request({ method, url, data: body });
    return unwrap(response.data);
  } catch (error) {
    const err = error as {
      message?: string;
      response?: { status?: number; data?: ErrorPayload };
    };
    const data = err.response?.data;
    const message =
      data?.message ||
      (data?.errors && Object.values(data.errors)[0]?.[0]) ||
      err.message ||
      `Request failed (${err.response?.status})`;
    throw new ApiError(message, err.response?.status, data?.errors);
  }
}

// ---- Public storefront endpoints -----------------------------------------

export function fetchCategories() {
  return request<Category[]>("get", "/categories");
}

export function fetchProducts(category?: string) {
  const query =
    category && category !== "all"
      ? `?category=${encodeURIComponent(category)}`
      : "";
  return request<Product[]>("get", `/products${query}`);
}

export function fetchProduct(id: string | number) {
  return request<Product>("get", `/products/${id}`);
}

export function placeOrder(payload: PlaceOrderPayload) {
  return request<Order>("post", "/orders", { body: payload });
}

// ---- Auth -------------------------------------------------------------

export async function login(email: string, password: string) {
  const data = await request<{ token: string; user: AdminUser }>("post", "/login", {
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function logout() {
  try {
    await request<{ message: string }>("post", "/logout");
  } finally {
    setToken(null);
  }
}

export function fetchMe() {
  return request<AdminUser>("get", "/me");
}

// ---- Customer auth ------------------------------------------------------

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  address: string | null;
  avatar: string | null;
}

export async function customerLogin(
  email: string,
  password: string
): Promise<CustomerUser> {
  const data = await customerRequest<{ token: string; user: CustomerUser }>(
    "post",
    "/login",
    { body: { email, password } }
  );
  setCustomerToken(data.token);
  return data.user;
}

export async function customerRegister(
  payload: RegisterPayload
): Promise<CustomerUser> {
  const data = await customerRequest<{ token: string; user: CustomerUser }>(
    "post",
    "/register",
    { body: payload }
  );
  setCustomerToken(data.token);
  return data.user;
}

export function customerForgotPassword(payload: ForgotPasswordPayload) {
  return customerRequest<{ message: string }>("post", "/forgot-password", {
    body: payload,
  });
}

export function fetchCustomerProfile() {
  return customerRequest<CustomerUser>("get", "/profile");
}

export function updateCustomerProfile(payload: UpdateProfilePayload) {
  return customerRequest<CustomerUser>("patch", "/profile", { body: payload });
}

// ---- Admin: categories -------------------------------------------------

export function createCategory(payload: CategoryPayload) {
  return request<Category>("post", "/categories", { body: payload });
}

export function updateCategory(id: string | number, payload: CategoryPayload) {
  return request<Category>("put", `/categories/${id}`, { body: payload });
}

export function deleteCategory(id: string | number) {
  return request<void>("delete", `/categories/${id}`);
}

// ---- Admin: products ----------------------------------------------------

export function createProduct(payload: ProductPayload) {
  return request<Product>("post", "/products", { body: payload });
}

export function updateProduct(id: string | number, payload: ProductPayload) {
  return request<Product>("put", `/products/${id}`, { body: payload });
}

export function deleteProduct(id: string | number) {
  return request<void>("delete", `/products/${id}`);
}

// ---- Admin: orders -------------------------------------------------------

export function fetchOrders(status?: string) {
  const query =
    status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  return request<Order[]>("get", `/orders${query}`);
}

export function fetchOrder(id: string | number) {
  return request<Order>("get", `/orders/${id}`);
}

export function updateOrderStatus(id: string | number, status: OrderStatus) {
  return request<Order>("patch", `/orders/${id}/status`, { body: { status } });
}

export function deleteOrder(id: string | number) {
  return request<void>("delete", `/orders/${id}`);
}

export { ApiError };
export default api;