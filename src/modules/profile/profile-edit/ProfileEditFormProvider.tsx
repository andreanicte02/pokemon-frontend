import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Profile } from "../../../store/api/interface/profile";
import { profileSchema, type IProfileForm } from "../core/_models";

interface Props {
   profile: Profile;
   children: ReactNode;
}

/** Un solo FormProvider con el schema completo; cada sección lee su parte con useFormContext. */
export const ProfileEditFormProvider = ({ profile, children }: Props) => {
   const methods = useForm<IProfileForm>({
      resolver: yupResolver(profileSchema),
      // `values` (no defaultValues): re-sincroniza la baseline cuando la query refetchea
      values: {
         name: profile.name,
         region: profile.region,
         hometown: profile.hometown,
         isGymLeader: profile.isGymLeader,
         gymName: profile.gymName ?? "",
         badgeName: profile.badgeName ?? "",
         avatarId: profile.avatarId,
      },
   });

   return <FormProvider {...methods}>{children}</FormProvider>;
};
