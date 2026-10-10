import { Box } from "@mui/material";

interface IModalTitle {
   title: string;
   subtitle?: string;
}

export const ModalTitle = ({ title, subtitle }: IModalTitle) => (
   <Box textAlign="center" fontSize="1.35rem" pt="1rem">
      <Box color="primary.dark" fontWeight="bold">
         {title}
      </Box>
      {subtitle && (
         <Box color="primary.main" textTransform="capitalize">
            {subtitle}
         </Box>
      )}
   </Box>
);
