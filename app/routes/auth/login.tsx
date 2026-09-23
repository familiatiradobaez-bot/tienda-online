import { useState } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { verifyPassword, createSession, createSessionCookieHeader } from "~/lib/auth";
import { getUserByEmail } from "~/lib/db/queries";
import { GoogleButton } from "~/components/auth/GoogleButton";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (appContext.user) return redirect("/"); return { appContext }; };
export function meta() { return [{ title: "Login — TiendaOnline" }]; }
export async function action({ request, context }: Route.ActionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const formData = await request.formData(); const email = formData.get("email") as string; const password = formData.get("password") as string;
  if (!email || !password) return { error: "Email y contraseña obligatorios" };
  const user = await getUserByEmail(env.DB, email.toLowerCase().trim());
  if (!user || !user.password_hash) return { error: "Credenciales incorrectas" };
  if (user.status !== "active") return { error: "Cuenta suspendida" };
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return { error: "Credenciales incorrectas" };
  const sessionId = await createSession(env.SESSIONS, user.id);
  const headers = new Headers({ Location: "/" }); headers.set("Set-Cookie", createSessionCookieHeader(sessionId));
  return redirect("/", { headers });
}
export default function Login({ actionData }: Route.ComponentProps) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  return (
    <div className="container-app py-16 max-w-md"><div className="card p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Iniciar sesión</h1>
      {actionData?.error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">{actionData.error}</div>}
      <GoogleButton />
      <div className="flex items-center gap-3 my-6"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted">o email</span><div className="flex-1 h-px bg-border" /></div>
      <form method="post" className="space-y-4">
        <div><label className="text-sm font-medium block mb-1">Email</label><input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" /></div>
        <div><label className="text-sm font-medium block mb-1">Contraseña</label><input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" /></div>
        <button type="submit" className="btn-primary w-full">Entrar</button>
      </form>
      <p className="text-center text-sm text-muted mt-6">¿No tienes cuenta? <a href="/register" className="text-brand-600 hover:underline">Regístrate</a></p>
    </div></div>
  );
}
