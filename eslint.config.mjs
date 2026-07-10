import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scripts de build/outillage (CommonJS) — pas du code applicatif.
    "scripts/**",
  ]),
  {
    rules: {
      // Règle purement stylistique (échapper apostrophes/guillemets dans le JSX) — aucun
      // impact runtime, du bruit. Désactivée pour garder une CI verte réellement utile.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
