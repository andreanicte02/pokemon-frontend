/** Permisos de la sesión: deciden rutas (`PermissionGate`), ítems del menú y botones (`<Can>`). */
export type Permission =
   | "dashboard_view"
   | "pokemon_view"
   | "pokemon_create"
   | "pokemon_edit"
   | "pokemon_delete"
   | "pokedex_view"
   | "profile_view"
   | "profile_edit"
   | "tournament_view"
   | "tournament_register";

export enum Rol {
   TRAINER = "trainer",
   VIEWER = "viewer",
}

/** Usuario en sesión (dominio). */
export interface SessionUser {
   sessionId: string;
   username: string;
   name: string;
   rol: Rol | "";
   permissions: Permission[];
}

export interface CredentialsRequest {
   username: string;
   password: string;
}

export type CredentialsResponse = SessionUser;
