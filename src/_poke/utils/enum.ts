export enum KeyLocalStorage {
   USER = "pokemon_user",
   TIMEOUT = "pokemon_timeout",
   /** Duración de la sesión en segundos (6 h). */
   TIMEOUTVALUE = 21600,
}

export const pageSize = 8;

export const pokedexPageSize = 24;

export const registrationPageSize = 4;

/** Máximo de Pokémon por inscripción a un torneo. */
export const MAX_TEAM_SIZE = 3;

/** Primera generación (Kanto). */
export const KANTO_TOTAL = 151;

/** Locale y moneda de la app (los usa `formatCurrency`). */
export const APP_LOCALE = "es-GT";
export const APP_CURRENCY = "GTQ";

/** Costo de una Pokéball en la Pokémart (para el dashboard). */
export const POKEBALL_PRICE = 15.5;

export const KANTO_BADGES = ["Roca", "Cascada", "Trueno", "Arcoíris", "Alma", "Pantano", "Volcán", "Tierra"];

export const REGION_LABELS = {
   kanto: "Kanto",
   johto: "Johto",
   hoenn: "Hoenn",
   sinnoh: "Sinnoh",
} as const;

/**
 * Mensajes que ve el usuario: conversacionales, en primera persona, diciendo qué pasó y qué
 * puede hacer; sin detalles técnicos (en local, `pnpm dev` levanta la API).
 */
export enum ErrorApis {
   Generic = "Algo no salió como esperaba. Probá de nuevo en un momento.",
   Connection = "No logro conectarme con el servidor. Revisá tu conexión y volvé a intentar.",
   PokeApi = "No pude traer la lista de la PokeAPI. Probá de nuevo en un momento.",
}

/** Mensajes de validación (Yup), con el mismo tono que `ErrorApis`. Objeto y no enum: algunos llevan valores. */
export const ErrorForms = {
   Required: "Necesito este dato para seguir",
   Number: "Acá va un número",
   Integer: "Usá un número entero, sin decimales",
   MaxLength: (max: number) => `Con ${max} caracteres alcanza; acortalo un poco`,
   Range: (min: number, max: number) => `Tiene que estar entre ${min} y ${max}`,
} as const;

export const POKEMON_TYPE_LABELS: Record<string, string> = {
   normal: "Normal",
   fire: "Fuego",
   water: "Agua",
   grass: "Planta",
   electric: "Eléctrico",
   ice: "Hielo",
   fighting: "Lucha",
   poison: "Veneno",
   ground: "Tierra",
   flying: "Volador",
   psychic: "Psíquico",
   bug: "Bicho",
   rock: "Roca",
   ghost: "Fantasma",
   dragon: "Dragón",
   dark: "Siniestro",
   steel: "Acero",
   fairy: "Hada",
};

export const POKEMON_TYPE_COLORS: Record<string, string> = {
   normal: "#9FA19F",
   fire: "#E62829",
   water: "#2980EF",
   grass: "#3FA129",
   electric: "#D4A800",
   ice: "#3DCEF3",
   fighting: "#FF8000",
   poison: "#9141CB",
   ground: "#915121",
   flying: "#81B9EF",
   psychic: "#EF4179",
   bug: "#91A119",
   rock: "#AFA981",
   ghost: "#704170",
   dragon: "#5060E1",
   dark: "#624D4E",
   steel: "#60A1B8",
   fairy: "#EF70EF",
};
