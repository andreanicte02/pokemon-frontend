import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { AuthPage } from "../modules/auth/AuthPage";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import DefaultRedirect from "./DefaultRedirect";

export const AppRoute = () => {
   const sessionId = useSelector((state: RootState) => state.currentUserSlice.user.sessionId);

   return (
      // BASE_URL sale del `base` de Vite: "/" en local, "/<repo>/" en GitHub Pages.
      <BrowserRouter basename={import.meta.env.BASE_URL}>
         <Routes>
            {/*ROOT*/}
            <Route index element={sessionId ? <DefaultRedirect /> : <Navigate to="/auth" replace />} />

            {/*AUTH — eager: es la primera pantalla sin sesión*/}
            <Route element={<PublicRoute />}>
               <Route path="auth/*" element={<AuthPage />} />
            </Route>

            {/*PRIVATE*/}
            <Route path="/*" element={<PrivateRoute />} />
         </Routes>
      </BrowserRouter>
   );
};
