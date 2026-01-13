import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

let firebaseConfig = {
  apiKey: "AIzaSyCClV8XUCZOJtTcIqHa1eQPzNjT66SaSHc",
  authDomain: "charamica-8bb03.firebaseapp.com",
  projectId: "charamica-8bb03",
  storageBucket: "charamica-8bb03.firebasestorage.app",
  messagingSenderId: "1071156852912",
  appId: "1:1071156852912:web:671a856c792a65750ee375",
  measurementId: "G-M7CQWL06KD",
};
console.log(process.env.REACT_APP_ENVIRONMENT === "production");
if (process.env.REACT_APP_ENVIRONMENT === "production") {
  firebaseConfig = {
    apiKey: "AIzaSyDTH2T39X_A8W36o70nqym-8tntdIsdF00",
    authDomain: "carramica-prod.firebaseapp.com",
    projectId: "carramica-prod",
    storageBucket: "carramica-prod.firebasestorage.app",
    messagingSenderId: "276155974594",
    appId: "1:276155974594:web:c7493d32506c5df5e28c5b",
    measurementId: "G-HQBVT68BKK",
  };
}
export default firebaseConfig;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { db };
