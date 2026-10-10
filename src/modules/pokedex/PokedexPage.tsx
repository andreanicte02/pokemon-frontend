import { Navigate, Route, Routes } from "react-router";
import PermissionGate from "../../routing/PermissionGate";
import { PokedexList } from "./pokedex-list/PokedexList";

const PokedexPage = () => (
   <Routes>
      <Route
         index
         element={
            <PermissionGate permission="pokedex_view">
               <PokedexList />
            </PermissionGate>
         }
      />
      <Route path="*" element={<Navigate to="/pokedex" replace />} />
   </Routes>
);

export default PokedexPage;
