import { Autocomplete, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreatePokemonMutation } from "../../../../../../store/api/service/pokemon";
import {
   useSpeciesDetailQuery,
   useSpeciesListQuery,
} from "../../../../../../store/api/service/species";
import { ErrorAlert } from "../../../../../../_poke/components/ErrorAlert";
import { useStatusMessage } from "../../../../../../_poke/context/StatusMessage";
import { TypeChip } from "../../../../../../_poke/components/TypeChip";
import {
   capitalize,
   getPokedexIdFromUrl,
   getRTKErrorMessage,
   getSpriteUrl,
} from "../../../../../../_poke/utils/function";
import { ErrorApis } from "../../../../../../_poke/utils/enum";
import { pokemonCreateSchema, type IPokemonCreateForm } from "../../../../core/_models";

interface Props {
   close: () => void;
}

export const PokemonCreateForm = ({ close }: Props) => {
   const { success } = useStatusMessage();
   const [createPokemon, createPokemonStatus] = useCreatePokemonMutation();
   const speciesList = useSpeciesListQuery();
   const { register, control, handleSubmit, formState } = useForm<IPokemonCreateForm>({
      resolver: yupResolver(pokemonCreateSchema),
      defaultValues: { species: "", nickname: "", level: 5, notes: "" },
   });
   const species = useWatch({ control, name: "species" });
   const speciesDetail = useSpeciesDetailQuery(species, { skip: !species });
   const speciesOptions = speciesList.data?.results.map((item) => item.name) ?? [];

   const onSubmit = async (values: IPokemonCreateForm) => {
      // los tipos y el número salen de la PokeAPI: sin el detalle cargado no se puede crear
      if (!speciesDetail.data) return;

      const result = await createPokemon({
         ...values,
         pokedexId: speciesDetail.data.id,
         types: speciesDetail.data.types.map((item) => item.type.name),
      });

      // sin unwrap() la mutation no lanza: el error ya lo muestra createPokemonStatus
      if (!result.data) return;

      close();
      success(`${result.data.nickname} se unió a tu equipo.`, { title: "¡Pokémon capturado!" });
   };

   return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate display="flex" flexDirection="column" gap={2} pt="0.5rem">
         <Controller
            name="species"
            control={control}
            render={({ field, fieldState }) => (
               <Autocomplete
                  options={speciesOptions}
                  loading={speciesList.isLoading}
                  value={field.value || null}
                  onChange={(_event, value) => field.onChange(value ?? "")}
                  getOptionLabel={capitalize}
                  renderOption={({ key, ...props }, option) => {
                     const url = speciesList.data?.results.find((item) => item.name === option)?.url ?? "";
                     return (
                        <Box component="li" key={key} {...props} sx={{ display: "flex", gap: 1 }}>
                           <Box component="span" color="text.secondary" fontFamily="monospace">
                              #{String(getPokedexIdFromUrl(url)).padStart(3, "0")}
                           </Box>
                           {capitalize(option)}
                        </Box>
                     );
                  }}
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        label="Especie (Kanto, 151)"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                     />
                  )}
               />
            )}
         />

         {speciesList.isError && (
            <ErrorAlert text={ErrorApis.PokeApi} close={speciesList.refetch} />
         )}

         {species && (
            <Box display="flex" alignItems="center" gap={2} p="0.75rem" borderRadius="0.75rem" bgcolor="secondary.main">
               {speciesDetail.isFetching ? (
                  <CircularProgress size="2rem" />
               ) : (
                  <>
                     <Box component="img" src={getSpriteUrl(speciesDetail.data?.id ?? 0)} alt="" sx={{ width: "4.5rem", height: "4.5rem" }} />
                     <Box>
                        <Typography fontWeight="bold" color="primary.dark">
                           {capitalize(species)}
                        </Typography>
                        <Box display="flex" gap={0.5} mt="0.25rem">
                           {speciesDetail.data?.types.map((item) => (
                              <TypeChip key={item.type.name} type={item.type.name} />
                           ))}
                        </Box>
                     </Box>
                  </>
               )}
            </Box>
         )}

         <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }} gap={2}>
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
         </Box>
         <TextField
            fullWidth
            label="Notas (opcional)"
            multiline
            minRows={2}
            error={!!formState.errors.notes}
            helperText={formState.errors.notes?.message}
            {...register("notes")}
         />

         {createPokemonStatus.isError && (
            <ErrorAlert
               text={getRTKErrorMessage(createPokemonStatus.error)}
               close={createPokemonStatus.reset}
            />
         )}

         <Box display="flex" gap={1} justifyContent="flex-end">
            <Button type="button" variant="text" onClick={close} sx={{ color: "text.secondary" }}>
               Cancelar
            </Button>
            <Button
               type="submit"
               variant="contained"
               loading={createPokemonStatus.isLoading || speciesDetail.isFetching}
            >
               Capturar
            </Button>
         </Box>
      </Box>
   );
};
