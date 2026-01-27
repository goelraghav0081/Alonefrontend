export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle specific HTTP status codes with user-friendly messages
      if (response.status === 409) {
        throw new Error("This email is already registered. Please use a different email or try signing in.");
      } else if (response.status === 400) {
        throw new Error(errorData.message || "Invalid input. Please check your details.");
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
      
      throw new Error(errorData.message || "Signup failed");
    }

    return await response.json();
  } catch (error: any) {
    // If it's already our custom error, re-throw it
    if (error.message) {
      throw error;
    }
    
    // This catches:
    // - CORS issues
    // - Server down
    // - Wrong port
    // - Network failure
    throw new Error("Unable to connect to server. Please check your internet connection.");
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(
      "http://localhost:3001/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ REQUIRED for cookies
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 401) {
        throw new Error("Invalid email or password. Please try again.");
      } else if (response.status === 400) {
        throw new Error(
          errorData.message || "Invalid input. Please check your details."
        );
      } else if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(errorData.message || "Login failed");
    }

    const jsonData = await response.json();

    // Import tokenManager here to avoid circular dependency
    const { tokenManager } = await import("./tokenManager");

    // ✅ Store ONLY access token
    if (jsonData.accessToken) {
      tokenManager.setAccessToken(jsonData.accessToken);
    }

    return jsonData;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }

    throw new Error(
      "Unable to connect to server. Please check your internet connection."
    );
  }
}
