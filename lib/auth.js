
// lib/auth.js
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

// Sign up function
export const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // Extract the user object
    await updateProfile(user, { displayName: username }); // Pass the user object
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

