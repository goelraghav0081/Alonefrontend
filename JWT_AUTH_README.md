# JWT Authentication Flow - Frontend Implementation

This document explains how JWT (JSON Web Token) authentication works in this Next.js frontend application.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Components](#key-components)
3. [How It Works](#how-it-works)
4. [File Structure](#file-structure)
5. [Setup Instructions](#setup-instructions)
6. [Usage Examples](#usage-examples)
7. [Common Scenarios](#common-scenarios)

---

## 🔐 Overview

This frontend implements a **complete JWT authentication system** with:
- ✅ **Access Token** (short-lived) - Used for API requests
- ✅ **Refresh Token** (long-lived) - Used to get new access tokens
- ✅ **Auto Token Refresh** - Automatically refreshes expired tokens
- ✅ **Protected Routes** - Ensures only logged-in users can access certain pages
- ✅ **Global Auth State** - Share authentication data across all components

### Why Two Tokens?

| Token | Purpose | Lifespan | Where Stored |
|-------|---------|----------|--------------|
| **Access Token** | Make API requests | 15 mins | localStorage |
| **Refresh Token** | Get new access token | 7 days | localStorage |

---

## 🏗️ Key Components

### 1. **tokenManager.ts** - Token Storage & Refresh
**Location:** `lib/tokenManager.ts`

Handles all token operations:
```typescript
// Store tokens after login
tokenManager.setTokens(accessToken, refreshToken);

// Get current access token
const token = tokenManager.getAccessToken();

// Get refresh token
const refreshToken = tokenManager.getRefreshToken();

// Refresh access token when it expires
const newToken = await tokenManager.refreshAccessToken();

// Clear all tokens (logout)
tokenManager.clearTokens();

// Check if user has a token
if (tokenManager.hasToken()) { ... }
```

---

### 2. **apiClient.ts** - Smart API Requests
**Location:** `lib/apiClient.ts`

Makes HTTP requests with automatic token management:

```typescript
// Automatically adds Authorization header
const data = await apiCallJson("/api/protected-endpoint");

// If token expires, automatically refreshes and retries
// If refresh fails, logs out user
```

**Key Features:**
- Adds `Authorization: Bearer <token>` header to all requests
- Detects expired tokens (401 errors)
- Automatically refreshes token and retries request
- Handles refresh failures gracefully

---

### 3. **authContext.tsx** - Global Auth State
**Location:** `lib/authContext.tsx`

Manages authentication state across entire app using React Context:

```typescript
// Access auth state and functions in any component
const { user, isAuthenticated, isLoading, logout, setUser } = useAuth();

// Example:
if (isAuthenticated) {
  // User is logged in
  console.log(user.name, user.email);
} else {
  // User not logged in
}
```

**Provides:**
- `user` - Currently logged-in user info
- `isAuthenticated` - Whether user is logged in
- `isLoading` - Whether auth is being checked
- `logout()` - Function to log out
- `setUser()` - Function to update user data

---

### 4. **protectedRoute.tsx** - Route Protection
**Location:** `lib/protectedRoute.tsx`

Wraps pages to ensure only authenticated users can access:

```typescript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

**Behavior:**
- If user is logged in → Shows component
- If user not logged in → Redirects to `/login`
- While checking auth → Shows loading spinner

---

## 🔄 How It Works

### Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER LOGIN                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    User submits email & password
                            ↓
┌─────────────────────────────────────────────────────────────┐
│             Backend API /api/auth/login                     │
│  Returns: { accessToken, refreshToken, user }              │
└─────────────────────────────────────────────────────────────┘
                            ↓
            tokenManager.setTokens() stores both tokens
                            ↓
            AuthContext updates with user info
                            ↓
            Redirects to /dashboard
```

### API Request Flow

```
┌──────────────────────────────────────┐
│  Component calls apiCallJson()        │
└──────────────────────────────────────┘
              ↓
    apiClient adds Authorization header
    with stored access token
              ↓
┌──────────────────────────────────────┐
│   Send Request to Backend API         │
└──────────────────────────────────────┘
              ↓
         ┌────┴──────┐
         │            │
    Response OK?   401 Error?
         │            │
       YES           NO
         │            ↓
      Return    Is Refresh Token
      Data      available?
                │      │
              YES     NO
                │      ↓
                │   Logout user
                │   Redirect to /login
                │
                ↓
         Call /api/auth/refresh
         with refresh token
                │
         ┌──────┴──────┐
         │             │
    Success?       Failed?
         │             │
        YES           NO
         │             ↓
      Store new    Logout user
      access token Redirect to /login
         │
         ↓
      Retry original
      request with
      new token
```

### Logout Flow

```
┌──────────────────────────────┐
│   User clicks Logout button  │
└──────────────────────────────┘
              ↓
    logout() from useAuth()
              ↓
    tokenManager.clearTokens()
    (removes access & refresh tokens)
              ↓
    AuthContext updates user = null
              ↓
    Redirects to /login
```

---

## 📁 File Structure

```
lib/
├── tokenManager.ts      ← Token storage & refresh logic
├── apiClient.ts         ← Smart API requests with auto token handling
├── authContext.tsx      ← Global auth state (useAuth hook)
├── protectedRoute.tsx   ← Route protection component
└── api.ts               ← Login/Signup API calls

app/
├── layout.tsx           ← Wrapped with <AuthProvider>
├── login/page.tsx       ← Login page (stores tokens)
├── signup/page.tsx      ← Signup page
└── dashboard/page.tsx   ← Protected page (wrapped with <ProtectedRoute>)
```

---

## 🚀 Setup Instructions

### Step 1: Ensure Backend is Running
```bash
# Terminal 1 - Start backend server
cd ../backend
npm start
# Should be running on http://localhost:3001
```

### Step 2: Update Environment Variables (if needed)
Check that `API_BASE_URL` in files matches your backend URL:
- Default: `http://localhost:3001`
- If different, update in `lib/apiClient.ts`

### Step 3: Start Frontend
```bash
# Terminal 2 - Start frontend
npm run dev
# Should be running on http://localhost:3000
```

### Step 4: Test the Flow
1. Go to `http://localhost:3000/signup`
2. Create a new account
3. Go to `http://localhost:3000/login`
4. Login with your credentials
5. You'll be redirected to `/dashboard` (protected route)
6. Click "Logout" to log out

---

## 💻 Usage Examples

### Example 1: Use useAuth Hook in a Component

```typescript
"use client";

import { useAuth } from "@/lib/authContext";

export function UserCard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Example 2: Make Protected API Request

```typescript
"use client";

import { useEffect, useState } from "react";
import { apiCallJson } from "@/lib/apiClient";

export function UserProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This request automatically includes the access token
        // If token expires, it's automatically refreshed
        const result = await apiCallJson("/api/user/profile");
        setData(result);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // User will be logged out automatically if token refresh fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Example 3: Protect a Page

```typescript
"use client";

import { ProtectedRoute } from "@/lib/protectedRoute";
import { useAuth } from "@/lib/authContext";

export default function SecretPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Secret Content</h1>
        <p>Only {user?.name} can see this</p>
      </div>
    </ProtectedRoute>
  );
}
```

### Example 4: Handle Login

```typescript
"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/lib/authContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      
      // Store user data in context
      setUser({
        name: response.user.name,
        email: response.user.email,
      });
      
      // Tokens are automatically stored by loginUser()
      // Navigate to dashboard happens in page.tsx
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form inputs */}
    </form>
  );
}
```

---

## 🎯 Common Scenarios

### Scenario 1: User Stays Logged In After Page Refresh
**What happens:**
1. User logs in → tokens stored in localStorage
2. User refreshes page
3. `AuthProvider` in `authContext.tsx` checks localStorage
4. If tokens exist → user stays logged in
5. If tokens missing → redirects to login

### Scenario 2: Access Token Expires While Using App
**What happens:**
1. User makes an API request
2. Backend returns `401 Unauthorized` (token expired)
3. `apiClient.ts` detects this
4. Automatically calls `/api/auth/refresh` with refresh token
5. Gets new access token
6. Retries original request
7. User doesn't notice anything - request completes normally!

### Scenario 3: Refresh Token Expires or Invalid
**What happens:**
1. User tries to make request
2. Access token is expired
3. Try to refresh → fails (refresh token also expired/invalid)
4. `tokenManager.clearTokens()` removes all tokens
5. `AuthContext` updates to logged out
6. User redirected to login page
7. User must login again

### Scenario 4: User Logs Out
**What happens:**
1. User clicks logout button
2. Calls `logout()` from `useAuth()`
3. All tokens cleared from localStorage
4. User info removed from context
5. Redirected to `/login`

---

## 🔑 Key Variables & Constants

### In tokenManager.ts
```typescript
ACCESS_TOKEN_KEY = "accessToken"        // localStorage key for access token
REFRESH_TOKEN_KEY = "refreshToken"      // localStorage key for refresh token
USER_KEY = "user"                        // localStorage key for user data
```

### In apiClient.ts
```typescript
API_BASE_URL = "http://localhost:3001"  // Backend API URL
```

**Expected Backend Endpoints:**
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Create account
- `POST /api/auth/refresh` - Refresh access token
- Other protected routes with Bearer token validation

---

## ⚠️ Important Notes

### LocalStorage Security
⚠️ **Warning:** localStorage is vulnerable to XSS attacks. For production:
- Consider using httpOnly cookies instead
- Implement Content Security Policy (CSP)
- Use environment variables for API URLs

### Token Expiration Times
Adjust based on your backend:
- Access Token: Usually 15-30 minutes
- Refresh Token: Usually 7-30 days

### CORS
Make sure your backend allows requests from `http://localhost:3000`:
```javascript
// Backend CORS config example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 🐛 Troubleshooting

### Problem: "Unable to connect to server"
**Solution:** Check if backend is running on `http://localhost:3001`

### Problem: "Session expired" message keeps appearing
**Solution:** 
1. Check if `/api/auth/refresh` endpoint exists on backend
2. Verify refresh token is being returned from login endpoint

### Problem: User not staying logged in after refresh
**Solution:** 
1. Check localStorage has tokens stored
2. Verify `AuthProvider` is wrapping the app in `layout.tsx`
3. Check browser console for errors

### Problem: 401 errors on protected API calls
**Solution:**
1. Verify access token is being sent in Authorization header
2. Check backend validates `Bearer <token>` format
3. Ensure backend returns proper error responses

---

## 📚 Related Files

- Backend Auth Logic: `../backend/`
- Login Page: `app/login/page.tsx`
- Signup Page: `app/signup/page.tsx`
- Dashboard (Protected): `app/dashboard/page.tsx`

---

## ✅ Checklist

- [x] Access token stored & sent with requests
- [x] Refresh token stored for token renewal
- [x] Auto token refresh on 401 errors
- [x] Protected routes prevent unauthorized access
- [x] Global auth state with useAuth hook
- [x] Automatic logout on failed token refresh
- [x] User data persists across page refreshes
- [x] Seamless user experience with token management

---

**Happy coding! 🚀**
