"use client";
// src/context/AuthContext.tsx
import { auth } from "@/components/FirebaseFrovider";
import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth, User } from "../firebase";

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
