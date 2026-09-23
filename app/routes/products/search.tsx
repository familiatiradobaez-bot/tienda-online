import { Link } from "react-router";
import type { Route } from "./+types/search";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { searchProducts } from "~/lib/db/queries";
import { ProductCard } from "~/components/products/ProductCard";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const appContext = await loadAppContext(request, env);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const products = q ? await searchProducts(env.DB, q, page, 24) : { items: [], total: 0, page: 1, per_page: 24, total_pages: 0 };
  return { appContext, query: q, products };
};

export function meta({ data }: Route.MetaArgs) {
  return [{ title: "Buscar: " + (data?.query ?? "") + " — TiendaOnline" }];
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { query, products } = loaderData;
  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold mb-2">Resultados: {query}</h1>
      <p className="text-sm text-muted mb-6">{products.total} encontrados</p>
      {products.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted mb-4">Sin resultados.</p>
          <Link to="/productos" className="btn-primary">Ver todos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
