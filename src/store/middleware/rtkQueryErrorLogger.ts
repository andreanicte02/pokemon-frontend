import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";

const unprotectedEndpoints = ["credentials"];

/** Única política global: 401 en un endpoint protegido = logout (sin UI, sin refresh token). */
export const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
   if (isRejectedWithValue(action)) {
      const endpointName = (action.meta.arg as { endpointName?: string }).endpointName ?? "";
      const status = (action.payload as { status?: number }).status;

      if (status === 401 && !unprotectedEndpoints.includes(endpointName)) {
         api.dispatch({ type: "auth/logout" });
      }
   }

   return next(action);
};
