import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDfq9DSvHMPrufKGf1LN8JW6KluwRpMf6w",
  authDomain: "library-managment-28632.firebaseapp.com",
  projectId: "library-managment-28632",
  storageBucket: "library-managment-28632.appspot.com",
  messagingSenderId: "1036194753908",
  appId: "1:1036194753908:web:593f4053cff669f285d021",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;

export const db = firebase.firestore();
