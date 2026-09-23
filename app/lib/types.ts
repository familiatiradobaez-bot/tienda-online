export type RoleName = 'super_admin' | 'admin' | 'supervisor' | 'mod' | 'user';

export interface Role {
  id: number;
  name: RoleName;
  level: number;
  description: string | null;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  name: string;
  avatar_url: string | null;
  role_id: number;
  role?: Role;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  updated_at: string;
}

export type PublicUser = Omit<User, 'password_hash'>;

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  children?: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  category_id: number | null;
  rating: number;
  review_count: number;
  sales_count: number;
  is_active: number;
  is_featured: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: Category;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  value: string;
  price: number | null;
  stock: number;
  created_at: string;
}

export interface CartItem {
  id: number;
  user_id: number | null;
  session_id: string | null;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  created_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  status: OrderStatus;
  total: number;
  shipping_address: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user?: PublicUser;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  is_approved: number;
  created_at: string;
  user?: { name: string; avatar_url: string | null };
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  is_default: number;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  details: string | null;
  created_at: string;
  user?: { name: string; email: string };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  CACHE: KVNamespace;
  PRODUCT_IMAGES: R2Bucket;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
  APP_URL: string;
}
