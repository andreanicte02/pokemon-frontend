import { useState, type FormEvent } from "react";
import { Box, Button, MenuItem, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import {
   resetPokemonFilter,
   setPokemonFilter,
} from "../../../../../store/slice/pokemonFilterSlice";
import { POKEMON_TYPE_LABELS } from "../../../../../_poke/utils/enum";

export const PokemonFilter = () => {
   const dispatch = useDispatch();
   const currentFilter = useSelector((state: RootState) => state.pokemonFilterSlice);
   // Los inputs arrancan desde el slice: al volver de editar, el filtro se sigue viendo.
   const [search, setSearch] = useState(currentFilter.search);
   const [type, setType] = useState(currentFilter.type);

   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      dispatch(setPokemonFilter({ search: search.trim(), type }));
   };

   const onClear = () => {
      setSearch("");
      setType("");
      dispatch(resetPokemonFilter());
   };

   return (
      <Paper
         component="form"
         onSubmit={onSearch}
         elevation={0}
         sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr auto auto" },
            gap: 2,
            p: "1rem",
            mb: "1.5rem",
            borderRadius: "1.25rem",
         }}
      >
         <TextField
            fullWidth
            label="Buscar por apodo o especie"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
         />
         <TextField
            fullWidth
            select
            label="Tipo"
            value={type}
            onChange={(event) => setType(event.target.value)}
         >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(POKEMON_TYPE_LABELS).map(([value, label]) => (
               <MenuItem key={value} value={value}>
                  {label}
               </MenuItem>
            ))}
         </TextField>
         <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
            Buscar
         </Button>
         <Box display="flex">
            <Button type="button" variant="text" onClick={onClear} sx={{ color: "text.secondary", flex: 1 }}>
               Limpiar
            </Button>
         </Box>
      </Paper>
   );
};
