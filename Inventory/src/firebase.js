import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBiT6XOMqMOSU6Y1HoeDvNg6NTOFrHZdzE",
  authDomain: "seller-backendnotification.firebaseapp.com",
  projectId: "seller-backendnotification",
  storageBucket: "seller-backendnotification.appspot.com",
  messagingSenderId: "841442645050",
  appId: "1:841442645050:web:1a13d8eba2ec0f52749103",
  measurementId: "G-Z2BRRDN56Y"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
export const messaging = getMessaging(firebaseApp);