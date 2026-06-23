import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFound() {
    return (
        <Box textAlign="center" py={10}>
            <Typography variant="h1" fontWeight={800} color="primary.main">
                404
            </Typography>
            <Typography variant="h6" mb={3}>
                Esta jugada no existe.
            </Typography>
            <Button component={RouterLink} to="/partidos" variant="contained">
                Volver al fixture
            </Button>
        </Box>
    );
}

export default NotFound;