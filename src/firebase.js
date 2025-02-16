import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6VT2oWsf47m8UAwAvtLl_jAD69U0LyZM",
  authDomain: "sistema-de-ventas-12e99.firebaseapp.com",
  projectId: "sistema-de-ventas-12e99",
  storageBucket: "sistema-de-ventas-12e99.firebasestorage.app",
  messagingSenderId: "2507502229",
  appId: "1:2507502229:web:c61eb854c1258b4b51a19c",
  measurementId: "G-HV92LB6WGC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const db = getFirestore(app);
export { auth, db };

