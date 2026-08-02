// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your Firebase Configuration
const firebaseConfig = {
apiKey: "AIzaSyDHDLAcMPepH6mdIz7cYvDauMGKXdCPWs0",
authDomain: "to-do-list-dae97.firebaseapp.com",
projectId: "to-do-list-dae97",
storageBucket: "to-do-list-dae97.firebasestorage.app",
messagingSenderId: "920444885467",
appId: "1:920444885467:web:d000e3d04b88a3b6ccaffe",
measurementId: "G-3BSQ6X8E0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Make Firestore available to script.js
window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;

console.log("✅ Firebase Connected Successfully");