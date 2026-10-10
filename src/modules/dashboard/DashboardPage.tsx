import { Navigate, Route, Routes } from "react-router";
import PermissionGate from "../../routing/PermissionGate";
import { TeamDashboard } from "./team-dashboard/TeamDashboard";

const DashboardPage = () => (
   <Routes>
      <Route
         index
         element={
            <PermissionGate permission="dashboard_view">
               <TeamDashboard />
            </PermissionGate>
         }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
   </Routes>
);

export default DashboardPage;
