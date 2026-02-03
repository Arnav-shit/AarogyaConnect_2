/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
let _database: Database | null = null;
if (firebaseConfig.databaseURL) {
  _database = getDatabase(app);
} else {
  // No RTDB configured — app will use local mock data unless Firebase is configured
  // This prevents the runtime "Cannot parse Firebase url" crash in the browser.
  // Set VITE_FIREBASE_DATABASE_URL in .env.local to enable Realtime Database.
  // Example: VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
  // or: VITE_FIREBASE_DATABASE_URL=https://your-project-region.firebasedatabase.app
  // See Firebase console -> Realtime Database for the correct URL.
  // eslint-disable-next-line no-console
  console.warn('VITE_FIREBASE_DATABASE_URL not set — Firebase Realtime Database disabled.');
}

export const database: Database | null = _database;
export default app;
