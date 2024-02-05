// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5NRDb-Af4ERIcC10q8SPstfKL4zPu6UE",
  authDomain: "fir-pn-c0921.firebaseapp.com",
  projectId: "fir-pn-c0921",
  storageBucket: "fir-pn-c0921.appspot.com",
  messagingSenderId: "186075869400",
  appId: "1:186075869400:web:21427d12b9d034470027ad",
  measurementId: "G-DSZ88962D8"
};

// Initialize Firebase
initializeApp(firebaseConfig)
const auth = getAuth()

export {auth}