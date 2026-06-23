import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

export function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/partidos" replace />;
    }

    return children;
}

export default ProtectedRoute;