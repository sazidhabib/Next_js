import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAdmin, setIsAdmin] = useState(() => {
        try {
            const storedIsAdmin = localStorage.getItem("isAdmin");
            return storedIsAdmin ? JSON.parse(storedIsAdmin) : false;
        } catch (error) {
            console.error("Error parsing isAdmin from localStorage:", error);
            return false;
        }
    });

    const [loggedOut, setLoggedOut] = useState(false); // 👈 NEW

    const isLoggedIn = !!token;

    const LogoutUser = () => {
        setToken("");
        setIsAdmin(false);
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setLoggedOut(true); // 👈 trigger redirect from a component
    };

    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            const expTime = decoded.exp * 1000;

            if (Date.now() >= expTime) {
                LogoutUser();
            } else {
                const timeout = expTime - Date.now();
                const timer = setTimeout(() => {
                    LogoutUser();
                    alert("Session expired. You have been logged out.");
                }, timeout);

                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error("Invalid token:", error);
            LogoutUser();
        }
    }, [token]);

    const storeTokenInLS = (serverToken, adminStatus) => {
        localStorage.setItem("token", serverToken);
        localStorage.setItem("isAdmin", JSON.stringify(!!adminStatus));
        setToken(serverToken);
        setIsAdmin(!!adminStatus);
        setLoggedOut(false); // Reset if logging in
    };

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, isAdmin, storeTokenInLS, LogoutUser, loggedOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth must be used inside the AuthProvider");
    }
    return authContextValue;
};
