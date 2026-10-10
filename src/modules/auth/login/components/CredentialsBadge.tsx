import { Alert, AlertTitle, Box, Button, Typography } from "@mui/material";
import { DEMO_USERS } from "../../../../store/api/service/auth";

interface Props {
   onSelect: (username: string, password: string) => void;
}

/** Credenciales quemadas de la demo en un `<Alert>` de MUI. "Usar" = autocompletar el login. */
export const CredentialsBadge = ({ onSelect }: Props) => (
   <Alert severity="info">
      <AlertTitle>Credenciales de prueba</AlertTitle>
      <Box display="flex" flexDirection="column" gap={1}>
         {DEMO_USERS.map((user) => (
            <Box key={user.username} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
               <Box>
                  <Typography fontFamily="monospace">
                     {user.username} / {user.password}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     {user.description}
                  </Typography>
               </Box>
               <Button size="small" variant="outlined" onClick={() => onSelect(user.username, user.password)}>
                  Usar
               </Button>
            </Box>
         ))}
      </Box>
   </Alert>
);
