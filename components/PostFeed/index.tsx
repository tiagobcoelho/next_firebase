import { UserProps } from "../../context/auth/context";
import PostItem, { Post } from "./PostItem";

interface PostFeedProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  posts: Post[];
  admin?: boolean;
}

export default function PostFeed({ posts, admin }: PostFeedProps) {
  return posts ? (
    <>
      {posts.map((post) => {
        return <PostItem post={post} admin={admin} />;
      })}
    </>
  ) : null;
}
