import * as yup from "yup";
import { ErrorForms } from "../../../_poke/utils/enum";

export interface IPokemonEditForm {
   nickname: string;
   level: number;
   notes: string;
}

export interface IPokemonCreateForm extends IPokemonEditForm {
   species: string;
}

const editFields = {
   nickname: yup
      .string()
      .trim()
      .required(ErrorForms.Required)
      .max(20, ErrorForms.MaxLength(20)),
   level: yup
      .number()
      .typeError(ErrorForms.Number)
      .required(ErrorForms.Required)
      .integer(ErrorForms.Integer)
      .min(1, ErrorForms.Range(1, 100))
      .max(100, ErrorForms.Range(1, 100)),
   notes: yup.string().max(200, ErrorForms.MaxLength(200)).defined(),
};

export const pokemonEditSchema: yup.ObjectSchema<IPokemonEditForm> = yup.object(editFields);

export const pokemonCreateSchema: yup.ObjectSchema<IPokemonCreateForm> = yup.object({
   species: yup.string().required("Elegí una especie"),
   ...editFields,
});
