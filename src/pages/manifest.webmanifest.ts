import type { APIRoute } from "astro";

import { BASE_PATH, SITE_DESCRIPTION, SITE_NAME } from "@/consts.ts";

export const GET: APIRoute = () => {
  const manifest = {
    name: `${SITE_NAME} — Thanksgiving, via Málaga`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: BASE_PATH,
    scope: BASE_PATH,
    display: "standalone",
    background_color: "#f7f2e6",
    theme_color: "#f7f2e6",
    lang: "en",
    icons: [
      {
        src: `${BASE_PATH}icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${BASE_PATH}icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${BASE_PATH}icons/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
};
