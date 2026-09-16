import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "blob-report/**",
    ],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

    extends: [js.configs.recommended, tseslint.configs.recommended],
  },

  eslintConfigPrettier,
]);
