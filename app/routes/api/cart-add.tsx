import { redirect } from "react-router";
import type { Route } from "./+types/cart-add";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { addToCart } from "~/lib/db/queries";
export async function action({ request, context }: Route.ActionArgs) { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (!appContext.user) return redirect("/login"); const formData = await request.formData(); await addToCart(env.DB, { userId: appContext.user.id, productId: parseInt(formData.get("productId") as string), variantId: formData.get("variantId") ? parseInt(formData.get("variantId") as string) : null, quantity: parseInt(formData.get("quantity") as string) || 1 }); return redirect("/carrito"); }
