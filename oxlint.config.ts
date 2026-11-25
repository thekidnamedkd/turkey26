import { defineConfig } from "oxlint";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";

/**
 * Framework components are linted by their own release, not by this project:
 * Lumos ships PascalCase Astro files and `type Props` aliases.
 */
export default defineConfig({
  env: core.env,
  extends: [core, astro],
  ignorePatterns: [
    ...core.ignorePatterns,
    ".agents/**",
    ".claude/**",
    ".stacki/**",
    "dist/**",
    "src/components/Button.astro",
    "src/components/form/**",
    "src/components/interactive/**",
    "src/components/item/**",
    "src/components/media/**",
    "src/components/typography/**",
    "src/components/wrapper/**",
    "src/utils/**",
  ],
  overrides: [
    {
      // The reset asks for confirmation from the browser rather than shipping a
      // modal for one destructive action. Unticking deletes the key so storage
      // and exports stay tick-only.
      files: ["src/scripts/app.ts"],
      rules: {
        "no-alert": "off",
        "typescript/no-dynamic-delete": "off",
      },
    },
    {
      files: ["**/*.astro"],
      rules: {
        "unicorn/filename-case": "off",
        "typescript/consistent-type-definitions": "off",
      },
    },
  ],
});
