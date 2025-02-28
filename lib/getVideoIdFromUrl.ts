export function getVideoIdFromUrl(url: string): string | null {
  let videoId: string | null = null;

  if (url.includes("https://youtu.be/")) {
    // If Video is in Shortened Format
    videoId = url.split("https://youtu.be/")[1]?.split(/[?#]/)[0] || null;
  } else if (url.includes("youtube.com/shorts/")) {
    // If Video is in Shorts Format
    videoId =
      url.split("https://www.youtube.com/shorts/")[1]?.split(/[?#]/)[0] || null;
  } else if (url.includes("youtube.com/watch?v=")) {
    // If Video is in Normal Format
    videoId = url
      .split("https://www.youtube.com/watch?v=")[1]
      ?.split(/[?#]/)[0];
  } else if (url.includes("youtube.com/embed/")) {
    // If Video is in Embed Format
    videoId = url.split("https://www.youtube.com/embed/")[1]?.split(/[?#]/)[0];
  } else if (url.includes("youtube.com/watch?")) {
    // If Video is in Watch Format
    const searchParams = new URLSearchParams(url.split("?")[1]);
    videoId = searchParams.get("v");
  } else if (url.includes("youtube.com/v/")) {
    // If Video is in V Format
    videoId = url.split("https://www.youtube.com/v/")[1]?.split(/[?#]/)[0];
  } else if (url.includes("youtube.com/user/")) {
    // If Video is in User Format
    videoId = url.split("https://www.youtube.com/user/")[1]?.split(/[?#]/)[0];
  } else if (url.includes("youtube.com/live/")) {
    // If Video is in Live Format
    videoId = url.split("https://www.youtube.com/live/")[1]?.split(/[?#]/)[0];
  }

  return videoId;
}
// https://www.youtube.com/live/2732XeTkiek?si=JWGc2kTr88LaNExp
// https://youtu.be/3LffEgXPrT4?si=dZcTZIJS0oT4k-4A
