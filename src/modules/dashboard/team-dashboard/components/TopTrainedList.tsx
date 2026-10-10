import { Box, Paper, Typography } from "@mui/material";
import type { Pokemon } from "../../../../store/api/interface/pokemon";
import { capitalize, getSpriteUrl } from "../../../../_poke/utils/function";

interface Props {
   pokemon: Pokemon[];
}

export const TopTrainedList = ({ pokemon }: Props) => (
   <Paper elevation={0} sx={{ p: "1.5rem", borderRadius: "1.25rem" }}>
      <Typography fontWeight="bold" color="primary.dark" mb="1rem">
         Más entrenados
      </Typography>
      {pokemon.map((item, index) => (
         <Box key={item.id} display="flex" alignItems="center" gap={1.5} mb="0.75rem">
            <Typography fontWeight="bold" color="primary.main" width="1.5rem">
               {index + 1}
            </Typography>
            <Box component="img" src={getSpriteUrl(item.pokedexId)} alt="" sx={{ width: "2.75rem", height: "2.75rem" }} />
            <Box flex={1} minWidth={0}>
               <Typography fontWeight={600} color="primary.dark" noWrap>
                  {item.nickname}
               </Typography>
               <Typography fontSize="0.8rem" color="text.secondary">
                  {capitalize(item.species)}
               </Typography>
            </Box>
            <Typography fontWeight="bold" color="primary.dark">
               Nv. {item.level}
            </Typography>
         </Box>
      ))}
   </Paper>
);
