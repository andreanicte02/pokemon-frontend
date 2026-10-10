import { Box, LinearProgress } from "@mui/material";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import PaymentsIcon from "@mui/icons-material/Payments";
import { usePokemonAllQuery } from "../../../store/api/service/pokemon";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { formatCurrency, getRTKErrorMessage } from "../../../_poke/utils/function";
import { POKEBALL_PRICE, POKEMON_TYPE_LABELS } from "../../../_poke/utils/enum";
import { SummaryCard } from "./components/SummaryCard";
import { TypeDistribution } from "./components/TypeDistribution";
import { TopTrainedList } from "./components/TopTrainedList";

export const TeamDashboard = () => {
   const { data = [], isLoading, isError, error, refetch } = usePokemonAllQuery(undefined, {
      refetchOnMountOrArgChange: true,
   });

   // Todo derivado en el render: sin useState ni useEffect para "calcular" estadísticas.
   const total = data.length;
   const averageLevel = total ? Math.round(data.reduce((sum, item) => sum + item.level, 0) / total) : 0;
   const typeCounts = Object.entries(
      data.flatMap((item) => item.types).reduce<Record<string, number>>((counts, type) => {
         counts[type] = (counts[type] ?? 0) + 1;
         return counts;
      }, {}),
   ).sort((a, b) => b[1] - a[1]);
   const topType = typeCounts[0]?.[0];

   return (
      <>
         <PageHeader title="Dashboard" subtitle="Resumen de tu equipo Pokémon" />

         {isLoading && <LinearProgress />}
         {isError && <ErrorAlert text={getRTKErrorMessage(error)} close={refetch} />}

         <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }} gap={2} mb="1.5rem">
            <SummaryCard label="Pokémon capturados" value={total} icon={<CatchingPokemonIcon fontSize="large" />} accent="#E3350D" />
            <SummaryCard label="Nivel promedio" value={averageLevel} icon={<TrendingUpIcon fontSize="large" />} accent="#2980EF" />
            <SummaryCard
               label="Tipo más común"
               value={topType ? POKEMON_TYPE_LABELS[topType] : "—"}
               icon={<StarIcon fontSize="large" />}
               accent="#D4A800"
            />
            <SummaryCard
               label="Invertido en Pokéballs"
               value={formatCurrency(total * POKEBALL_PRICE)}
               icon={<PaymentsIcon fontSize="large" />}
               accent="#3FA129"
            />
         </Box>

         <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1.3fr 1fr" }} gap={2}>
            <TypeDistribution typeCounts={typeCounts} total={total} />
            <TopTrainedList pokemon={data.slice(0, 5)} />
         </Box>
      </>
   );
};
