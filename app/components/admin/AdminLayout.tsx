import { Link, Outlet } from "react-router";
import type { PublicUser } from "~/lib/types";
import { getRoleName } from "~/lib/roles";
const NAV = [
  { key: "dashboard", label: "Dashboard", path: "/admin", icon: "📊" },
  { key: "products", label: "Productos", path: "/admin/productos", icon: "📦", min: 2 },
  { key: "categories", label: "Categorías", path: "/admin/categorias", icon: "📁", min: 2 },
  { key: "orders", label: "Pedidos", path: "/admin/pedidos", icon: "🧾", min: 3 },
  { key: "users", label: "Usuarios", path: "/admin/usuarios", icon: "👥", min: 2 },
  { key: "reviews", label: "Reseñas", path: "/admin/resenas", icon: "⭐", min: 4 },
  { key: "roles", label: "Roles", path: "/admin/roles", icon: "🔑", min: 1 },
  { key: "audit", label: "Auditoría", path: "/admin/auditoria", icon: "📜", min: 2 },
];
export function AdminLayout({ user, activeSection }: { user: PublicUser; activeSection: string }) {
  const roleName = getRoleName(user.role_id) ?? "user";
  const items = NAV.filter((i) => !i.min || user.role_id <= i.min);
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="lg:w-64 lg:min-h-screen bg-surface border-r border-border lg:fixed lg:left-0 lg:top-0 lg:bottom-0 z-30">
        <div className="p-4 border-b border-border"><Link to="/" className="text-lg font-extrabold text-brand-600">🛍️ TiendaOnline</Link><p className="text-xs text-muted mt-1">Panel admin</p></div>
        <div className="p-4 border-b border-border"><div className="flex items-center gap-3"><span className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">{user.name.charAt(0).toUpperCase()}</span><div><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-muted capitalize">{roleName.replace("_", " ")}</p></div></div></div>
        <nav className="p-2 space-y-1">{items.map((i) => <Link key={i.key} to={i.path} className={"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium " + activeSection === i.key ? "bg-brand-50 text-brand-700" : "hover:bg-muted/10"}><span>{i.icon}</span>{i.label}</Link>)}</nav>
        <div className="p-2"><Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-muted/10">← Tienda</Link></div>
      </aside>
      <main className="flex-1 lg:ml-64 p-4 lg:p-8"><Outlet /></main>
    </div>
  );
}
