// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';

export default withNuxt(
  // Your custom configs here
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/no-tabs': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/no-side-effects-in-computed-properties': 'off',
      '@stylistic/multiline-ternary': 'off',
      'no-empty': 'off',
    },
  },
);
