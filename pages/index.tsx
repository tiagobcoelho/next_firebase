import { useState } from "react";
import Button from "../components/Button";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../utils/firebase";

const LIMIT = 1;

export const getServerSideProps = async (context) => {
  const postQuery = firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postQuery.get()).docs.map(postToJSON);

  return {
    props: { posts },
  };
};

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts((prevState) => [...prevState, ...newPosts]);
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && (
        <Button onClick={getMorePosts}>Load more</Button>
      )}

      {loading && <Loader show />}
      {postsEnd && <p>You have reached the ending</p>}
    </main>
  );
}
