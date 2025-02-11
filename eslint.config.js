import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import js from "@eslint/js";

export default [
  {
    ignores: ["**/dist/**"]
  },
  // Base config for all files
  js.configs.recommended,
  
  // TypeScript/React specific config
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // React rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true 
      }],
      "@typescript-eslint/no-explicit-any": "error",
      
      // General rules
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-undef": "error",
      
      // Disable duplicate rules
      "no-unused-vars": "off" // Using @typescript-eslint/no-unused-vars instead
    }
  }
];
