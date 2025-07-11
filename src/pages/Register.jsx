import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const { isAuthenticated } = useAuth();
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
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
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            handleInputChange("username", e.target.value)
                        }
                        required
                        disabled={loading}
                        style={{
                            borderColor: errors.username ? "#e74c3c" : "",
                        }}
                    />
                    {errors.username && (
                        <div style={{ color: "#e74c3c", fontSize: "0.875rem" }}>
                            {errors.username.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        required
                        disabled={loading}
                        style={{ borderColor: errors.email ? "#e74c3c" : "" }}
                    />
                    {errors.email && (
                        <div style={{ color: "#e74c3c", fontSize: "0.875rem" }}>
                            {errors.email.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            handleInputChange("password", e.target.value)
                        }
                        required
                        disabled={loading}
                        style={{
                            borderColor: errors.password ? "#e74c3c" : "",
                        }}
                    />
                    {errors.password && (
                        <div style={{ color: "#e74c3c", fontSize: "0.875rem" }}>
                            {errors.password.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                {message && <p>{message}</p>}
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;
