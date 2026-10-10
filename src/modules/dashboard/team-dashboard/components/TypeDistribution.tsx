import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import { POKEMON_TYPE_COLORS, POKEMON_TYPE_LABELS } from "../../../../_poke/utils/enum";

interface Props {
   /** [tipo, cantidad] ordenado de mayor a menor. */
   typeCounts: [string, number][];
   total: number;
}

export const TypeDistribution = ({ typeCounts, total }: Props) => (
   <Paper elevation={0} sx={{ p: "1.5rem", borderRadius: "1.25rem" }}>
      <Typography fontWeight="bold" color="primary.dark" mb="1rem">
         Tipos en el equipo
      </Typography>
      {typeCounts.map(([type, count]) => (
         <Box key={type} display="grid" gridTemplateColumns="6rem 1fr 2rem" alignItems="center" gap={1} mb="0.5rem">
            <Typography fontSize="0.85rem" color="text.secondary">
               {POKEMON_TYPE_LABELS[type] ?? type}
            </Typography>
            <LinearProgress
               variant="determinate"
               value={(count / total) * 100}
               sx={{
                  height: "0.6rem",
                  borderRadius: "1rem",
                  backgroundColor: "secondary.main",
                  "& .MuiLinearProgress-bar": { backgroundColor: POKEMON_TYPE_COLORS[type] },
               }}
            />
            <Typography fontSize="0.85rem" fontWeight="bold" color="primary.dark" textAlign="right">
               {count}
            </Typography>
         </Box>
      ))}
   </Paper>
);
