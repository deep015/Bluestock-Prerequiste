// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaUGgBiEdgEPv2GHlR_RxGRyHvOo4MV10",
  authDomain: "companyprofile-5e4e6.firebaseapp.com",
  projectId: "companyprofile-5e4e6",
  storageBucket: "companyprofile-5e4e6.appspot.com", // <-- fix here
  messagingSenderId: "69305784798",
  appId: "1:69305784798:web:1b93cdc107af3fd81aa54f",
  measurementId: "G-S3Z0P3T9YX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;