import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint/config').EslintRules} */
const generalRules = {
  "no-empty": "off",
  "no-useless-catch": "off",
  "prefer-const": "off",
  "no-case-declarations": "off",
};

/** @type {import('eslint/config').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/node_modules/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      ...generalRules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...generalRules,
    },
  },
];
