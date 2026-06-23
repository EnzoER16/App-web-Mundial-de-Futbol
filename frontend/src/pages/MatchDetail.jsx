import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Box,
    Typography,
    Chip,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StadiumIcon from "@mui/icons-material/Stadium";
import EventIcon from "@mui/icons-material/Event";
import SportsIcon from "@mui/icons-material/Sports";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PersonIcon from "@mui/icons-material/Person";

import useFetch from "../hooks/useFetch";
import matchService from "../services/matchService";
import catalogService from "../services/catalogService";
import { getFlagSrc } from "../utils/flags";

function TeamFlagLarge({ teamName }) {
    const src = getFlagSrc(teamName);
    if (!src) {
        return (
            <Box
                sx={{
                    width: 72,
                    height: 50,
                    borderRadius: 1,
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 1,
                }}
            >
                <Typography variant="h6" fontWeight={700} color="text.secondary">
                    {teamName?.charAt(0)?.toUpperCase() || "?"}
                </Typography>
            </Box>
        );
    }
    return (
        <Box
            component="img"
            src={src}
            alt={`Bandera de ${teamName}`}
            sx={{
                width: 72,
                height: 50,
                objectFit: "cover",
                borderRadius: 1,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                display: "block",
                mx: "auto",
                mb: 1,
            }}
        />
    );
}

export function MatchDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: match, loading, error } = useFetch(
        () => matchService.getById(id),
        [id]
    );
    const { data: teams } = useFetch(() => catalogService.getTeams(), []);
    const { data: stadiums } = useFetch(() => catalogService.getStadiums(), []);
    const { data: referees } = useFetch(() => catalogService.getReferees(), []);

    const homeTeam = useMemo(
        () => teams?.find((t) => t.id_team === match?.id_home_team),
        [teams, match]
    );
    const awayTeam = useMemo(
        () => teams?.find((t) => t.id_team === match?.id_away_team),
        [teams, match]
    );
    const stadium = useMemo(
        () => stadiums?.find((s) => s.id_stadium === match?.id_stadium),
        [stadiums, match]
    );
    const referee = useMemo(
        () => referees?.find((r) => r.id_referee === match?.id_referee),
        [referees, match]
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !match) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Alert severity="error">No se pudo cargar el partido solicitado.</Alert>
                <Button sx={{ mt: 2 }} onClick={() => navigate("/partidos")}>
                    Volver al fixture
                </Button>
            </Container>
        );
    }

    const finished = match.state === "Terminado";

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/partidos")}
                sx={{ mb: 2 }}
            >
                Volver al fixture
            </Button>

            <Paper sx={{ p: 4 }} elevation={3}>
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Chip label={match.round} color="primary" />
                    <Chip label={match.state} color={finished ? "secondary" : "default"} />
                </Box>

                <Grid container alignItems="center" textAlign="center" mb={3}>
                    <Grid item xs={5}>
                        <TeamFlagLarge teamName={homeTeam?.name} />
                        <Typography variant="h6">{homeTeam?.name || "Equipo local"}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        {finished ? (
                            <Typography variant="h3" fontWeight={800} color="primary.dark">
                                {match.goals_home_team}-{match.goals_away_team}
                            </Typography>
                        ) : (
                            <Typography variant="h5" color="text.secondary">
                                vs
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={5}>
                        <TeamFlagLarge teamName={awayTeam?.name} />
                        <Typography variant="h6">{awayTeam?.name || "Equipo visitante"}</Typography>
                    </Grid>
                </Grid>

                {match.goals?.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Goleadores
                        </Typography>
                        <Grid container>
                            <Grid item xs={6}>
                                {match.goals
                                    .filter((g) => g.id_team === match.id_home_team)
                                    .map((g) => (
                                        <Box
                                            key={g.id_goal}
                                            display="flex"
                                            alignItems="center"
                                            gap={0.75}
                                            mb={0.5}
                                        >
                                            <SportsSoccerIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {g.player_name} <strong>{g.minute}'</strong>
                                            </Typography>
                                        </Box>
                                    ))}
                            </Grid>
                            <Grid item xs={6}>
                                {match.goals
                                    .filter((g) => g.id_team === match.id_away_team)
                                    .map((g) => (
                                        <Box
                                            key={g.id_goal}
                                            display="flex"
                                            alignItems="center"
                                            gap={0.75}
                                            mb={0.5}
                                            justifyContent="flex-end"
                                        >
                                            <Typography variant="body2">
                                                <strong>{g.minute}'</strong> {g.player_name}
                                            </Typography>
                                            <SportsSoccerIcon fontSize="small" color="action" />
                                        </Box>
                                    ))}
                            </Grid>
                        </Grid>
                    </>
                )}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" gap={1.5} alignItems="center">
                        <EventIcon color="action" />
                        <Typography>
                            {match.date} a las {match.time?.slice(0, 5)}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="center">
                        <StadiumIcon color="action" />
                        <Typography>
                            {stadium?.name || "Estadio"} — {stadium?.city}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="center">
                        <PersonIcon color="action" />
                        <Typography>Árbitro: {referee?.name || "A confirmar"}</Typography>
                    </Box>
                    <Box display="flex" gap={1.5} alignItems="center">
                        <SportsIcon color="action" />
                        <Typography>ID del partido: {match.id_match}</Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default MatchDetail;