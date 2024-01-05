// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1ed04.firebaseapp.com",
  projectId: "mern-estate-1ed04",
  storageBucket: "mern-estate-1ed04.appspot.com",
  messagingSenderId: "277285327675",
  appId: "1:277285327675:web:8b4144ae9f3c4157759d1e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);