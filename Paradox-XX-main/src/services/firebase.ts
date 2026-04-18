// import { initializeApp } from 'firebase/app';
// import { signInWithRedirect } from "firebase/auth";


// //import { getAnalytics } from "firebase/analytics";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged,
//   User,
// } from 'firebase/auth';
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
// } from 'firebase/firestore';

// // Initialize Firebase

//  const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,


// };

// //console.log("Firebase Config:", firebaseConfig);



// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const firestore = getFirestore(app);
// //const analytics = getAnalytics(app);
// const provider = new GoogleAuthProvider();

// // -------------------
// // Google Sign-In
// // -------------------
// // export const signInWithGoogle = async (): Promise<User> => {
// //   try {
// //     const result = await signInWithPopup(auth, provider);
// //     return result.user;
// //   } catch (error) {
// //     console.error('Google Sign-In error:', error);
// //     throw error;
// //   }
// // };
// // export const signInWithGoogle = async (): Promise<void> => {
// //   try {
// //     await signInWithRedirect(auth, provider);
// //   } catch (error) {
// //     console.error('Google Sign-In error:', error);
// //   }
// // };
// export const signInWithGoogle = async (): Promise<void> => {
//   try {
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({
//       prompt: "select_account", // 👈 FORCE account selection
//     });

//     await signInWithRedirect(auth, provider);
//   } catch (error) {
//     console.error("Google Sign-In error:", error);
//   }
// };

// // -------------------
// // Sign Out
// // -------------------
// export const signOutUser = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.error('Sign out error:', error);
//     throw error;
//   }
// };

// // -------------------
// // Auth State Listener
// // -------------------
// export const onAuthStateChangedListener = (callback: (user: User | null) => void): (() => void) => {
//   return onAuthStateChanged(auth, callback);
// };

// // -------------------
// // Save Economy Data
// // -------------------
// export const saveEconomyToFirestore = async (
//   userId: string,
//   coins: number,
//   XP: number
// ) => {
//   const userRef = doc(firestore, 'users', userId);
//   await setDoc(userRef, { coins, XP }, { merge: true });
// };

// // -------------------
// // Load Economy Data
// // -------------------
// export const loadEconomyFromFirestore = async (
//   userId: string
// ) => {
//   const userRef = doc(firestore, 'users', userId);
//   const docSnap = await getDoc(userRef);
//   if (docSnap.exists()) {
//     return docSnap.data() || null;
//   }
//   return null;
// };











import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup ,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

// -------------------
// Firebase Config
// -------------------
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

console.log("Firebase config:", firebaseConfig);
// -------------------
// Initialize Firebase
// -------------------
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Create provider ONCE
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account", // force account selection
});

// -------------------
// Google Sign-In
// -------------------
export const signInWithGoogle = async (): Promise<void> => {
  try {
    // 🔥 IMPORTANT FIX: persistence
    await setPersistence(auth, browserLocalPersistence);

    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google Sign-In error:", error);
  }
};

// -------------------
// Sign Out
// -------------------
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// -------------------
// Auth State Listener
// -------------------
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user); // 🔍 debug
    callback(user);
  });
};

// -------------------
// Save Economy Data
// -------------------
export const saveEconomyToFirestore = async (
  userId: string,
  coins: number,
  XP: number
) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, { coins, XP }, { merge: true });
  } catch (error) {
    console.error("Save error:", error);
  }
};

// -------------------
// Load Economy Data
// -------------------
export const loadEconomyFromFirestore = async (userId: string) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Load error:", error);
    return null;
  }
};

