// src/firebase-config.js

import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCCkr9mIk5-9TbptHtwLNkTKryJP3KcQDY",
  authDomain: "gym-admin-panel.firebaseapp.com",
  projectId: "gym-admin-panel",
  storageBucket: "gym-admin-panel.firebasestorage.app",
  messagingSenderId: "106707550623",
  appId: "1:106707550623:web:fa35e9a354040818023daa",
  measurementId: "G-W3M92BY4G4"
};



const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);