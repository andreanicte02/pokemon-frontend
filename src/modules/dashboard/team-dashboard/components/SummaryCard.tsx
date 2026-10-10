import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { SummaryCardStyle } from "./SummaryCard.styles";

interface ISummaryCard {
   label: string;
   value: ReactNode;
   icon: ReactNode;
   accent: string;
}

export const SummaryCard = ({ label, value, icon, accent }: ISummaryCard) => (
   <SummaryCardStyle elevation={0} accent={accent}>
      <Box color={accent} display="flex">
         {icon}
      </Box>
      <Box minWidth={0}>
         <Typography fontSize="0.85rem" color="text.secondary">
            {label}
         </Typography>
         <Typography fontSize="1.5rem" fontWeight="bold" color="primary.dark" noWrap>
            {value}
         </Typography>
      </Box>
   </SummaryCardStyle>
);
