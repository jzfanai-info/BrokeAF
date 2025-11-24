import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDZMDOiLqWqBEHwm_zzJyCR0bZcy0k4C0",
  authDomain: "brokeaf-db.firebaseapp.com",
  projectId: "brokeaf-db",
  storageBucket: "brokeaf-db.firebasestorage.app",
  messagingSenderId: "141247738144",
  appId: "1:141247738144:web:f45502b32684d515822745",
  measurementId: "G-W1SB5RVJWL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);