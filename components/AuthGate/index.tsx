import { useAuth } from "context/auth/use-auth";
import Link from "next/link";

export default function AuthGate(props) {
  const { username } = useAuth();

  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
