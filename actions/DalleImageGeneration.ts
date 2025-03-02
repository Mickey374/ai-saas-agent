"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flag";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

const IMAGE_SIZE = "1024x1024" as const;
const convexClient = getConvexClient();

export const DalleImageGeneration = async (prompt: string, videoId: string) => {
  const user = await currentUser();

  if (!user?.id) throw new Error("User not found");

  const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!prompt) throw new Error("Prompt is required");

  console.log("🎨 Generating image with prompt: ", prompt);

  const imageResponse = await openAI.images.generate({
    prompt: prompt,
    model: "dall-e-2",
    n: 1,
    size: IMAGE_SIZE,
    quality: "standard",
    style: "vivid",
  });

  const imageUrl = imageResponse.data[0]?.url;

  if (!imageUrl) throw new Error("Image not found");

  // Step 1: Get a short lived upload URL
  console.log("🔗 Getting upload URL...");
  const uploadUrl = await convexClient.mutation(api.images.generateUploadUrl);
  console.log("✅ Upload URL Gotten: ", uploadUrl);

  // Step 2: Download the image from the URL
  console.log("🌐 Downloading image...");
  const image: Blob = await fetch(imageUrl).then((res) => res.blob());
  console.log("📥 Image Downloaded: ", image);

  // Step 3: Upload the image to the storage
  console.log("🚀 Uploading image...");
  const result = await fetch(uploadUrl, {
    method: "POST",
    body: image,
    headers: {
      "Content-Type": image!.type,
    },
  });

  const { storageId } = await result.json();
  console.log("✅ Image Uploaded successfully with ID: ", storageId);

  // Step 4: Save the image to the database
  console.log("💾 Saving image to the database...");
  const imageId = await convexClient.mutation(api.images.storeImage, {
    storageId: storageId,
    videoId,
    userId: user.id,
  });
  console.log("✅ Image saved to the database with ID: ", imageId);

  // Get serve image URL
  console.log("🔗 Getting image URL...");
  const dbImageUrl = await convexClient.query(api.images.getImage, {
    videoId,
    userId: user.id,
  });
  console.log("✅ Image URL gotten: ", dbImageUrl);

  // Track the image generation event
  console.log("📊 Tracking image generation event...");
  await client.track({
    event: featureFlagEvents[FeatureFlag.IMAGE_GENERATION].event,
    company: {
      id: user.id,
    },
    user: {
      id: user.id,
    },
  });
  console.log("✅ Image generation event tracked successfully");

  return {
    imageUrl: dbImageUrl,
  };
};
