import { createRequestHandler } from "@react-router/cloudflare";

export default {
  async fetch(request: Request, env: Record<string, unknown>): Promise<Response> {
    // @ts-ignore - build is injected by the Cloudflare Vite plugin at build time
    const handler = createRequestHandler(globalThis.__BUILD__ ?? {}, "production");
    return handler(request, { cloudflare: { env } } as any);
  },
} satisfies ExportedHandler<Record<string, unknown>>;

declare global {
  // @ts-ignore
  var __BUILD__: unknown;
}
