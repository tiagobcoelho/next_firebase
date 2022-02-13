import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../utils/firebase";

export const getServerSideProps = async ({ query }) => {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null;
  let posts = null;

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
};

export default function UserProfilePage(props) {
  return (
    <div>
      <UserProfile user={props.user} />
      <PostFeed posts={props.posts} />
    </div>
  );
}

// POST SCHEMA
// {
//     title: 'Hello World,
//     slug: 'hello-world',
//     uid: 'userID',
//     username: 'jeffd23',
//     published: false,
//     content: '# hello world!',
//     createdAt: TimeStamp,
//     updatedAt: TimeStamp,
//     heartCount: 0,
// }
