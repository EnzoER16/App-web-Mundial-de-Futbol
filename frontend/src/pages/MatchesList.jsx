import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import matchService from "../services/matchService";
import catalogService from "../services/catalogService";

import MatchCard from "../components/MatchCard";
import MatchFilters from "../components/MatchFilters";
import MatchFormDialog from "../components/MatchFormDialog";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";

export function MatchesList() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const { data: teams, loading: loadingTeams } = useFetch(
        () => catalogService.getTeams(),
        []
    );
    const { data: stadiums, loading: loadingStadiums } = useFetch(
        () => catalogService.getStadiums(),
        []
    );
    const { data: referees, loading: loadingReferees } = useFetch(
        () => catalogService.getReferees(),
        []
    );

    const {
        data: matches,
        loading: loadingMatches,
        error: matchesError,
        refetch: refetchMatches,
    } = useFetch(() => matchService.getAll(), []);

    const [search, setSearch] = useState("");
    const [roundFilter, setRoundFilter] = useState("Todas");
    const [stateFilter, setStateFilter] = useState("Todos");

    const [formOpen, setFormOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const loadingCatalogs = loadingTeams || loadingStadiums || loadingReferees;

    const teamsMap = useMemo(() => {
        const map = {};
        (teams || []).forEach((t) => (map[t.id_team] = t.name));
        return map;
    }, [teams]);

    const stadiumsMap = useMemo(() => {
        const map = {};
        (stadiums || []).forEach((s) => (map[s.id_stadium] = s.name));
        return map;
    }, [stadiums]);

    const enrichedMatches = useMemo(() => {
        if (!matches) return [];
        return matches.map((m) => ({
            ...m,
            homeTeamName: teamsMap[m.id_home_team] || "Equipo local",
            awayTeamName: teamsMap[m.id_away_team] || "Equipo visitante",
            stadiumName: stadiumsMap[m.id_stadium] || "Estadio",
        }));
    }, [matches, teamsMap, stadiumsMap]);

    const filteredMatches = useMemo(() => {
        return enrichedMatches.filter((m) => {
            const matchesSearch =
                !search ||
                m.homeTeamName.toLowerCase().includes(search.toLowerCase()) ||
                m.awayTeamName.toLowerCase().includes(search.toLowerCase());
            const matchesRound = roundFilter === "Todas" || m.round === roundFilter;
            const matchesState = stateFilter === "Todos" || m.state === stateFilter;
            return matchesSearch && matchesRound && matchesState;
        });
    }, [enrichedMatches, search, roundFilter, stateFilter]);

    const handleCreate = () => {
        setEditingMatch(null);
        setFormOpen(true);
    };

    const handleEdit = (match) => {
        setEditingMatch(match);
        setFormOpen(true);
    };

    const handleView = (match) => {
        navigate(`/partidos/${match.id_match}`);
    };

    const handleFormSubmit = async (payload) => {
        setSubmitting(true);
        try {
            if (editingMatch) {
                await matchService.update(editingMatch.id_match, payload);
                setSnackbar({ open: true, message: "Partido actualizado correctamente", severity: "success" });
            } else {
                await matchService.create(payload);
                setSnackbar({ open: true, message: "Partido creado correctamente", severity: "success" });
            }
            setFormOpen(false);
            refetchMatches();
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            await matchService.remove(deleteTarget.id_match);
            setSnackbar({ open: true, message: "Partido eliminado", severity: "success" });
            setDeleteTarget(null);
            refetchMatches();
        } catch {
            setSnackbar({ open: true, message: "No se pudo eliminar el partido", severity: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4">Fixture del Mundial</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Partidos, resultados y próximos encuentros
                    </Typography>
                </Box>
                {isAdmin && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    >
                        Nuevo partido
                    </Button>
                )}
            </Box>

            <MatchFilters
                search={search}
                onSearchChange={setSearch}
                round={roundFilter}
                onRoundChange={setRoundFilter}
                state={stateFilter}
                onStateChange={setStateFilter}
            />

            {(loadingMatches || loadingCatalogs) && (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {matchesError && !loadingMatches && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {matchesError}. Verificá que el backend Flask esté corriendo en
                    /api/matches.
                </Alert>
            )}

            {!loadingMatches && !loadingCatalogs && filteredMatches.length === 0 && (
                <Alert severity="info">No hay partidos que coincidan con los filtros.</Alert>
            )}

            <Grid container spacing={3}>
                {filteredMatches.map((match) => (
                    <Grid item xs={12} sm={6} md={4} key={match.id_match}>
                        <MatchCard
                            match={match}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={setDeleteTarget}
                        />
                    </Grid>
                ))}
            </Grid>

            {isAdmin && (
                <Fab
                    color="primary"
                    onClick={handleCreate}
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        display: { xs: "inline-flex", sm: "none" },
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

            <MatchFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingMatch}
                teams={teams || []}
                stadiums={stadiums || []}
                referees={referees || []}
                submitting={submitting}
            />

            <ConfirmDeleteDialog
                open={!!deleteTarget}
                match={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                submitting={submitting}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default MatchesList;