import js from '@eslint/js' // Core JS rules
import globals from 'globals' // Predefined global variables
import reactHooks from 'eslint-plugin-react-hooks' // Hooks rules for React
import reactRefresh from 'eslint-plugin-react-refresh' // Vite + React refresh rules
import tseslint from 'typescript-eslint' // TypeScript-specific rules
import { defineConfig, globalIgnores } from 'eslint/config' // ESLint helper functions

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
