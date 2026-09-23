import { redirect } from "react-router";
import type { Route } from "./+types/audit-log";
import type { Env } from "~/lib/types";
import { loadAppContext } from "~/lib/app-context";
import { getAuditLogs } from "~/lib/db/queries";
import { canManageUsers } from "~/lib/roles";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { formatDateTime } from "~/lib/utils";
export const loader = async ({ request, context }: Route.LoaderArgs) => { const env = (context as { cloudflare: { env: Env } }).cloudflare.env; const appContext = await loadAppContext(request, env); if (!appContext.user) return redirect("/login"); if (!canManageUsers(appContext.user as never)) return redirect("/admin"); const url = new URL(request.url); const page = parseInt(url.searchParams.get("page") ?? "1"); const logs = await getAuditLogs(env.DB, page, 30); return { appContext, logs }; };
export function meta() { return [{ title: "Auditoría — Admin" }]; }
export default function AdminAuditLog({ loaderData }: Route.ComponentProps) { const { user, logs } = loaderData; return <AdminLayout user={user!} activeSection="audit"><div><h1 className="text-2xl font-bold mb-6">Auditoría</h1><div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="border-b border-border"><tr className="text-left text-muted"><th className="p-3">Fecha</th><th className="p-3">Usuario</th><th className="p-3">Acción</th><th className="p-3">Detalles</th></tr></thead><tbody>{logs.items.map((l) => <tr key={l.id} className="border-b border-border last:border-0"><td className="p-3 text-muted">{formatDateTime(l.created_at)}</td><td className="p-3">{(l as any).name ?? "—"}</td><td className="p-3 font-mono text-xs">{l.action}</td><td className="p-3 text-xs text-muted max-w-xs truncate">{l.details}</td></tr>)}</tbody></table></div></div></AdminLayout>; }
