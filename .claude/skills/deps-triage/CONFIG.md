# Config de deps-triage — pokemon-web-frontend

Lo único de la skill que cambia entre repos. Para usarla en otro repo: copiar la carpeta `deps-triage/` completa y reescribir solo este archivo.

## Repo

| Campo | Valor |
|---|---|
| Gestor | pnpm 12 (`pnpm-lock.yaml`; `saveExact: true` y `allowBuilds` en `pnpm-workspace.yaml`) |
| Instalar el lockfile | `ppnpm install --frozen-lockfile` |
| Validación | `pnpm build` (eslint + tsc + vite) · `pnpm lint:security` · `pnpm audit:gate` |
| Tipo de app | **SPA estática**: React 19 + Vite. No hay código Node en servidor (json-server es solo la API local de desarrollo) |
| Revisores | (completar con los usuarios de GitHub que revisan) |

## Reglas

| Regla | Valor |
|---|---|
| Cooldown | 7 días desde la publicación. Excepción: la versión corrige una alerta abierta de ese mismo paquete |
| Formato | Versión exacta, **sin `^` ni `~`** |
| Congelados (no se suben) | — (ninguno por ahora) |
| Familias de major (suben juntas) | `react`: `react`, `react-dom`, `@types/react`, `@types/react-dom` · `mui`: `@mui/*`, `@emotion/*` · `redux`: `@reduxjs/toolkit`, `react-redux` · `forms`: `react-hook-form`, `@hookform/resolvers`, `yup` |
| Módulos sensibles (pesan más) | `src/modules/auth/**`, `src/store/middleware/**`, `src/_poke/utils/function.ts` (sesión y header de auth) |

## Contexto para los veredictos

- Vulnerabilidades que solo aplican a servidor Node (SSR, RSC, APIs) **no aplican**: es una SPA. Ej.: las de `react-router` en modo RSC.
- Solo de build/CI (no llegan al navegador): Vite, Rollup, esbuild, Babel, PostCSS, ESLint y sus plugins, typescript-eslint, TypeScript, concurrently.
- `json-server` es solo para desarrollo local (`devDependencies`): sus alertas se tratan como tooling.
