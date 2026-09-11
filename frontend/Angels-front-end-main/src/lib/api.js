// Thin fetch wrapper around the Laravel API. Centralizing this here means
// components never construct URLs or handle tokens/headers themselves.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "angels-admin-token";

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage may be unavailable; token just won't persist.
  }
}

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content (deletes) has no body to parse.
  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message ||
      (data?.errors && Object.values(data.errors)[0]?.[0]) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.errors);
  }

  return data;
}

// ---- Public storefront endpoints -----------------------------------------

export function fetchCategories() {
  return request("/categories").then((json) => json.data);
}

export function fetchProducts(category) {
  const query =
    category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/products${query}`).then((json) => json.data);
}

export function fetchProduct(id) {
  return request(`/products/${id}`).then((json) => json.data);
}

export function placeOrder(payload) {
  return request("/orders", { method: "POST", body: payload }).then(
    (json) => json.data
  );
}

// ---- Auth -------------------------------------------------------------

export async function login(email, password) {
  const json = await request("/login", { method: "POST", body: { email, password } });
  setToken(json.token);
  return json.user;
}

export async function logout() {
  try {
    await request("/logout", { method: "POST", auth: true });
  } finally {
    setToken(null);
  }
}

export function fetchMe() {
  return request("/me", { auth: true });
}

// ---- Admin: categories -------------------------------------------------

export function createCategory(payload) {
  return request("/categories", { method: "POST", body: payload, auth: true }).then(
    (json) => json.data
  );
}

export function updateCategory(id, payload) {
  return request(`/categories/${id}`, {
    method: "PUT",
    body: payload,
    auth: true,
  }).then((json) => json.data);
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, { method: "DELETE", auth: true });
}

// ---- Admin: products ----------------------------------------------------

export function createProduct(payload) {
  return request("/products", { method: "POST", body: payload, auth: true }).then(
    (json) => json.data
  );
}

export function updateProduct(id, payload) {
  return request(`/products/${id}`, {
    method: "PUT",
    body: payload,
    auth: true,
  }).then((json) => json.data);
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE", auth: true });
}

// ---- Admin: orders -------------------------------------------------------

export function fetchOrders(status) {
  const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/orders${query}`, { auth: true }).then((json) => json.data);
}

export function fetchOrder(id) {
  return request(`/orders/${id}`, { auth: true }).then((json) => json.data);
}

export function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, {
    method: "PATCH",
    body: { status },
    auth: true,
  }).then((json) => json.data);
}

export function deleteOrder(id) {
  return request(`/orders/${id}`, { method: "DELETE", auth: true });
}

export { ApiError };
