import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { Permission } from "../../store/api/interface/auth";
import { hasPermission } from "../utils/function";

export interface PermissionHook {
   permissions: Permission[];
   isAllowed: (permission: Permission | Permission[]) => boolean;
   isAllowedSome: (permission: Permission[]) => boolean;
}

export const usePermissionsHook = (): PermissionHook => {
   const permissions = useSelector(
      (state: RootState) => state.currentUserSlice.user.permissions,
   );

   const isAllowed = (permission: Permission | Permission[]) =>
      Array.isArray(permission)
         ? permission.every((value) => hasPermission(value, permissions))
         : hasPermission(permission, permissions);

   const isAllowedSome = (permission: Permission[]) =>
      permission.some((value) => hasPermission(value, permissions));

   return { permissions, isAllowed, isAllowedSome };
};
