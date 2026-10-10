import { Navigate, Route, Routes } from "react-router";
import PermissionGate from "../../routing/PermissionGate";
import { ProfileTabs } from "./profile-tabs/ProfileTabs";

const ProfilePage = () => (
   <Routes>
      <Route
         index
         element={
            <PermissionGate permission="profile_view">
               <ProfileTabs />
            </PermissionGate>
         }
      />
      <Route path="*" element={<Navigate to="/profile" replace />} />
   </Routes>
);

export default ProfilePage;
