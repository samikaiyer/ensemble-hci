// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzINEX7RSj_VGz5xP3vm4jiN8IhCgGRFo",
  authDomain: "ensemble-hci-539db.firebaseapp.com",
  projectId: "ensemble-hci-539db",
  storageBucket: "ensemble-hci-539db.firebasestorage.app",
  messagingSenderId: "1032852416636",
  appId: "1:1032852416636:web:f15a9eb4d706c909bf81f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Export db to use in other parts of the app
export { db };