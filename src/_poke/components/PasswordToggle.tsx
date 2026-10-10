import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface IPasswordToggle {
   show: boolean;
   toggle: () => void;
}

export const PasswordToggle = ({ show, toggle }: IPasswordToggle) => (
   <InputAdornment position="end">
      <IconButton onClick={toggle} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>
         {show ? <Visibility /> : <VisibilityOff />}
      </IconButton>
   </InputAdornment>
);
