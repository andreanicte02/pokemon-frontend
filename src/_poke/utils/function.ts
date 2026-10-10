import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { Permission, SessionUser } from "../../store/api/interface/auth";
import type { RootState } from "../../store/store";
import { APP_CURRENCY, APP_LOCALE, ErrorApis, KeyLocalStorage } from "./enum";

/** `prepareHeaders` del baseApi: inyecta el Bearer de la sesión. Único lugar donde vive el header. */
export const getHeader = (headers: Headers, getState: () => unknown) => {
   const token = (getState() as RootState).currentUserSlice.user.sessionId;
   if (token) headers.set("Authorization", `Bearer ${token}`);
   return headers;
};

/** Convierte el error de RTK Query en un string listo para la UI. */
export const getRTKErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined) => {
   if (!error) return ErrorApis.Generic;
   if ("status" in error) {
      if (error.status === "FETCH_ERROR") return ErrorApis.Connection;
      const data = error.data as { message?: string } | undefined;
      return data?.message ?? ErrorApis.Generic;
   }
   return error.message ?? ErrorApis.Generic;
};

export const hasPermission = (permission: Permission, userPermissions: Permission[]) =>
   userPermissions.includes(permission);

export const saveUserLocalStorage = (user: SessionUser) => {
   const expiresAt = Date.now() + KeyLocalStorage.TIMEOUTVALUE * 1000;
   localStorage.setItem(KeyLocalStorage.USER, JSON.stringify(user));
   localStorage.setItem(KeyLocalStorage.TIMEOUT, String(expiresAt));
};

/** Devuelve la sesión guardada si no expiró; si expiró o está corrupta, limpia y devuelve null. */
export const getUserLocalStorage = (): SessionUser | null => {
   try {
      const user = localStorage.getItem(KeyLocalStorage.USER);
      const expiresAt = Number(localStorage.getItem(KeyLocalStorage.TIMEOUT));
      if (!user || !expiresAt || Date.now() > expiresAt) {
         localStorage.removeItem(KeyLocalStorage.USER);
         localStorage.removeItem(KeyLocalStorage.TIMEOUT);
         return null;
      }
      return JSON.parse(user) as SessionUser;
   } catch {
      return null;
   }
};

/** La PokeAPI no trae el id en el listado: viene al final de la url (`.../pokemon/25/`). */
export const getPokedexIdFromUrl = (url: string) => Number(url.split("/").filter(Boolean).pop());

export const getSpriteUrl = (pokedexId: number) =>
   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexId}.png`;

/** Moneda con Intl: un solo helper, locale y moneda centralizados en enum.ts. */
export const formatCurrency = (amount: number) =>
   new Intl.NumberFormat(APP_LOCALE, { style: "currency", currency: APP_CURRENCY }).format(amount);

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
