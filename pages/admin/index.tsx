import styles from "@styles/Admin.module.css";
import AuthGate from "@components/AuthGate";
import PostFeed from "@components/PostFeed";
import { auth, firestore, serverTimestamp } from "@utils/firebase";
import { useAuth } from "context/auth/use-auth";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import kebabcase from "lodash.kebabcase";
import Button from "@components/Button";
import toast from "react-hot-toast";

export default function AdminPostsPage() {
  return (
    <main>
      <AuthGate>
        <PostList />
        <CreateNewPost />
      </AuthGate>
    </main>
  );
}

const PostList = () => {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { username } = useAuth();
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabcase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success("Post created!");

    // imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };
  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <Button type="submit" disabled={!isValid} className="btn-green">
        Create new post
      </Button>
    </form>
  );
};
