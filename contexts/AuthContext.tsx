import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  signInAnonymously,
  Auth,
  User
} from 'firebase/auth';

// Firebase configuration using provided environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase using the Modular API
let app: FirebaseApp;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();

try {
  // Check if API key exists to avoid crashing on start
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } else {
    console.warn("Firebase API Key is missing. Check your environment variables.");
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Modern modular listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);
        localStorage.setItem('vesper_user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('vesper_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      alert("Auth system not initialized. Check console for configuration errors.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const signInAsGuest = async () => {
    if (!auth) {
      // Manual fallback if Firebase is not connected
      const mockUser = { uid: 'guest-offline', displayName: 'Offline Guest', email: null, photoURL: null };
      setUser(mockUser);
      setLoading(false);
      return;
    }
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest Sign-In Error:", error);
      // Local fallback for guest mode if network/config is down
      const mockUser = { 
        uid: 'guest-' + Math.random().toString(36).substr(2, 5), 
        displayName: 'Guest Adventurer', 
        email: null, 
        photoURL: null 
      };
      setUser(mockUser);
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};