import * as yup from "yup";
import type { Pokemon } from "../../../store/api/interface/pokemon";
import type { RegistrationCategory, Tournament } from "../../../store/api/interface/tournament";
import { ErrorForms, MAX_TEAM_SIZE } from "../../../_poke/utils/enum";

export interface IRegistrationForm {
   tournamentId: string;
   category: RegistrationCategory;
   pokemonIds: number[];
}

/** Datos EXTERNOS al form que la validación necesita: llegan por `context` de useForm. */
export interface IRegistrationContext {
   team: Pokemon[];
   tournaments: Tournament[];
}

export const CATEGORY_LABELS: Record<RegistrationCategory, string> = {
   open: "Libre",
   rookie: "Novato (nivel limitado)",
};

export const registrationSchema: yup.ObjectSchema<IRegistrationForm> = yup.object({
   tournamentId: yup.string().required("Elegí un torneo"),
   category: yup.mixed<RegistrationCategory>().oneOf(["open", "rookie"]).required(ErrorForms.Required),
   pokemonIds: yup
      .array(yup.number().required())
      .min(1, "Elegí al menos un Pokémon")
      .max(MAX_TEAM_SIZE, `Podés llevar hasta ${MAX_TEAM_SIZE} Pokémon`)
      .required()
      .test("level-cap", "Algún Pokémon supera el nivel máximo de este torneo; cambialo por otro", function (ids) {
         // En novato, el tope de nivel depende del torneo elegido y de los niveles del equipo:
         // ninguno de los dos vive en el form → se leen del context.
         if (this.parent.category !== "rookie") return true;
         const { team, tournaments } = this.options.context as IRegistrationContext;
         const levelCap = tournaments.find((item) => String(item.id) === this.parent.tournamentId)?.levelCap;
         if (!levelCap) return true;
         return ids.every((id) => (team.find((pokemon) => pokemon.id === id)?.level ?? 0) <= levelCap);
      }),
});

/** Campos que valida cada paso antes de avanzar (`trigger`). */
export const STEP_FIELDS: (keyof IRegistrationForm)[][] = [["tournamentId", "category"], ["pokemonIds"], []];

export const TOURNAMENT_ROUTE = "/tournament";
