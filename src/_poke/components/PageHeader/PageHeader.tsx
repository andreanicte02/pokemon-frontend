import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface IPageHeader {
   title: string;
   subtitle?: string;
   children?: ReactNode;
}

export const PageHeader = ({ title, subtitle, children }: IPageHeader) => (
   <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      mb="1.5rem"
      sx={{
         flexDirection: { xs: "column", sm: "row" },
         alignItems: { xs: "flex-start", sm: "center" },
         justifyContent: "space-between",
      }}
   >
      <Box>
         <Typography color="primary.dark" fontSize="1.75rem" fontWeight="bold">
            {title}
         </Typography>
         {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
      </Box>
      {children && <Box display="flex" gap={1}>{children}</Box>}
   </Box>
);
