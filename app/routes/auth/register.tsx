import { useState } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/register";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { hashPassword, createSession, createSessionCookieHeader } from "~/lib/auth";
import { getUserByEmail, createUser } from "~/lib/db/queries";
import { isValidEmail } from "~/lib/utils";
import { GoogleButton } from "~/components/auth/GoogleButton";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (appContext.user) return redirect("/"); return { appContext }; };
export function meta() { return [{ title: "Registro — TiendaOnline" }]; }
export async function action({ request, context }: Route.ActionArgs) {
  const env = (context as { cloudflare: { env: Env } }).cloudflare.env;
  const formData = await request.formData(); const name = formData.get("name") as string; const email = formData.get("email") as string; const password = formData.get("password") as string; const confirmPassword = formData.get("confirmPassword") as string;
  if (!name || !email || !password) return { error: "Todos los campos son obligatorios" };
  if (!isValidEmail(email)) return { error: "Email no válido" };
  if (password.length < 6) return { error: "Mínimo 6 caracteres" };
  if (password !== confirmPassword) return { error: "Las contraseñas no coinciden" };
  const existing = await getUserByEmail(env.DB, email.toLowerCase().trim());
  if (existing) return { error: "Ya existe una cuenta con este email" };
  const passwordHash = await hashPassword(password);
  const user = await createUser(env.DB, { email: email.toLowerCase().trim(), passwordHash, name });
  const sessionId = await createSession(env.SESSIONS, user.id);
  const headers = new Headers({ Location: "/" }); headers.set("Set-Cookie", createSessionCookieHeader(sessionId));
  return redirect("/", { headers });
}
export default function Register({ actionData }: Route.ComponentProps) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className="container-app py-16 max-w-md"><div className="card p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Crear cuenta</h1>
      {actionData?.error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">{actionData.error}</div>}
      <GoogleButton label="Registrarse con Google" />
      <div className="flex items-center gap-3 my-6"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted">email</span><div className="flex-1 h-px bg-border" /></div>
      <form method="post" className="space-y-4">
        <div><label className="text-sm font-medium block mb-1">Nombre</label><input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required className="input" /></div>
        <div><label className="text-sm font-medium block mb-1">Email</label><input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" /></div>
        <div><label className="text-sm font-medium block mb-1">Contraseña</label><input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" /></div>
        <div><label className="text-sm font-medium block mb-1">Confirmar</label><input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input" /></div>
        <button type="submit" className="btn-primary w-full">Crear cuenta</button>
      </form>
      <p className="text-center text-sm text-muted mt-6">¿Ya tienes cuenta? <a href="/login" className="text-brand-600 hover:underline">Login</a></p>
    </div></div>
  );
}
