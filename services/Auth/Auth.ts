export const loginSubmittion = async (email: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return response;
};
