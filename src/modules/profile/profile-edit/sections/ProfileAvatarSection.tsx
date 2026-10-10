import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import type { IProfileForm } from "../../core/_models";
import { getSpriteUrl } from "../../../../_poke/utils/function";

const AVATAR_OPTIONS = [25, 1, 4, 7, 133, 121, 94, 143];

export const ProfileAvatarSection = () => {
   const { control, setValue } = useFormContext<IProfileForm>();
   const avatarId = useWatch({ control, name: "avatarId" });

   return (
      <Box>
         <Typography fontWeight="bold" color="primary.dark" mb="0.75rem">
            Compañero
         </Typography>
         <Box display="flex" flexWrap="wrap" gap={1}>
            {AVATAR_OPTIONS.map((id) => (
               <ButtonBase
                  key={id}
                  aria-label={`Elegir avatar ${id}`}
                  // el avatar no es un input: sin shouldDirty el guard isDirty no se entera del cambio
                  onClick={() => setValue("avatarId", id, { shouldDirty: true })}
                  sx={{ borderRadius: "50%" }}
               >
                  <Avatar
                     src={getSpriteUrl(id)}
                     sx={{
                        width: "3.5rem",
                        height: "3.5rem",
                        bgcolor: "secondary.main",
                        border: "0.188rem solid",
                        borderColor: avatarId === id ? "primary.main" : "transparent",
                     }}
                  />
               </ButtonBase>
            ))}
         </Box>
      </Box>
   );
};
