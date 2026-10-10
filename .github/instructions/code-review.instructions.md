---
applyTo: "**"
description: "Reglas de code review para proyectos React + Redux Toolkit + RTK Query + react-hook-form. Responder siempre en español."
---

# Guía de Code Review

Proyecto React con Redux Toolkit, RTK Query y react-hook-form + Yup.

**IMPORTANT: Always respond in Spanish (español) when performing a code review on this repository. Do not respond in English under any circumstance.**

## Principios fundamentales

1. **Componentes puros en render.** Sin side effects, mutaciones ni `setState` durante el render.
2. **El state es snapshot.** Usar `setState(prev => ...)` cuando se depende del valor anterior.
3. **Effects solo para sincronizar con sistemas externos** (red, suscripciones, timers, APIs del navegador, librerías no-React). Si no sincroniza con algo fuera de React, no es un Effect.

## Reglas firmes (bloquean el PR)

1. **Lógica RTK directa en el componente.** `useQuery`/`useMutation`/`useSelector`/`useDispatch` en el componente que los consume. Un hook que encapsula la lógica del feature y devuelve valores a un componente "tonto" es anti-patrón.
2. **Formularios con react-hook-form + Yup.** Formik prohibido. Schemas e interfaces del form en `core/_models.ts` del módulo.
3. **Feedback de mutations:** `await` la mutation en el handler (con `unwrap()` + `try/catch` o guard `if (!result.data) return`), acciones post-éxito después del `await` (no en `useEffect([isSuccess])`). El error se muestra **inline** con `status.isError` + `close={status.reset}` y no se duplica en el mensaje global.
4. **Edición sin cambios:** guard `if (!formState.isDirty) return;`, aviso "No hay cambios por guardar" y botón **siempre habilitado** (nunca `disabled={!isDirty}`).

## Reglas de revisión

1. Eliminar `console.log` y logs de debug (`console.error` en un `catch` sí se permite).
2. Evitar `useEffect` siempre que sea posible. Marcar cuando se usa para: transformar datos, derivar estado, reaccionar a eventos de usuario, resetear estado al cambiar prop, o notificar al padre. Eso va en render, `useMemo`, event handlers o `key`. Excepción válida: query disparada al montar sin handler (ver `TournamentList.tsx`).
3. `useMemo` solo si aporta optimización real (cálculo costoso o valor no-primitivo que es dependencia de otro hook o prop de un componente memoizado).
4. `useCallback` solo si aporta optimización real (consumer memoizado o dependencia de otro hook).
5. `useRef` solo para nodos del DOM, timers/suscripciones o valores que nadie pinta. Marcar refs usados para estado que se muestra o para pasar un "pendiente" a un callback posterior.
6. Dividir en subcomponentes cuando el componente supera ~200 líneas, maneja múltiples responsabilidades o el JSX tiene anidación condicional >3 niveles.
7. **Un solo `return` de JSX** por componente, con la condición adentro. Nada de `return null` para auto-ocultarse (la decisión va en el padre). 3+ variantes → mapa de vistas, no ternarios anidados. Los early returns siguen bien en handlers y funciones auxiliares.
8. Formularios con >6 campos o estado compartido entre hijos → `FormProvider` + `useFormContext`, no pasar `register`/`control`/`errors` como props.
9. Componentes con >7 props → sugerir en orden: agrupar props en objeto, composición con `children`, Context, o slice solo si es estado global real.
10. Preferir código simple. Marcar abstracciones prematuras (hook, constante o componente compartido con un solo uso real), condicionales anidados resolubles con early returns, duplicación en 3+ lugares y nombres genéricos (`data`, `info`, `handleIt`).
11. Modal con form: renderizado condicional (no `open` toggleado), así el form se desmonta y no hace falta `reset()`. `form.reset()` solo tras submit exitoso que deja el form montado, botón "Limpiar" o wizard en el mismo componente.
12. `setValue` que representa una edición del usuario lleva `{ shouldDirty: true }`.
13. RTK Query: `builder.query` para lecturas, `builder.mutation` solo para modificaciones. `onQueryStarted` sin mensajes de UI. Invalidar un tag solo si quien lo consume está montado.
14. Routing: sub-rutas con `PermissionGate`, páginas lazy con `LazyPage`, todo `Navigate` de redirect con `replace`, catch-alls absolutos. El ítem del sidebar replica la condición de la ruta. Rutas nuevas por permiso, no por rol.
15. Estilos con `sx` o `*.styles.ts` (`styled()` + `shouldForwardProp`), tamaños en `rem`, colores del theme. Nada de `className` con utilidades.
16. Imports relativos (sin aliases) e indentación de 3 espacios.
17. Dependencias pinneadas a versión exacta: marcar cualquier `^` o `~` en `dependencies` o `devDependencies`. Las actualizaciones van explícitas por PR.
18. `package.json` y `pnpm-lock.yaml` van juntos. Si el PR cambia dependencias y el lockfile no viene (o no coincide), dejar una **advertencia** (⚠️, no bloqueante): "Falta regenerar pnpm-lock.yaml: corre `pnpm install` (sin borrar el lockfile) y commitéalo".
19. Avisar sobre re-renders evitables (objetos/funciones nuevas pasadas a componentes memoizados, selectores que devuelven objetos nuevos).

## Lo que NO necesitas revisar

Confía en las buenas prácticas oficiales de React (https://react.dev). Enfocate en los principios, las reglas firmes y las reglas de revisión. No repitas reglas obvias salvo que veas una violación concreta. El README tiene un "Mapa de prácticas" con el ejemplo correcto de cada punto.
