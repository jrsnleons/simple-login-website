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
        <div className="flex flex-col items-center justify-center w-1/4 gap-3">
            <h1 className="text-neutral-100 text-2xl font-bold">
                Welcome {user.username}!
            </h1>
            {user && (
                <div className="text-neutral-300 border-1 border-neutral-800 bg-neutral-900 rounded-md w-full p-3">
                    <h1 className="font-bold mb-5 text-xl">User Details: </h1>
                    <div className="flex flex-row justify-between">
                        <p className="text-neutral-500 font-mono text-sm">
                            Username:
                        </p>
                        <p className="font-mono text-sm"> {user.username}</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className="text-neutral-500 font-mono text-sm">
                            User ID:
                        </p>
                        <p className="font-mono text-sm"> {user.id}</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className="text-neutral-500 font-mono text-sm">
                            Email:
                        </p>
                        <p className="font-mono text-sm"> {user.email}</p>
                    </div>
                    <button
                        className="mt-5 w-full cursor-pointer text-red-700 hover:text-neutral-50 border-1  border-red-800 hover:bg-red-800 rounded py-3 font-bold text-sm transition-colors ease-in-out duration-300"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
