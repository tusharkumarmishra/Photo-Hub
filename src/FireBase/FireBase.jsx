import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpyMJKVohzfuElTzpC3X1npafU2UoJKy4",
    authDomain: "protfolio-1bc70.firebaseapp.com",
    projectId: "protfolio-1bc70",
    storageBucket: "protfolio-1bc70.appspot.com",
    messagingSenderId: "213759386619",
    appId: "1:213759386619:web:134026034004b2fd79a15e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);