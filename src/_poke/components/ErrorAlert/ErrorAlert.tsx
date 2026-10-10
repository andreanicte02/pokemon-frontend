import { Alert } from "@mui/material";

interface Props {
   text: string;
   close?: () => void;
}

/**
 * Error inline de una query/mutation con el `<Alert>` de MUI. No se cierra solo: queda
 * hasta que lo cierran (X) o se reintenta. El padre decide cuándo se ve: `{status.isError && …}`.
 */
const ErrorAlert = ({ text, close }: Props) => (
   <Alert severity="error" onClose={close} sx={{ my: 2 }}>
      {text}
   </Alert>
);

export default ErrorAlert;
