import { Navigate } from "react-router";
import { usePermissionsHook } from "../_poke/hooks/usePermissionsHook";
import { MENU_ITEMS } from "../_poke/layout/main-layout/drawer/_menuItems";

/**
 * Aterrizaje con sesión: el primer destino permitido en el orden del drawer
 * ("aterrizás en lo primero que ves en tu menú"). Evita mandar a alguien a un 404.
 */
const DefaultRedirect = () => {
   const permission = usePermissionsHook();
   const firstAllowed = MENU_ITEMS.find((item) => permission.isAllowed(item.permission));

   return <Navigate to={firstAllowed?.path ?? "/profile"} replace />;
};

export default DefaultRedirect;
