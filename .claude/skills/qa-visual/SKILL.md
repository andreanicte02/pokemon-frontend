---
name: qa-visual
description: Checklist de QA visual y de comportamiento en el navegador con Playwright - abre la app, verifica desbordes, estilos que debían mantenerse, layout y responsive con evidencia medible, y si el cambio toca rutas o permisos valida redirects, catch-alls y 404 por permiso; corrige lo roto con cambios mínimos, re-verifica y reporta. Usar cuando pidan "verificá el cambio", "revisá que no rompí nada visual", "probalo en el navegador" o invoquen /qa-visual.
---

# qa-visual

QA en el navegador **dentro de la sesión** (no es un agente): se usa sabiendo qué se cambió y viendo cada captura. La regla de fondo: **evidencia medible, nunca "se ve bien"**.

## 1. Preparar

- **Qué revisar:** si hay plan en `.claude/plans/`, sus *Restricciones* (lo que NO debía cambiar) y su *Verificación*. Si no, `git diff` / lo que se tocó en la sesión. Sacar dos listas: lo que **sí** debía cambiar y lo que **no** (si cambió, es regresión).
- **Levantar la app:** `pnpm dev` (API json-server + vite). URL: `http://localhost:5173`.
- **Confirmar que es tu código y no otra cosa:** `curl -s http://localhost:5173/src/main.tsx | head -1` tiene que devolver el módulo de vite.
- **Login** con el badge del login (`ash / pikachu123` = todos los permisos; `misty / starmie123` = solo lectura). Si cambiaron los permisos de un usuario demo, **cerrar sesión y volver a entrar**: la sesión guardada trae los permisos viejos.

## 2. Verificar (desktop 1440×900 y móvil 390×844)

| Chequeo | Evidencia |
|---|---|
| **Desbordes** | `document.documentElement.scrollWidth > clientWidth` (scroll horizontal), o `getBoundingClientRect` del elemento contra su padre |
| **Estilos que debían mantenerse** | `getComputedStyle(el)` de color, fuente, padding o ancho, comparado con el antes |
| **Layout** | Screenshot: nada encimado, desaparecido ni desalineado |
| **Responsive** | Screenshot en 390×844: sidebar como drawer, grillas que bajan a una columna, sin scroll horizontal |

**Flujos (si el cambio tiene lógica):** recorrerlos de punta a punta y mirar el resultado, no solo que no explote:
- Alta → aparece en la lista **sin recargar**.
- Edición → guardar sin cambios = **cero** peticiones; con cambios = edición + refetch del detalle, éxito inline y vuelve "No hay cambios por guardar".
- Error → se ve inline y se puede cerrar.
- Filtro → ir a editar y volver: el filtro sigue aplicado y visible en los inputs.
- Para contar peticiones: el log de json-server en la terminal de `pnpm dev` o la pestaña Network.

**Rutas y permisos (si el cambio toca routing, `*Page.tsx`, permisos o el sidebar):**
- Redirects y catch-alls: navegar a la URL y comparar `location.pathname` con el destino esperado (index del módulo, ruta inventada `/<modulo>/xyz`). El botón atrás no tiene que rebotar.
- Sin permiso → **404, nunca pantalla en blanco**: entrar con el usuario sin permiso (o vaciar `permissions` en el `localStorage` y recargar) y abrir la ruta por URL directa, incluidas las sub-rutas (`edit/:id`). Restaurar el `localStorage` al terminar.
- Sidebar = router: cada ítem visible lleva a una ruta permitida y no falta ninguno.
- 401: Perfil → Sesión → "Simular sesión expirada" tiene que terminar en `/auth`.

### Antes / después (cuando hay que comparar con lo que estaba)

- Cambios sin commitear: captura DESPUÉS → `git stash push -u` → captura ANTES → `git stash pop`.
- Cambio commiteado: `git checkout <commit>^ -- <archivos>` → captura ANTES → `git checkout HEAD -- <archivos>`.
- **Siempre restaurar.** No es pixel-diff: se busca que lo de fuera del cambio se mantenga.

## 3. Ajustar y re-verificar

- **Rotura objetiva** (desborde, encimado, desaparecido, flujo roto) o **regresión fuera de alcance** → corregir con el cambio mínimo, buscando la causa, no tapando el síntoma.
- **Decisión de diseño dentro del alcance** (un color o un espaciado elegido a propósito) → no tocar, anotar como observación.
- Corregir con `sx` / `*.styles.ts` y tokens del theme. Después de cada ajuste: re-verificar **ese** chequeo y `pnpm build`.
- Tope: si tras ~3 intentos la misma rotura sigue, parar y dejarla como pendiente con lo que se sabe.

## 4. Reportar (en el chat)

- **Veredicto:** ✅ pasa · 🔧 corregido (validar) · ⚠️ pasa con observaciones · ❌ no se pudo dejar bien.
- Hallazgos por chequeo con su dato (ej. "scrollWidth 390 = clientWidth en móvil").
- Qué se corrigió (`archivo:línea`, qué estaba roto, cómo se re-verificó).
- Qué falta validar a mano.

## Gotchas conocidos

- **"Invalid hook call" o "loading @emotion/react when it is already loaded" en consola** justo después de usar un ícono o una librería nueva: es Vite re-optimizando dependencias en caliente (se mezclan dos versiones del chunk). No es un bug del código: **recargar** y volver a mirar la consola.
- **Páginas lazy:** después de navegar, esperar a que aparezca un texto de la pantalla antes de hacer click; si no, el click cae en el loader. Para medir, conviene un segundo `goto` (el primero calienta el lazy).
- **Screenshot de página completa** desacomoda elementos fijos o sticky (el sidebar aparece corrido): para revisar layout usar captura del viewport.
- **Selectores por texto** pueden matchear de más (`'ash'` también matchea "d**ash**board"): usar un texto único o el rol + nombre accesible.
- **Botones que cambian de `type` en el mismo lugar** (Siguiente → Enviar) sin `key` distinta: el click puede enviar el form. Probar siempre el penúltimo paso de un wizard.
- **CLI de Playwright** (si se usa en vez del MCP): en `eval` no hay `;` entre sentencias (usar una única función autoinvocada `(() => { …; return x })()`), el valor viene en la línea siguiente a `### Result`, y en un script de QA nada de `set -e`: que corran todos los chequeos y el logout vaya siempre al final.
- **json-server 0.17:** no soporta `_lt` (usar `_lte`) y recarga solo `db.json` con `--watch`; `pnpm api:reset` vuelve a los datos semilla después de probar.
