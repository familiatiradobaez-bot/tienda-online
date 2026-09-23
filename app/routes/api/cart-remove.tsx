import { redirect } from "react-router";
import type { Route } from "./+types/cart-remove";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { removeFromCart } from "~/lib/db/queries";
export async function action({ request, context }: Route.ActionArgs) { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (!appContext.user) return redirect("/login"); const formData = await request.formData(); await removeFromCart(env.DB, parseInt(formData.get("cartItemId") as string)); return redirect("/carrito"); }
