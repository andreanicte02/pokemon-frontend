import { useState } from "react";

export const usePasswordHook = (): [() => void, boolean] => {
   const [showPassword, setShowPassword] = useState(false);
   const togglePassword = () => setShowPassword((show) => !show);

   return [togglePassword, showPassword];
};
