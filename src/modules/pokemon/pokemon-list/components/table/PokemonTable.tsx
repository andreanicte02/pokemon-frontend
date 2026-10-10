import { Box, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import { usePokemonListQuery } from "../../../../../store/api/service/pokemon";
import { setPokemonPage } from "../../../../../store/slice/pokemonFilterSlice";
import DataTable from "../../../../../_poke/components/DataTable";
import { ErrorAlert } from "../../../../../_poke/components/ErrorAlert";
import { getRTKErrorMessage } from "../../../../../_poke/utils/function";
import { pageSize } from "../../../../../_poke/utils/enum";
import { pokemonColumns } from "./columns/_pokemonColumns";

export const PokemonTable = () => {
   const dispatch = useDispatch();
   const filter = useSelector((state: RootState) => state.pokemonFilterSlice);
   // Remonte = refresco: al volver de editar o crear, la lista se pide de nuevo.
   const { data, isFetching, isError, error, refetch } = usePokemonListQuery(filter, {
      refetchOnMountOrArgChange: true,
   });
   const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

   return (
      <>
         {isError && <ErrorAlert text={getRTKErrorMessage(error)} close={refetch} />}
         <DataTable
            columns={pokemonColumns}
            data={data?.items ?? []}
            isLoading={isFetching}
            getRowId={(row) => row.id}
            emptyMessage="No encontré Pokémon por acá. Si filtraste, probá con otro apodo, especie o tipo."
         />
         {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt="1.5rem">
               <Pagination
                  color="primary"
                  count={totalPages}
                  page={filter.page}
                  onChange={(_event, page) => dispatch(setPokemonPage(page))}
               />
            </Box>
         )}
      </>
   );
};
