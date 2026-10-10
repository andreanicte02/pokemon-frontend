import { useState, type ReactNode } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import { PageHeader } from "../../../_poke/components/PageHeader/PageHeader";
import { ProfileTab } from "../core/_models";
import { ProfileEdit } from "../profile-edit/ProfileEdit";
import { ProfileBadges } from "../profile-badges/ProfileBadges";
import { ProfileSession } from "../profile-session/ProfileSession";

/** 3+ variantes de render → mapa de vistas, no ternarios anidados. */
const views: Record<ProfileTab, ReactNode> = {
   [ProfileTab.info]: <ProfileEdit />,
   [ProfileTab.badges]: <ProfileBadges />,
   [ProfileTab.session]: <ProfileSession />,
};

export const ProfileTabs = () => {
   const [tab, setTab] = useState(ProfileTab.info);

   return (
      <>
         <PageHeader title="Mi perfil" subtitle="Tu ficha de entrenador" />
         <Paper elevation={0} sx={{ borderRadius: "1.25rem", mb: "1.5rem", px: "0.5rem" }}>
            <Tabs value={tab} onChange={(_event, value: ProfileTab) => setTab(value)} variant="scrollable">
               <Tab value={ProfileTab.info} label="Datos" />
               <Tab value={ProfileTab.badges} label="Medallas" />
               <Tab value={ProfileTab.session} label="Sesión" />
            </Tabs>
         </Paper>
         {views[tab]}
      </>
   );
};
