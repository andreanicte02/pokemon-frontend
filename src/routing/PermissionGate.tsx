import type { ReactNode } from "react";
import { usePermissionsHook } from "../_poke/hooks/usePermissionsHook";
import type { Permission } from "../store/api/interface/auth";
import NotFound from "../_poke/errors/NotFound";

interface Props {
   permission: Permission | Permission[];
   children: ReactNode;
}

const PermissionGate = ({ permission, children }: Props) => {
   const permissions = usePermissionsHook();

   return <>{permissions.isAllowed(permission) ? children : <NotFound />}</>;
};

export default PermissionGate;
