import { useMemo, useState, type ReactNode } from "react";
import type { StatusVariant } from "../../components/StatusMessage";
import {
   StatusMessageActionsContext,
   StatusMessageStateContext,
   type StatusMessageActions,
   type StatusMessageOptions,
   type StatusMessageState,
} from "./StatusMessageContext";

interface Props {
   children: ReactNode;
}

/** El cierre lo maneja el propio `StatusMessage` (timer por animación): acá no hay effects. */
export const StatusMessageProvider = ({ children }: Props) => {
   const [message, setMessage] = useState<StatusMessageState | undefined>(undefined);

   // Las acciones solo usan el setter (estable): se crean una vez, así el value del
   // contexto de acciones nunca cambia y sus consumidores no se re-renderizan.
   const actions = useMemo<StatusMessageActions>(() => {
      const show = (
         variant: StatusVariant,
         description: string,
         { title, keepCurrent = false }: StatusMessageOptions = {},
      ) =>
         setMessage((current) =>
            current && keepCurrent ? current : { id: Date.now(), title, description, variant },
         );

      return {
         success: (description, options) => show("success", description, options),
         warning: (description, options) => show("warning", description, options),
         clean: () => setMessage(undefined),
      };
   }, []);

   return (
      <StatusMessageActionsContext.Provider value={actions}>
         <StatusMessageStateContext.Provider value={message}>{children}</StatusMessageStateContext.Provider>
      </StatusMessageActionsContext.Provider>
   );
};
