import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RegistrationFilterState {
   tournamentId: string;
   cursor: number | null;
}

const initialRegistrationFilter: RegistrationFilterState = {
   tournamentId: "",
   cursor: null,
};

/**
 * Paginación por cursor: al salir de la pantalla se suelta SOLO el cursor
 * (`clearRegistrationCursor`), el filtro se conserva. El cursor es relativo
 * ("después de X"): sin las páginas previas dejaría un hueco.
 */
export const registrationFilterSlice = createSlice({
   name: "registrationFilter",
   initialState: initialRegistrationFilter,
   reducers: {
      setRegistrationTournament: (state, action: PayloadAction<string>) => {
         state.tournamentId = action.payload;
         state.cursor = null;
      },
      setRegistrationCursor: (state, action: PayloadAction<number>) => {
         state.cursor = action.payload;
      },
      clearRegistrationCursor: (state) => {
         state.cursor = null;
      },
      resetRegistrationFilter: () => initialRegistrationFilter,
   },
});

export const {
   setRegistrationTournament,
   setRegistrationCursor,
   clearRegistrationCursor,
   resetRegistrationFilter,
} = registrationFilterSlice.actions;
export default registrationFilterSlice.reducer;
