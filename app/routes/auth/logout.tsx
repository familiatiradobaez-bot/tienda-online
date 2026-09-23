import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import type { Env } from "~/lib/types";
import { getSessionCookie, destroySession, createDeleteSessionCookieHeader } from "~/lib/auth";
export async function loader({ request, context }: Route.LoaderArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const sessionId = getSessionCookie(request);
  if (sessionId) await destroySession(env.SESSIONS, sessionId);
  const headers = new Headers({ Location: "/" }); headers.set("Set-Cookie", createDeleteSessionCookieHeader());
  return redirect("/", { headers });
}
