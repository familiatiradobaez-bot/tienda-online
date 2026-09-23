import { createRequestHandler } from "@react-router/cloudflare";

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext): Promise<Response> {
    const handler = createRequestHandler(() => import("virtual:react-router/server-build"), import.meta.env.MODE);
    return handler(request, { cloudflare: { env, ctx } } as any);
  },
} satisfies ExportedHandler<Record<string, unknown>>;
