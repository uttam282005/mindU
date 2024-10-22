// lib/auth.js
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Sign up function
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password, displayName);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing up: ", error.message);
    throw error;
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error logging in: ", error.message);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out: ", error.message);
    throw error;
  }
};
