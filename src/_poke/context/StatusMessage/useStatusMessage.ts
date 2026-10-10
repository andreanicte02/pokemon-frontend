import { useContext } from "react";
import { StatusMessageActionsContext } from "./StatusMessageContext";

/** `{ success, warning, clean }`: referencias estables, no re-renderiza al cambiar el mensaje. */
export const useStatusMessage = () => useContext(StatusMessageActionsContext);
