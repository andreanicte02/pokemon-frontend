import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = () => {
   const navigate = useNavigate();

   return (
      <Box textAlign="center" py="4rem">
         <Typography fontSize="4rem" fontWeight="bold" color="primary.main">
            404
         </Typography>
         <Typography color="text.secondary" mb="1.5rem">
            No encontré esta página, o tu usuario no tiene permiso para verla.
         </Typography>
         <Button variant="contained" onClick={() => navigate("/", { replace: true })}>
            Ir al inicio
         </Button>
      </Box>
   );
};

export default NotFound;
