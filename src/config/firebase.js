import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAY9gazk0zPSzIPyCX-XBMkHwdYpY2ONnY",
  authDomain: "questionanswerapp-6aaf7.firebaseapp.com",
  projectId: "questionanswerapp-6aaf7",
  storageBucket: "questionanswerapp-6aaf7.firebasestorage.app",
  messagingSenderId: "457536283403",
  appId: "1:457536283403:web:550b251d95b4ae9ab7b80e",
  measurementId: "G-WTWZK30VLQ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
export { db, auth, googleProvider, storage };
