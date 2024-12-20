export const createOnboardingRequest = async (params: {
  firstName: string;
  lastName: string;
  avatar?: File; // Make avatar optional if needed
  teamId: string;
}) => {
  let newAvatar = null;
  if (params.avatar instanceof File) {
    newAvatar = {
      name: params.avatar.name,
      type: params.avatar.type,
      size: params.avatar.size,
    };
  }
  const newBody = {
    ...params,
    avatar: newAvatar,
  };
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/onboarding`,
      {
        method: "POST",
        body: JSON.stringify(newBody),
      }
    );

    const response = await request.json();

    if (!request.ok) {
      throw new Error(
        response.message || "Failed to create onboarding request"
      );
    }

    return response;
  } catch (error) {
    console.error("Error creating onboarding request:", error);
    throw error;
  }
};
