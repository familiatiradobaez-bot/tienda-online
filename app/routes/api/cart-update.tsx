import { redirect } from "react-router";
import type { Route } from "./+types/cart-update";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { updateCartQuantity } from "~/lib/db/queries";
export async function action({ request, context }: Route.ActionArgs) { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (!appContext.user) return redirect("/login"); const formData = await request.formData(); const cartItemId = parseInt(formData.get("cartItemId") as string); const action = formData.get("action") as string; const item = await env.DB.prepare("SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?").bind(cartItemId, appContext.user.id).first<{ quantity: number }>(); if (!item) return redirect("/carrito"); const newQty = action === "increase" ? item.quantity + 1 : item.quantity - 1; await updateCartQuantity(env.DB, cartItemId, newQty); return redirect("/carrito"); }
