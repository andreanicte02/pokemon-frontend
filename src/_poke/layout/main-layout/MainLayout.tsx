import { Box, Drawer } from "@mui/material";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { closeDrawer } from "../../../store/slice/drawerSlice";
import { AppBar } from "../app-bar/AppBar";
import { ItemList } from "./drawer/ItemList";
import { drawerWidth } from "./drawer/Sidebar.styles";

const drawerPaperSx = {
   width: drawerWidth,
   boxSizing: "border-box",
   border: "none",
   backgroundColor: "primary.dark",
} as const;

const MainLayout = () => {
   const dispatch = useDispatch();
   const mobileOpen = useSelector((state: RootState) => state.drawerSlice.mobileOpen);

   return (
      <Box display="flex" minHeight="100vh" bgcolor="background.default">
         {/* mobile: drawer temporal */}
         <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => dispatch(closeDrawer())}
            sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": drawerPaperSx }}
         >
            <ItemList />
         </Drawer>
         {/* desktop: sidebar permanente */}
         <Drawer
            variant="permanent"
            sx={{
               display: { xs: "none", md: "block" },
               width: drawerWidth,
               flexShrink: 0,
               "& .MuiDrawer-paper": drawerPaperSx,
            }}
         >
            <ItemList />
         </Drawer>

         <Box flex={1} minWidth={0}>
            <AppBar />
            <Box component="main" px={{ xs: "1rem", md: "2.5rem" }} py={{ xs: "1.5rem", md: "2rem" }}>
               <Outlet />
            </Box>
         </Box>
      </Box>
   );
};

export default MainLayout;
