import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // General
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off', // Using TypeScript's checker instead
      'prefer-const': 'error',
      'spaced-comment': ['error', 'always'],

      // ES6+
      'arrow-body-style': ['error', 'as-needed'],
      'no-var': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',

      // Imports
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettier, // Harus diletakkan di akhir agar bisa override rules lainnya
];
