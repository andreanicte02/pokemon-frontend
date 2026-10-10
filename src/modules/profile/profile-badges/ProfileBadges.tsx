import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useProfileDetailQuery } from "../../../store/api/service/profile";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { getRTKErrorMessage } from "../../../_poke/utils/function";
import { KANTO_BADGES } from "../../../_poke/utils/enum";

export const ProfileBadges = () => {
   const username = useSelector((state: RootState) => state.currentUserSlice.user.username);
   const { data, isLoading, isError, error } = useProfileDetailQuery(username);
   const obtained = data?.badges ?? [];

   return (
      <Paper elevation={0} sx={{ p: "1.5rem", borderRadius: "1.25rem" }}>
         {isLoading && <LinearProgress />}
         {isError && <ErrorAlert text={getRTKErrorMessage(error)} />}
         <Typography fontWeight="bold" color="primary.dark" mb="1rem">
            Medallas de Kanto · {obtained.length}/{KANTO_BADGES.length}
         </Typography>
         <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(8rem, 1fr))" gap={2}>
            {KANTO_BADGES.map((badge) => (
               <Box
                  key={badge}
                  textAlign="center"
                  p="1rem"
                  borderRadius="1rem"
                  bgcolor="secondary.main"
                  sx={{ opacity: obtained.includes(badge) ? 1 : 0.35 }}
               >
                  <MilitaryTechIcon sx={{ fontSize: "2.5rem", color: obtained.includes(badge) ? "warning.main" : "text.disabled" }} />
                  <Typography fontWeight={600} color="primary.dark">
                     {badge}
                  </Typography>
               </Box>
            ))}
         </Box>
      </Paper>
   );
};
