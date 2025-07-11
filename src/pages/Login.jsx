import React from "react";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [message, setMessage] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Login attempt with:", {
                email,
                password,
            });

            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                setMessage("Login Successful. Redirecting to home page...");

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
            console.error("Login rror:", error);
            setMessage("An error occurred. Please try again.");
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
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Login;
