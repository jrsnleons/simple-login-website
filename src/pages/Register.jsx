import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const { isAuthenticated } = useAuth();
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [errors, setErrors] = React.useState({});

    // If already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Validation functions
    const validateUsername = (username) => {
        const errors = [];
        if (username.length < 3 || username.length > 30) {
            errors.push("Username must be between 3 and 30 characters");
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push(
                "Username can only contain letters, numbers, and underscores"
            );
        }
        return errors;
    };

    const validateEmail = (email) => {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Please provide a valid email");
        }
        return errors;
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            errors.push(
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            );
        }
        return errors;
    };

    const validateForm = () => {
        const newErrors = {};

        const usernameErrors = validateUsername(username);
        if (usernameErrors.length > 0) {
            newErrors.username = usernameErrors;
        }

        const emailErrors = validateEmail(email);
        if (emailErrors.length > 0) {
            newErrors.email = emailErrors;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        // Clear errors for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }

        // Update the field value
        switch (field) {
            case "username":
                setUsername(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // Validate form before submitting
        if (!validateForm()) {
            setMessage("Please fix the errors below");
            return;
        }

        setLoading(true);

        try {
            console.log("Registration attempt with:", {
                username,
                email,
                password,
            });

            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                setMessage(
                    "Registration successful! Please login to continue."
                );
                // Clear form
                setUsername("");
                setEmail("");
                setPassword("");
                setErrors({});
            } else {
                const errorData = await response.json().catch(() => null);
                console.log(response);

                if (response.status === 500) {
                    setMessage("Server error. Please try again later.");
                } else if (response.status === 400) {
                    // Handle validation errors from server
                    if (errorData && errorData.errors) {
                        const serverErrors = {};
                        errorData.errors.forEach((error) => {
                            const field = error.path || error.param;
                            if (!serverErrors[field]) {
                                serverErrors[field] = [];
                            }
                            serverErrors[field].push(error.msg);
                        });
                        setErrors(serverErrors);
                        setMessage("Please fix the errors below");
                    } else {
                        setMessage("All fields are required.");
                    }
                } else if (response.status === 409) {
                    setMessage("Email already exists.");
                } else {
                    setMessage("Registration failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage(
                "Cannot connect to server. Please check your connection."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-1 border-neutral-800 bg-neutral-900 rounded-md p-5 w-1/4">
            <form onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-9">Register</h2>
                {message && <p className="text-xs text-neutral-500">{message}</p>}

                <div className="flex flex-col my-3">
                    <label className="text-neutral-200 text-sm font-bold">
                        Username
                    </label>
                    <input
                        className={`bg-neutral-900 border-1 rounded mt-1 p-1 px-3 focus:outline-none text-sm text-neutral-300 placeholder:text-xs placeholder:text-neutral-700 ${
                            errors.username
                                ? "border-red-400"
                                : "border-neutral-800"
                        }`}
                        type="text"
                        value={username}
                        onChange={(e) =>
                            handleInputChange("username", e.target.value)
                        }
                        required
                        disabled={loading}
                        placeholder="name"
                    />
                    {errors.username && (
                        <div className="text-red-400 text-xs">
                            {errors.username.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col my-3">
                    <label className="text-neutral-200 text-sm font-bold">
                        Email
                    </label>
                    <input
                        className={`bg-neutral-900 border-1 rounded mt-1 p-1 px-3 focus:outline-none text-sm text-neutral-300 placeholder:text-xs placeholder:text-neutral-700 ${
                            errors.email
                                ? "border-red-400"
                                : "border-neutral-800"
                        }`}
                        type="email"
                        value={email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        required
                        disabled={loading}
                        placeholder="example@email.com"
                    />
                    {errors.email && (
                        <div className="text-red-400 text-xs">
                            {errors.email.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col my-3">
                    <label className="text-neutral-200 text-sm font-bold">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            className={`bg-neutral-900 border-1 rounded mt-1 p-1 px-3 pr-10 focus:outline-none text-sm text-neutral-300 placeholder:text-xs placeholder:text-neutral-700 w-full ${
                                errors.password
                                    ? "border-red-400"
                                    : "border-neutral-800"
                            }`}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) =>
                                handleInputChange("password", e.target.value)
                            }
                            required
                            disabled={loading}
                            placeholder="**********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
                            disabled={loading}
                        >
                            {showPassword ? (
                                <svg
                                    className="w-4 h-4 text-neutral-700 hover:text-neutral-300 cursor-pointer"
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
                                    className="w-4 h-4 text-neutral-700 hover:text-neutral-300 cursor-pointer"
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
                    {errors.password && (
                        <div className="text-red-400 text-xs">
                            {errors.password.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-neutral-800 py-2 px-5 rounded-md w-full font-bold hover:cursor-pointer hover:bg-emerald-600 transition-colors ease-in-out duration-300 "
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <p className="font-thin text-xs text-right mt-2 text-neutral-400">
                Already have an account?{" "}
                <Link
                    className="hover:text-emerald-500 transition-colors animation ease-in font-bold"
                    to="/login"
                >
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;
