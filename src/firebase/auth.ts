import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import app from "./firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export const signUp = async (email: string, password: string, role: "hungerbox" | "ngo") => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), { email: user.email, role: role });
  return user;
};

export const getUserRole = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data()?.role : null;
};

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const role = await getUserRole(user.uid);
  console.log("Login successful","User : ",user , "role" , role);
  return { user, role };
};

export const logout = async () => {
  await signOut(auth);
};

export default auth;
