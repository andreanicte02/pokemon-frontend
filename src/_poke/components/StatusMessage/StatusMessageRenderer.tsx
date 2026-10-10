import { useContext } from "react";
import StatusMessage from "./StatusMessage";
import { StatusMessageStateContext, useStatusMessage } from "../../context/StatusMessage";

/** Único suscriptor del estado: cuando el mensaje cambia, solo se re-renderiza esto. */
export const StatusMessageRenderer = () => {
   const message = useContext(StatusMessageStateContext);
   const { clean } = useStatusMessage();

   return <>{message && <StatusMessage key={message.id} {...message} close={clean} />}</>;
};
