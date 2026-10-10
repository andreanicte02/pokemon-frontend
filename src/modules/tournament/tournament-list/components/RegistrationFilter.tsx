import { useEffect } from "react";
import { MenuItem, Paper, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import type { Tournament } from "../../../../store/api/interface/tournament";
import {
   clearRegistrationCursor,
   setRegistrationTournament,
} from "../../../../store/slice/registrationFilterSlice";

interface Props {
   tournaments: Tournament[];
}

export const RegistrationFilter = ({ tournaments }: Props) => {
   const dispatch = useDispatch();
   const tournamentId = useSelector((state: RootState) => state.registrationFilterSlice.tournamentId);

   // Al salir se suelta SOLO el cursor: el filtro sobrevive y al volver la lista arranca desde
   // la primera página (sin cursor viejo, el remonte no pide "la última página" suelta).
   useEffect(
      () => () => {
         dispatch(clearRegistrationCursor());
      },
      [dispatch],
   );

   return (
      <Paper elevation={0} sx={{ p: "1rem", mb: "1.5rem", borderRadius: "1.25rem" }}>
         <TextField
            fullWidth
            select
            label="Torneo"
            value={tournamentId}
            onChange={(event) => dispatch(setRegistrationTournament(event.target.value))}
            sx={{ maxWidth: { sm: "22rem" } }}
         >
            <MenuItem value="">Todos</MenuItem>
            {tournaments.map((item) => (
               <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
               </MenuItem>
            ))}
         </TextField>
      </Paper>
   );
};
