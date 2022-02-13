import Link from "next/link";

export interface Post {
  title: string;
  slug: string;
  uid: string;
  username: string;
  published: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
  heartCount: number;
}

interface PostItemProps {
  post: Post;
  admin?: boolean;
}
export default function PostItem({ post }: PostItemProps) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <div className="card">
      <Link href={`/${post.username}`} passHref>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`} passHref>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>💛 {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
}
