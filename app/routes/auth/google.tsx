import { redirect } from "react-router";
import type { Route } from "./+types/google";
import type { Env } from "~/lib/types";
export async function loader({ request, context }: Route.LoaderArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const url = new URL(request.url); const redirectUri = `${url.origin}/auth/google/callback`;
  const params = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID ?? "PLACEHOLDER", redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", access_type: "offline", prompt: "consent" });
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
