import type { Category, Product, ProductImage, ProductVariant, Review, User, Role, Order, OrderItem, CartItem, Address, AuditLog, OrderStatus, PaginatedResponse } from "~/lib/types";

export async function getRoleById(db: D1Database, id: number): Promise<Role | null> { return await db.prepare("SELECT * FROM roles WHERE id = ?").bind(id).first<Role>() ?? null; }
export async function getRoleByName(db: D1Database, name: string): Promise<Role | null> { return await db.prepare("SELECT * FROM roles WHERE name = ?").bind(name).first<Role>() ?? null; }
export async function getAllRoles(db: D1Database): Promise<Role[]> { return (await db.prepare("SELECT * FROM roles ORDER BY level DESC").all<Role>()).results ?? []; }
export async function getUserById(db: D1Database, id: number): Promise<User | null> { return await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<User>() ?? null; }
export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> { return await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>() ?? null; }
export async function getUserByGoogleId(db: D1Database, googleId: string): Promise<User | null> { return await db.prepare("SELECT * FROM users WHERE google_id = ?").bind(googleId).first<User>() ?? null; }
export async function createUser(db: D1Database, data: { email: string; passwordHash?: string | null; googleId?: string | null; name: string; avatarUrl?: string | null; roleId?: number; }): Promise<User> {
  const result = await db.prepare("INSERT INTO users (email, password_hash, google_id, name, avatar_url, role_id) VALUES (?, ?, ?, ?, ?, ?)").bind(data.email, data.passwordHash ?? null, data.googleId ?? null, data.name, data.avatarUrl ?? null, data.roleId ?? 5).run();
  return (await getUserById(db, result.meta.last_row_id!))!;
}
export async function updateUserRole(db: D1Database, userId: number, roleId: number): Promise<void> { await db.prepare("UPDATE users SET role_id = ?, updated_at = datetime('now') WHERE id = ?").bind(roleId, userId).run(); }
export async function updateUserStatus(db: D1Database, userId: number, status: string): Promise<void> { await db.prepare("UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, userId).run(); }
export async function getAllUsers(db: D1Database, page = 1, perPage = 20): Promise<PaginatedResponse<User>> {
  const offset = (page - 1) * perPage;
  const total = (await db.prepare("SELECT COUNT(*) as total FROM users").first<{ total: number }>())?.total ?? 0;
  const items = (await db.prepare("SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(perPage, offset).all<User>()).results ?? [];
  return { items, total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) };
}
export async function getAllCategories(db: D1Database): Promise<Category[]> { return (await db.prepare("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC").all<Category>()).results ?? []; }
export async function getCategoryBySlug(db: D1Database, slug: string): Promise<Category | null> { return await db.prepare("SELECT * FROM categories WHERE slug = ?").bind(slug).first<Category>() ?? null; }
export async function getSubcategories(db: D1Database, parentId: number): Promise<Category[]> { return (await db.prepare("SELECT * FROM categories WHERE parent_id = ? AND is_active = 1 ORDER BY sort_order ASC").bind(parentId).all<Category>()).results ?? []; }
export async function createCategory(db: D1Database, data: { name: string; slug: string; parentId?: number | null; icon?: string | null; }): Promise<void> { await db.prepare("INSERT INTO categories (name, slug, parent_id, icon, sort_order) VALUES (?, ?, ?, ?, 0)").bind(data.name, data.slug, data.parentId ?? null, data.icon ?? null).run(); }
export async function deleteCategory(db: D1Database, id: number): Promise<void> { await db.prepare("DELETE FROM categories WHERE id = ?").bind(id).run(); }
export async function getProductBySlug(db: D1Database, slug: string): Promise<Product | null> {
  const product = await db.prepare("SELECT * FROM products WHERE slug = ? AND is_active = 1").bind(slug).first<Product>();
  if (!product) return null;
  product.images = (await db.prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC").bind(product.id).all<ProductImage>()).results ?? [];
  product.variants = (await db.prepare("SELECT * FROM product_variants WHERE product_id = ?").bind(product.id).all<ProductVariant>()).results ?? [];
  return product;
}
export async function getFeaturedProducts(db: D1Database, limit = 8): Promise<Product[]> { return (await db.prepare("SELECT * FROM products WHERE is_active = 1 AND is_featured = 1 ORDER BY sales_count DESC LIMIT ?").bind(limit).all<Product>()).results ?? []; }
export async function getProductsByCategory(db: D1Database, categoryId: number, page = 1, perPage = 20): Promise<PaginatedResponse<Product>> {
  const offset = (page - 1) * perPage;
  const total = (await db.prepare("SELECT COUNT(*) as total FROM products WHERE category_id = ? AND is_active = 1").bind(categoryId).first<{ total: number }>())?.total ?? 0;
  const items = (await db.prepare("SELECT * FROM products WHERE category_id = ? AND is_active = 1 ORDER BY sales_count DESC LIMIT ? OFFSET ?").bind(categoryId, perPage, offset).all<Product>()).results ?? [];
  return { items, total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) };
}
export async function searchProducts(db: D1Database, query: string, page = 1, perPage = 20): Promise<PaginatedResponse<Product>> {
  const offset = (page - 1) * perPage; const pattern = `%${query}%`;
  const total = (await db.prepare("SELECT COUNT(*) as total FROM products WHERE is_active = 1 AND (name LIKE ? OR description LIKE ?)").bind(pattern, pattern).first<{ total: number }>())?.total ?? 0;
  const items = (await db.prepare("SELECT * FROM products WHERE is_active = 1 AND (name LIKE ? OR description LIKE ?) ORDER BY sales_count DESC LIMIT ? OFFSET ?").bind(pattern, pattern, perPage, offset).all<Product>()).results ?? [];
  return { items, total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) };
}
export async function getAllProducts(db: D1Database, page = 1, perPage = 20): Promise<PaginatedResponse<Product>> {
  const offset = (page - 1) * perPage;
  const total = (await db.prepare("SELECT COUNT(*) as total FROM products").first<{ total: number }>())?.total ?? 0;
  const items = (await db.prepare("SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(perPage, offset).all<Product>()).results ?? [];
  return { items, total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) };
}
export async function createProduct(db: D1Database, data: { name: string; slug: string; description?: string | null; price: number; comparePrice?: number | null; stock: number; categoryId?: number | null; isFeatured?: boolean; }): Promise<number> {
  const result = await db.prepare("INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(data.name, data.slug, data.description ?? null, data.price, data.comparePrice ?? null, data.stock, data.categoryId ?? null, data.isFeatured ? 1 : 0).run();
  return result.meta.last_row_id!;
}
export async function updateProduct(db: D1Database, id: number, data: Partial<{ name: string; slug: string; description: string; price: number; compare_price: number; stock: number; category_id: number; is_active: number; is_featured: number; }>): Promise<void> {
  const fields = Object.entries(data).map(([key]) => `${key} = ?`).join(", "); const values = Object.values(data);
  await db.prepare(`UPDATE products SET ${fields}, updated_at = datetime('now') WHERE id = ?`).bind(...values, id).run();
}
export async function deleteProduct(db: D1Database, id: number): Promise<void> { await db.prepare("UPDATE products SET is_active = 0 WHERE id = ?").bind(id).run(); }
export async function getReviewsByProduct(db: D1Database, productId: number): Promise<Review[]> {
  const result = await db.prepare("SELECT r.*, u.name, u.avatar_url FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? AND r.is_approved = 1 ORDER BY r.created_at DESC").bind(productId).all<Review & { name: string; avatar_url: string | null }>();
  return (result.results ?? []) as unknown as Review[];
}
export async function createReview(db: D1Database, data: { productId: number; userId: number; rating: number; comment: string; }): Promise<void> { await db.prepare("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)").bind(data.productId, data.userId, data.rating, data.comment).run(); }
export async function getPendingReviews(db: D1Database): Promise<Review[]> {
  const result = await db.prepare("SELECT r.*, u.name, u.avatar_url FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.is_approved = 0 ORDER BY r.created_at DESC").all<Review & { name: string; avatar_url: string | null }>();
  return (result.results ?? []) as unknown as Review[];
}
export async function approveReview(db: D1Database, id: number): Promise<void> { await db.prepare("UPDATE reviews SET is_approved = 1 WHERE id = ?").bind(id).run(); }
export async function deleteReview(db: D1Database, id: number): Promise<void> { await db.prepare("DELETE FROM reviews WHERE id = ?").bind(id).run(); }
export async function getCartItems(db: D1Database, userId: number): Promise<CartItem[]> { return (await db.prepare("SELECT c.*, p.name, p.slug, p.price, p.compare_price, p.stock FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?").bind(userId).all<CartItem>()).results ?? []; }
export async function addToCart(db: D1Database, data: { userId?: number | null; sessionId?: string | null; productId: number; variantId?: number | null; quantity: number; }): Promise<void> {
  const existing = await db.prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND variant_id IS ?").bind(data.userId ?? null, data.productId, data.variantId ?? null).first<{ id: number; quantity: number }>();
  if (existing) { await db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").bind(data.quantity, existing.id).run(); }
  else { await db.prepare("INSERT INTO cart_items (user_id, session_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)").bind(data.userId ?? null, data.sessionId ?? null, data.productId, data.variantId ?? null, data.quantity).run(); }
}
export async function updateCartQuantity(db: D1Database, cartItemId: number, quantity: number): Promise<void> { if (quantity <= 0) { await db.prepare("DELETE FROM cart_items WHERE id = ?").bind(cartItemId).run(); } else { await db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").bind(quantity, cartItemId).run(); } }
export async function removeFromCart(db: D1Database, cartItemId: number): Promise<void> { await db.prepare("DELETE FROM cart_items WHERE id = ?").bind(cartItemId).run(); }
export async function clearCart(db: D1Database, userId: number): Promise<void> { await db.prepare("DELETE FROM cart_items WHERE user_id = ?").bind(userId).run(); }
export async function createOrder(db: D1Database, data: { userId: number; total: number; shippingAddress?: string | null; paymentMethod?: string | null; }): Promise<Order> {
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const result = await db.prepare("INSERT INTO orders (order_number, user_id, status, total, shipping_address, payment_method) VALUES (?, ?, 'pending', ?, ?, ?)").bind(orderNumber, data.userId, data.total, data.shippingAddress ?? null, data.paymentMethod ?? null).run();
  return (await db.prepare("SELECT * FROM orders WHERE id = ?").bind(result.meta.last_row_id!).first<Order>())!;
}
export async function addOrderItem(db: D1Database, data: { orderId: number; productId: number; variantId?: number | null; productName: string; unitPrice: number; quantity: number; subtotal: number; }): Promise<void> { await db.prepare("INSERT INTO order_items (order_id, product_id, variant_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(data.orderId, data.productId, data.variantId ?? null, data.productName, data.unitPrice, data.quantity, data.subtotal).run(); }
export async function getOrdersByUser(db: D1Database, userId: number): Promise<Order[]> { return (await db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all<Order>()).results ?? []; }
export async function getOrderById(db: D1Database, id: number): Promise<Order | null> { const order = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first<Order>(); if (!order) return null; order.items = (await db.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(id).all<OrderItem>()).results ?? []; return order; }
export async function getAllOrders(db: D1Database, page = 1, perPage = 20): Promise<PaginatedResponse<Order>> {
  const offset = (page - 1) * perPage;
  const total = (await db.prepare("SELECT COUNT(*) as total FROM orders").first<{ total: number }>())?.total ?? 0;
  const items = (await db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(perPage, offset).all<Order>()).results ?? [];
  return { items, total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) };
}
export async function updateOrderStatus(db: D1Database, id: number, status: OrderStatus): Promise<void> { await db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, id).run(); }
export async function getAddressesByUser(db: D1Database, userId: number): Promise<Address[]> { return (await db.prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC").bind(userId).all<Address>()).results ?? []; }
export async function createAddress(db: D1Database, data: { userId: number; fullName: string; phone?: string | null; line1: string; line2?: string | null; city: string; state?: string | null; postalCode?: string | null; country?: string; isDefault?: boolean; }): Promise<void> {
  if (data.isDefault) { await db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").bind(data.userId).run(); }
  await db.prepare("INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(data.userId, data.fullName, data.phone ?? null, data.line1, data.line2 ?? null, data.city, data.state ?? null, data.postalCode ?? null, data.country ?? 'ES', data.isDefault ? 1 : 0).run();
}
export async function deleteAddress(db: D1Database, id: number): Promise<void> { await db.prepare("DELETE FROM addresses WHERE id = ?").bind(id).run(); }
export async function createAuditLog(db: D1Database, data: { userId?: number | null; action: string; entityType?: string | null; entityId?: number | null; details?: string | null; }): Promise<void> { await db.prepare("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)").bind(data.userId ?? null, data.action, data.entityType ?? null, data.entityId ?? null, data.details ?? null).run(); }
export async function getAuditLogs(db: D1Database, page = 1, perPage = 30): Promise<PaginatedResponse<AuditLog>> {
  const offset = (page - 1) * perPage;
  const total = (await db.prepare("SELECT COUNT(*) as total FROM audit_logs").first<{ total: number }>())?.total ?? 0;
  const result = await db.prepare("SELECT a.*, u.name, u.email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?").bind(perPage, offset).all<AuditLog & { name: string | null; email: string | null }>();
  return { items: (result.results ?? []) as unknown as AuditLog[], total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) };
}
export async function getDashboardStats(db: D1Database): Promise<{ totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number; pendingOrders: number; pendingReviews: number; }> {
  const users = (await db.prepare("SELECT COUNT(*) as c FROM users").first<{ c: number }>())?.c ?? 0;
  const products = (await db.prepare("SELECT COUNT(*) as c FROM products WHERE is_active = 1").first<{ c: number }>())?.c ?? 0;
  const orders = (await db.prepare("SELECT COUNT(*) as c FROM orders").first<{ c: number }>())?.c ?? 0;
  const revenue = (await db.prepare("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status != 'cancelled'").first<{ s: number }>())?.s ?? 0;
  const pending = (await db.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").first<{ c: number }>())?.c ?? 0;
  const pendingRev = (await db.prepare("SELECT COUNT(*) as c FROM reviews WHERE is_approved = 0").first<{ c: number }>())?.c ?? 0;
  return { totalUsers: users, totalProducts: products, totalOrders: orders, totalRevenue: revenue, pendingOrders: pending, pendingReviews: pendingRev };
}
