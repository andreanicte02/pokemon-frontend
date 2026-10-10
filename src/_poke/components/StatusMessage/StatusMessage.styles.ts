import { keyframes, styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const enter = keyframes({
   from: { opacity: 0 },
   to: { opacity: 1 },
});

/** El nombre se usa en `onAnimationEnd` para saber que terminó la salida y hay que cerrar. */
export const exit = keyframes({
   from: { opacity: 1 },
   to: { opacity: 0 },
});

interface Props {
   durationMs: number;
}

/**
 * Solo maneja el tiempo; el aspecto es el `<Alert>` de MUI tal cual. Entra, espera
 * `durationMs` y sale; el hover (o el foco) pausa la animación y con ella el cierre.
 */
export const AutoCloseBox = styled(Box, { shouldForwardProp: (prop) => prop !== "durationMs" })<Props>(
   ({ durationMs }) => ({
      margin: "1rem 0",
      animation: `${enter} 200ms ease-out, ${exit} 200ms ease-in ${durationMs}ms forwards`,

      "&:hover, &:focus-within": {
         animationPlayState: "paused",
      },
   }),
);
