/** @type {import('eslint/config').EslintRules} */
const generalRules = {
  'no-empty': 'off',
  'no-useless-catch': 'off',
  'prefer-const': 'off',
  'no-case-declarations': 'off',
};

/** @type {import('eslint/config').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/node_modules/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      ...generalRules,
    }
  }
];