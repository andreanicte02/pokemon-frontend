// Lint de seguridad (SAST). Va aparte de `eslint.config.js` a propósito: aquí solo
// hay reglas que detectan patrones peligrosos, y todas son `error`. Lo corren el
// check `lint-security` en cada PR.
//
//   pnpm lint:security
//
// Para exceptuar un caso revisado: `// eslint-disable-next-line <regla> -- motivo`
// en la línea del código. Sin motivo no pasa el review.
import noUnsanitized from 'eslint-plugin-no-unsanitized'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import security from 'eslint-plugin-security'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Los `eslint-disable` de otras reglas (las de `eslint.config.js`) no cuentan aquí.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    plugins: {
      'no-unsanitized': noUnsanitized,
      security,
      // Sin reglas activas: solo se registran para que los `eslint-disable` que ya
      // existen en el código (de `eslint.config.js`) no den "rule not found".
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Ejecución de código a partir de texto
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'security/detect-eval-with-expression': 'error',

      // Inyección de HTML (XSS): innerHTML, outerHTML, insertAdjacentHTML, document.write…
      'no-unsanitized/property': 'error',
      'no-unsanitized/method': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML inyecta HTML sin escapar (XSS). Renderizar como texto o sanitizar antes.',
        },
      ],

      // Expresiones regulares que pueden colgar el navegador (ReDoS)
      'security/detect-unsafe-regex': 'error',
      'security/detect-non-literal-regexp': 'error',

      // Caracteres invisibles o bidireccionales que esconden código (Trojan Source)
      'security/detect-bidi-characters': 'error',
      'security/detect-invisible-characters': 'error',
    },
  },
)
