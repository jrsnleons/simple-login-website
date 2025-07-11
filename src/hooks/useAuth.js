import { useEffect, useState } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");

        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return false;
        }

        try {
            // Basic JWT expiration check
            const payload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;

            if (payload.exp < currentTime) {
                // Token is expired
                logout();
                return false;
            }

            setIsAuthenticated(true);
            setUser(userData ? JSON.parse(userData) : null);
            setIsLoading(false);
            return true;
        } catch {
            // Invalid token format
            logout();
            return false;
        }
    };

    const login = (token, userData) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
    };

    // Token refresh logic
    const refreshToken = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return false;

            const response = await fetch(
                "http://localhost:3000/refresh-token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.user);
                return true;
            } else {
                logout();
                return false;
            }
        } catch {
            logout();
            return false;
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return {
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        refreshToken,
        checkAuth,
    };
};
