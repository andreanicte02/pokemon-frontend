import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PokedexState {
   /** Offset de la última página pedida. Vive en el store: al volver a la Pokédex se conserva lo cargado. */
   offset: number;
}

const initialState: PokedexState = { offset: 0 };

export const pokedexSlice = createSlice({
   name: "pokedex",
   initialState,
   reducers: {
      setPokedexOffset: (state, action: PayloadAction<number>) => {
         state.offset = action.payload;
      },
   },
});

export const { setPokedexOffset } = pokedexSlice.actions;
export default pokedexSlice.reducer;
