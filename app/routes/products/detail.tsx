import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/detail";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getProductBySlug, getReviewsByProduct } from "~/lib/db/queries";
import { ProductCard } from "~/components/products/ProductCard";
import { formatPrice, discountPercentage, renderStars, formatDate } from "~/lib/utils";

export const loader = async ({ request, context, params }: Route.LoaderArgs) => {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const appContext = await loadAppContext(request, env);
  const product = await getProductBySlug(env.DB, params.slug);
  if (!product) throw new Response("No encontrado", { status: 404 });
  const reviews = await getReviewsByProduct(env.DB, product.id);
  const related = await env.DB.prepare("SELECT * FROM products WHERE category_id = ? AND id != ? AND is_active = 1 LIMIT 4").bind(product.category_id, product.id).all();
  return { appContext, product, reviews, relatedProducts: related.results ?? [] };
};

export function meta({ data }: Route.MetaArgs) {
  return [{ title: (data?.product?.name ?? "Producto") + " — TiendaOnline" }];
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product, reviews, relatedProducts } = loaderData;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const discount = discountPercentage(product.price, product.compare_price);
  const images = product.images ?? [];
  const variants = product.variants ?? [];
  const variantNames = Array.from(new Set(variants.map((v) => v.name)));

  return (
    <div className="container-app py-8">
      <nav className="text-sm text-muted mb-4">
        <Link to="/" className="hover:text-brand-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/productos" className="hover:text-brand-600">Productos</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="card overflow-hidden aspect-square mb-3">
            <img src={images[0]?.url ?? "/images/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted">{renderStars(product.rating)}</span>
            <span className="text-sm text-muted">({product.review_count})</span>
          </div>
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-brand-600">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.compare_price)}</span>
                <span className="badge bg-brand-100 text-brand-700">-{discount}%</span>
              </>
            )}
          </div>
          {product.description && <p className="text-muted mb-6">{product.description}</p>}
          {variants.length > 0 && (
            <div className="mb-6 space-y-3">
              {variantNames.map((vn) => (
                <div key={vn}>
                  <label className="text-sm font-medium block mb-2">{vn}:</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.filter((v) => v.name === vn).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        className={"px-4 py-2 rounded-lg border text-sm " + (selectedVariant === v.id ? "border-brand-600 bg-brand-50 text-brand-700" : "border-border")}
                      >
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">Cantidad:</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn-secondary h-10 w-10 p-0">−</button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="btn-secondary h-10 w-10 p-0">+</button>
            </div>
          </div>
          <div className="flex gap-3">
            <form method="post" action="/api/cart/add">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="quantity" value={quantity} />
              {selectedVariant && <input type="hidden" name="variantId" value={selectedVariant} />}
              <button type="submit" className="btn-primary flex-1" disabled={product.stock === 0}>🛒 Añadir</button>
            </form>
          </div>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Reseñas ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-muted">Sin reseñas.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                    {r.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{r.user?.name ?? "Usuario"}</p>
                    <p className="text-xs text-muted">{formatDate(r.created_at)}</p>
                  </div>
                  <span className="ml-auto text-sm">{renderStars(r.rating)}</span>
                </div>
                {r.comment && <p className="text-sm text-muted">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
