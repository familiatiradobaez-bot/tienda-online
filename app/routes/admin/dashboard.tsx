import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getDashboardStats } from "~/lib/db/queries";
import { canAccessAdmin } from "~/lib/roles";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { StatCard } from "~/components/admin/StatCard";
import { formatPrice } from "~/lib/utils";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (!appContext.user) return redirect("/login"); if (!canAccessAdmin(appContext.user as never)) return redirect("/"); const stats = await getDashboardStats(env.DB); return { appContext, stats }; };
export function meta() { return [{ title: "Admin — TiendaOnline" }]; }
export default function AdminDashboard({ loaderData }: Route.ComponentProps) { const { user } = loaderData.appContext; const { stats } = loaderData; return <AdminLayout user={user!} activeSection="dashboard"><div><h1 className="text-2xl font-bold mb-6">Dashboard</h1><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"><StatCard icon="👥" label="Usuarios" value={stats.totalUsers} /><StatCard icon="📦" label="Productos" value={stats.totalProducts} /><StatCard icon="🧾" label="Pedidos" value={stats.totalOrders} /><StatCard icon="💰" label="Ingresos" value={formatPrice(stats.totalRevenue)} /><StatCard icon="⏳" label="Pendientes" value={stats.pendingOrders} /><StatCard icon="⭐" label="Reseñas" value={stats.pendingReviews} /></div></div></AdminLayout>; }
