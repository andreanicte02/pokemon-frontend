import { createSlice } from "@reduxjs/toolkit";

interface DrawerState {
   /** Solo aplica en mobile (drawer temporal). En desktop el sidebar es permanente. */
   mobileOpen: boolean;
}

const initialState: DrawerState = { mobileOpen: false };

export const drawerSlice = createSlice({
   name: "drawer",
   initialState,
   reducers: {
      toggleDrawer: (state) => {
         state.mobileOpen = !state.mobileOpen;
      },
      closeDrawer: (state) => {
         state.mobileOpen = false;
      },
   },
});

export const { toggleDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
