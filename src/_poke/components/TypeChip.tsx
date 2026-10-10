import { Chip } from "@mui/material";
import { POKEMON_TYPE_COLORS, POKEMON_TYPE_LABELS } from "../utils/enum";

interface ITypeChip {
   type: string;
}

export const TypeChip = ({ type }: ITypeChip) => (
   <Chip
      size="small"
      label={POKEMON_TYPE_LABELS[type] ?? type}
      sx={{
         backgroundColor: POKEMON_TYPE_COLORS[type] ?? "secondary.light",
         color: "common.white",
         fontWeight: 600,
      }}
   />
);
