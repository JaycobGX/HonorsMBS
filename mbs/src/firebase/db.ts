import { getFirestore } from "firebase/firestore";
import { app } from "./config";

//initializing and exporting a Firestore database instance that connects Firestore to the main Firebase 
// app so the other parts of the project can import `db` to read/write data.
export const db = getFirestore(app);
