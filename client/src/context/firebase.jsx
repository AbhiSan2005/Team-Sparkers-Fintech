import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuIWavOtf65O8UL_2hIay9lyAInoVMRJo",
  authDomain: "finspark-backend.firebaseapp.com",
  projectId: "finspark-backend",
  storageBucket: "finspark-backend.firebasestorage.app",
  messagingSenderId: "275037519397",
  appId: "1:275037519397:web:7baedbbc0e01f66a97c9cc",
  measurementId: "G-X8YGERRJNP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
