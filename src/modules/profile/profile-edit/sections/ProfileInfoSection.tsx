import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { IProfileForm } from "../../core/_models";
import { REGION_LABELS } from "../../../../_poke/utils/enum";

export const ProfileInfoSection = () => {
   const { control } = useFormContext<IProfileForm>();

   return (
      <Box>
         <Typography fontWeight="bold" color="primary.dark" mb="0.75rem">
            Información general
         </Typography>
         <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
            <Controller
               name="name"
               control={control}
               render={({ field, fieldState }) => (
                  <TextField
                     fullWidth
                     {...field}
                     label="Nombre"
                     error={!!fieldState.error}
                     helperText={fieldState.error?.message}
                     sx={{ gridColumn: { sm: "1 / -1" } }}
                  />
               )}
            />
            <Controller
               name="region"
               control={control}
               render={({ field, fieldState }) => (
                  <TextField
                     fullWidth
                     {...field}
                     select
                     label="Región"
                     error={!!fieldState.error}
                     helperText={fieldState.error?.message}
                  >
                     {Object.entries(REGION_LABELS).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                           {label}
                        </MenuItem>
                     ))}
                  </TextField>
               )}
            />
            <Controller
               name="hometown"
               control={control}
               render={({ field, fieldState }) => (
                  <TextField
                     fullWidth
                     {...field}
                     label="Pueblo natal"
                     error={!!fieldState.error}
                     helperText={fieldState.error?.message}
                  />
               )}
            />
         </Box>
      </Box>
   );
};
