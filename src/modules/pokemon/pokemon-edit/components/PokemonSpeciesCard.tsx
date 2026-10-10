import { Box, Paper, Typography } from "@mui/material";
import type { Pokemon } from "../../../../store/api/interface/pokemon";
import { SpeciesStats } from "../../../../_poke/components/SpeciesStats/SpeciesStats";
import { capitalize, getSpriteUrl } from "../../../../_poke/utils/function";

interface Props {
   pokemon: Pokemon;
}

export const PokemonSpeciesCard = ({ pokemon }: Props) => (
   <Paper elevation={0} sx={{ p: "1.5rem", borderRadius: "1.25rem" }}>
      <Box textAlign="center" mb="0.5rem">
         <Box
            component="img"
            src={getSpriteUrl(pokemon.pokedexId)}
            alt=""
            sx={{ width: "100%", maxWidth: "14rem" }}
         />
         <Typography fontSize="1.4rem" fontWeight="bold" color="primary.dark">
            {capitalize(pokemon.species)}{" "}
            <Box component="span" color="text.secondary" fontWeight="normal">
               #{String(pokemon.pokedexId).padStart(3, "0")}
            </Box>
         </Typography>
      </Box>
      <SpeciesStats name={pokemon.species} />
   </Paper>
);
