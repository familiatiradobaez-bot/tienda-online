import { Link } from "react-router";
import type { Route } from "./+types/category";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getCategoryBySlug, getSubcategories, getProductsByCategory } from "~/lib/db/queries";
import { ProductCard } from "~/components/products/ProductCard";

export const loader = async ({ request, context, params }: Route.LoaderArgs) => {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const appContext = await loadAppContext(request, env);
  const category = await getCategoryBySlug(env.DB, params.slug);
  if (!category) throw new Response("No encontrada", { status: 404 });
  const subcategories = await getSubcategories(env.DB, category.id);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const products = await getProductsByCategory(env.DB, category.id, page, 24);
  return { appContext, category, subcategories, products };
};

export function meta({ data }: Route.MetaArgs) {
  return [{ title: (data?.category?.name ?? "Categoría") + " — TiendaOnline" }];
}

export default function Category({ loaderData }: Route.ComponentProps) {
  const { category, subcategories, products } = loaderData;
  return (
    <div className="container-app py-8">
      <nav className="text-sm text-muted mb-4">
        <Link to="/" className="hover:text-brand-600">Inicio</Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6">
        {category.icon && <span className="mr-2">{category.icon}</span>}
        {category.name} ({products.total})
      </h1>
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {subcategories.map((s) => (
            <Link key={s.id} to={"/categoria/" + s.slug} className="badge bg-brand-50 text-brand-700 hover:bg-brand-100">
              {s.name}
            </Link>
          ))}
        </div>
      )}
      {products.items.length === 0 ? (
        <p className="text-muted text-center py-12">Sin productos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
