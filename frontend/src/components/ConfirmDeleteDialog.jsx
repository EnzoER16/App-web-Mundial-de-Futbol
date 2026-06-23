import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
}from "@mui/material";

export function ConfirmDeleteDialog({ open, match, onClose, onConfirm, submitting }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Eliminar partido</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Seguro que querés eliminar el partido{" "}
                    <strong>
                        {match?.homeTeamName} vs {match?.awayTeamName}
                    </strong>{" "}
                    ({match?.date})? Esta acción no se puede deshacer.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDeleteDialog;
