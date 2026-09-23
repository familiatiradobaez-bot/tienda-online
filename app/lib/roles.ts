import type { RoleName, User } from "~/lib/types";

export const ROLE_LEVELS: Record<RoleName, number> = {
  super_admin: 100, admin: 80, supervisor: 60, mod: 40, user: 10,
};

export const PERMISSIONS = {
  product_create: ['super_admin', 'admin'],
  product_edit: ['super_admin', 'admin'],
  product_delete: ['super_admin', 'admin'],
  category_create: ['super_admin', 'admin'],
  category_delete: ['super_admin', 'admin'],
  order_view_all: ['super_admin', 'admin', 'supervisor'],
  order_update_status: ['super_admin', 'admin', 'supervisor'],
  user_view_all: ['super_admin', 'admin'],
  user_change_role: ['super_admin'],
  user_ban: ['super_admin', 'admin'],
  review_moderate: ['super_admin', 'admin', 'supervisor', 'mod'],
  view_audit_logs: ['super_admin', 'admin'],
  view_dashboard: ['super_admin', 'admin', 'supervisor', 'mod'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(roleName: string, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(roleName);
}

export function hasMinLevel(user: User | null, minLevel: number): boolean {
  if (!user) return false;
  const levelMap: Record<number, number> = { 1: 100, 2: 80, 3: 60, 4: 40, 5: 10 };
  return (levelMap[user.role_id] ?? 0) >= minLevel;
}

export function canAccessAdmin(user: User | null): boolean {
  return hasMinLevel(user, 40);
}

export function canManageUsers(user: User | null): boolean {
  return hasMinLevel(user, 80);
}

export function isSuperAdmin(user: User | null): boolean {
  return user?.role_id === 1;
}

export function getRoleName(roleId: number): RoleName | null {
  const names: Record<number, RoleName> = { 1: 'super_admin', 2: 'admin', 3: 'supervisor', 4: 'mod', 5: 'user' };
  return names[roleId] ?? null;
}
