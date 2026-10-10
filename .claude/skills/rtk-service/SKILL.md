---
name: rtk-service
description: Genera interfaces TypeScript y un servicio RTK Query (un createApi por dominio) a partir de una request HTTP pegada (URL, método, body y response). Crea o extiende src/store/api/interface/<dominio>.ts y src/store/api/service/<dominio>.ts, y registra el servicio en src/store/store.ts si es nuevo. Usar cuando peguen un endpoint y pidan "armá el servicio", "generá las interfaces" o invoquen /rtk-service.
---

# rtk-service

Genera la capa de API de un endpoint siguiendo la convención del repo: **un `createApi` por dominio**, cada uno con su `fetchBaseQuery` + `prepareHeaders: getHeader`, e interfaces en un archivo por dominio.

Ejemplo de referencia: `src/store/api/service/pokemon.ts` + `src/store/api/interface/pokemon.ts`.

## Entrada

La persona pega algo como:

```
URL: GET /pokemon?_page=1&_limit=8
Response: [ { "id": 1, "species": "pikachu", "types": ["electric"], ... } ]
```

Opcionales: nombre del dominio/archivo, nombre del endpoint, query o mutation. Si falta algo crítico (dominio ambiguo, baseUrl distinto al del servicio existente), preguntar **una sola vez**.

## Reglas

### Interfaces — `src/store/api/interface/<dominio>.ts`

1. **Sufijo `Request`/`Response` solo en los tipos top-level** que consume el endpoint (`builder.query<XResponse, XRequest>`). Todo lo anidado lleva nombre de dominio sin sufijo (`Pokemon`, `Stat`, `SpeciesItem`).
2. Arrays de objetos → interface propia en singular. Objetos anidados con varios campos → interface propia. Solo se inlinean objetos de 1-2 campos.
3. Campos con valores fijos (status, region, type) → union type (`"kanto" | "johto"`).
4. Si el request no tiene body (GET, DELETE por id), el arg es el tipo primitivo (`number`, `string`) o `void`.
5. Preferir `interface`; `type` solo para alias (`type PokemonDetailResponse = Pokemon`) y unions.
6. Si el archivo existe: leerlo y extenderlo, sin duplicar tipos.

### Servicio — `src/store/api/service/<dominio>.ts`

Si es nuevo:

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { XRequest, XResponse } from "../interface/<dominio>";
import { getHeader } from "../../../_poke/utils/function";

export const <dominio> = createApi({
   reducerPath: "<dominio>",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_URL + "/<recurso>/",
      prepareHeaders: (headers, { getState }) => getHeader(headers, getState),
   }),
   tagTypes: ["<X>List", "<X>Detail"],
   endpoints: (builder) => ({
      // …
   }),
});

export const { use<X>Query } = <dominio>;
```

Si existe: agregar el endpoint y el hook al export, **no** crear un segundo `createApi`.

- **`query` para leer, `mutation` solo para modificar.** Usar mutation para leer pierde caché, dedup y refetch (y rompe el estándar de edición).
- **Tags** (ver `listado-con-filtros` y `form-edicion`):
  - Lista: `providesTags: ["<X>List"]`. Detalle: `providesTags: ["<X>Detail"]`.
  - Edición: `invalidatesTags: ["<X>Detail"]`.
  - Alta/baja: invalidar la lista **solo si la tabla queda montada** (alta desde modal, baja desde la fila). Si hay navegación de por medio, el remonte ya refresca.
- **`onQueryStarted` solo para sincronizar el store** (guardar sesión, resetear un filtro). Nunca para mostrar mensajes: eso va en el handler del componente.
- API externa sin auth: sin `prepareHeaders` (ver `species.ts`).
- Paginación infinita: `serializeQueryArgs` + `merge` + `forceRefetch`, con la página 0 reemplazando en vez de concatenar (ver `pokedexPage` en `species.ts`).
- Total de registros en headers: `transformResponse: (items, meta) => ({ items, total: Number(meta?.response?.headers.get("X-Total-Count")) })`.
- Endpoints públicos (login, recuperar contraseña): agregarlos a `unprotectedEndpoints` en `src/store/middleware/rtkQueryErrorLogger.ts` para que un 401 no haga logout.

### Store — `src/store/store.ts` (solo si el servicio es nuevo)

1. `import { <dominio> } from "./api/service/<dominio>";`
2. En `combineReducers`: `[<dominio>.reducerPath]: <dominio>.reducer,`
3. En la cadena: `.concat(<dominio>.middleware)` **antes** de `.concat(rtkQueryErrorLogger)`, que va siempre último.

## Salida

Archivos creados/modificados, hooks generados (`useXQuery` / `useXMutation`) y cualquier decisión tomada por default. Verificar con `pnpm build`.
