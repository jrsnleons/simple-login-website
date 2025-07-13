import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { isAuthenticated, login } = useAuth();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
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
        <div className="border-1 border-neutral-800 bg-neutral-900 rounded-md p-5 w-1/4">
            <div>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold mb-9 ">Login</h2>
                    <div className="flex flex-col my-3">
                        <label className="text-neutral-200 text-sm font-bold">
                            Email:
                        </label>
                        <input
                            className="bg-neutral-900 border-1 border-neutral-800 rounded mt-1 p-1 px-3 focus:outline-none text-sm text-neutral-300 placeholder:text-xs placeholder:text-neutral-700"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="example@email.com"
                        />
                    </div>
                    <div className="flex flex-col my-3">
                        <label className="text-neutral-200 text-sm font-bold">
                            Password:
                        </label>
                        <div className="relative">
                            <input
                                className="bg-neutral-900 border-1 border-neutral-800 rounded-sm mt-1 p-1 px-3 pr-10 text-sm focus:outline-none text-neutral-300 placeholder:text-xs placeholder:text-neutral-700 w-full"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="***********"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-4 h-4 hover:text-neutral-300 cursor-pointer text-neutral-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-4 h-4 hover:text-neutral-300 cursor-pointer text-neutral-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-neutral-800 py-2 px-5 rounded-md w-full font-bold hover:cursor-pointer hover:bg-emerald-600 transition-colors ease-in-out duration-300 "
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {message && <p>{message}</p>}
                </form>

                <p className="font-thin text-xs text-right mt-2 text-neutral-400">
                    Don't have an account?{" "}
                    <Link
                        className="hover:text-emerald-500 transition-colors animation ease-in font-bold"
                        to={"/register"}
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
