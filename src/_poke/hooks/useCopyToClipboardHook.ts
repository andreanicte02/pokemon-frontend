import { useEffect, useState } from "react";

/** Copia al portapapeles y deja `copied` en true por 2 s (feedback del botón). */
export const useCopyToClipboardHook = (): [(text: string) => Promise<void>, boolean] => {
   const [copied, setCopied] = useState(false);

   // Sincroniza con un timer (sistema externo): apaga el feedback solo.
   useEffect(() => {
      if (!copied) return;
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
   }, [copied]);

   const copy = async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
   };

   return [copy, copied];
};
