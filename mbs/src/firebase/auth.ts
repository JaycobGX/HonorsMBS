import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import type {User} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./db"; // make sure db is exported from firebase/db.ts
import { app } from "./config";

export const auth = getAuth(app);

// Regular login
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);

// Register a new user and store extra info in Firestore
type RegisterData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  isAdmin?: boolean; // optional flag for admins
};

export async function register({
  fullName,
  email,
  phone,
  address,
  password,
  isAdmin = false,
}: RegisterData): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    fullName,
    email,
    phone,
    address,
    isAdmin,
    createdAt: new Date().toISOString(),
  });

  return user;
}


// Get user info including admin status
export async function getUserData(uid: string) {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (!docSnap.exists()) return null;
  return docSnap.data();
}
