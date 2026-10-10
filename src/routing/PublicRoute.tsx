import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const PublicRoute = () => {
   const sessionId = useSelector((state: RootState) => state.currentUserSlice.user.sessionId);

   return <>{sessionId ? <Navigate to="/" replace /> : <Outlet />}</>;
};
