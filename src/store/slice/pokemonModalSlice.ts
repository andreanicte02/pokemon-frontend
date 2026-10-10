import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Pokemon } from "../api/interface/pokemon";

export enum IndexPokemonModal {
   none,
   create,
   delete,
}

interface PokemonModalState {
   indexPokemonModal: IndexPokemonModal;
   pokemon: Pokemon | null;
}

const initialState: PokemonModalState = {
   indexPokemonModal: IndexPokemonModal.none,
   pokemon: null,
};

export const pokemonModalSlice = createSlice({
   name: "pokemonModal",
   initialState,
   reducers: {
      setIndexPokemonModal: (
         state,
         action: PayloadAction<{ index: IndexPokemonModal; pokemon?: Pokemon }>,
      ) => {
         state.indexPokemonModal = action.payload.index;
         state.pokemon = action.payload.pokemon ?? null;
      },
   },
});

export const { setIndexPokemonModal } = pokemonModalSlice.actions;
export default pokemonModalSlice.reducer;
