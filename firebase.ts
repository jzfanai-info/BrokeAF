import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Use import.meta.env for Vite environment variables
// Add a safety check (|| {}) to prevent crashes if import.meta.env is undefined
const env = (import.meta as any).env || {};

// Fallback to hardcoded values for development if env vars aren't set
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCDZMDOiLqWqBEHwm_zzJyCR0bZcy0k4C0",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "brokeaf-db.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "brokeaf-db",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "brokeaf-db.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "141247738144",
  appId: env.VITE_FIREBASE_APP_ID || "1:141247738144:web:f45502b32684d515822745",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-W1SB5RVJWL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);