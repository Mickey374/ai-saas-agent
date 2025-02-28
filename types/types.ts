export interface channelDetails {
  id: string;
  name: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  channel: channelDetails;
  channelUrl: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  commentCount: string;
  duration: string;
}
