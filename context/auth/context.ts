import { createContext } from "react";

const definitionError = (): void => {
  throw new Error(
    'Auth context not defined. Please make sure "Auth" component is wrapping your applicatin'
  );
};

export type UserProps = {
  uid: string;
  photoURL: string;
  displayName: string;
};

export type AuthContextProps = {
  user: UserProps;
  username: string;
};

export const AuthContext = createContext<AuthContextProps>({
  user: {
    uid: "",
    photoURL: "",
    displayName: "",
  },
  username: "",
});
