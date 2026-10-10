export type RegistrationCategory = "open" | "rookie";

/** Torneo (dominio). `levelCap` aplica solo a la categoría novato. */
export interface Tournament {
   id: number;
   name: string;
   closesAt: string;
   levelCap: number;
}

/** Inscripción a un torneo (dominio). */
export interface Registration {
   id: number;
   tournamentId: number;
   tournamentName: string;
   category: RegistrationCategory;
   pokemonIds: number[];
   nicknames: string[];
   createdAt: string;
}

export type TournamentListResponse = Tournament[];

export interface RegistrationListRequest {
   /** "" = todos los torneos. */
   tournamentId: string;
   /** id de la última inscripción cargada; null = primera página. */
   cursor: number | null;
}

export interface RegistrationListResponse {
   items: Registration[];
   cursor: number | null;
   hasMore: boolean;
}

export type RegistrationCreateRequest = Omit<Registration, "id">;

export type RegistrationCreateResponse = Registration;
