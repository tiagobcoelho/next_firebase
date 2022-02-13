import {
  firestore,
  getUserWithUsername,
  postToJSON,
} from "../../utils/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import styles from "@styles/Post.module.css";
import AuthGate from "@components/AuthGate";
import Heart from "@components/HeartButton";
import Link from "next/link";

export default function PostPage(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 💛</strong>
        </p>
        <AuthGate
          fallback={
            <Link href="/enter" passHref>
              <button>Sign up</button>
            </Link>
          }
        >
          <Heart postRef={postRef} />
        </AuthGate>
      </aside>
    </main>
  );
}

export const getStaticProps = async ({ params }) => {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
};

export const getStaticPaths = async () => {
  // improve by using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    // { params: { username, slug } }
    // ],
    paths,
    fallback: "blocking",
  };
};
