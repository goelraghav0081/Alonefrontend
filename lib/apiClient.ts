// API Client - handles requests with automatic token management
import { tokenManager } from "./tokenManager";

const API_BASE_URL = "http://localhost:3001";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean; // Set to true to skip adding authorization header
}

// Make authenticated API requests
export async function apiCall(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options;

  let token = tokenManager.getAccessToken();

  // Add authorization header if token exists and not skipped
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token && !skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // If token expired (401), try to refresh and retry
  if (response.status === 401 && !skipAuth && token) {
    const newToken = await tokenManager.refreshAccessToken();

    if (newToken) {
      // Retry request with new token
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    } else {
      // Refresh failed, user needs to login again
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}

// Helper for JSON responses
export async function apiCallJson<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiCall(endpoint, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}
