import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
   PokedexPageResponse,
   SpeciesDetailResponse,
   SpeciesListResponse,
} from "../interface/species";
import { KANTO_TOTAL, pokedexPageSize } from "../../../_poke/utils/enum";

/** API pública externa (sin auth): por eso no lleva `prepareHeaders`. */
export const species = createApi({
   reducerPath: "species",
   baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_POKEAPI_URL + "/pokemon" }),
   keepUnusedDataFor: 3600,
   endpoints: (builder) => ({
      speciesList: builder.query<SpeciesListResponse, void>({
         query: () => `?limit=${KANTO_TOTAL}`,
      }),
      speciesDetail: builder.query<SpeciesDetailResponse, string>({
         query: (name) => `/${name}`,
      }),
      // Paginación infinita: una sola entrada de caché que acumula páginas.
      pokedexPage: builder.query<PokedexPageResponse, number>({
         query: (offset) =>
            `?limit=${Math.min(pokedexPageSize, KANTO_TOTAL - offset)}&offset=${offset}`,
         transformResponse: (response: SpeciesListResponse, _meta, offset) => ({
            items: response.results,
            offset,
            hasMore: offset + pokedexPageSize < KANTO_TOTAL,
         }),
         serializeQueryArgs: ({ endpointName }) => endpointName,
         merge: (current, incoming) => {
            // offset 0 = primera página: reemplaza en vez de concatenar (evita duplicados)
            if (incoming.offset === 0) return incoming;
            current.items.push(...incoming.items);
            current.offset = incoming.offset;
            current.hasMore = incoming.hasMore;
         },
         forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      }),
   }),
});

export const { useSpeciesListQuery, useSpeciesDetailQuery, usePokedexPageQuery } = species;
