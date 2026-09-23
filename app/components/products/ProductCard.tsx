import { Link } from "react-router";
import type { Product } from "~/lib/types";
import { discountPercentage, formatPrice, renderStars } from "~/lib/utils";
export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercentage(product.price, product.compare_price);
  const imageUrl = product.images?.[0]?.url ?? "/images/placeholder.svg";
  return (
    <Link to={"/productos/" + product.slug} className="card group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-muted/10"><img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />{discount > 0 && <span className="badge bg-brand-600 text-white absolute top-2 left-2">-{discount}%</span>}</div>
      <div className="p-3"><p className="text-xs text-muted mb-1">{renderStars(product.rating)} ({product.review_count})</p><h3 className="text-sm font-medium line-clamp-2 min-h-10">{product.name}</h3><div className="mt-2 flex items-baseline gap-2"><span className="text-lg font-bold text-brand-600">{formatPrice(product.price)}</span>{product.compare_price && <span className="text-sm text-muted line-through">{formatPrice(product.compare_price)}</span>}</div></div>
    </Link>
  );
}
