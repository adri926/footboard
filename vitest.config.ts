import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // Aligné sur le path "@/*" du tsconfig (racine du projet).
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
})
