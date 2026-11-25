// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import { BASE_PATH, SITE_URL } from "./src/consts.ts";
import serviceWorker from "./src/integrations/service-worker.mjs";

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // Its floating pill sits on the fixed bottom nav.
  devToolbar: { enabled: false },
  integrations: [serviceWorker()],
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/inter-regular.woff2"],
          },
        ],
      },
    },
  ],
  vite: { build: { cssTarget: "safari15.4" } },
});
