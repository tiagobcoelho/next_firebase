import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Button from "../components/Button";
import { useAuth } from "../context/auth/use-auth";
import { auth, firestore, googleAuthProvider } from "../utils/firebase";
import debounce from "lodash.debounce";

export default function EnterPage() {
  const { user, username } = useAuth();

  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoadind] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        setLoadind(false);
      }
    }, 500),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zZ-Z0-0._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setValue(val);
      setLoadind(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setValue(val);
      setLoadind(true);
      setIsValid(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${value}`);

    const batch = firestore.batch();
    batch.set(userDoc, {
      username: value,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };

  const usernameMessage = useMemo(() => {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (value && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <></>;
    }
  }, [loading, isValid, username]);

  useEffect(() => {
    checkUsername(value);
  }, [value]);

  return (
    <main>
      {user ? (
        !username ? (
          <section>
            <h3>Choose Username</h3>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="username"
                value={value}
                onChange={handleChange}
              />
              {usernameMessage}
              <Button type="submit" className="btn-green" disabled={!isValid}>
                submit
              </Button>

              <h3>Debug state</h3>
              <div>
                Username : {value}
                <br />
                Loading: {loading.toString()}
                <br />
                Usernamr valid: {isValid.toString()}
              </div>
            </form>
          </section>
        ) : (
          <Button onClick={() => auth.signOut()}>Sing out</Button>
        )
      ) : (
        <Button onClick={signInWithGoogle}>
          <img src="/google.png" alt="Google logo" /> Sign in with google
        </Button>
      )}
    </main>
  );
}
