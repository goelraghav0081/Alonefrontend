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
      throw new Error(errorData.message || "Signup failed");
    }

    return await response.json();
  } catch (error) {
    // This catches:
    // - CORS issues
    // - Server down
    // - Wrong port
    // - Network failure
    throw new Error("Unable to connect to server");
  }
}
