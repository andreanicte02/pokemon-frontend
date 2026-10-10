import * as yup from "yup";
import type { Region } from "../../../store/api/interface/profile";
import { ErrorForms } from "../../../_poke/utils/enum";

export interface IProfileForm {
   name: string;
   region: Region;
   hometown: string;
   isGymLeader: boolean;
   gymName: string;
   badgeName: string;
   avatarId: number;
}

const requiredIfGymLeader = (message: string) =>
   yup.string().when("isGymLeader", {
      is: true,
      then: (schema) => schema.trim().required(message),
      otherwise: (schema) => schema,
   }).defined();

/** Un solo schema para TODAS las secciones; `yup.when` gobierna los campos condicionales. */
export const profileSchema: yup.ObjectSchema<IProfileForm> = yup.object({
   name: yup.string().trim().required(ErrorForms.Required).max(40, ErrorForms.MaxLength(40)),
   region: yup.mixed<Region>().oneOf(["kanto", "johto", "hoenn", "sinnoh"]).required(ErrorForms.Required),
   hometown: yup.string().trim().required(ErrorForms.Required),
   isGymLeader: yup.boolean().required(),
   gymName: requiredIfGymLeader("Un líder necesita su gimnasio"),
   badgeName: requiredIfGymLeader("¿Qué medalla entregás?"),
   avatarId: yup.number().required(),
});

export enum ProfileTab {
   info = "info",
   badges = "badges",
   session = "session",
}
