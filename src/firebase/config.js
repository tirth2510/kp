// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGz1GzMzoCKWyfle9hEDidmyT5lJj-ll0",
  authDomain: "graphical-password-ea1ba.firebaseapp.com",
  projectId: "graphical-password-ea1ba",
  storageBucket: "graphical-password-ea1ba.appspot.com",
  messagingSenderId: "1055099433642",
  appId: "1:1055099433642:web:1ba87f8b52ac32c01c16d3",
  measurementId: "G-VB3YD9Y0MY"
};

// ✅ Prevent duplicate Firebase initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Ensure Analytics runs only in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Ensure auth is defined before exporting
if (!auth) {
  console.error("❌ Firebase Auth initialization failed!");
} else {
  console.log("✅ Firebase Auth initialized successfully!");
}

// ✅ Export Firebase services
export { app, auth, analytics, db };
