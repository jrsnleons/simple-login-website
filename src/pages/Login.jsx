import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { isAuthenticated, login } = useAuth();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState("");

    // If already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            console.log("Login attempt with:", { email, password });

            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.user);
                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else {
                console.log(response);
                if (response.status === 500) {
                    setMessage("Server error. Please try again later.");
                } else if (response.status === 400) {
                    setMessage("All fields are required.");
                } else if (response.status === 401) {
                    setMessage("Invalid email or password.");
                } else {
                    setMessage("Login failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage(
                "Cannot connect to server. Please check your connection."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                {message && <p>{message}</p>}
            </form>
            <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
        </div>
    );
};

export default Login;
