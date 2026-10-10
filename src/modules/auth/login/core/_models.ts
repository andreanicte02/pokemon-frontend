import * as yup from "yup";
import { ErrorForms } from "../../../../_poke/utils/enum";

export interface ILoginForm {
   username: string;
   password: string;
}

export const loginSchema: yup.ObjectSchema<ILoginForm> = yup.object({
   username: yup.string().trim().required(ErrorForms.Required),
   password: yup.string().required(ErrorForms.Required),
});
