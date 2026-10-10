import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";
import { useDeletePokemonMutation } from "../../../../../../store/api/service/pokemon";
import { IndexPokemonModal, setIndexPokemonModal } from "../../../../../../store/slice/pokemonModalSlice";
import { ModalTitle } from "../../../../../../_poke/components/ModalTitle";
import { ErrorAlert } from "../../../../../../_poke/components/ErrorAlert";
import { useStatusMessage } from "../../../../../../_poke/context/StatusMessage";
import { getRTKErrorMessage, getSpriteUrl } from "../../../../../../_poke/utils/function";

/** Modal de pura confirmación: sin form, contenido inline en el Dialog. */
const PokemonModalDelete = () => {
   const dispatch = useDispatch();
   const { success } = useStatusMessage();
   const pokemon = useSelector((state: RootState) => state.pokemonModalSlice.pokemon);
   const [deletePokemon, deletePokemonStatus] = useDeletePokemonMutation();

   const close = () => dispatch(setIndexPokemonModal({ index: IndexPokemonModal.none }));

   const onConfirm = async () => {
      if (!pokemon) return;

      const result = await deletePokemon(pokemon.id);
      if (result.error) return;

      close();
      success(`${pokemon.nickname} volvió a la naturaleza.`, { title: "Pokémon liberado" });
   };

   return (
      <Dialog open onClose={close} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: "1.25rem" } } }}>
         <ModalTitle title="¿Liberar Pokémon?" subtitle={pokemon?.nickname} />
         <DialogContent>
            <Box textAlign="center">
               <Box component="img" src={getSpriteUrl(pokemon?.pokedexId ?? 0)} alt="" sx={{ width: "7rem", height: "7rem" }} />
               <Typography color="text.secondary">
                  Esta acción no se puede deshacer.
               </Typography>
            </Box>
            {deletePokemonStatus.isError && (
               <ErrorAlert
                  text={getRTKErrorMessage(deletePokemonStatus.error)}
                  close={deletePokemonStatus.reset}
               />
            )}
         </DialogContent>
         <DialogActions sx={{ p: "0 1.5rem 1.5rem", gap: 1 }}>
            <Button variant="text" onClick={close} sx={{ color: "text.secondary", flex: 1 }}>
               Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={onConfirm} loading={deletePokemonStatus.isLoading} sx={{ flex: 1 }}>
               Liberar
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default PokemonModalDelete;
