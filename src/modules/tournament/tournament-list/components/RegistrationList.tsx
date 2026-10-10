import { Box, Button, Chip, LinearProgress, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { useRegistrationListQuery } from "../../../../store/api/service/tournament";
import { setRegistrationCursor } from "../../../../store/slice/registrationFilterSlice";
import { ErrorAlert } from "../../../../_poke/components/ErrorAlert";
import { getRTKErrorMessage } from "../../../../_poke/utils/function";
import { CATEGORY_LABELS } from "../../core/_models";

export const RegistrationList = () => {
   const dispatch = useDispatch();
   const filter = useSelector((state: RootState) => state.registrationFilterSlice);
   const { data, isFetching, isError, error, refetch } = useRegistrationListQuery(filter, {
      refetchOnMountOrArgChange: true,
   });
   const items = data?.items ?? [];
   const lastId = items[items.length - 1]?.id;

   return (
      <>
         {isError && <ErrorAlert text={getRTKErrorMessage(error)} close={refetch} />}

         <Box display="flex" flexDirection="column" gap={1.5}>
            {items.map((registration) => (
               <Paper
                  key={registration.id}
                  elevation={0}
                  sx={{
                     p: "1rem 1.25rem",
                     borderRadius: "1rem",
                     display: "flex",
                     flexWrap: "wrap",
                     alignItems: "center",
                     gap: 1.5,
                  }}
               >
                  <Box flex={1} minWidth="12rem">
                     <Typography fontWeight="bold" color="primary.dark">
                        {registration.tournamentName}
                     </Typography>
                     <Typography fontSize="0.85rem" color="text.secondary">
                        {registration.nicknames.join(" · ")}
                     </Typography>
                  </Box>
                  <Chip
                     size="small"
                     label={CATEGORY_LABELS[registration.category]}
                     color={registration.category === "rookie" ? "warning" : "default"}
                  />
                  <Typography fontSize="0.8rem" color="text.secondary">
                     #{registration.id} · {registration.createdAt.slice(0, 10)}
                  </Typography>
               </Paper>
            ))}
         </Box>

         {isFetching && <LinearProgress sx={{ mt: "1.5rem" }} />}

         <Box textAlign="center" mt="1.5rem">
            {data &&
               (data.hasMore ? (
                  <Button
                     variant="outlined"
                     loading={isFetching}
                     // el cursor de la próxima página es el id de la última inscripción cargada
                     onClick={() => lastId && dispatch(setRegistrationCursor(lastId))}
                  >
                     Cargar más
                  </Button>
               ) : (
                  <Typography color="text.secondary">
                     {items.length
                        ? "Eso es todo: ya cargué todas las inscripciones."
                        : "Todavía no veo inscripciones. Cuando alguien se anote a un torneo, va a aparecer acá."}
                  </Typography>
               ))}
         </Box>
      </>
   );
};
