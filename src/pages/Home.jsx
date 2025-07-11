import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
    const { isAuthenticated, user, isLoading, logout } = useAuth();

    if (isLoading) {
        return <Loading message="Checking authentication..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <div>
            <h1>Welcome to Home!</h1>
            <p>You are successfully logged in.</p>
            {user && (
                <div>
                    <p>Welcome, {user.username}!</p>
                    <p>User ID: {user.id}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
