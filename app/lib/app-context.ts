import type { Env, User, Category, PublicUser } from "~/lib/types";
import { getSession, getSessionCookie, toPublicUser } from "~/lib/auth";
import { getUserById } from "~/lib/db/queries";

export interface AppContextData {
  user: PublicUser | null;
  categories: Category[];
  cartCount: number;
}

/**
 * Application data loader. The Worker bindings are supplied by the route
 * loader from `context.cloudflare.env`, which is created by the Cloudflare
 * Vite plugin's `getLoadContext` helper.
 */
export async function loadAppContext(request: Request, env: Env): Promise<AppContextData> {
  let user: PublicUser | null = null;
  const sessionId = getSessionCookie(request);
  if (sessionId) {
    const session = await getSession(env.SESSIONS, sessionId);
    if (session) {
      const dbUser = await getUserById(env.DB, session.userId);
      if (dbUser && dbUser.status === "active") {
        user = toPublicUser(dbUser);
      }
    }
  }
  const allCategories = await env.DB.prepare("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC").all<Category>();
  const categories = (allCategories.results ?? []).filter((c) => c.parent_id === null);
  let cartCount = 0;
  if (user) {
    const countResult = await env.DB.prepare("SELECT COUNT(*) as c FROM cart_items WHERE user_id = ?").bind(user.id).first<{ c: number }>();
    cartCount = countResult?.c ?? 0;
  }
  return { user, categories, cartCount };
}
