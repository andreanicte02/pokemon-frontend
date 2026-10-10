import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
   Pokemon,
   PokemonAllResponse,
   PokemonCreateRequest,
   PokemonCreateResponse,
   PokemonDetailResponse,
   PokemonEditRequest,
   PokemonEditResponse,
   PokemonListRequest,
   PokemonListResponse,
} from "../interface/pokemon";
import { getHeader } from "../../../_poke/utils/function";
import { pageSize } from "../../../_poke/utils/enum";
import { resetPokemonFilter } from "../../slice/pokemonFilterSlice";

export const pokemon = createApi({
   reducerPath: "pokemon",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_URL + "/pokemon/",
      prepareHeaders: (headers, { getState }) => getHeader(headers, getState),
   }),
   tagTypes: ["PokemonList", "PokemonDetail"],
   endpoints: (builder) => ({
      pokemonList: builder.query<PokemonListResponse, PokemonListRequest>({
         query: ({ search, type, page }) => ({
            url: "",
            params: {
               _page: page,
               _limit: pageSize,
               _sort: "id",
               _order: "desc",
               ...(search && { q: search }),
               ...(type && { types_like: type }),
            },
         }),
         transformResponse: (items: Pokemon[], meta) => ({
            items,
            total: Number(meta?.response?.headers.get("X-Total-Count") ?? items.length),
         }),
         providesTags: ["PokemonList"],
      }),
      pokemonAll: builder.query<PokemonAllResponse, void>({
         query: () => ({ url: "", params: { _sort: "level", _order: "desc" } }),
         providesTags: ["PokemonList"],
      }),
      pokemonDetail: builder.query<PokemonDetailResponse, number>({
         query: (id) => `${id}`,
         providesTags: ["PokemonDetail"],
      }),
      // Alta desde un modal: la tabla sigue montada (no hay remonte) → se invalida la lista.
      // Además se resetea el filtro para que el alta quede a la vista en la página 1.
      createPokemon: builder.mutation<PokemonCreateResponse, PokemonCreateRequest>({
         query: (body) => ({ url: "", method: "POST", body }),
         invalidatesTags: ["PokemonList"],
         async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
               await queryFulfilled;
               dispatch(resetPokemonFilter());
            } catch {
               // el error lo muestra el modal inline
            }
         },
      }),
      // Edición: invalida solo el detalle (el form sigue montado y vuelve a pristine solo).
      editPokemon: builder.mutation<PokemonEditResponse, PokemonEditRequest>({
         query: ({ id, ...body }) => ({ url: `${id}`, method: "PATCH", body }),
         invalidatesTags: ["PokemonDetail"],
      }),
      // Baja: la tabla está montada y la paginación es numerada → invalidar la lista es seguro.
      deletePokemon: builder.mutation<void, number>({
         query: (id) => ({ url: `${id}`, method: "DELETE" }),
         invalidatesTags: ["PokemonList"],
      }),
   }),
});

export const {
   usePokemonListQuery,
   usePokemonAllQuery,
   usePokemonDetailQuery,
   useCreatePokemonMutation,
   useEditPokemonMutation,
   useDeletePokemonMutation,
} = pokemon;
