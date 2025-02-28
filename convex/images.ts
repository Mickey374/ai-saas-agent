import { v } from "convex/values";
import { query } from "./_generated/server";

export const getImages = query({
  args: {
    userId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("images")
      .withIndex("by_user_id_and_video_id")
      .filter((q) => q.eq("userId", args.userId))
      .filter((q) => q.eq("videoId", args.videoId))
      .collect();

    const imageUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await ctx.storage.getUrl(image.storageId),
      }))
    );
    return imageUrls;
  },
});
