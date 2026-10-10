/** Pokémon del equipo (dominio). */
export interface Pokemon {
   id: number;
   pokedexId: number;
   species: string;
   types: string[];
   nickname: string;
   level: number;
   notes: string;
}

export interface PokemonListRequest {
   search: string;
   type: string;
   page: number;
}

export interface PokemonListResponse {
   items: Pokemon[];
   total: number;
}

export type PokemonAllResponse = Pokemon[];

export type PokemonDetailResponse = Pokemon;

export type PokemonCreateRequest = Omit<Pokemon, "id">;

export type PokemonCreateResponse = Pokemon;

export type PokemonEditRequest = Pick<Pokemon, "id" | "nickname" | "level" | "notes">;

export type PokemonEditResponse = Pokemon;
