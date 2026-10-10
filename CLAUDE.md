# CLAUDE.md — pokemon-web-frontend

App de ejemplo (Pokémon) que reúne un stack y prácticas de front de referencia. El README tiene el **mapa de prácticas → archivo**: leelo antes de agregar algo y copiá el patrón que ya existe.

- Idioma de la UI y de los comentarios: español.
- Verificación: `pnpm build` (eslint + tsc + vite) + `pnpm lint:security` + revisión visual con `pnpm dev`. Sin tests automatizados.
- pnpm 12 (`packageManager` en `package.json`), versiones exactas (sin `^`/`~`; `saveExact` en `pnpm-workspace.yaml`). Scripts de instalación de dependencias solo los aprobados en `allowBuilds`.
- Imports relativos, 3 espacios, Prettier a 100 columnas.
- Capa local en `src/_poke/` (componentes con nombre descriptivo sin prefijo: `PageHeader`, `DataTable`, `ErrorAlert`…; inputs y alertas con los componentes de MUI tal cual (`TextField`, `Alert`); hooks `use*Hook`; contextos en `_poke/context/`). Reusar antes de crear.
- API: un `createApi` por dominio en `store/api/service/<dominio>.ts` con `prepareHeaders: getHeader`; registrarlo en `store/store.ts` (reducer + middleware, `rtkQueryErrorLogger` siempre al final).
- Reglas firmes: RTK directo en el componente · RHF + Yup (nunca Formik) · `await` en el handler + error inline · forms de edición con guard `isDirty` + "No hay cambios por guardar" y botón habilitado.
- Módulo nuevo: `<Module>Page.tsx` (default export, router local con `PermissionGate` por sub-ruta y catch-all con `replace`) + ruta lazy en `PrivateRoute` + ítem en `_menuItems.ts` con el mismo permiso.
- Reglas de review: `.github/instructions/code-review.instructions.md` (las usa también el workflow de Claude en los PRs).
- Para tareas nuevas: agente `planificar-tarea` (plan en `.claude/plans/`) → skills de `.claude/skills/` → `/qa-visual` → `/revisar-practicas` → `/pr`.
- Dependencias: Dependabot abre 1 PR semanal; se completa con `/deps-triage` (en local). No subir majors ni descartar alertas sin que lo pida una persona.
- Configuración de GitHub y Claude que no se commitea (secrets, toggles, protección de rama): `.github/CONFIGURACION.md`.
