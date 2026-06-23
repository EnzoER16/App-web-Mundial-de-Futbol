import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0B6E4F",
            dark: "#074B35",
            light: "#3C9B73",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#D4AF37",
            dark: "#A6841F",
            contrastText: "#1A1A1A",
        },
        background: {
            default: "#F6F8F6",
            paper: "#FFFFFF",
        },
        success: {
            main: "#0B6E4F",
        },
        warning: {
            main: "#D4AF37",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 800,
            letterSpacing: "-0.5px",
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            fontWeight: 600,
            textTransform: "none",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage:
                        "linear-gradient(90deg, #074B35 0%, #0B6E4F 60%, #117A57 100%)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 10px rgba(7, 75, 53, 0.08)",
                },
            },
        },
    },
});

export default theme;