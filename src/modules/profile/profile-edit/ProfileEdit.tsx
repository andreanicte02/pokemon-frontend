import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useProfileDetailQuery } from "../../../store/api/service/profile";
import { ErrorAlert } from "../../../_poke/components/ErrorAlert";
import { getRTKErrorMessage } from "../../../_poke/utils/function";
import { ProfileEditFormProvider } from "./ProfileEditFormProvider";
import { ProfileEditFormSections } from "./ProfileEditFormSections";

export const ProfileEdit = () => {
   const username = useSelector((state: RootState) => state.currentUserSlice.user.username);
   const profileDetail = useProfileDetailQuery(username, { refetchOnMountOrArgChange: true });

   return (
      <>
         {profileDetail.isLoading && <LinearProgress />}
         {profileDetail.isError && <ErrorAlert text={getRTKErrorMessage(profileDetail.error)} />}
         {profileDetail.data && (
            <ProfileEditFormProvider profile={profileDetail.data}>
               <ProfileEditFormSections username={username} isFetching={profileDetail.isFetching} />
            </ProfileEditFormProvider>
         )}
      </>
   );
};
