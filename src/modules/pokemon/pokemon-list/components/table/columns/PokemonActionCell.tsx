import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import type { Pokemon } from "../../../../../../store/api/interface/pokemon";
import { IndexPokemonModal, setIndexPokemonModal } from "../../../../../../store/slice/pokemonModalSlice";
import { Can } from "../../../../../../_poke/components/Can";
import { pokemonEditRoute } from "../../../../core/routes";

interface Props {
   pokemon: Pokemon;
}

export const PokemonActionCell = ({ pokemon }: Props) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   return (
      <Box display="flex" gap={0.5}>
         <Can requiredPermissions="pokemon_edit">
            {(isAllowed) =>
               isAllowed && (
                  <Tooltip title="Editar">
                     <IconButton color="primary" onClick={() => navigate(pokemonEditRoute(pokemon.id))}>
                        <EditIcon />
                     </IconButton>
                  </Tooltip>
               )
            }
         </Can>
         <Can requiredPermissions="pokemon_delete">
            {(isAllowed) =>
               isAllowed && (
                  <Tooltip title="Liberar">
                     <IconButton
                        color="error"
                        onClick={() =>
                           dispatch(setIndexPokemonModal({ index: IndexPokemonModal.delete, pokemon }))
                        }
                     >
                        <DeleteIcon />
                     </IconButton>
                  </Tooltip>
               )
            }
         </Can>
      </Box>
   );
};
