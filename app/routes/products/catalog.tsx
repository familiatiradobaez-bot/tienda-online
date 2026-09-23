import { Link } from "react-router";
import type { Route } from "./+types/catalog";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getAllProducts } from "~/lib/db/queries";
import { ProductCard } from "~/components/products/ProductCard";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); const url = new URL(request.url); const page = parseInt(url.searchParams.get("page") ?? "1"); const products = await getAllProducts(env.DB, page, 24); return { appContext, products }; };
export function meta() { return [{ title: "Productos — TiendaOnline" }]; }
export default function Catalog({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  return (<div className="container-app py-8"><nav className="text-sm text-muted mb-4"><Link to="/" className="hover:text-brand-600">Inicio</Link><span className="mx-2">/</span><span>Todos</span></nav><h1 className="text-2xl font-bold mb-6">Productos ({products.total})</h1><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{products.items.map((p) => <ProductCard key={p.id} product={p} />)}</div>{products.total_pages > 1 && <div className="flex justify-center gap-2 mt-8">{Array.from({ length: products.total_pages }, (_, i) => i + 1).map((p) => <Link key={p} to={"/productos?page=" + p} className={"px-3 py-2 rounded-lg text-sm " + p === products.page ? "bg-brand-600 text-white" : "bg-surface border border-border"}>{p}</Link>)}</div>}</div>);
}
