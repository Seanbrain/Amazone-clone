import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAREQE0jqDbfOIUeWkKDHy0GW7Nbu244AU",
  authDomain: "my-e-clone-c271b.firebaseapp.com",
  projectId: "my-e-clone-c271b",
  storageBucket: "my-e-clone-c271b.appspot.com",
  messagingSenderId: "54260555627",
  appId: "1:54260555627:web:7b070bd69a5f28ee3a362e",
  measurementId: "G-BCW39V4N2K"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();



export {db, auth};

