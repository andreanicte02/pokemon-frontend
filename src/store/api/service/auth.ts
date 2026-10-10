import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Rol, type CredentialsRequest, type CredentialsResponse, type SessionUser } from "../interface/auth";
import { saveSession } from "../../slice/currentUserSlice";
import { saveUserLocalStorage } from "../../../_poke/utils/function";

/**
 * Credenciales QUEMADAS (demo): no hay backend de auth, el `queryFn` simula
 * `POST auth/credentials`. Se muestran en el badge del login.
 */
export const DEMO_USERS: (SessionUser & { password: string; description: string })[] = [
   {
      username: "ash",
      password: "pikachu123",
      name: "Ash Ketchum",
      rol: Rol.TRAINER,
      description: "Entrenador · acceso completo",
      permissions: [
         "dashboard_view",
         "pokemon_view",
         "pokemon_create",
         "pokemon_edit",
         "pokemon_delete",
         "pokedex_view",
         "profile_view",
         "profile_edit",
         "tournament_view",
         "tournament_register",
      ],
      sessionId: "",
   },
   {
      username: "misty",
      password: "starmie123",
      name: "Misty",
      rol: Rol.VIEWER,
      description: "Solo lectura · sin dashboard",
      permissions: ["pokemon_view", "pokedex_view", "profile_view", "tournament_view"],
      sessionId: "",
   },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const auth = createApi({
   reducerPath: "auth",
   baseQuery: fakeBaseQuery<{ status: number; data: { message: string } }>(),
   endpoints: (builder) => ({
      credentials: builder.mutation<CredentialsResponse, CredentialsRequest>({
         queryFn: async ({ username, password }) => {
            await wait(500);
            const found = DEMO_USERS.find(
               (user) => user.username === username.trim().toLowerCase() && user.password === password,
            );
            if (!found) {
               return { error: { status: 401, data: { message: "No reconozco ese usuario o contraseña. Revisalos o usá una de las credenciales de prueba." } } };
            }
            return {
               data: {
                  username: found.username,
                  name: found.name,
                  rol: found.rol,
                  permissions: found.permissions,
                  sessionId: crypto.randomUUID(),
               },
            };
         },
         // onQueryStarted solo sincroniza el store (no muestra mensajes)
         async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
               const { data } = await queryFulfilled;
               saveUserLocalStorage(data);
               dispatch(saveSession(data));
            } catch {
               // intencionalmente vacío — el error lo muestra el form de login inline
            }
         },
      }),
   }),
});

export const { useCredentialsMutation } = auth;
