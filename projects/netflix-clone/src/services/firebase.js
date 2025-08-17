import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Authentication functions
export const createUserAccount = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Firestore functions
export const addToWatchlist = async (userId, movie) => {
  try {
    const docRef = await addDoc(collection(db, 'watchlist'), {
      userId,
      movieId: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      release_date: movie.release_date || movie.first_air_date,
      media_type: movie.media_type || 'movie',
      dateAdded: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getWatchlist = async (userId) => {
  try {
    const q = query(
      collection(db, 'watchlist'),
      where('userId', '==', userId),
      orderBy('dateAdded', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const watchlist = [];
    querySnapshot.forEach((doc) => {
      watchlist.push({ id: doc.id, ...doc.data() });
    });
    return watchlist;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeFromWatchlist = async (docId) => {
  try {
    await deleteDoc(doc(db, 'watchlist', docId));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Storage functions
export const uploadProfileImage = async (userId, file) => {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw new Error(error.message);
  }
};

// User preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      preferences,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export { app };
export default app;
