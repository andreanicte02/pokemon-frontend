import { useState } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { usePokedexPageQuery } from "../../../store/api/service/species";
import { setPokedexOffset } from "../../../store/slice/pokedexSlice";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { getRTKErrorMessage } from "../../../_poke/utils/function";
import { KANTO_TOTAL } from "../../../_poke/utils/enum";
import { PokedexCard } from "./components/PokedexCard";
import { PokedexDetailModal } from "./components/PokedexDetailModal";

export const PokedexList = () => {
   const dispatch = useDispatch();
   const offset = useSelector((state: RootState) => state.pokedexSlice.offset);
   const { data, isFetching, isError, error, refetch } = usePokedexPageQuery(offset);
   const [selectedName, setSelectedName] = useState<string | null>(null);
   const loaded = data?.items.length ?? 0;

   return (
      <>
         <PageHeader title="Pokédex" subtitle={`Kanto · ${loaded} de ${KANTO_TOTAL} especies (PokeAPI)`} />

         {isError && <ErrorAlert text={getRTKErrorMessage(error)} close={refetch} />}

         <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(9rem, 1fr))" gap={2}>
            {data?.items.map((species) => (
               <PokedexCard key={species.name} species={species} onSelect={setSelectedName} />
            ))}
         </Box>

         {isFetching && <LinearProgress sx={{ mt: "1.5rem" }} />}

         <Box textAlign="center" mt="2rem">
            {data && (data.hasMore ? (
               <Button
                  variant="contained"
                  loading={isFetching}
                  // la próxima página arranca donde termina lo cargado
                  onClick={() => dispatch(setPokedexOffset(loaded))}
               >
                  Cargar más
               </Button>
            ) : (
               <Typography color="text.secondary">¡Atrapaste a todos los de Kanto!</Typography>
            ))}
         </Box>

         {selectedName && (
            <PokedexDetailModal name={selectedName} close={() => setSelectedName(null)} />
         )}
      </>
   );
};
