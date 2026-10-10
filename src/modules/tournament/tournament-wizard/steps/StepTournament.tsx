import { Box, FormControlLabel, MenuItem, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTournamentListQuery } from "../../../../store/api/service/tournament";
import type { RegistrationCategory } from "../../../../store/api/interface/tournament";
import { CATEGORY_LABELS, type IRegistrationForm } from "../../core/_models";

export const StepTournament = () => {
   const { control, resetField } = useFormContext<IRegistrationForm>();
   const { data: tournaments = [] } = useTournamentListQuery();

   return (
      <Box display="flex" flexDirection="column" gap={2.5}>
         <Controller
            name="tournamentId"
            control={control}
            render={({ field, fieldState }) => (
               <TextField
                  fullWidth
                  {...field}
                  select
                  label="Torneo"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
               >
                  {tournaments.map((item) => (
                     <MenuItem key={item.id} value={String(item.id)}>
                        {item.name} · cierra {item.closesAt} · novato hasta Nv. {item.levelCap}
                     </MenuItem>
                  ))}
               </TextField>
            )}
         />
         <Box>
            <Typography fontWeight="bold" color="primary.dark" mb="0.25rem">
               Categoría
            </Typography>
            <Controller
               name="category"
               control={control}
               render={({ field }) => (
                  <RadioGroup
                     value={field.value}
                     onChange={(_event, value) => {
                        field.onChange(value as RegistrationCategory);
                        // reset PARCIAL legítimo: el equipo elegido puede no valer para la nueva categoría
                        resetField("pokemonIds");
                     }}
                  >
                     {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                     ))}
                  </RadioGroup>
               )}
            />
         </Box>
      </Box>
   );
};
