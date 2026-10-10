import type { SvgIconComponent } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { Permission } from "../../../../store/api/interface/auth";

export interface MenuItem {
   label: string;
   path: string;
   icon: SvgIconComponent;
   /** Misma condición que el PermissionGate de la ruta ("el router manda"). */
   permission: Permission;
}

/** Orden del drawer. También define el aterrizaje: DefaultRedirect va al primero permitido. */
export const MENU_ITEMS: MenuItem[] = [
   { label: "Dashboard", path: "/dashboard", icon: DashboardIcon, permission: "dashboard_view" },
   { label: "Mi equipo", path: "/pokemon", icon: CatchingPokemonIcon, permission: "pokemon_view" },
   { label: "Pokédex", path: "/pokedex", icon: MenuBookIcon, permission: "pokedex_view" },
   { label: "Torneos", path: "/tournament", icon: EmojiEventsIcon, permission: "tournament_view" },
   { label: "Mi perfil", path: "/profile", icon: PersonIcon, permission: "profile_view" },
];
