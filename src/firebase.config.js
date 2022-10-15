import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMp-BKXhXlvIWqIZ_4Gt5hCOosUUTBWpE",
  authDomain: "gecko-web-services.firebaseapp.com",
  projectId: "gecko-web-services",
  storageBucket: "gecko-web-services.appspot.com",
  messagingSenderId: "406375635773",
  appId: "1:406375635773:web:b1e839df699078db770354",
  databaseURL: 'https://gecko-web-services-default-rtdb.europe-west1.firebasedatabase.app/'
};

const app = initializeApp(firebaseConfig)
export const firebase = {auth: getAuth(app), database: getDatabase(app)}
