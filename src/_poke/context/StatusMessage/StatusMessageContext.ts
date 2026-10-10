import { createContext } from "react";
import type { StatusMessageProps } from "../../components/StatusMessage";

export type StatusMessageState = Pick<StatusMessageProps, "title" | "description" | "variant"> & {
   /** Distinto en cada mensaje: va de `key` para que el timer arranque de cero aunque el texto se repita. */
   id: number;
};

export interface StatusMessageOptions {
   title?: string;
   /** `true` = no pisa un mensaje que ya se está mostrando (ej. el éxito que viene de otra ruta). */
   keepCurrent?: boolean;
}

/** Solo éxitos y avisos: los errores van inline (regla firme 3), nunca en el mensaje global. */
export interface StatusMessageActions {
   success: (description: string, options?: StatusMessageOptions) => void;
   warning: (description: string, options?: StatusMessageOptions) => void;
   clean: () => void;
}

/**
 * Estado y acciones en contextos separados: quien solo muestra mensajes (forms, modales)
 * se suscribe a las acciones, que son estables, y no se re-renderiza cuando el mensaje cambia.
 * El único suscrito al estado es `StatusMessageRenderer`.
 */
export const StatusMessageStateContext = createContext<StatusMessageState | undefined>(undefined);

export const StatusMessageActionsContext = createContext<StatusMessageActions>({
   success: () => {},
   warning: () => {},
   clean: () => {},
});
