import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// import { firebaseConfig } from "./firebase";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
// import firebaseConfig from "./firebase";
import { getStorage } from "firebase/storage";
import firebaseConfig from "@/config/firebase";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "asia-southeast2");
export { RecaptchaVerifier };
