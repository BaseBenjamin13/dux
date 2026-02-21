"use client";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

type UserProfile = {
  email: string;
  name: string;
};

// Helper function - usually called right after successful sign up
export async function createUserProfile(uid: string, data: Partial<UserProfile> = {}) {
  const db = getFirestore();
  
  const userRef = doc(db, "users", uid);

  const defaultData = {
    uid,
    email: data.email || null,
    name: data.name || null,
    profileImage: '',
    bio: 'No bio yet',
  };

  try {
    await setDoc(userRef, {
      ...defaultData,
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log("User profile created:", uid);
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}