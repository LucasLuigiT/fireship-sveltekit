// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";
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

/**
 * Creates a document store for a specific path in Firestore.
 * The document store allows subscribing to changes in real-time and provides the document reference and ID.
 *
 * @template T - The type of data stored in the document.
 * @param {string} path - The path to the document in Firestore.
 * @returns {Object} - An object containing the subscription, document reference, and document ID.
 */
export function docStore<T>(
    path: string,
) {
    let unsubscribe: () => void;
    // reference to a document in Firestore
    const docRef = doc(db, path);
    const { subscribe } = writable<T | null>(null, (set) => {
        // listen to the document for changes in real-time
        // and update the store
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });
        // return the unsubscribe function to stop listening
        return () => unsubscribe();
    });

    return {
        /**
         * Subscribe to changes in the document store.
         *
         * @param {Function} run - The callback function to be executed when the document changes.
         * @param {Function} invalidate - The callback function to be executed when the subscription is invalidated.
         * @returns {Function} - The unsubscribe function to stop listening to changes.
         */
        subscribe,
        /**
         * The reference to the document in Firestore.
         *
         * @type {Object}
         */
        ref: docRef,
        /**
         * The ID of the document.
         *
         * @type {string}
         */
        id: docRef.id,
    };
}

interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
});  