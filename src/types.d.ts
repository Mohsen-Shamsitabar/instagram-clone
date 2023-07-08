import { type BrowserHistory } from "history";

export type ObjectKeys = string | number | symbol;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<ObjectKeys, any>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type ParamsObject = {
  logedUserId: string;
  userId?: string;
  postId?: string;
};

export interface PageContext<PageProps = EmptyObject, Params = ParamsObject> {
  pageProps: PageProps;
  params?: Params;
  history: BrowserHistory;
}

export type Page<PageProps = EmptyObject, Params = ParamsObject> = (
  pageContext: PageContext<PageProps, Params>
) => string;

export interface Comment {
  id: string;
  author: string;
  post: string;
  context: string;
}

export interface Post {
  id: string;
  caption: string;
  author: string;
  likedBy: string[];
  comments: string[];
  images: string[];
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  website: string;
  posts: string[];
  followers: string[];
  following: string[];
}

export interface Data {
  users: User[];
  posts: Post[];
  comments: Comment[];
  uniqueId: string;
}
