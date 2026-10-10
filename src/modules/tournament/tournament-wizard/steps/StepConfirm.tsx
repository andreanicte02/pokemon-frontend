import { Box, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { usePokemonAllQuery } from "../../../../store/api/service/pokemon";
import { useTournamentListQuery } from "../../../../store/api/service/tournament";
import { getSpriteUrl } from "../../../../_poke/utils/function";
import { CATEGORY_LABELS, type IRegistrationForm } from "../../core/_models";

export const StepConfirm = () => {
   const { control } = useFormContext<IRegistrationForm>();
   const { data: team = [] } = usePokemonAllQuery();
   const { data: tournaments = [] } = useTournamentListQuery();
   const [tournamentId, category, pokemonIds] = useWatch({
      control,
      name: ["tournamentId", "category", "pokemonIds"],
   });
   const tournament = tournaments.find((item) => String(item.id) === tournamentId);
   const selected = team.filter((pokemon) => pokemonIds.includes(pokemon.id));

   return (
      <Box display="flex" flexDirection="column" gap={2}>
         <Box>
            <Typography fontSize="0.85rem" color="text.secondary">
               Torneo
            </Typography>
            <Typography fontWeight="bold" color="primary.dark">
               {tournament?.name} · {CATEGORY_LABELS[category]}
            </Typography>
         </Box>
         <Box>
            <Typography fontSize="0.85rem" color="text.secondary" mb="0.5rem">
               Equipo
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
               {selected.map((pokemon) => (
                  <Box key={pokemon.id} textAlign="center">
                     <Box component="img" src={getSpriteUrl(pokemon.pokedexId)} alt="" sx={{ width: "4.5rem", height: "4.5rem" }} />
                     <Typography fontWeight={600} color="primary.dark">
                        {pokemon.nickname}
                     </Typography>
                     <Typography fontSize="0.8rem" color="text.secondary">
                        Nv. {pokemon.level}
                     </Typography>
                  </Box>
               ))}
            </Box>
         </Box>
      </Box>
   );
};
