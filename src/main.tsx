import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { store } from "./store/store";
import { theme } from "./_poke/themes/theme";
import { AppRoute } from "./routing/AppRoute";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <Provider store={store}>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRoute />
         </ThemeProvider>
      </Provider>
   </StrictMode>,
);
