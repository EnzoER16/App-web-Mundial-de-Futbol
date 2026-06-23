import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MatchesList from "./pages/MatchesList";
import MatchDetail from "./pages/MatchDetail";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Navigate to="/partidos" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Register />} />

                        <Route
                            path="/partidos"
                            element={
                                <ProtectedRoute>
                                    <MatchesList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/partidos/:id"
                            element={
                                <ProtectedRoute>
                                    <MatchDetail />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;