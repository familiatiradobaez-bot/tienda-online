import { redirect } from "react-router";
import type { Route } from "./+types/google-callback";
import type { Env } from "~/lib/types";
import { createSession, createSessionCookieHeader } from "~/lib/auth";
import { getUserByGoogleId, getUserByEmail, createUser } from "~/lib/db/queries";
export async function loader({ request, context }: Route.LoaderArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const url = new URL(request.url); const code = url.searchParams.get("code"); const error = url.searchParams.get("error");
  if (error || !code) return redirect("/login?error=google_auth_failed");
  const redirectUri = `${url.origin}/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID ?? "", client_secret: env.GOOGLE_CLIENT_SECRET ?? "", redirect_uri: redirectUri, grant_type: "authorization_code" }) });
  if (!tokenResponse.ok) return redirect("/login?error=token_exchange_failed");
  const tokens = (await tokenResponse.json()) as { access_token: string };
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
  if (!userResponse.ok) return redirect("/login?error=userinfo_failed");
  const googleUser = (await userResponse.json()) as { id: string; email: string; name: string; picture: string };
  let user = await getUserByGoogleId(env.DB, googleUser.id);
  if (!user) { user = await getUserByEmail(env.DB, googleUser.email); if (user) { await env.DB.prepare("UPDATE users SET google_id = ? WHERE id = ?").bind(googleUser.id, user.id).run(); } else { user = await createUser(env.DB, { email: googleUser.email, googleId: googleUser.id, name: googleUser.name, avatarUrl: googleUser.picture }); } }
  if (user.status !== "active") return redirect("/login?error=account_suspended");
  const sessionId = await createSession(env.SESSIONS, user.id);
  const headers = new Headers({ Location: "/" }); headers.set("Set-Cookie", createSessionCookieHeader(sessionId));
  return redirect("/", { headers });
}
