import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    cloudflare({
      viteEnvironment: {
        name: "ssr",
      },
    }),
  ],
});
