import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

export const SummaryCardStyle = styled(Paper, {
   shouldForwardProp: (prop) => prop !== "accent",
})<{ accent: string }>(({ accent }) => ({
   padding: "1.25rem",
   borderRadius: "1.25rem",
   borderLeft: `0.375rem solid ${accent}`,
   display: "flex",
   alignItems: "center",
   gap: "1rem",
}));
