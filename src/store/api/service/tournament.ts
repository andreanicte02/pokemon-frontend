import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
   Registration,
   RegistrationCreateRequest,
   RegistrationCreateResponse,
   RegistrationListRequest,
   RegistrationListResponse,
   TournamentListResponse,
} from "../interface/tournament";
import { getHeader } from "../../../_poke/utils/function";
import { registrationPageSize } from "../../../_poke/utils/enum";
import { resetRegistrationFilter } from "../../slice/registrationFilterSlice";

export const tournament = createApi({
   reducerPath: "tournament",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_URL + "/",
      prepareHeaders: (headers, { getState }) => getHeader(headers, getState),
   }),
   endpoints: (builder) => ({
      tournamentList: builder.query<TournamentListResponse, void>({
         query: () => "tournaments",
      }),
      // Paginación por CURSOR: "dame las siguientes después de la inscripción X".
      registrationList: builder.query<RegistrationListResponse, RegistrationListRequest>({
         query: ({ tournamentId, cursor }) => ({
            url: "registrations",
            params: {
               _sort: "id",
               _order: "desc",
               _limit: registrationPageSize,
               ...(cursor && { id_lte: cursor - 1 }), // json-server 0.17 no tiene `_lt`
               ...(tournamentId && { tournamentId }),
            },
         }),
         transformResponse: (items: Registration[], meta, { cursor }) => ({
            items,
            cursor,
            // X-Total-Count = cuántas quedan desde el cursor: si hay más que las recibidas, hay otra página
            hasMore: Number(meta?.response?.headers.get("X-Total-Count") ?? 0) > items.length,
         }),
         // Una entrada de caché por filtro (el cursor NO cuenta): las páginas se acumulan ahí.
         serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs.tournamentId}`,
         merge: (current, incoming) => {
            // cursor null = primera página: reemplaza (si concatenara, duplicaría filas al volver)
            if (incoming.cursor === null) return incoming;
            current.items.push(...incoming.items);
            current.cursor = incoming.cursor;
            current.hasMore = incoming.hasMore;
         },
         forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      }),
      // Alta desde el wizard: después se navega a la lista (remonte = refresco), así que sin tags.
      // El reset del filtro es para que la inscripción nueva quede a la vista.
      createRegistration: builder.mutation<RegistrationCreateResponse, RegistrationCreateRequest>({
         query: (body) => ({ url: "registrations", method: "POST", body }),
         async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
               await queryFulfilled;
               dispatch(resetRegistrationFilter());
            } catch {
               // el error lo muestra el wizard inline
            }
         },
      }),
   }),
});

export const { useTournamentListQuery, useRegistrationListQuery, useCreateRegistrationMutation } =
   tournament;
