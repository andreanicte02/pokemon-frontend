import { Suspense, type ReactNode } from "react";
import { LinearProgress } from "@mui/material";

interface Props {
   children: ReactNode;
}

const LazyPage = ({ children }: Props) => (
   <Suspense fallback={<LinearProgress />}>{children}</Suspense>
);

export default LazyPage;
