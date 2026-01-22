"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./home.css";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🔐</span>
            <span className="logo-text">AuthHub</span>
          </div>
          
          <div className="nav-links">
            {isLoggedIn ? (
              <Link href="/dashboard" className="nav-button nav-dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="nav-button nav-login">
                  Sign In
                </Link>
                <Link href="/signup" className="nav-button nav-signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Secure Authentication Made Simple</h1>
          <p className="hero-subtitle">
            Join thousands of users enjoying seamless and secure login experience
          </p>
          
          <div className="hero-buttons">
            <Link href="/login" className="hero-button hero-login">
              Sign In Now
            </Link>
            <Link href="/signup" className="hero-button hero-signup">
              Create Account
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-number">256-bit</span>
              <span className="stat-label">Encryption</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="card-icon">🛡️</span>
            <p>Secure</p>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">⚡</span>
            <p>Fast</p>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">✨</span>
            <p>Easy</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose AuthHub?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Bank-Level Security</h3>
            <p>Your data is protected with military-grade encryption and advanced security protocols.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Easy Integration</h3>
            <p>Simple APIs and comprehensive documentation for quick implementation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Sub-millisecond authentication with globally distributed servers.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Optimized</h3>
            <p>Perfect authentication experience on all devices and screen sizes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Support</h3>
            <p>24/7 customer support available in multiple languages and timezones.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Always Available</h3>
            <p>99.9% uptime guarantee with automatic failover and redundancy.</p>
          </div>
        </div>
      </section>

      {/* Advertisement Sections */}
      <section className="ads-section">
        <h2 className="section-title">Premium Plans</h2>
        
        <div className="pricing-grid">
          <div className="pricing-card basic">
            <div className="pricing-badge">Starter</div>
            <h3>Basic</h3>
            <div className="price">
              <span className="amount">$0</span>
              <span className="period">/month</span>
            </div>
            <ul className="price-features">
              <li>✓ Up to 1,000 users</li>
              <li>✓ Basic analytics</li>
              <li>✓ Email support</li>
              <li>✓ API access</li>
            </ul>
            <button className="price-button">Get Started</button>
          </div>

          <div className="pricing-card pro">
            <div className="pricing-badge popular">Most Popular</div>
            <h3>Professional</h3>
            <div className="price">
              <span className="amount">$29</span>
              <span className="period">/month</span>
            </div>
            <ul className="price-features">
              <li>✓ Up to 100,000 users</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
              <li>✓ Custom integrations</li>
            </ul>
            <button className="price-button pro-button">Upgrade Now</button>
          </div>

          <div className="pricing-card enterprise">
            <div className="pricing-badge">Enterprise</div>
            <h3>Enterprise</h3>
            <div className="price">
              <span className="amount">Custom</span>
              <span className="period">/month</span>
            </div>
            <ul className="price-features">
              <li>✓ Unlimited users</li>
              <li>✓ Dedicated account manager</li>
              <li>✓ Custom SLA</li>
              <li>✓ On-premise option</li>
            </ul>
            <button className="price-button">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Secure Your Application?</h2>
          <p>Join our community and start authenticating users in minutes.</p>
          
          <div className="cta-buttons">
            <Link href="/signup" className="cta-button primary">
              Create Free Account
            </Link>
            <Link href="/login" className="cta-button secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>AuthHub</h4>
            <p>Secure authentication solutions for modern applications.</p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 AuthHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
