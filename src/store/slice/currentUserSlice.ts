import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "../api/interface/auth";
import { getUserLocalStorage } from "../../_poke/utils/function";

interface CurrentUserState {
   user: SessionUser;
}

export const initSessionUser = (): SessionUser => ({
   sessionId: "",
   username: "",
   name: "",
   rol: "",
   permissions: [],
});

const initialState: CurrentUserState = {
   user: getUserLocalStorage() ?? initSessionUser(),
};

export const currentUserSlice = createSlice({
   name: "currentUser",
   initialState,
   reducers: {
      saveSession: (state, action: PayloadAction<SessionUser>) => {
         state.user = action.payload;
      },
      /** Demo: fuerza un token que el backend rechaza con 401 → el middleware hace logout. */
      expireSession: (state) => {
         state.user.sessionId = "expired";
      },
   },
});

export const { saveSession, expireSession } = currentUserSlice.actions;
export default currentUserSlice.reducer;
