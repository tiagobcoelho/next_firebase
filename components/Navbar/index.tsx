import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/auth/use-auth";

export default function Navbar() {
  const { user, username } = useAuth();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" passHref>
            <button className="btn-logo">Feed</button>
          </Link>
        </li>

        {user ? (
          <>
            <li className="push-left">
              <Link href="/admin" passHref>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`} passHref>
                <Image src={user?.photoURL} />
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/enter" passHref>
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
