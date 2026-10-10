import { Dialog, DialogContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { IndexPokemonModal, setIndexPokemonModal } from "../../../../../../store/slice/pokemonModalSlice";
import { ModalTitle } from "../../../../../../_poke/components/ModalTitle";
import { PokemonCreateForm } from "./PokemonCreateForm";

const PokemonModalCreate = () => {
   const dispatch = useDispatch();
   const close = () => dispatch(setIndexPokemonModal({ index: IndexPokemonModal.none }));

   return (
      <Dialog open onClose={close} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: "1.25rem" } } }}>
         <ModalTitle title="Capturar Pokémon" />
         <DialogContent>
            <PokemonCreateForm close={close} />
         </DialogContent>
      </Dialog>
   );
};

export default PokemonModalCreate;
