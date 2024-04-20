// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC1OE1dlO9UaEsn4qn1eBmttiNCvFdWHX8",
    authDomain: "fireship-svelte-fa8b1.firebaseapp.com",
    projectId: "fireship-svelte-fa8b1",
    storageBucket: "fireship-svelte-fa8b1.appspot.com",
    messagingSenderId: "1017890099220",
    appId: "1:1017890099220:web:55d3898c2bc14de6f6d701"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storeage = getStorage(app);

function userStore() {
    let unsubscribe: () => void;

    if (!auth || !globalThis.window) {
        console.warn('Firebase not initialized. Check your configuration.');
        const { subscribe, set } = writable<User | null>(null);
        return { subscribe };
    }

    const { subscribe, set } = writable(auth?.currentUser ?? null, (set) => {
        onAuthStateChanged(auth, (user) => {
            set(user);
        });
        return () => unsubscribe();
    });

    return {
        subscribe,
    };
}

export const user = userStore();
