import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDvcPbWScZH0ZCMKRy4ezMGbPm_mPLakVI",
    authDomain: "realtor-app-clone-f83c6.firebaseapp.com",
    projectId: "realtor-app-clone-f83c6",
    storageBucket: "realtor-app-clone-f83c6.appspot.com",
    messagingSenderId: "879108700863",
    appId: "1:879108700863:web:5f258002944a15c812240a"
};

// const firebaseConfig = {

//     apiKey: "AIzaSyCzqTNRZxh3xwuZQJz8XqcvH_O2E0iC708",

//     authDomain: "real-state-trade.firebaseapp.com",

//     projectId: "real-state-trade",

//     storageBucket: "real-state-trade.appspot.com",

//     messagingSenderId: "881947191948",

//     appId: "1:881947191948:web:ade9c59f0b77a2f3bb29a9"

// };

initializeApp(firebaseConfig);

export const db = getFirestore();



