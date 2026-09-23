import { createRequestHandler } from "@react-router/serve";
// @ts-ignore
import * as build from "../build/server/index.js";
import type { Env } from "../app/lib/types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const handler = createRequestHandler(build, "production");
    return handler(request, { cloudflare: { env } } as unknown as Record<string, unknown>);
  },
} satisfies ExportedHandler<Env>;
