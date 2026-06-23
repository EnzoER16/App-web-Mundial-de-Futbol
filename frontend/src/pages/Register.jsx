import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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

export function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(form);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo completar el registro. Probá nuevamente."
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
                        Crear cuenta
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Cuenta creada. Redirigiendo al login...
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Usuario"
                        margin="normal"
                        value={form.username}
                        onChange={handleChange("username")}
                        required
                    />
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        margin="normal"
                        value={form.email}
                        onChange={handleChange("email")}
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Contraseña"
                        margin="normal"
                        value={form.password}
                        onChange={handleChange("password")}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3 }}
                        disabled={loading || success}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        Registrarme
                    </Button>
                </Box>

                <Typography variant="body2" textAlign="center" mt={3}>
                    ¿Ya tenés cuenta?{" "}
                    <Link component={RouterLink} to="/login">
                        Ingresá
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Register;