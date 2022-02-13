import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoHXdMC63Mbr8c1P8BJGLGJWQkrcD2eUQ",
  authDomain: "nextfire-107f0.firebaseapp.com",
  projectId: "nextfire-107f0",
  storageBucket: "nextfire-107f0.appspot.com",
  messagingSenderId: "302791589843",
  appId: "1:302791589843:web:4e028698fc54fc810cf926",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// firebase auth
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// firestore
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
// storage
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

const EMULATORS_STARTED = "EMULATORS_STARTED";
const startEmulators = () => {
  if (!global[EMULATORS_STARTED]) {
    global[EMULATORS_STARTED] = true;
    firestore.useEmulator("localhost", 8080);
    auth.useEmulator("http://localhost:9099/");
    storage.useEmulator("localhost", 9199);
  }
};

if (process.env.NODE_ENV === "development") {
  startEmulators();
}

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");

  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = await query.get();

  return userDoc.docs[0];
}

export function postToJSON(doc) {
  const data = doc.data();
  if (!data) return null;
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
