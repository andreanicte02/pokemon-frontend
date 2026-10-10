import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { useCredentialsMutation } from "../../../../store/api/service/auth";
import { ErrorAlert } from "../../../../_poke/components/ErrorAlert";
import { PasswordToggle } from "../../../../_poke/components/PasswordToggle";
import { usePasswordHook } from "../../../../_poke/hooks/usePasswordHook";
import { getRTKErrorMessage } from "../../../../_poke/utils/function";
import { loginSchema, type ILoginForm } from "../core/_models";
import { CredentialsBadge } from "./CredentialsBadge";

export const CardLogin = () => {
   const navigate = useNavigate();
   const [togglePassword, showPassword] = usePasswordHook();
   const [credentials, credentialsStatus] = useCredentialsMutation();
   const { control, handleSubmit, setValue } = useForm<ILoginForm>({
      resolver: yupResolver(loginSchema),
      defaultValues: { username: "", password: "" },
   });

   const onSubmit = async (values: ILoginForm) => {
      const result = await credentials(values);

      // sin unwrap() la mutation no lanza: el error ya lo muestra credentialsStatus
      if (!result.data) return;

      navigate("/", { replace: true }); // DefaultRedirect decide el aterrizaje
   };

   const fillCredentials = (username: string, password: string) => {
      setValue("username", username, { shouldValidate: true });
      setValue("password", password, { shouldValidate: true });
   };

   return (
      <Paper sx={{ width: "100%", maxWidth: "26rem", p: { xs: "1.5rem", sm: "2.5rem" }, borderRadius: "1.25rem" }}>
         <Box textAlign="center" mb="1.5rem">
            <Box
               component="img"
               src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
               alt=""
               sx={{ width: "6rem", height: "6rem" }}
            />
            <Typography fontSize="1.6rem" fontWeight="bold" color="primary.dark">
               Pokémon Admin
            </Typography>
            <Typography color="text.secondary">Iniciá sesión para gestionar tu equipo</Typography>
         </Box>

         <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate display="flex" flexDirection="column" gap={2}>
            {/* Controller (controlado): el badge hace setValue y el label tiene que enterarse */}
            <Controller
               name="username"
               control={control}
               render={({ field, fieldState }) => (
                  <TextField
                     fullWidth
                     {...field}
                     label="Usuario"
                     autoComplete="username"
                     error={!!fieldState.error}
                     helperText={fieldState.error?.message}
                  />
               )}
            />
            <Controller
               name="password"
               control={control}
               render={({ field, fieldState }) => (
                  <TextField
                     fullWidth
                     {...field}
                     label="Contraseña"
                     type={showPassword ? "text" : "password"}
                     autoComplete="current-password"
                     slotProps={{
                        input: {
                           endAdornment: <PasswordToggle show={showPassword} toggle={togglePassword} />,
                        },
                     }}
                     error={!!fieldState.error}
                     helperText={fieldState.error?.message}
                  />
               )}
            />

            {credentialsStatus.isError && (
               <ErrorAlert
                  text={getRTKErrorMessage(credentialsStatus.error)}
                  close={credentialsStatus.reset}
               />
            )}

            <Button type="submit" variant="contained" size="large" loading={credentialsStatus.isLoading}>
               Ingresar
            </Button>
         </Box>

         {/* Fuera del <form>: solo autocompleta, no envía */}
         <Box mt="1rem">
            <CredentialsBadge onSelect={fillCredentials} />
         </Box>
      </Paper>
   );
};
