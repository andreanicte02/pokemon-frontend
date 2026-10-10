import { Box, Typography } from "@mui/material";
import type { DataTableColumn } from "../../../../../../_poke/components/DataTable/DataTable.types";
import type { Pokemon } from "../../../../../../store/api/interface/pokemon";
import { TypeChip } from "../../../../../../_poke/components/TypeChip";
import { capitalize, getSpriteUrl } from "../../../../../../_poke/utils/function";
import { PokemonActionCell } from "./PokemonActionCell";

export const pokemonColumns: ReadonlyArray<DataTableColumn<Pokemon>> = [
   {
      id: "species",
      label: "Pokémon",
      format: (row) => (
         <Box display="flex" alignItems="center" gap={1.5} minWidth="11rem">
            <Box
               component="img"
               src={getSpriteUrl(row.pokedexId)}
               alt=""
               loading="lazy"
               sx={{ width: "3rem", height: "3rem" }}
            />
            <Box>
               <Typography fontWeight="bold" color="primary.dark">
                  {capitalize(row.species)}
               </Typography>
               <Typography fontSize="0.8rem" color="text.secondary">
                  #{String(row.pokedexId).padStart(3, "0")}
               </Typography>
            </Box>
         </Box>
      ),
   },
   { id: "nickname", dataField: "nickname", label: "Apodo" },
   {
      id: "types",
      label: "Tipo",
      format: (row) => (
         <Box display="flex" gap={0.5} flexWrap="wrap">
            {row.types.map((type) => (
               <TypeChip key={type} type={type} />
            ))}
         </Box>
      ),
   },
   { id: "level", label: "Nivel", format: (row) => `Nv. ${row.level}` },
   { id: "actions", label: "Acciones", format: (row) => <PokemonActionCell pokemon={row} /> },
];
