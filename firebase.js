const firebaseAdmin = require("firebase-admin");
require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
  databaseURL: process.env.databaseURL,
  credential: firebaseAdmin.credential.cert(
    JSON.parse(process.env.serviceAccount)
  ),
};
firebaseAdmin.initializeApp(firebaseConfig);

let database = firebaseAdmin.database();

module.exports = database;
