import { initializeApp } from "firebase/app";
import { initializeFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// Firebase config aqui embaixo
const firebaseConfig = {
    apiKey: "AIzaSyB-KzB4lPIyL6omKtG_wYsEfrdTgcWGBMI",
    authDomain: "manifest-campus-340822.firebaseapp.com",
    projectId: "manifest-campus-340822",
    storageBucket: "manifest-campus-340822.appspot.com",
    messagingSenderId: "718391211548",
    appId: "1:718391211548:web:4a97a0d82322eca27a91d9"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const db = initializeFirestore(firebaseApp, {
    ignoreUndefinedProperties: true,
});
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Timestamp
const timestamp = serverTimestamp();

export { db, auth, storage, timestamp };
