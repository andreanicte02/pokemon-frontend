---
name: nuevo-modulo
description: Crea un módulo privado nuevo completo - carpeta en src/modules, <Module>Page con router local, PermissionGate por sub-ruta y catch-all con replace, ruta lazy en PrivateRoute, permisos nuevos e ítem del sidebar con la misma condición que la ruta. Usar cuando pidan "agregá una sección/pantalla/módulo nuevo" o invoquen /nuevo-modulo.
---

# nuevo-modulo

Agrega un módulo privado respetando las 4 capas de gating: **sesión** (`PrivateRoute`) → **permiso por sub-ruta** (`PermissionGate`) → **elemento** (`<Can>`), con el **sidebar replicando la condición del router**.

Ejemplos: `src/modules/pokedex/` (simple) y `src/modules/pokemon/` (lista + edición).

## Entrada

- Nombre del módulo (kebab: `battles`) y título visible ("Batallas").
- Sub-rutas y el permiso de cada una (si no se dan: una sola vista `index` con `<modulo>_view`).
- Ícono de `@mui/icons-material` para el sidebar (si no se da, elegir uno razonable y decirlo).

## Pasos

1. **Permisos** — agregar los nuevos a la union `Permission` en `src/store/api/interface/auth.ts`, y a los usuarios que correspondan (en la demo: `DEMO_USERS` de `store/api/service/auth.ts`).
2. **Estructura**:
   ```
   src/modules/<modulo>/
   ├── <Modulo>Page.tsx          ← default export (requisito de React.lazy)
   ├── core/_models.ts            ← schemas Yup + interfaces de form (si hay forms)
   └── <sub-feature>/
       ├── <SubFeature>.tsx       ← componente de la vista, lógica RTK directa
       └── components/
   ```
3. **`<Modulo>Page.tsx`** — router local:
   ```tsx
   const ModuloPage = () => (
      <Routes>
         <Route index element={
            <PermissionGate permission="<modulo>_view">
               <StatusMessageProvider>   {/* solo si hay mensajes globales de éxito */}
                  <Vista />
               </StatusMessageProvider>
            </PermissionGate>
         } />
         <Route path="*" element={<Navigate to="/<modulo>" replace />} />
      </Routes>
   );
   export default ModuloPage;
   ```
   - Catch-all **absoluto** y **con `replace`** (sin `replace`, el botón atrás rebota).
   - Cada sub-ruta con su permiso específico. Nunca `isAllowed(x) ? <Page/> : <NotFound/>` a mano.
4. **`src/routing/PrivateRoute.tsx`** — `const ModuloPage = lazy(() => import("../modules/<modulo>/ModuloPage"));` arriba, y la ruta `path="<modulo>/*"` envuelta en `<LazyPage>`.
5. **Sidebar** — ítem en `src/_poke/layout/main-layout/drawer/_menuItems.ts` con **el mismo permiso** que el `PermissionGate` de la vista principal. El orden del array también define el aterrizaje (`DefaultRedirect`).
   - Regla "el router manda": si drawer y router divergen, se ajusta el drawer. El drawer puede ser más estricto que la ruta, nunca más permisivo.
6. **Título** con `PageHeader` (`src/_poke/components/PageHeader/PageHeader.tsx`).

## Verificación

- `pnpm build`.
- Navegar por URL directa con un usuario **con** y **sin** el permiso: sin permiso debe verse el 404, nunca pantalla en blanco.
- El ítem del sidebar aparece solo para quien puede entrar.
- Una URL rota dentro del módulo (`/<modulo>/xyz`) redirige al default y el botón atrás no rebota.
