import { Box, List, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { usePermissionsHook } from "../../../hooks/usePermissionsHook";
import { closeDrawer } from "../../../../store/slice/drawerSlice";
import { MENU_ITEMS } from "./_menuItems";
import { SidebarItem } from "./Sidebar.styles";

export const ItemList = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { pathname } = useLocation();
   const permission = usePermissionsHook();

   const goTo = (path: string) => {
      dispatch(closeDrawer());
      navigate(path);
   };

   return (
      <Box p="1rem">
         <Box display="flex" alignItems="center" gap={1.5} px="0.5rem" py="0.75rem" mb="1rem">
            <Box
               component="img"
               src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
               alt=""
               sx={{ width: "2rem", height: "2rem" }}
            />
            <Typography fontWeight="bold" fontSize="1.15rem" color="common.white">
               Pokémon Admin
            </Typography>
         </Box>
         <List disablePadding>
            {MENU_ITEMS.filter((item) => permission.isAllowed(item.permission)).map((item) => (
               <SidebarItem
                  key={item.path}
                  active={pathname.startsWith(item.path)}
                  onClick={() => goTo(item.path)}
               >
                  <ListItemIcon>
                     <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
               </SidebarItem>
            ))}
         </List>
      </Box>
   );
};
