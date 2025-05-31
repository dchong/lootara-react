// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRxeeIUMQUQ1H8RIKk5lXh77IQAGHhMe4",
  authDomain: "lootara-website.firebaseapp.com",
  projectId: "lootara-website",
  storageBucket: "lootara-website.firebasestorage.app",
  messagingSenderId: "984923606768",
  appId: "1:984923606768:web:7d816b4c4dea60c6b7fc35",
  measurementId: "G-46CY0YCTW1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
