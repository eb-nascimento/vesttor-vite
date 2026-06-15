import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdiTGDvCyYTLdP5UTFqml2p-QJLrfakFs",
  authDomain: "gestor-financeiro-43435.firebaseapp.com",
  projectId: "gestor-financeiro-43435",
  storageBucket: "gestor-financeiro-43435.firebasestorage.app",
  messagingSenderId: "484962553511",
  appId: "1:484962553511:web:887fc9bbd50dbc2f859582",
  measurementId: "G-07V5TWV124",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
