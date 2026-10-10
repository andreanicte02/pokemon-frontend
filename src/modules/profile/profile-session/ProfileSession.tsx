import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useProfileDetailQuery } from "../../../store/api/service/profile";
import { expireSession } from "../../../store/slice/currentUserSlice";

export const ProfileSession = () => {
   const dispatch = useDispatch();
   const user = useSelector((state: RootState) => state.currentUserSlice.user);
   const { refetch } = useProfileDetailQuery(user.username);

   // Demo del flujo 401: token inválido → la request responde 401 → rtkQueryErrorLogger → auth/logout.
   const simulateExpiredSession = () => {
      dispatch(expireSession());
      refetch();
   };

   return (
      <Paper elevation={0} sx={{ p: "1.5rem", borderRadius: "1.25rem" }}>
         <Typography fontWeight="bold" color="primary.dark" mb="0.5rem">
            Permisos de esta sesión
         </Typography>
         <Box display="flex" flexWrap="wrap" gap={1} mb="1.5rem">
            {user.permissions.map((permission) => (
               <Chip key={permission} label={permission} size="small" sx={{ fontFamily: "monospace" }} />
            ))}
         </Box>

         <Typography fontWeight="bold" color="primary.dark" mb="0.5rem">
            Sesión expirada
         </Typography>
         <Typography color="text.secondary" mb="1rem">
            Cambia tu token por uno inválido y dispara una petición. El backend responde 401 y el
            middleware cierra la sesión, igual que cuando vence en la vida real.
         </Typography>
         <Button variant="outlined" color="error" startIcon={<TimerOffIcon />} onClick={simulateExpiredSession}>
            Simular sesión expirada
         </Button>
      </Paper>
   );
};
