"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ProtectedRoute } from "@/lib/protectedRoute";
import "./dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <DashboardContent user={user} onLogout={handleLogout} />
    </ProtectedRoute>
  );
}

function DashboardContent({
  user,
  onLogout,
}: {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}) {
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user.name}! 👋</h1>
          <button onClick={onLogout} className="logout-button">
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
