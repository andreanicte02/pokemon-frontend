import { Box, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { IProfileForm } from "../../core/_models";

export const ProfileGymSection = () => {
   const { control } = useFormContext<IProfileForm>();
   // Misma condición que el `yup.when("isGymLeader")` del schema: render y validación sincronizados.
   const isGymLeader = useWatch({ control, name: "isGymLeader" });

   return (
      <Box>
         <Typography fontWeight="bold" color="primary.dark" mb="0.5rem">
            Gimnasio
         </Typography>
         <Controller
            name="isGymLeader"
            control={control}
            render={({ field }) => (
               <FormControlLabel
                  label="Soy líder de gimnasio"
                  control={<Switch checked={field.value} onChange={(_event, checked) => field.onChange(checked)} />}
               />
            )}
         />
         {isGymLeader && (
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2} mt="0.75rem">
               <Controller
                  name="gymName"
                  control={control}
                  render={({ field, fieldState }) => (
                     <TextField
                        fullWidth
                        {...field}
                        label="Nombre del gimnasio"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                     />
                  )}
               />
               <Controller
                  name="badgeName"
                  control={control}
                  render={({ field, fieldState }) => (
                     <TextField
                        fullWidth
                        {...field}
                        label="Medalla que entregás"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                     />
                  )}
               />
            </Box>
         )}
      </Box>
   );
};
