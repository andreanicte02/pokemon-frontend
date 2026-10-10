import { Box, Checkbox, FormHelperText, Typography } from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { usePokemonAllQuery } from "../../../../store/api/service/pokemon";
import { useTournamentListQuery } from "../../../../store/api/service/tournament";
import { capitalize, getSpriteUrl } from "../../../../_poke/utils/function";
import { MAX_TEAM_SIZE } from "../../../../_poke/utils/enum";
import type { IRegistrationForm } from "../../core/_models";

export const StepTeam = () => {
   const { control } = useFormContext<IRegistrationForm>();
   const { data: team = [] } = usePokemonAllQuery();
   const { data: tournaments = [] } = useTournamentListQuery();
   const [tournamentId, category] = useWatch({ control, name: ["tournamentId", "category"] });
   const levelCap = tournaments.find((item) => String(item.id) === tournamentId)?.levelCap;

   return (
      <>
         <Typography color="text.secondary" mb="1rem">
            Elegí hasta {MAX_TEAM_SIZE} Pokémon.
            {category === "rookie" && levelCap && ` En novato el nivel máximo es ${levelCap}.`}
         </Typography>
         <Controller
            name="pokemonIds"
            control={control}
            render={({ field, fieldState }) => (
               <>
                  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(12rem, 1fr))" gap={1}>
                     {team.map((pokemon) => {
                        const checked = field.value.includes(pokemon.id);
                        const overCap = category === "rookie" && !!levelCap && pokemon.level > levelCap;

                        return (
                           <Box
                              key={pokemon.id}
                              component="label"
                              display="flex"
                              alignItems="center"
                              gap={1}
                              p="0.5rem"
                              borderRadius="0.75rem"
                              border="0.125rem solid"
                              borderColor={checked ? "primary.main" : "primary.light"}
                              sx={{ cursor: "pointer", opacity: overCap ? 0.5 : 1 }}
                           >
                              <Checkbox
                                 checked={checked}
                                 onChange={(_event, isChecked) =>
                                    field.onChange(
                                       isChecked
                                          ? [...field.value, pokemon.id]
                                          : field.value.filter((id) => id !== pokemon.id),
                                    )
                                 }
                              />
                              <Box component="img" src={getSpriteUrl(pokemon.pokedexId)} alt="" sx={{ width: "2.5rem", height: "2.5rem" }} />
                              <Box minWidth={0}>
                                 <Typography fontWeight={600} color="primary.dark" noWrap>
                                    {pokemon.nickname}
                                 </Typography>
                                 <Typography fontSize="0.8rem" color={overCap ? "error.main" : "text.secondary"}>
                                    {capitalize(pokemon.species)} · Nv. {pokemon.level}
                                 </Typography>
                              </Box>
                           </Box>
                        );
                     })}
                  </Box>
                  {fieldState.error && <FormHelperText error sx={{ mt: "0.75rem" }}>{fieldState.error.message}</FormHelperText>}
               </>
            )}
         />
      </>
   );
};
