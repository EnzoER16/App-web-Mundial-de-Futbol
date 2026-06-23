import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                setLoading(false);
                return;
            }
            try {
                const freshUser = await authService.me();
                localStorage.setItem("user", JSON.stringify(freshUser));
                setUser(freshUser);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = async (username, password) => {
        setAuthError(null);
        try {
            const { token, user: loggedUser } = await authService.login(
                username,
                password
            );
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(loggedUser));
            setUser(loggedUser);
            return loggedUser;
        } catch (err) {
            const message =
                err.response?.status === 401
                    ? "Usuario o contraseña incorrectos"
                    : "No se pudo iniciar sesión. Intentá nuevamente.";
            setAuthError(message);
            throw err;
        }
    };

    const register = async (payload) => {
        setAuthError(null);
        try {
            return await authService.register(payload);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "No se pudo completar el registro. Intentá nuevamente.";
            setAuthError(message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {

        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "Admin",
        loading,
        authError,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}