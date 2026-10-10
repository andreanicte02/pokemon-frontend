import { Navigate, Route, Routes } from "react-router";
import { Box } from "@mui/material";
import { CardLogin } from "./login/components/CardLogin";

export const AuthPage = () => (
   <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="1rem"
      py="2rem"
      sx={{ background: "linear-gradient(160deg, #2A1B3D 0%, #E3350D 140%)" }}
   >
      <Routes>
         <Route index element={<CardLogin />} />
         <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
   </Box>
);
