/** Especies (PokeAPI pública, solo lectura). */
export interface SpeciesItem {
   name: string;
   url: string;
}

export interface Stat {
   base_stat: number;
   stat: { name: string };
}

export interface SpeciesListResponse {
   results: SpeciesItem[];
}

export interface PokedexPageResponse {
   items: SpeciesItem[];
   offset: number;
   hasMore: boolean;
}

export interface SpeciesDetailResponse {
   id: number;
   name: string;
   height: number;
   weight: number;
   types: { slot: number; type: { name: string } }[];
   stats: Stat[];
}
