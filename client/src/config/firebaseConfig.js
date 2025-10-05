// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { CONFIGURATIONS } from "./envConfig";

const FIREBASE_API_KEY = CONFIGURATIONS.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = CONFIGURATIONS.FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = CONFIGURATIONS.FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = CONFIGURATIONS.FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGE_SENDER_ID = CONFIGURATIONS.FIREBASE_MESSAGE_SENDER_ID;
const FIREBASE_APP_ID = CONFIGURATIONS.FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = CONFIGURATIONS.FIREBASE_MEASUREMENT_ID;

// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGE_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// including measurement id only if it available
if(FIREBASE_MEASUREMENT_ID && FIREBASE_MEASUREMENT_ID !== "NOT_AVAILABLE"){
  firebaseConfig = {
    ...firebaseConfig,
    measurementId: FIREBASE_MEASUREMENT_ID
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;