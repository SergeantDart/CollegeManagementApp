import firebase from "firebase";

const config = {
    
    apiKey: "AIzaSyB8pRX-gU7JggbGaHB1x81ZBnpVdRlALzE",
    authDomain: "college-management-app-57e64.firebaseapp.com",
    projectId: "college-management-app-57e64",
    storageBucket: "college-management-app-57e64.appspot.com",
    messagingSenderId: "1022113297366",
    appId: "1:1022113297366:web:35fe96a1aef66d84c26a77",
    measurementId: "G-J091QZ5W90"
  };

  firebase.initializeApp(config);
  

  const snapshotToArrayConversion = (snapshot) => {
      let items = [];
      snapshot.forEach((childSnapshot) => {
          items.push({
              ...childSnapshot.val(),
              id: childSnapshot.key
          });
      });
      return items;
  }

  export {
      firebase,
      snapshotToArrayConversion
  };