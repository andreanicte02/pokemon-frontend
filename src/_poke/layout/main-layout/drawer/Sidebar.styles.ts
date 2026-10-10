import { styled } from "@mui/material/styles";
import { ListItemButton } from "@mui/material";

export const drawerWidth = "16rem";

export const SidebarItem = styled(ListItemButton, {
   shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
   borderRadius: "0.75rem",
   marginBottom: "0.25rem",
   color: active ? theme.palette.common.white : theme.palette.primary.light,
   backgroundColor: active ? theme.palette.primary.main : "transparent",

   ".MuiListItemIcon-root": {
      color: "inherit",
      minWidth: "2.5rem",
   },

   "&:hover": {
      backgroundColor: active ? theme.palette.primary.main : "rgba(255, 255, 255, 0.08)",
   },
}));
