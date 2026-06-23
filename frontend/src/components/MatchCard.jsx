import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StadiumIcon from "@mui/icons-material/Stadium";
import EventIcon from "@mui/icons-material/Event";
import useAuth from "../hooks/useAuth";
import { getFlagSrc } from "../utils/flags";

function TeamFlag({ teamName }) {
    const src = getFlagSrc(teamName);

    if (!src) {
        return (
            <Box
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "60px",
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 0.5,
                }}
            >
                <Typography variant="caption" fontWeight={700} color="text.secondary">
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
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: "60px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.50)",
                display: "block",
                mx: "auto",
                mb: 0.5,
            }}
        />
    );
}

function GoalsList({ match }) {
    const goals = match.goals || [];
    if (goals.length === 0) return null;

    const homeGoals = goals.filter((g) => g.id_team === match.id_home_team);
    const awayGoals = goals.filter((g) => g.id_team === match.id_away_team);

    const renderColumn = (list) =>
        list.map((g) => (
            <Typography
                key={`${g.player_name}-${g.minute}`}
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block" }}
            >
                ⚽ {g.player_name} {g.minute}'
            </Typography>
        ));

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mb: 1,
            }}
        >
            <Box sx={{ flex: 1, textAlign: "center" }}>{renderColumn(homeGoals)}</Box>
            <Box sx={{ minWidth: 70 }} />
            <Box sx={{ flex: 1, textAlign: "center" }}>{renderColumn(awayGoals)}</Box>
        </Box>
    );
}

export function MatchCard({ match, onView, onEdit, onDelete }) {
    const { isAdmin } = useAuth();
    const finished = match.state === "Terminado";

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderTop: "4px solid",
                borderColor: finished ? "secondary.main" : "primary.main",
                transition: "0.35s",
                cursor: "pointer",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                >
                    <Chip
                        label={match.round}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        label={match.state}
                        size="small"
                        color={finished ? "secondary" : "default"}
                    />
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        my: 2,
                    }}
                >
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                        <TeamFlag teamName={match.homeTeamName} />
                        <Typography variant="h6" noWrap>
                            {match.homeTeamName}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center", minWidth: 70 }}>
                        {finished ? (
                            <Typography variant="h4" fontWeight={800} color="primary.dark">
                                {match.goals_home_team} - {match.goals_away_team}
                            </Typography>
                        ) : (
                            <Typography variant="h6" color="text.secondary">
                                vs
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ textAlign: "center", flex: 1 }}>
                        <TeamFlag teamName={match.awayTeamName} />
                        <Typography variant="h6" noWrap>
                            {match.awayTeamName}
                        </Typography>
                    </Box>
                </Box>

                <GoalsList match={match} />

                <Stack spacing={0.5} mt={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {match.date} · {match.time?.slice(0, 5)}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <StadiumIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {match.stadiumName}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                <Tooltip title="Ver detalle">
                    <IconButton onClick={() => onView(match)} size="small">
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                {isAdmin && (
                    <>
                        <Tooltip title="Editar">
                            <IconButton onClick={() => onEdit(match)} size="small" color="primary">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton
                                onClick={() => onDelete(match)}
                                size="small"
                                color="error"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </CardActions>
        </Card>
    );
}

export default MatchCard;