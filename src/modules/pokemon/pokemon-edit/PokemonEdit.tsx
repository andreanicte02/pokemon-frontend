import { Box, Button, LinearProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import { usePokemonDetailQuery } from "../../../store/api/service/pokemon";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { capitalize, getRTKErrorMessage } from "../../../_poke/utils/function";
import { POKEMON_LIST_ROUTE } from "../core/routes";
import { PokemonSpeciesCard } from "./components/PokemonSpeciesCard";
import { PokemonEditForm } from "./components/PokemonEditForm";

export const PokemonEdit = () => {
   const navigate = useNavigate();
   const id = Number(useParams().id);
   // Detalle por query + tag: la edición lo invalida y el form vuelve a pristine solo.
   const pokemonDetail = usePokemonDetailQuery(id, { refetchOnMountOrArgChange: true, skip: !id });

   return (
      <>
         <PageHeader
            title={pokemonDetail.data ? `Editar a ${pokemonDetail.data.nickname}` : "Editar Pokémon"}
            subtitle={pokemonDetail.data && capitalize(pokemonDetail.data.species)}
         >
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(POKEMON_LIST_ROUTE)}>
               Volver al equipo
            </Button>
         </PageHeader>

         {pokemonDetail.isLoading && <LinearProgress />}
         {pokemonDetail.isError && (
            <ErrorAlert text={getRTKErrorMessage(pokemonDetail.error)} />
         )}

         {pokemonDetail.data && (
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1.4fr" }} gap={3} alignItems="start">
               <PokemonSpeciesCard pokemon={pokemonDetail.data} />
               <PokemonEditForm pokemon={pokemonDetail.data} isFetching={pokemonDetail.isFetching} />
            </Box>
         )}
      </>
   );
};
