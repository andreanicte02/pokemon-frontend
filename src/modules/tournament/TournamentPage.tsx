import { Navigate, Route, Routes } from "react-router";
import PermissionGate from "../../routing/PermissionGate";
import { StatusMessageProvider } from "../../_poke/context/StatusMessage";
import { TournamentList } from "./tournament-list/TournamentList";
import { TournamentWizard } from "./tournament-wizard/TournamentWizard";
import { TOURNAMENT_ROUTE } from "./core/_models";

/**
 * Provider a nivel de MÓDULO (envuelve todas las rutas): el éxito del wizard se
 * muestra en la lista, así que el mensaje tiene que sobrevivir a la navegación.
 */
const TournamentPage = () => (
   <StatusMessageProvider>
      <Routes>
         <Route
            index
            element={
               <PermissionGate permission="tournament_view">
                  <TournamentList />
               </PermissionGate>
            }
         />
         <Route
            path="inscripcion"
            element={
               <PermissionGate permission="tournament_register">
                  <TournamentWizard />
               </PermissionGate>
            }
         />
         <Route path="*" element={<Navigate to={TOURNAMENT_ROUTE} replace />} />
      </Routes>
   </StatusMessageProvider>
);

export default TournamentPage;
