// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCCkr9mIk5-9TbptHtwLNkTKryJP3KcQDY",
  authDomain: "gym-admin-panel.firebaseapp.com",
  projectId: "gym-admin-panel",
  storageBucket: "gym-admin-panel.firebasestorage.app",
  messagingSenderId: "106707550623",
  appId: "1:106707550623:web:fa35e9a354040818023daa",
  measurementId: "G-W3M92BY4G4"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
  