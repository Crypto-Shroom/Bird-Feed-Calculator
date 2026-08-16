import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5o2mHWFcJS99knyQa6FSHoXfegjsk0w4",
  authDomain: "bird-food-calculator-25e6d.firebaseapp.com",
  projectId: "bird-food-calculator-25e6d",
  storageBucket: "bird-food-calculator-25e6d.firebasestorage.app",
  messagingSenderId: "290545485708",
  appId: "1:290545485708:web:5a4eb5f9b468183b5b38a9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
