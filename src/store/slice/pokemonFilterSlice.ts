import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PokemonFilterState {
   search: string;
   type: string;
   page: number;
}

const initialPokemonFilter: PokemonFilterState = {
   search: "",
   type: "",
   page: 1,
};

/**
 * Paginación numerada: el filtro (incluida la página) sobrevive al ida y vuelta
 * a la edición, así que NO hay cleanup al desmontar (ver skill /listado-con-filtros).
 */
export const pokemonFilterSlice = createSlice({
   name: "pokemonFilter",
   initialState: initialPokemonFilter,
   reducers: {
      setPokemonFilter: (state, action: PayloadAction<Pick<PokemonFilterState, "search" | "type">>) => {
         state.search = action.payload.search;
         state.type = action.payload.type;
         state.page = 1;
      },
      setPokemonPage: (state, action: PayloadAction<number>) => {
         state.page = action.payload;
      },
      resetPokemonFilter: () => initialPokemonFilter,
   },
});

export const { setPokemonFilter, setPokemonPage, resetPokemonFilter } = pokemonFilterSlice.actions;
export default pokemonFilterSlice.reducer;
