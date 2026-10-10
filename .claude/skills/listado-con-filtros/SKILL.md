---
name: listado-con-filtros
description: Genera una pantalla de listado (título + botón de alta + filtros + tabla DataTable con columnas tipadas + paginación) atada a una query RTK existente, con filtros en un slice que sobreviven al ida y vuelta a la edición y refresco por remonte. Usar cuando pidan "una tabla/listado de X con filtros", "paginar X" o invoquen /listado-con-filtros.
---

# listado-con-filtros

Ejemplo de referencia: `src/modules/pokemon/pokemon-list/` + `src/store/slice/pokemonFilterSlice.ts`.

## Entrada

- Interface del item (fuente de verdad de las columnas) y el hook de la query de lista.
- Filtros (búsqueda, selects) y tipo de paginación: **numerada** (default) o **infinita** (cursor/offset).
- Columnas visibles y acciones por fila con su permiso (si no se dan: una columna por campo).

## Estructura

```
<sub-feature>/
├── <X>List.tsx                    ← PageHeader + <Can> alta + StatusMessageRenderer + filtro + tabla + modales
└── components/
    ├── filter/<X>Filter.tsx
    └── table/
        ├── <X>Table.tsx
        └── columns/_<x>Columns.tsx (+ <X>ActionCell.tsx)
store/slice/<x>FilterSlice.ts
```

## Reglas

1. **Slice del filtro**: `{ search, <selects>, page }` con `set<X>Filter` (vuelve a página 1), `set<X>Page` y `reset<X>Filter`. Registrar en `store.ts`.
2. **El filtro sobrevive** a ir a editar y volver:
   - Paginación numerada: **sin cleanup** al desmontar (la página es absoluta, también se conserva).
   - Paginación infinita/cursor: en el cleanup soltar **solo el cursor** (`clear<X>Cursor`), nunca el filtro entero.
   - Los `useState` del filtro se **inicializan desde el slice**, si no la lista vuelve filtrada pero los inputs en blanco.
3. **Tabla**: la query **directo en el componente** (sin hook "container"), leyendo el filtro del slice:
   ```ts
   const { data, isFetching, isError, error, refetch } = useXListQuery(filter, {
      refetchOnMountOrArgChange: true,   // remonte = refresco al volver de editar/crear
   });
   ```
   - Error de la query inline: `{isError && <ErrorAlert … close={refetch} />}`.
   - Paginación con MUI `Pagination` solo si `totalPages > 1`.
4. **Columnas**: `ReadonlyArray<DataTableColumn<Item>>`, tipadas con la interfaz del item. Celdas compuestas → componente aparte.
5. **Acciones por fila** envueltas en `<Can requiredPermissions="…">{(isAllowed) => isAllowed && …}</Can>`. Editar navega a la pantalla de edición; eliminar abre el modal por slice (skill `nuevo-modal`).
6. **Refresco**:
   - Al volver de editar/crear con navegación → remonte (ya está con `refetchOnMountOrArgChange`).
   - Alta desde modal o baja desde la fila (la tabla sigue montada) → la mutation `invalidatesTags: ["<X>List"]`. Con paginación numerada es seguro.
   - Con scroll infinito **no** invalidar el tag de lista (el refetch reusa el último cursor y duplica filas): resetear la paginación al cursor inicial.
7. Paginación infinita: ver `pokedexPage` en `store/api/service/species.ts` (`serializeQueryArgs` + `merge` + `forceRefetch`, offset en un slice).

## Verificación

`pnpm build` y en el navegador: filtrar → editar → "Regresar" → el filtro sigue aplicado y visible en los inputs, y la fila muestra el dato nuevo. Crear desde el modal → aparece sin recargar.
