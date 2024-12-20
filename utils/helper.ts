import { LRUCache } from "lru-cache";

export const escapeFormData = <T>(data: T): T => {
  const escapeString = (str: string): string => {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  };

  if (typeof data === "string") {
    return escapeString(data) as T;
  } else if (data instanceof Date) {
    // Handle Date objects by converting them to ISO strings
    return data.toISOString() as unknown as T;
  } else if (Array.isArray(data)) {
    return data.map((item) => escapeFormData(item)) as unknown as T;
  } else if (data instanceof File) {
    // Handle file objects
    const escapedFile = new File(
      [data],
      escapeString(data.name), // Escape the file name
      { type: data.type }
    );
    return escapedFile as unknown as T;
  } else if (typeof data === "object" && data !== null) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key as keyof T] = escapeFormData(data[key as keyof T]);
      return acc;
    }, {} as T);
  }
  return data;
};

export const formatTeamName = (teamName: string) => {
  return teamName.toLowerCase().replace(/\s+/g, "-");
};

const rateLimiter = new LRUCache({
  max: 1000,
  ttl: 60 * 1000,
});

export const applyRateLimit = async (ipAddress: string) => {
  if (!ipAddress) {
    throw new Error("IP address is required for rate limiting.");
  }

  const rateLimitKey = `${ipAddress}`;

  const currentCount = (rateLimiter.get(rateLimitKey) as number) || 0;

  if (currentCount >= 50) {
    throw new Error("Too many requests. Please try again later.");
  }

  rateLimiter.set(rateLimitKey, currentCount + 1);
};
