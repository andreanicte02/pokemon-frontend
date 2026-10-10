import { Alert, Box, Button, Divider, Paper } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useEditProfileMutation } from "../../../store/api/service/profile";
import { usePermissionsHook } from "../../../_poke/hooks/usePermissionsHook";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { StatusMessage } from "../../../_poke/components/StatusMessage";
import { getRTKErrorMessage } from "../../../_poke/utils/function";
import type { IProfileForm } from "../core/_models";
import { ProfileAvatarSection } from "./sections/ProfileAvatarSection";
import { ProfileInfoSection } from "./sections/ProfileInfoSection";
import { ProfileGymSection } from "./sections/ProfileGymSection";

interface Props {
   username: string;
   isFetching: boolean;
}

export const ProfileEditFormSections = ({ username, isFetching }: Props) => {
   const permission = usePermissionsHook();
   const canEdit = permission.isAllowed("profile_edit");
   const { handleSubmit, formState } = useFormContext<IProfileForm>();
   const [editProfile, editProfileStatus] = useEditProfileMutation();

   const onSubmit = async (values: IProfileForm) => {
      if (!formState.isDirty || isFetching) return;

      await editProfile({ id: username, ...values });
      // éxito/error inline leyendo editProfileStatus; el refetch del detalle devuelve el form a pristine
   };

   return (
      <Paper
         component="form"
         onSubmit={handleSubmit(onSubmit)}
         noValidate
         elevation={0}
         sx={{ p: "1.5rem", borderRadius: "1.25rem" }}
      >
         {!canEdit && (
            <Alert severity="info" sx={{ mb: "1.5rem" }}>
               Solo lectura: tu usuario no tiene permiso para editar el perfil.
            </Alert>
         )}
         <Box component="fieldset" disabled={!canEdit} sx={{ border: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <ProfileAvatarSection />
            <Divider />
            <ProfileInfoSection />
            <Divider />
            <ProfileGymSection />
         </Box>

         {editProfileStatus.isSuccess && (
            <StatusMessage
               title="Perfil actualizado"
               description="Tus datos de entrenador se guardaron."
               close={editProfileStatus.reset}
            />
         )}
         {editProfileStatus.isError && (
            <ErrorAlert
               text={getRTKErrorMessage(editProfileStatus.error)}
               close={editProfileStatus.reset}
            />
         )}

         {/* aviso + botón dentro de la MISMA condición: sin permiso no hay nada que guardar */}
         {canEdit && (
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1} mt="1.5rem">
               {!formState.isDirty && (
                  <Box component="span" sx={{ color: "text.secondary" }}>
                     No hay cambios por guardar
                  </Box>
               )}
               <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={editProfileStatus.isLoading || isFetching}
               >
                  Guardar
               </Button>
            </Box>
         )}
      </Paper>
   );
};
