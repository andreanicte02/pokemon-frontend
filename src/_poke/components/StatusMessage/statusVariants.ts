import type { AlertColor } from "@mui/material";

interface StatusVariantConfig {
   /** `severity` del `<Alert>` de MUI: define color e ícono. */
   severity: AlertColor;
   /** Cuánto se muestra antes de cerrarse solo (el hover lo pausa). */
   durationMs: number;
}

/**
 * Mapa de variantes: agregar una es sumar una entrada acá, sin tocar el componente.
 * Los errores no van acá: se muestran inline con `ErrorAlert` y no se cierran solos.
 */
export const STATUS_VARIANTS = {
   success: { severity: "success", durationMs: 5000 },
   warning: { severity: "warning", durationMs: 7000 },
} as const satisfies Record<string, StatusVariantConfig>;

export type StatusVariant = keyof typeof STATUS_VARIANTS;
