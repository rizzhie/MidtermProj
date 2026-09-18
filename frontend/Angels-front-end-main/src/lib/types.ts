export interface Category {
  id: number;
  key: string;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  category_id: number;
  image: string | null;
  description: string | null;
  is_available: boolean;
}

export type CartItem = Product & {
  quantity: number;
};

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  line_total: number;
}

export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderStatusHistory {
  id: number;
  status: OrderStatus;
  created_at: string | null;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string | null;
  delivery_time_slot: string | null;
  shipping_option: string | null;
  shipping_price: number;
  payment_method: string;
  note: string | null;
  subtotal: number;
  total: number;
  status: OrderStatus;
  status_history: OrderStatusHistory[];
  items: OrderItem[];
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export interface CustomerUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
}

export interface PlaceOrderPayload {
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  shipping_option: string;
  shipping_price: number;
  payment_method: string;
  note: string | null;
  items: { product_id: number; quantity: number }[];
}

export interface CategoryPayload {
  key: string;
  label: string;
}

export interface ProductPayload {
  name: string;
  price: number;
  category_id: number;
  image: string | null;
  description: string | null;
  is_available: boolean;
}