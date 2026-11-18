import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // New in eslint-plugin-react-hooks 7 (shipped with Next 16). The flagged
      // effects predate the rule and work; refactor them separately rather
      // than as part of the security upgrade.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts", "src/types/generated/**"]),
]);
