import { createRequestHandler } from "@react-router/cloudflare";
import type { Env } from "../app/lib/types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const handler = createRequestHandler(
      // @ts-ignore - injected by the build
      typeof __BUILD__ !== "undefined" ? __BUILD__ : {},
      "production"
    );
    return handler(request as any, { cloudflare: { env } } as any);
  },
} satisfies ExportedHandler<Env>;
