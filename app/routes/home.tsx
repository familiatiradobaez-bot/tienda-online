import { Link } from "react-router";
import type { Route } from "./+types/home";
import type { Env, Product, Category } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getFeaturedProducts, getAllCategories } from "~/lib/db/queries";
import { ProductCard } from "~/components/products/ProductCard";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); const featuredProducts = await getFeaturedProducts(env.DB, 12); const categories = await getAllCategories(env.DB); const topCategories = categories.filter((c) => c.parent_id === null).slice(0, 6); return { appContext, featuredProducts, topCategories }; };
export function meta() { return [{ title: "TiendaOnline — Tu tienda online de confianza" }]; }
export default function Home({ loaderData }: Route.ComponentProps) {
  const { featuredProducts, topCategories } = loaderData;
  return (
    <div>
      <section className="relative bg-gradient-to-r from-brand-600 to-brand-800 text-white"><div className="container-app py-16 lg:py-24"><div className="max-w-2xl"><h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Todo lo que necesitas, al mejor precio</h1><p className="text-lg lg:text-xl text-brand-100 mb-8">Miles de productos. Envío gratis +50€.</p><div className="flex flex-wrap gap-3"><Link to="/productos" className="btn bg-white text-brand-700 hover:bg-brand-50">Ver productos</Link><Link to="/categoria/electronica" className="btn border border-white/30 text-white hover:bg-white/10">Categorías</Link></div></div></div></section>
      <section className="container-app py-10"><h2 className="text-2xl font-bold mb-6">Categorías populares</h2><div className="grid grid-cols-3 md:grid-cols-6 gap-4">{topCategories.map((cat: Category) => <Link key={cat.id} to={"/categoria/" + cat.slug} className="card p-4 flex flex-col items-center gap-2 hover:shadow-lg text-center"><span className="text-4xl">{cat.icon ?? "📦"}</span><span className="text-sm font-medium">{cat.name}</span></Link>)}</div></section>
      <section className="container-app py-10"><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">🔥 Destacados</h2><Link to="/productos" className="text-sm text-brand-600 hover:underline">Ver todos →</Link></div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">{featuredProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)}</div></section>
    </div>
  );
}
