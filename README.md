# pokemon-web-frontend

Admin de Pokémon de ejemplo: un CRUD completo + login quemado, construido como **referencia de stack y prácticas de front** (React + RTK Query + RHF + MUI). La idea es que cada práctica importante tenga **al menos un ejemplo real** acá adentro: la tabla de abajo dice dónde mirar.

## Cómo correrlo

Requiere Node 24 y pnpm 12 (`npm i -g pnpm@12` o `corepack enable`; la versión exacta está en `packageManager`).

```bash
pnpm install
pnpm dev        # levanta la API (json-server :3001) + la web (vite :5173)
```

Abrí http://localhost:5173. Las credenciales están en el badge del login (click en "Usar" las autocompleta):

| Usuario | Contraseña | Qué puede hacer |
|---|---|---|
| `ash` | `pikachu123` | Todo: dashboard, CRUD de Pokémon, Pokédex, editar perfil |
| `misty` | `starmie123` | Solo lectura, sin dashboard (aterriza en "Mi equipo"); ve Torneos pero no puede inscribirse |

Otros scripts:

| Script | Para qué |
|---|---|
| `pnpm build` | La verificación: eslint + tsc + vite |
| `pnpm lint:security` | ESLint de seguridad (SAST) |
| `pnpm audit:gate` | Gate de dependencias (advisories high/critical de producción) |
| `pnpm api:reset` | Vuelve `db.json` a los datos semilla |

## Stack

React 19 · React Router 7 · Vite 6 · TypeScript 6 strict · Redux Toolkit 2 + RTK Query · react-hook-form 7 + Yup · MUI 7 + Emotion · pnpm 12 con versiones **pinneadas exactas** (sin `^`/`~`).

APIs:
- **json-server** (`db.json`) = backend CRUD local. `server/auth-middleware.cjs` simula la auth: sin Bearer o con token `expired` responde **401**.
- **PokeAPI** (pública, solo lectura) = especies, tipos y stats.

## Estructura

```
src/
├── _poke/              capa local del repo (NO es una librería compartida)
│   ├── context/        StatusMessage (provider + hook useStatusMessage)
│   ├── components/     PageHeader, DataTable, ErrorAlert, StatusMessage, Can, SpeciesStats…
│   ├── hooks/          use*Hook de UI (no lógica de feature)
│   ├── layout/         AppBar + MainLayout con sidebar (drawer)
│   ├── themes/ utils/ errors/
├── modules/            un módulo por feature: auth, dashboard, pokemon, pokedex, tournament, profile
│   └── <feature>/<sub-feature>/{components, core/_models.ts}  +  <Feature>Page.tsx (router local)
├── routing/            AppRoute, PrivateRoute, PublicRoute, LazyPage, PermissionGate, DefaultRedirect
├── store/
│   ├── api/service/    un createApi por dominio (auth, pokemon, profile, species, tournament)
│   ├── api/interface/  tipos por dominio + request/response (auth: Permission, Rol, SessionUser)
│   ├── middleware/     rtkQueryErrorLogger (401 → logout)
│   └── slice/          sesión, filtros, modales, drawer, pokédex
```

## Mapa de prácticas → dónde está el ejemplo

| Práctica | Dónde verla |
|---|---|
| **Capa API por dominio**: un `createApi` por dominio, `fetchBaseQuery` con `baseUrl` del env + `prepareHeaders: getHeader` | `store/api/service/pokemon.ts`, `profile.ts` · registro de reducers + middlewares en `store/store.ts` |
| `getHeader` inyecta `Authorization: Bearer` | `_poke/utils/function.ts` |
| Interfaces: sufijo `Request`/`Response` solo en las top-level, dominio sin sufijo | `store/api/interface/*.ts` |
| `builder.query` para leer, `mutation` solo para modificar | todos los services |
| Middleware **401 → logout** (con endpoints públicos excluidos), al final de la cadena | `store/middleware/rtkQueryErrorLogger.ts` · probalo en Perfil → Sesión → "Simular sesión expirada" |
| Logout = reset global del store en `auth/logout` | `store/store.ts` (rootReducer) |
| Sesión en Redux + localStorage con TTL de 6 h | `_poke/utils/function.ts` (`getUserLocalStorage`) + `currentUserSlice.ts` |
| `onQueryStarted` **solo** para sincronizar el store (nunca mensajes) | `auth.ts` (guarda sesión), `pokemon.ts` (`createPokemon` resetea el filtro) |
| **Regla 1** — lógica RTK directa en el componente, sin hook "container" | `PokemonTable.tsx`, `TeamDashboard.tsx`, `PokemonEditForm.tsx` |
| **Regla 2** — react-hook-form + Yup, schemas en `core/_models.ts` | `modules/*/core/_models.ts` |
| Form grande: un `FormProvider` + secciones con `useFormContext` + `yup.when` | `modules/profile/profile-edit/` (avatar / info / gimnasio) |
| `setValue` con `{ shouldDirty: true }` (si no, el guard `isDirty` bloquea) | `ProfileAvatarSection.tsx` |
| Form un nivel abajo del DOM: el modal se monta condicional → form limpio sin `reset()` | `PokemonList.tsx` + `PokemonModalCreate` / `PokemonCreateForm` |
| **Regla 3** — `await` la mutation en el handler (forma B, guard `if (!result.data) return`) + error inline | `CardLogin.tsx`, `PokemonCreateForm.tsx`, `PokemonModalDelete.tsx` |
| Éxito global por contexto (`useStatusMessage().success`) con `StatusMessageProvider` por módulo (`_poke/context/StatusMessage/`) · estado y acciones en contextos separados (las acciones son estables: quien solo muestra mensajes no se re-renderiza) | `PokemonPage.tsx` + modales de alta/baja |
| **Regla 4 + estándar de edición (4 capas)**: guard `isDirty`, aviso "No hay cambios por guardar", botón siempre habilitado, éxito inline que se cierra solo, detalle por query + tag, "Regresar" | `modules/pokemon/pokemon-edit/` y `modules/profile/profile-edit/` |
| Aviso + botón dentro de la misma condición de permiso | `ProfileEditFormSections.tsx` (Misty no ve ni el botón ni el aviso) |
| Slice de modales con `enum` + `none`, render condicional | `store/slice/pokemonModalSlice.ts` + `PokemonList.tsx` |
| Modal muy local con `useState` (excepción válida) | `PokedexList.tsx` → `PokedexDetailModal` |
| Listado: filtro en slice que **sobrevive** al ida y vuelta a la edición, inputs rehidratados desde el slice | `pokemonFilterSlice.ts` + `PokemonFilter.tsx` |
| Refresco: remonte (`refetchOnMountOrArgChange`) para la lista; tag de lista solo si la tabla está montada | `PokemonTable.tsx` + comentarios en `pokemon.ts` |
| Paginación numerada (la página se conserva, sin cleanup) | `PokemonTable.tsx` |
| Paginación infinita por offset: `serializeQueryArgs` + `merge` + `forceRefetch` | `store/api/service/species.ts` (`pokedexPage`) |
| Paginación por **cursor**: el cursor no entra en la key de caché, primera página reemplaza; al salir se suelta **solo el cursor** y el filtro sobrevive | `store/api/service/tournament.ts` (`registrationList`) + `registrationFilterSlice.ts` + `RegistrationFilter.tsx` |
| **Wizard**: un solo `useForm` para todos los pasos, `trigger` por paso, `context` con datos externos al form para validar, `resetField` parcial | `modules/tournament/tournament-wizard/` + `core/_models.ts` |
| Caso **válido** de `useEffect([isSuccess])`: query al montar sin handler | `TournamentList.tsx` |
| `StatusMessageProvider` a nivel de módulo cuando el éxito tiene que sobrevivir a la navegación | `TournamentPage.tsx` |
| Botones que cambian de `type` en el mismo lugar → `key` distinta (si no, el "Siguiente" envía el form) | `TournamentWizard.tsx` |
| Routing: `LazyPage`, `PermissionGate` por sub-ruta, catch-alls absolutos con `replace` | `routing/` + cada `<Module>Page.tsx` |
| `DefaultRedirect`: aterrizás en lo primero permitido del menú | `routing/DefaultRedirect.tsx` (Ash → Dashboard, Misty → Mi equipo) |
| Drawer con **la misma condición que el router** ("el router manda") | `_poke/layout/main-layout/drawer/_menuItems.ts` |
| Gating de elementos con `<Can>` + render-prop | `PokemonList.tsx` (botón capturar), `PokemonActionCell.tsx` |
| Hooks de UI en tupla `[valor, handler]` | `usePasswordHook.ts`, `useCopyToClipboardHook.ts` |
| Estilos en `*.styles.ts` con `styled()` + `shouldForwardProp` | `Sidebar.styles.ts` (`active`), `SummaryCard.styles.ts` (`accent`), `StatusMessage.styles.ts` (`durationMs`) |
| Un solo `return`, la condición adentro del JSX (sin `return null` para auto-ocultarse) | `StatusMessageRenderer.tsx`, `PublicRoute.tsx`, `ErrorAlert` (el padre decide) |
| 3+ variantes → mapa de vistas | `ProfileTabs.tsx` · variantes de `StatusMessage` en el keymap `statusVariants.ts` |
| Derivar en el render, no `useEffect` | `TeamDashboard.tsx` (estadísticas) |
| `useEffect` solo para sistemas externos (timers) · si una animación CSS alcanza, ni eso | `useCopyToClipboardHook.ts` · `StatusMessage.tsx` (se cierra solo con `onAnimationEnd`, sin timer) |
| Extraer solo con dos usos reales | `SpeciesStats` (edición + Pokédex) |
| Moneda con `Intl.NumberFormat`, locale y moneda centralizados | `formatCurrency` en `_poke/utils/function.ts` + `APP_LOCALE`/`APP_CURRENCY` en `enum.ts` (dashboard) |
| ESLint `no-restricted-imports` (Formik / react-bootstrap) encadenado al `build` | `eslint.config.js` + `package.json` |
| Imports relativos (sin alias), indentación de 3 espacios | todo el repo |

## Checks de seguridad

Corren en cada PR (`.github/workflows/`). Si fallan, dejan un comentario en el PR con el reporte y qué hacer.

| Check | Qué revisa | En local | Excepciones |
|---|---|---|---|
| `audit` | Advisories high/critical en dependencias de producción (solo lee el lockfile) | `pnpm audit:gate` | `.audit-exceptions.json`, con motivo y fecha de vencimiento |
| `lint-security` | Patrones peligrosos en `src/`: `eval`, `innerHTML`/`dangerouslySetInnerHTML`, regex que cuelgan el navegador, caracteres invisibles | `pnpm lint:security` | `// eslint-disable-next-line <regla> -- motivo` |

**Para activarlos** (secrets, toggles de GitHub, protección de rama): ver [`.github/CONFIGURACION.md`](.github/CONFIGURACION.md).

Además: `dependabot.yml` (1 PR semanal agrupado, sin majors, cooldown de 7 días), `claude.yml` (Claude revisa PRs solo cuando lo mencionan con `@claude`, sin permiso para pushear; requiere el secret `CLAUDE_CODE_OAUTH_TOKEN`) y `instructions/code-review.instructions.md` (las reglas de review, fuente única para Claude y para las personas). Las Actions van fijadas por SHA y `pnpm-workspace.yaml` fuerza versiones exactas (`saveExact`) y lista los únicos paquetes que pueden correr scripts al instalarse (`allowBuilds`).

## Publicación (GitHub Pages)

`.github/workflows/deploy-pages.yml` hace el build y lo publica en `https://<usuario>.github.io/<repo>/` en cada push a `main` (o a mano desde Actions). Activarlo y la API: ver el paso 6 de [`.github/CONFIGURACION.md`](.github/CONFIGURACION.md).

- `base` de Vite y `basename` del router salen de `VITE_BASE_PATH` (en local es `/`, no hay que tocar nada).
- `404.html` = `index.html`: entrar directo a una ruta (o recargar) no da 404.
- json-server no corre en Pages: sin la variable `VITE_API_URL` funcionan el login demo y la Pokédex; el resto muestra el error inline.

## Skills y agente (Claude Code)

| Comando | Para qué |
|---|---|
| `/rtk-service` | Pegás un endpoint → interfaces + servicio por dominio + registro en el store |
| `/nuevo-modulo` | Módulo privado completo: página, permisos, ruta lazy e ítem del sidebar |
| `/nuevo-modal` | Modal con form (o de confirmación) conectado al slice de modales |
| `/listado-con-filtros` | Pantalla de listado con filtros que sobreviven y paginación |
| `/form-edicion` | Pantalla de edición con el estándar de 4 capas |
| `/qa-visual` | QA en el navegador: chequeos medibles, rutas/permisos, ajustar y re-verificar |
| `/revisar-practicas` | Review de un cambio contra estas prácticas |
| `/pr` | Título y descripción del PR desde el diff |
| `/deps-triage` | Mantenimiento de dependencias: qué alertas de Dependabot nos afectan de verdad y deja el PR semanal validado |
| agente `planificar-tarea` | Pegás una tarea → borrador de plan en `.claude/plans/` con supuestos marcados |

## Notas

- El login es **quemado** a propósito (`DEMO_USERS` en `store/api/service/auth.ts`): no hay backend de auth. Es una demo, no lo copies a producción.
- La API es json-server: REST plano (GET/POST/PATCH/DELETE), sin envelope en las respuestas.
