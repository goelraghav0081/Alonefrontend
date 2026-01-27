const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export const tokenManager = {
  // Store access token only
  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Clear auth data (logout)
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check login state
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  // Refresh access token (cookie-based)
  async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/refresh",
        {
          method: "POST",
          credentials: "include", // ✅ SEND COOKIE
        }
      );

      if (!response.ok) {
        this.clear();
        return null;
      }

      const data = await response.json();

      if (data.accessToken) {
        this.setAccessToken(data.accessToken);
        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error("Refresh token failed", error);
      this.clear();
      return null;
    }
  },
};
