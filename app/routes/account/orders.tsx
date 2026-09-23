import { Link, redirect } from "react-router";
import type { Route } from "./+types/orders";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getOrdersByUser, getOrderById } from "~/lib/db/queries";
import { formatPrice, formatDateTime } from "~/lib/utils";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (!appContext.user) return redirect("/login"); const orders = await getOrdersByUser(env.DB, appContext.user.id); const url = new URL(request.url); const newOrderId = url.searchParams.get("new"); let newOrder = null; if (newOrderId) newOrder = await getOrderById(env.DB, parseInt(newOrderId)); return { appContext, orders, newOrder }; };
export function meta() { return [{ title: "Pedidos — TiendaOnline" }]; }
export default function Orders({ loaderData }: Route.ComponentProps) {
  const { orders, newOrder } = loaderData;
  return (<div className="container-app py-8"><h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>{newOrder && <div className="card p-6 mb-6 bg-green-50 border-green-200"><h2 className="font-bold text-green-700">✅ ¡Pedido confirmado!</h2><p className="text-sm text-green-600">{newOrder.order_number}</p></div>}{orders.length === 0 ? <div className="text-center py-12"><Link to="/productos" className="btn-primary">Comprar</Link></div> : <div className="space-y-4">{orders.map((o) => <div key={o.id} className="card p-5"><div className="flex items-center justify-between mb-3"><div><p className="font-medium">{o.order_number}</p><p className="text-xs text-muted">{formatDateTime(o.created_at)}</p></div><span className="badge bg-yellow-100 text-yellow-700">{o.status}</span></div>{o.items && o.items.map((i) => <div key={i.id} className="flex justify-between text-sm"><span className="text-muted">{i.product_name} × {i.quantity}</span><span>{formatPrice(i.subtotal)}</span></div>)}<hr className="border-border my-3" /><div className="flex justify-between font-bold"><span>Total</span><span className="text-brand-600">{formatPrice(o.total)}</span></div></div>)}</div>}</div>);
}
