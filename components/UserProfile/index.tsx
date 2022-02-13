import { UserProps } from "../../context/auth/context";

interface UserProfileProps {
  user: UserProps & {
    username: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="box-center">
      {user && user.photoURL && (
        <img src={user.photoURL} className="card-img-center" />
      )}
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
}
