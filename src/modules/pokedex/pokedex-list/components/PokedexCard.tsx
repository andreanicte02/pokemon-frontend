import { Box, ButtonBase, Typography } from "@mui/material";
import type { SpeciesItem } from "../../../../store/api/interface/species";
import { capitalize, getPokedexIdFromUrl, getSpriteUrl } from "../../../../_poke/utils/function";

interface Props {
   species: SpeciesItem;
   onSelect: (name: string) => void;
}

export const PokedexCard = ({ species, onSelect }: Props) => {
   const pokedexId = getPokedexIdFromUrl(species.url);

   return (
      <ButtonBase
         onClick={() => onSelect(species.name)}
         sx={{
            flexDirection: "column",
            p: "1rem",
            borderRadius: "1.25rem",
            bgcolor: "common.white",
            transition: "transform 0.15s, box-shadow 0.15s",
            "&:hover": { transform: "translateY(-0.25rem)", boxShadow: 3 },
         }}
      >
         <Box component="img" src={getSpriteUrl(pokedexId)} alt="" loading="lazy" sx={{ width: "6rem", height: "6rem" }} />
         <Typography fontSize="0.8rem" color="text.secondary">
            #{String(pokedexId).padStart(3, "0")}
         </Typography>
         <Typography fontWeight="bold" color="primary.dark">
            {capitalize(species.name)}
         </Typography>
      </ButtonBase>
   );
};
