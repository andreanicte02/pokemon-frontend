import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import MainLayout from "../_poke/layout/main-layout/MainLayout";
import type { RootState } from "../store/store";
import LazyPage from "./LazyPage";
import DefaultRedirect from "./DefaultRedirect";

const DashboardPage = lazy(() => import("../modules/dashboard/DashboardPage"));
const PokemonPage = lazy(() => import("../modules/pokemon/PokemonPage"));
const PokedexPage = lazy(() => import("../modules/pokedex/PokedexPage"));
const TournamentPage = lazy(() => import("../modules/tournament/TournamentPage"));
const ProfilePage = lazy(() => import("../modules/profile/ProfilePage"));

export const PrivateRoute = () => {
   const sessionId = useSelector((state: RootState) => state.currentUserSlice.user.sessionId);

   return (
      <>
         {sessionId ? (
            <Routes>
               <Route element={<MainLayout />}>
                  <Route
                     path="dashboard/*"
                     element={
                        <LazyPage>
                           <DashboardPage />
                        </LazyPage>
                     }
                  />
                  <Route
                     path="pokemon/*"
                     element={
                        <LazyPage>
                           <PokemonPage />
                        </LazyPage>
                     }
                  />
                  <Route
                     path="pokedex/*"
                     element={
                        <LazyPage>
                           <PokedexPage />
                        </LazyPage>
                     }
                  />
                  <Route
                     path="tournament/*"
                     element={
                        <LazyPage>
                           <TournamentPage />
                        </LazyPage>
                     }
                  />
                  <Route
                     path="profile/*"
                     element={
                        <LazyPage>
                           <ProfilePage />
                        </LazyPage>
                     }
                  />
                  <Route path="*" element={<DefaultRedirect />} />
               </Route>
            </Routes>
         ) : (
            <Navigate to="/auth" replace />
         )}
      </>
   );
};
