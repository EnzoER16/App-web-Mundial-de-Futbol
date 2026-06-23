import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Chip,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import useAuth from "../hooks/useAuth";

export function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = async () => {
        setAnchorEl(null);
        await logout();
        navigate("/login");
    };

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar sx={{ gap: 1 }}>
                <SportsSoccerIcon sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/partidos"
                    sx={{
                        flexGrow: 1,
                        color: "inherit",
                        textDecoration: "none",
                        fontWeight: 800,
                    }}
                >
                    Mundial · Partidos
                </Typography>

                {isAuthenticated && (
                    <Button
                        component={RouterLink}
                        to="/partidos"
                        color="inherit"
                        sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    >
                        Fixture
                    </Button>
                )}

                {isAuthenticated ? (
                    <>
                        <Chip
                            label={isAdmin ? "Admin" : "Usuario"}
                            size="small"
                            color="secondary"
                            sx={{ display: { xs: "none", sm: "inline-flex" }, mr: 1 }}
                        />
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: "secondary.main", color: "#1A1A1A" }}>
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={!!anchorEl}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem disabled>{user?.username}</MenuItem>
                            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button component={RouterLink} to="/login" color="inherit">
                            Ingresar
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/registro"
                            variant="contained"
                            color="secondary"
                        >
                            Crear cuenta
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;