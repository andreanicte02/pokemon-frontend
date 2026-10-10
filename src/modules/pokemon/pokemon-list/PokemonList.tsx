import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { IndexPokemonModal, setIndexPokemonModal } from "../../../store/slice/pokemonModalSlice";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { Can } from "../../../_poke/components/Can";
import { StatusMessageRenderer } from "../../../_poke/components/StatusMessage";
import { PokemonFilter } from "./components/filter/PokemonFilter";
import { PokemonTable } from "./components/table/PokemonTable";
import PokemonModalCreate from "./components/modal/pokemon-modal-create/PokemonModalCreate";
import PokemonModalDelete from "./components/modal/pokemon-modal-delete/PokemonModalDelete";

export const PokemonList = () => {
   const dispatch = useDispatch();
   const indexModal = useSelector(
      (state: RootState) => state.pokemonModalSlice.indexPokemonModal,
   );

   return (
      <>
         <PageHeader title="Mi equipo Pokémon" subtitle="Capturá, entrená y liberá a tus Pokémon">
            <Can requiredPermissions="pokemon_create">
               {(isAllowed) =>
                  isAllowed && (
                     <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                           dispatch(setIndexPokemonModal({ index: IndexPokemonModal.create }))
                        }
                     >
                        Capturar Pokémon
                     </Button>
                  )
               }
            </Can>
         </PageHeader>

         <StatusMessageRenderer />
         <PokemonFilter />
         <PokemonTable />

         {/* Render condicional: el form de cada modal se monta limpio al abrir (sin reset()) */}
         {indexModal === IndexPokemonModal.create && <PokemonModalCreate />}
         {indexModal === IndexPokemonModal.delete && <PokemonModalDelete />}
      </>
   );
};
