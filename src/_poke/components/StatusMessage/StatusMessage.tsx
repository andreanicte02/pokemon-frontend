import type { AnimationEvent } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { STATUS_VARIANTS, type StatusVariant } from "./statusVariants";
import { AutoCloseBox, exit } from "./StatusMessage.styles";

export interface StatusMessageProps {
   title?: string;
   description?: string;
   /** `severity` y duración salen del mapa `STATUS_VARIANTS`. */
   variant?: StatusVariant;
   /**
    * Se llama cuando termina el tiempo. Pasar una referencia estable (el `reset` de la
    * mutation RTK o el `clean` del contexto). La visibilidad la decide el padre.
    */
   close: () => void;
}

/**
 * Éxito / aviso que se cierra solo (sin X; el hover lo pausa). El cierre lo dispara
 * la animación de salida, sin timers ni effects.
 */
export const StatusMessage = ({ title, description, variant = "success", close }: StatusMessageProps) => {
   const { severity, durationMs } = STATUS_VARIANTS[variant];

   // Solo la salida cierra: la entrada también dispara animationend.
   const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.target === event.currentTarget && event.animationName === exit.name) close();
   };

   return (
      <AutoCloseBox durationMs={durationMs} onAnimationEnd={handleAnimationEnd}>
         <Alert severity={severity}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {description}
         </Alert>
      </AutoCloseBox>
   );
};

export default StatusMessage;
