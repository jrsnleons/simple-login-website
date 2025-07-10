import React from "react";

const Register = () => {
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [message, setMessage] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Registration attempt with:", {
                username,
                email,
                password,
            });

            setMessage("Registration successful!");
            // const response = await fetch("https://example.com/api/register", {
            // method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ username, email, password }),
            // });
            //    if (response.ok) {
            //   setMessage("Registration successful!");
            //   // TODO: Redirect to home page or perform other actions
            // } else {
            //   setMessage("Registration failed. Please try again.");
            // }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("An error occurred. Please try again.");
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
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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

export default Register;
