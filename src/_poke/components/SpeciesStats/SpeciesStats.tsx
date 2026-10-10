import { Box, LinearProgress, Typography } from "@mui/material";
import { useSpeciesDetailQuery } from "../../../store/api/service/species";
import { ErrorAlert } from "../ErrorAlert";
import { getRTKErrorMessage } from "../../utils/function";
import { TypeChip } from "../TypeChip";

const STAT_LABELS: Record<string, string> = {
   hp: "PS",
   attack: "Ataque",
   defense: "Defensa",
   "special-attack": "At. Esp.",
   "special-defense": "Def. Esp.",
   speed: "Velocidad",
};

interface ISpeciesStats {
   name: string;
}

/** Tipos, medidas y stats base de una especie (PokeAPI). Lo usan la edición y la Pokédex. */
export const SpeciesStats = ({ name }: ISpeciesStats) => {
   const speciesDetail = useSpeciesDetailQuery(name);

   return (
      <>
         {speciesDetail.isLoading && <LinearProgress />}
         {speciesDetail.isError && (
            <ErrorAlert text={getRTKErrorMessage(speciesDetail.error)} />
         )}
         {speciesDetail.data && (
            <>
               <Box display="flex" gap={0.5} justifyContent="center" mb="0.75rem">
                  {speciesDetail.data.types.map((item) => (
                     <TypeChip key={item.type.name} type={item.type.name} />
                  ))}
               </Box>
               <Box display="flex" justifyContent="space-around" color="text.secondary" mb="1rem">
                  <span>Altura: {speciesDetail.data.height / 10} m</span>
                  <span>Peso: {speciesDetail.data.weight / 10} kg</span>
               </Box>
               {speciesDetail.data.stats.map((item) => (
                  <Box
                     key={item.stat.name}
                     display="grid"
                     gridTemplateColumns="5.5rem 2.5rem 1fr"
                     alignItems="center"
                     gap={1}
                     mb="0.5rem"
                  >
                     <Typography fontSize="0.85rem" color="text.secondary">
                        {STAT_LABELS[item.stat.name] ?? item.stat.name}
                     </Typography>
                     <Typography fontSize="0.85rem" fontWeight="bold" color="primary.dark">
                        {item.base_stat}
                     </Typography>
                     <LinearProgress
                        variant="determinate"
                        value={Math.min(item.base_stat / 1.6, 100)}
                        sx={{ height: "0.5rem", borderRadius: "1rem" }}
                     />
                  </Box>
               ))}
            </>
         )}
      </>
   );
};
