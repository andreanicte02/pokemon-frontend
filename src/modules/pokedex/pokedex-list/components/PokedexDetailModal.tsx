import { Box, Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useSpeciesDetailQuery } from "../../../../store/api/service/species";
import { ModalTitle } from "../../../../_poke/components/ModalTitle";
import { SpeciesStats } from "../../../../_poke/components/SpeciesStats/SpeciesStats";
import { useCopyToClipboardHook } from "../../../../_poke/hooks/useCopyToClipboardHook";
import { getSpriteUrl } from "../../../../_poke/utils/function";

interface Props {
   name: string;
   close: () => void;
}

/** Modal de solo lectura, muy local: lo abre un useState del padre (excepción válida al slice de modales). */
export const PokedexDetailModal = ({ name, close }: Props) => {
   const [copy, copied] = useCopyToClipboardHook();
   const speciesDetail = useSpeciesDetailQuery(name);

   return (
      <Dialog open onClose={close} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: "1.25rem" } } }}>
         <ModalTitle title="Pokédex" subtitle={name} />
         <DialogContent>
            <Box textAlign="center">
               <Box
                  component="img"
                  src={getSpriteUrl(speciesDetail.data?.id ?? 0)}
                  alt=""
                  sx={{ width: "10rem", height: "10rem", visibility: speciesDetail.data ? "visible" : "hidden" }}
               />
            </Box>
            <SpeciesStats name={name} />
         </DialogContent>
         <DialogActions sx={{ p: "0 1.5rem 1.5rem", gap: 1 }}>
            <Button
               variant="text"
               startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
               onClick={() => copy(name)}
               sx={{ flex: 1 }}
            >
               {copied ? "¡Copiado!" : "Copiar nombre"}
            </Button>
            <Button variant="contained" onClick={close} sx={{ flex: 1 }}>
               Cerrar
            </Button>
         </DialogActions>
      </Dialog>
   );
};
