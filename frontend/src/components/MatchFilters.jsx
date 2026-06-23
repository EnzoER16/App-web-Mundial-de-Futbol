import { Box, TextField, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ROUNDS = [
    "Todas",
    "Fase de Grupos",
    "Octavos de Final",
    "Cuartos de Final",
    "Semifinal",
    "Final"
];

const STATES = ["Todos", "Por jugarse", "Terminado"];

export function MatchFilters({ search, onSearchChange, round, onRoundChange, state, onStateChange }) {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
            }}
        >
            <TextField
                placeholder="Buscar por selección..."
                size="small"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{ minWidth: 240, flexGrow: 1 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                select
                label="Ronda"
                size="small"
                value={round}
                onChange={(e) => onRoundChange(e.target.value)}
                sx={{ minWidth: 180 }}
            >
                {ROUNDS.map((r) => (
                    <MenuItem key={r} value={r}>
                        {r}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Estado"
                size="small"
                value={state}
                onChange={(e) => onStateChange(e.target.value)}
                sx={{ minWidth: 160 }}
            >
                {STATES.map((s) => (
                    <MenuItem key={s} value={s}>
                        {s}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
}

export const MATCH_ROUNDS = ROUNDS.filter((r) => r !== "Todas");

export default MatchFilters;