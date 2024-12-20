export const loginSubmission = async (email: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const data = await response.json();

  return data as { redirect: string; message: string };
};

export const registerSubmission = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response;
};
