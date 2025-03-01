import { ConvexHttpClient } from "convex/browser";

// Create a client for HTTP server side requests
export const getConvexClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL)
    throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");

  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};
