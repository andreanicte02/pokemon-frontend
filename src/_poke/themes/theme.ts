import { createTheme } from "@mui/material";

export const theme = createTheme({
   typography: {
      fontFamily: "Roboto, sans-serif, Noto Sans",
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
      fontSize: 14.4,
   },
   palette: {
      mode: "light",
      primary: {
         dark: "#2A1B3D",
         main: "#E3350D",
         light: "#D9DCE0",
         contrastText: "#FFFFFF",
      },
      secondary: {
         main: "#FAFAFA",
         light: "#B8BDC5",
         dark: "#7A808B",
         contrastText: "#EFEFEF",
      },
      text: {
         secondary: "#7A808B",
         primary: "#4A4F57",
         disabled: "#747E8E",
      },
      error: {
         main: "#FF3040",
         light: "#FCEEED",
      },
      success: {
         main: "#85C31A",
         light: "#F7FFE8",
         dark: "#5E8F0D",
      },
      warning: {
         main: "#FFB60D",
         light: "#FFF6DD",
      },
      background: {
         default: "#F8F8F8",
      },
   },
   shape: {
      borderRadius: 10,
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               textTransform: "none",
               borderRadius: "0.75rem",
               fontWeight: 600,
            },
         },
      },
   },
});
