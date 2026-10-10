import { useEffect } from "react";
import { Button } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router";
import { useTournamentListQuery } from "../../../store/api/service/tournament";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { Can } from "../../../_poke/components/Can";
import { StatusMessageRenderer } from "../../../_poke/components/StatusMessage";
import { useStatusMessage } from "../../../_poke/context/StatusMessage";
import { RegistrationFilter } from "./components/RegistrationFilter";
import { RegistrationList } from "./components/RegistrationList";

export const TournamentList = () => {
   const navigate = useNavigate();
   const { warning } = useStatusMessage();
   const { data: tournaments = [], isSuccess } = useTournamentListQuery();

   // Caso VÁLIDO de useEffect([isSuccess]): la query se dispara al montar, no hay un handler
   // donde poner el feedback. (Si una mutation la dispara un click, el feedback va en el handler.)
   // `warning` viene del contexto de acciones: referencia estable, no re-dispara el efecto.
   // `keepCurrent`: si venís del wizard, el éxito de la inscripción no se pisa con este aviso.
   useEffect(() => {
      if (!isSuccess || tournaments.length === 0) return;
      const nextToClose = [...tournaments].sort((a, b) => a.closesAt.localeCompare(b.closesAt))[0];
      warning(`${nextToClose.name} cierra inscripciones el ${nextToClose.closesAt}.`, {
         title: "Inscripciones abiertas",
         keepCurrent: true,
      });
   }, [isSuccess, tournaments, warning]);

   return (
      <>
         <PageHeader title="Torneos" subtitle="Inscripciones de la temporada">
            <Can requiredPermissions="tournament_register">
               {(isAllowed) =>
                  isAllowed && (
                     <Button
                        variant="contained"
                        startIcon={<HowToRegIcon />}
                        onClick={() => navigate("inscripcion")}
                     >
                        Inscribirme
                     </Button>
                  )
               }
            </Can>
         </PageHeader>

         <StatusMessageRenderer />
         <RegistrationFilter tournaments={tournaments} />
         <RegistrationList />
      </>
   );
};
