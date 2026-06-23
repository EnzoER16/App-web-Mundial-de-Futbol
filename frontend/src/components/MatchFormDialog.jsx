import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Grid,
    Alert,
    CircularProgress,
    Box,
    Typography,
    IconButton,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { MATCH_ROUNDS } from "./MatchFilters";

const EMPTY_FORM = {
    date: "",
    time: "",
    state: "Por jugarse",
    goals_home_team: 0,
    goals_away_team: 0,
    round: "Fase de Grupos",
    id_stadium: "",
    id_referee: "",
    id_home_team: "",
    id_away_team: "",
    goals: [],
};

function GoalsEditor({ label, teamName, idTeam, goals, onAdd, onChange, onRemove }) {
    const rows = goals
        .map((g, index) => ({ ...g, index }))
        .filter((g) => g.id_team === idTeam);

    return (
        <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                {label} {teamName ? `(${teamName})` : ""}
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
                {rows.map((g) => (
                    <Box key={g.index} display="flex" gap={0.5} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Jugador"
                            value={g.player_name}
                            onChange={onChange(g.index, "player_name")}
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            size="small"
                            type="number"
                            placeholder="Min."
                            value={g.minute}
                            onChange={onChange(g.index, "minute")}
                            inputProps={{ min: 1, max: 130 }}
                            sx={{ width: 72 }}
                        />
                        <IconButton size="small" color="error" onClick={() => onRemove(g.index)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
                <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAdd(idTeam)}
                    disabled={!idTeam}
                    sx={{ alignSelf: "flex-start" }}
                >
                    Agregar gol
                </Button>
            </Box>
        </Grid>
    );
}

export function MatchFormDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    teams,
    stadiums,
    referees,
    submitting,
}) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState(null);

    const isEditing = Boolean(initialData);

    useEffect(() => {
        if (open) {
            setForm(
                initialData
                    ? {
                        date: initialData.date || "",
                        time: initialData.time?.slice(0, 5) || "",
                        state: initialData.state || "Por jugarse",
                        goals_home_team: initialData.goals_home_team ?? 0,
                        goals_away_team: initialData.goals_away_team ?? 0,
                        round: initialData.round || "Fase de Grupos",
                        id_stadium: initialData.id_stadium || "",
                        id_referee: initialData.id_referee || "",
                        id_home_team: initialData.id_home_team || "",
                        id_away_team: initialData.id_away_team || "",
                        goals: (initialData.goals || []).map((g) => ({
                            id_team: g.id_team,
                            player_name: g.player_name,
                            minute: g.minute,
                        })),
                    }
                    : EMPTY_FORM
            );
            setErrors({});
            setFormError(null);
        }
    }, [open, initialData]);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.date) newErrors.date = "La fecha es obligatoria";
        if (!form.time) newErrors.time = "La hora es obligatoria";
        if (!form.round) newErrors.round = "Seleccioná una ronda";
        if (!form.id_stadium) newErrors.id_stadium = "Seleccioná un estadio";
        if (!form.id_referee) newErrors.id_referee = "Seleccioná un árbitro";
        if (!form.id_home_team) newErrors.id_home_team = "Seleccioná el equipo local";
        if (!form.id_away_team) newErrors.id_away_team = "Seleccioná el equipo visitante";
        if (
            form.id_home_team &&
            form.id_away_team &&
            form.id_home_team === form.id_away_team
        ) {
            newErrors.id_away_team = "El visitante no puede ser el mismo que el local";
        }
        if (form.goals_home_team < 0 || form.goals_away_team < 0) {
            newErrors.goals_home_team = "Los goles no pueden ser negativos";
        }
        if (form.state === "Terminado") {
            const invalidGoal = form.goals.some(
                (g) => !g.player_name?.trim() || g.minute === "" || Number(g.minute) < 1 || Number(g.minute) > 130
            );
            if (invalidGoal) {
                newErrors.goals = "Cada goleador necesita nombre y un minuto válido (1-130)";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddGoal = (id_team) => {
        setForm((prev) => ({
            ...prev,
            goals: [...prev.goals, { id_team, player_name: "", minute: "" }],
        }));
    };

    const handleGoalChange = (index, field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            goals: prev.goals.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
        }));
    };

    const handleRemoveGoal = (index) => {
        setForm((prev) => ({
            ...prev,
            goals: prev.goals.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        setFormError(null);
        if (!validate()) return;

        const payload = {
            ...form,
            time: form.time.length === 5 ? `${form.time}:00` : form.time,
            goals_home_team: Number(form.goals_home_team),
            goals_away_team: Number(form.goals_away_team),
            goals:
                form.state === "Terminado"
                    ? form.goals.map((g) => ({
                        id_team: g.id_team,
                        player_name: g.player_name.trim(),
                        minute: Number(g.minute),
                    }))
                    : [],
        };

        try {
            await onSubmit(payload);
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "No se pudo guardar el partido. Verificá los datos e intentá de nuevo."
            );
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "Editar partido" : "Nuevo partido"}</DialogTitle>
            <DialogContent>
                {formError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {formError}
                    </Alert>
                )}
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Equipo local"
                            value={form.id_home_team}
                            onChange={handleChange("id_home_team")}
                            error={!!errors.id_home_team}
                            helperText={errors.id_home_team}
                        >
                            {teams.map((t) => (
                                <MenuItem key={t.id_team} value={t.id_team}>
                                    {t.flag} {t.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Equipo visitante"
                            value={form.id_away_team}
                            onChange={handleChange("id_away_team")}
                            error={!!errors.id_away_team}
                            helperText={errors.id_away_team}
                        >
                            {teams.map((t) => (
                                <MenuItem key={t.id_team} value={t.id_team}>
                                    {t.flag} {t.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            type="date"
                            fullWidth
                            label="Fecha"
                            InputLabelProps={{ shrink: true }}
                            value={form.date}
                            onChange={handleChange("date")}
                            error={!!errors.date}
                            helperText={errors.date}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type="time"
                            fullWidth
                            label="Hora"
                            InputLabelProps={{ shrink: true }}
                            value={form.time}
                            onChange={handleChange("time")}
                            error={!!errors.time}
                            helperText={errors.time}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Ronda"
                            value={form.round}
                            onChange={handleChange("round")}
                            error={!!errors.round}
                            helperText={errors.round}
                        >
                            {MATCH_ROUNDS.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Estado"
                            value={form.state}
                            onChange={handleChange("state")}
                        >
                            <MenuItem value="Por jugarse">Por jugarse</MenuItem>
                            <MenuItem value="Terminado">Terminado</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Estadio"
                            value={form.id_stadium}
                            onChange={handleChange("id_stadium")}
                            error={!!errors.id_stadium}
                            helperText={errors.id_stadium}
                        >
                            {stadiums.map((s) => (
                                <MenuItem key={s.id_stadium} value={s.id_stadium}>
                                    {s.name} ({s.city})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Árbitro"
                            value={form.id_referee}
                            onChange={handleChange("id_referee")}
                            error={!!errors.id_referee}
                            helperText={errors.id_referee}
                        >
                            {referees.map((r) => (
                                <MenuItem key={r.id_referee} value={r.id_referee}>
                                    {r.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {form.state === "Terminado" && (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Goles local"
                                    value={form.goals_home_team}
                                    onChange={handleChange("goals_home_team")}
                                    error={!!errors.goals_home_team}
                                    helperText={errors.goals_home_team}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Goles visitante"
                                    value={form.goals_away_team}
                                    onChange={handleChange("goals_away_team")}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Goleadores
                                </Typography>
                                {errors.goals && (
                                    <Alert severity="error" sx={{ mb: 1.5 }}>
                                        {errors.goals}
                                    </Alert>
                                )}
                            </Grid>

                            <GoalsEditor
                                label="Local"
                                teamName={teams.find((t) => t.id_team === form.id_home_team)?.name}
                                idTeam={form.id_home_team}
                                goals={form.goals}
                                onAdd={handleAddGoal}
                                onChange={handleGoalChange}
                                onRemove={handleRemoveGoal}
                            />
                            <GoalsEditor
                                label="Visitante"
                                teamName={teams.find((t) => t.id_team === form.id_away_team)?.name}
                                idTeam={form.id_away_team}
                                goals={form.goals}
                                onAdd={handleAddGoal}
                                onChange={handleGoalChange}
                                onRemove={handleRemoveGoal}
                            />
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isEditing ? "Guardar cambios" : "Crear partido"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MatchFormDialog;