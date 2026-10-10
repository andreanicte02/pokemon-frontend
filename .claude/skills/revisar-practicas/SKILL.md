---
name: revisar-practicas
description: Revisa los cambios pendientes (o archivos indicados) contra las reglas firmes y prácticas de front del repo - RTK directo en el componente, RHF + Yup, await en el handler con error inline, estándar de edición, modales por slice, routing/permisos, un solo return, useEffect/useRef, estilos y dependencias - y reporta hallazgos con archivo:línea y la corrección. Usar cuando pidan "revisá mi código", "¿cumple las prácticas?", "review antes del PR" o invoquen /revisar-practicas.
---

# revisar-practicas

Checklist de review de front (la versión para PRs vive en `.github/instructions/code-review.instructions.md`). Ver el README (tabla "Mapa de prácticas") para el ejemplo correcto de cada punto.

## Alcance

Por defecto: `git diff` contra la rama base + archivos sin trackear. Si no hay git, los archivos que indique la persona. Leer cada archivo tocado completo, no solo el diff.

## Checklist

**Reglas firmes (bloquean)**
1. Lógica RTK (`useQuery`/`useMutation`/`useSelector`/`useDispatch`) **directo en el componente**. Un hook que encapsula el feature y devuelve valores a un componente "tonto" es anti-patrón.
2. Formularios con **react-hook-form + Yup**, schema en `core/_models.ts`. Formik prohibido (ESLint ya lo bloquea).
3. Mutation por evento de usuario → `await` en el handler (con `unwrap()` + `try/catch` o guard `if (!result.data) return`). Acciones post-éxito después del `await`, **no** en `useEffect([isSuccess])`. Error **inline** con `status.isError` + `close={status.reset}`, y no duplicado en el mensaje global.
4. Edición: guard `isDirty`, aviso "No hay cambios por guardar", **sin** `disabled={!isDirty}`, vuelta a pristine tras guardar.

**RTK Query**
- `query` para leer, `mutation` solo para modificar.
- `onQueryStarted` sin mensajes de UI.
- Tags coherentes: invalidar solo si quien consume el tag está montado; lista con `refetchOnMountOrArgChange`.
- Servicio nuevo registrado en `store.ts` (reducer + middleware, `rtkQueryErrorLogger` al final).

**Modales y forms**
- Modal con form renderizado condicionalmente (no `open` toggleado) → sin `reset()`.
- `setValue` de edición del usuario con `shouldDirty: true`.
- 5+ campos o secciones → `FormProvider` + `useFormContext`.

**Routing y permisos**
- Sub-rutas con `PermissionGate`, páginas lazy con `LazyPage`, `Navigate` de redirect con `replace`, catch-alls absolutos.
- Ítem del sidebar con la misma condición que la ruta.
- Elementos con `<Can>`; rutas nuevas por permiso, no por rol.

**Componentes**
- Un solo `return` de JSX con la condición adentro; nada de `return null` para auto-ocultarse (la decisión va en el padre).
- 3+ variantes → mapa de vistas, no ternarios anidados.
- `useEffect` solo para sistemas externos (timers, suscripciones, DOM). Nada de derivar estado ni reaccionar a eventos con él.
- `useRef` solo para DOM, timers o valores que nadie pinta.
- `useMemo`/`useCallback` solo con una optimización real.
- Sin abstracciones "por si acaso": hook, constante o componente compartido con un solo uso real.
- Componentes de más de ~200 líneas → dividir.

**Estilo y convenciones**
- `sx` o `*.styles.ts` con `styled()` + `shouldForwardProp`; nada de `className` con utilidades.
- Tamaños en `rem`, colores del theme (no hex sueltos salvo datos, como colores por tipo).
- Imports relativos, 3 espacios, `interface` para props (prefijo `I` o `Props`, consistente con el archivo).
- Reusar lo de `src/_poke/` antes de crear algo nuevo.

**Dependencias**
- Versión exacta en `package.json` (sin `^`/`~`) y `pnpm-lock.yaml` en el mismo cambio.
- Variable `VITE_*` nueva → agregarla a `.env.example`.

## Salida

1. Hallazgos ordenados por severidad (**Bloquea** = regla firme, **Debería**, **Sugerencia**), cada uno con `archivo:línea`, qué está mal, por qué y cómo corregirlo (con snippet corto si ayuda).
2. Lo que está bien hecho, en una línea (para no repetirlo como hallazgo).
3. Resultado de `pnpm build` y `pnpm lint:security`.

No aplicar correcciones salvo que la persona lo pida.
