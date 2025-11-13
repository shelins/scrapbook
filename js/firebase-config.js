const firebaseConfig = {
  apiKey: "AIzaSyDD1qF0Ggs_mH4OI56Bc4Zw23caRtjmMm4",
  authDomain: "myscrapbook-2e166.firebaseapp.com",
  projectId: "myscrapbook-2e166"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
