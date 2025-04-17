export interface UserSimple {
  id: number;
  nickname: string;
  profilePictureUrl: string;
}

export interface Post {
  id: number;
  title: string;
  summary: string;
  coverImage?: string;
  updatedTime: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  user: UserSimple;
}
