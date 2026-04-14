import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEEokqNX2DLLJFEJhBbBAoT7l-a-1YrjQ",
  authDomain: "taskflow-8a37f.firebaseapp.com",
  projectId: "taskflow-8a37f",
  storageBucket: "taskflow-8a37f.firebasestorage.app",
  messagingSenderId: "883533764188",
  appId: "1:883533764188:web:be4eff8f2c966cbedf7899"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);