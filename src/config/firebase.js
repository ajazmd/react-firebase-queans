import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeHi5xD7hddorLzn_8C_maeM6AasmF70o",
  authDomain: "quickask-cad0c.firebaseapp.com",
  projectId: "quickask-cad0c",
  storageBucket: "quickask-cad0c.firebasestorage.app",
  messagingSenderId: "688012718721",
  appId: "1:688012718721:web:c07b746b8cecfb9d0b1380"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
export { db, auth, googleProvider, storage };
