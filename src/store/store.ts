import { combineReducers, configureStore, type UnknownAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// slices
import drawerReducer from "./slice/drawerSlice";
import currentUserReducer from "./slice/currentUserSlice";
import pokemonFilterReducer from "./slice/pokemonFilterSlice";
import pokemonModalReducer from "./slice/pokemonModalSlice";
import pokedexReducer from "./slice/pokedexSlice";
import registrationFilterReducer from "./slice/registrationFilterSlice";

// APIs (RTK Query)
import { auth } from "./api/service/auth";
import { pokemon } from "./api/service/pokemon";
import { profile } from "./api/service/profile";
import { species } from "./api/service/species";
import { tournament } from "./api/service/tournament";

// middleware
import { rtkQueryErrorLogger } from "./middleware/rtkQueryErrorLogger";
import { KeyLocalStorage } from "../_poke/utils/enum";

// 1. Todos los reducers combinados
const appReducer = combineReducers({
   // APIs
   [auth.reducerPath]: auth.reducer,
   [pokemon.reducerPath]: pokemon.reducer,
   [profile.reducerPath]: profile.reducer,
   [species.reducerPath]: species.reducer,
   [tournament.reducerPath]: tournament.reducer,
   // slices
   drawerSlice: drawerReducer,
   currentUserSlice: currentUserReducer,
   pokemonFilterSlice: pokemonFilterReducer,
   pokemonModalSlice: pokemonModalReducer,
   pokedexSlice: pokedexReducer,
   registrationFilterSlice: registrationFilterReducer,
});

// 2. Root reducer con reset global en logout
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
   if (action.type === "auth/logout") {
      state = undefined;
      localStorage.removeItem(KeyLocalStorage.USER);
      localStorage.removeItem(KeyLocalStorage.TIMEOUT);
      window.location.replace("/auth");
   }
   return appReducer(state, action);
};

// 3. Store — rtkQueryErrorLogger va AL FINAL para capturar los 401
export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
         .concat(auth.middleware)
         .concat(pokemon.middleware)
         .concat(profile.middleware)
         .concat(species.middleware)
         .concat(tournament.middleware)
         .concat(rtkQueryErrorLogger),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
