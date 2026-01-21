"use client";

import { useState } from "react";
import { signupUser } from "@/lib/api";
import "./signup.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signupUser({ name, email, password });
      setSuccess("Signup successful. You can now login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p className="subtitle">Join us today and get started</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="signup-button">
            {loading ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">✕</span>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            {success}
          </div>
        )}

        <p className="signin-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>

      <div className="decoration-circle circle-1"></div>
      <div className="decoration-circle circle-2"></div>
    </div>
  );
}
