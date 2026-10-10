import { Box, Button, Paper, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import type { Pokemon } from "../../../../store/api/interface/pokemon";
import { useEditPokemonMutation } from "../../../../store/api/service/pokemon";
import { ErrorAlert } from "../../../../_poke/components/ErrorAlert";
import { StatusMessage } from "../../../../_poke/components/StatusMessage";
import { getRTKErrorMessage } from "../../../../_poke/utils/function";
import { pokemonEditSchema, type IPokemonEditForm } from "../../core/_models";
import { POKEMON_LIST_ROUTE } from "../../core/routes";

interface Props {
   pokemon: Pokemon;
   isFetching: boolean;
}

/**
 * Estándar de edición (README → "Mapa de prácticas" y skill /form-edicion):
 * A) guard isDirty + aviso inline + botón habilitado · B) se queda en pantalla con éxito inline
 * C) `values` desde la query: tras invalidar el tag, el form vuelve a pristine sin reset().
 */
export const PokemonEditForm = ({ pokemon, isFetching }: Props) => {
   const navigate = useNavigate();
   const [editPokemon, editPokemonStatus] = useEditPokemonMutation();
   const { register, handleSubmit, formState } = useForm<IPokemonEditForm>({
      resolver: yupResolver(pokemonEditSchema),
      values: { nickname: pokemon.nickname, level: pokemon.level, notes: pokemon.notes ?? "" },
   });

   const onSubmit = async (values: IPokemonEditForm) => {
      if (!formState.isDirty || isFetching) return;

      await editPokemon({ id: pokemon.id, ...values });
      // el éxito y el error los pintan los alerts inline leyendo editPokemonStatus
   };

   return (
      <Paper
         component="form"
         onSubmit={handleSubmit(onSubmit)}
         noValidate
         elevation={0}
         sx={{ p: "1.5rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: 2 }}
      >
         <TextField
            fullWidth
            label="Apodo"
            error={!!formState.errors.nickname}
            helperText={formState.errors.nickname?.message}
            {...register("nickname")}
         />
         <TextField
            fullWidth
            label="Nivel"
            type="number"
            slotProps={{ htmlInput: { min: 1, max: 100 } }}
            error={!!formState.errors.level}
            helperText={formState.errors.level?.message}
            {...register("level", { valueAsNumber: true })}
         />
         <TextField
            fullWidth
            label="Notas"
            multiline
            minRows={3}
            error={!!formState.errors.notes}
            helperText={formState.errors.notes?.message}
            {...register("notes")}
         />

         {editPokemonStatus.isSuccess && (
            <StatusMessage
               title="Cambios guardados"
               description={`${editPokemonStatus.data.nickname} fue actualizado.`}
               close={editPokemonStatus.reset}
            />
         )}
         {editPokemonStatus.isError && (
            <ErrorAlert
               text={getRTKErrorMessage(editPokemonStatus.error)}
               close={editPokemonStatus.reset}
            />
         )}

         <Box textAlign="right">
            {!formState.isDirty && (
               <Box component="span" sx={{ color: "text.secondary" }}>
                  No hay cambios por guardar
               </Box>
            )}
         </Box>
         <Button
            type="submit"
            variant="contained"
            size="large"
            loading={editPokemonStatus.isLoading || isFetching}
         >
            Guardar
         </Button>
         <Button
            type="button"
            variant="text"
            onClick={() => navigate(POKEMON_LIST_ROUTE)}
            sx={{ width: "100%", color: "text.secondary" }}
         >
            Regresar
         </Button>
      </Paper>
   );
};
