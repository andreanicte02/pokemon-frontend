export type Region = "kanto" | "johto" | "hoenn" | "sinnoh";

/** Perfil del entrenador (dominio). El id es el username. */
export interface Profile {
   id: string;
   name: string;
   region: Region;
   hometown: string;
   isGymLeader: boolean;
   gymName: string;
   badgeName: string;
   avatarId: number;
   badges: string[];
}

export type ProfileDetailResponse = Profile;

export type ProfileEditRequest = Omit<Profile, "badges">;

export type ProfileEditResponse = Profile;
