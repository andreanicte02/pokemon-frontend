import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
   { ignores: ["dist"] },
   {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
      },
      plugins: {
         "react-hooks": reactHooks,
         "react-refresh": reactRefresh,
      },
      rules: {
         ...reactHooks.configs.recommended.rules,
         "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
         // Stack retirado: reintroducirlo es regresión. Corre en `build` (eslint src && …).
         "no-restricted-imports": [
            "error",
            {
               paths: [
                  { name: "formik", message: "Formularios: react-hook-form + Yup (regla firme 2)." },
                  { name: "react-bootstrap", message: "UI: MUI + capa local _poke/." },
               ],
               patterns: [
                  { group: ["react-bootstrap/*"], message: "UI: MUI + capa local _poke/." },
               ],
            },
         ],
      },
   },
);
