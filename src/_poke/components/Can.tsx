import type { ReactNode } from "react";
import type { Permission } from "../../store/api/interface/auth";
import { usePermissionsHook } from "../hooks/usePermissionsHook";

interface CanProps {
   children: (allowed: boolean) => ReactNode;
   requiredPermissions: Permission | Permission[];
}

export const Can = ({ children, requiredPermissions }: CanProps) => {
   const permission = usePermissionsHook();

   return <>{children(permission.isAllowed(requiredPermissions))}</>;
};
