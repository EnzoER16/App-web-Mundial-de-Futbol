import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import useAuth from "../hooks/useAuth";

export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/partidos";

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(form.username, form.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(
                err.response?.status === 401
                    ? "Usuario o contraseña incorrectos"
                    : "No se pudo iniciar sesión. Intentá nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 2,
            }}
        >
            <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }} elevation={3}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <SportsSoccerIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    <Typography variant="h5" mt={1}>
                        Ingresar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Accedé para gestionar el fixture del Mundial
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Usuario"
                        margin="normal"
                        value={form.username}
                        onChange={handleChange("username")}
                        autoFocus
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Contraseña"
                        margin="normal"
                        value={form.password}
                        onChange={handleChange("password")}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3 }}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        Ingresar
                    </Button>
                </Box>

                <Typography variant="body2" textAlign="center" mt={3}>
                    ¿No tenés cuenta?{" "}
                    <Link component={RouterLink} to="/registro">
                        Registrate
                    </Link>
                </Typography>

                <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                    Usuarios de prueba (creados por seed.py): admin / admin123 (Admin) · user / user123 (User)
                </Typography>
            </Paper>
        </Box>
    );
}

export default Login;