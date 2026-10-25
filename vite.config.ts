import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { siteOrigin } from "./scripts/site-origin.mjs";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), tanstackStart(), ...(command === "build" ? [nitro()] : []), viteReact()],
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(siteOrigin("https://velora-beauty.vercel.app")),
  },
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
}));
