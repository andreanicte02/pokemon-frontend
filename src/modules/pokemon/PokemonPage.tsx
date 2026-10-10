import { Navigate, Route, Routes } from "react-router";
import PermissionGate from "../../routing/PermissionGate";
import { StatusMessageProvider } from "../../_poke/context/StatusMessage";
import { PokemonList } from "./pokemon-list/PokemonList";
import { PokemonEdit } from "./pokemon-edit/PokemonEdit";
import { POKEMON_LIST_ROUTE } from "./core/routes";

const PokemonPage = () => (
   <Routes>
      <Route index element={<Navigate to={POKEMON_LIST_ROUTE} replace />} />
      <Route
         path="list"
         element={
            <PermissionGate permission="pokemon_view">
               <StatusMessageProvider>
                  <PokemonList />
               </StatusMessageProvider>
            </PermissionGate>
         }
      />
      <Route
         path="edit/:id"
         element={
            <PermissionGate permission="pokemon_edit">
               <PokemonEdit />
            </PermissionGate>
         }
      />
      <Route path="*" element={<Navigate to={POKEMON_LIST_ROUTE} replace />} />
   </Routes>
);

export default PokemonPage;
