import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const USER_KEY = "shopmartUser";
    const AUTH_KEY = "shopmartAuth";

    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const location = useLocation();
    const from = location.state?.from || "/";

    useEffect(() => {
        if (localStorage.getItem(AUTH_KEY) === "true") {
            navigate(from);
        }
    }, [navigate, from]);

    const getUser = () => {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return;
        }

        if (mode === "signup") {
            if (password.length < 6) {
                setError("Password must be at least 6 characters.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            const existing = getUser();
            if (existing && existing.email === email.trim().toLowerCase()) {
                setError("This email is already registered. Please login.");
                return;
            }

            localStorage.setItem(
                USER_KEY,
                JSON.stringify({ email: email.trim().toLowerCase(), password })
            );
            setMessage("Signup successful! Please login to continue.");
            setMode("login");
            setPassword("");
            setConfirmPassword("");
            return;
        }

        const existing = getUser();
        if (!existing) {
            setError("No registered account found. Please sign up first.");
            return;
        }

        if (existing.email !== email.trim().toLowerCase() || existing.password !== password) {
            setError("Email or password is incorrect.");
            return;
        }

        localStorage.setItem(AUTH_KEY, "true");
        window.dispatchEvent(new Event("authChanged"));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate(from), 700);
    };

    const toggleMode = () => {
        setMessage("");
        setError("");
        setMode(mode === "login" ? "signup" : "login");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>{mode === "login" ? "Welcome Back" : "Create Your Account"}</h1>
                <p className="login-description">
                    {mode === "login"
                        ? "Login using the account you created on this site."
                        : "Sign up with an email and password to start shopping."}
                </p>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Email address
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    {mode === "signup" && (
                        <label>
                            Confirm Password
                            <input
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                    )}
                    <button type="submit" className="login-submit">
                        {mode === "login" ? "Sign In" : "Sign Up"}
                    </button>
                </form>
                {message && <p className="auth-message">{message}</p>}
                {error && <p className="auth-error">{error}</p>}
                <p className="login-footer">
                    {mode === "login" ? "New here?" : "Already registered?"}{" "}
                    <button type="button" className="login-footer-link" onClick={toggleMode}>
                        {mode === "login" ? "Create account" : "Sign in instead"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
