"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

interface User {
  name: string;
  email: string;
  token: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user.name}! 👋</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2>Profile Information</h2>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Full Name</label>
            <p className="info-value">{user.name}</p>
          </div>

          <div className="info-item">
            <label>Email Address</label>
            <p className="info-value">{user.email}</p>
          </div>

          <div className="info-item">
            <label>Account Status</label>
            <p className="info-value status-active">✓ Active</p>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Dashboard</h3>
          <p>You are successfully logged in</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <h3>Security</h3>
          <p>Your account is secure</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Manage your preferences</p>
        </div>
      </div>
    </div>
  );
}
