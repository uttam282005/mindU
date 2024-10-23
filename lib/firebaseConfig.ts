// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjQrJ6xpIWRqSfgRHnCRk9UTdYk2o7NTk",
  authDomain: "mindu-5f63e.firebaseapp.com",
  projectId: "mindu-5f63e",
  storageBucket: "mindu-5f63e.appspot.com",
  messagingSenderId: "429999781857",
  appId: "1:429999781857:web:56dbadae8d85e4f54644a0",
  measurementId: "G-X21G4WB42B"
};

// Initialize Firebase
let app, analytics, db: any, auth: any;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };

