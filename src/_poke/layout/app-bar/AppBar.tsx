import { AppBar as MuiAppBar, Avatar, Box, Button, Chip, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toggleDrawer } from "../../../store/slice/drawerSlice";
import { Rol } from "../../../store/api/interface/auth";

export const AppBar = () => {
   const dispatch = useDispatch();
   const user = useSelector((state: RootState) => state.currentUserSlice.user);

   return (
      <MuiAppBar
         position="sticky"
         elevation={0}
         sx={{ backgroundColor: "common.white", color: "primary.dark", borderBottom: "0.063rem solid", borderColor: "primary.light" }}
      >
         <Toolbar sx={{ gap: 1.5 }}>
            <IconButton
               aria-label="Abrir menú"
               onClick={() => dispatch(toggleDrawer())}
               sx={{ display: { md: "none" } }}
            >
               <MenuIcon />
            </IconButton>
            <Box flex={1} />
            <Avatar sx={{ width: "2rem", height: "2rem", bgcolor: "primary.main" }}>
               {user.name.charAt(0)}
            </Avatar>
            <Box display={{ xs: "none", sm: "flex" }} alignItems="center" gap={1}>
               <Typography fontWeight={600}>{user.name}</Typography>
               <Chip
                  size="small"
                  variant="outlined"
                  label={user.rol === Rol.TRAINER ? "Entrenador" : "Solo lectura"}
               />
            </Box>
            <Button
               color="inherit"
               startIcon={<LogoutIcon />}
               onClick={() => dispatch({ type: "auth/logout" })}
            >
               Salir
            </Button>
         </Toolbar>
      </MuiAppBar>
   );
};
