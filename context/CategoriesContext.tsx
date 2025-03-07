"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
// import { db } from "@/lib/firebase"; // Adjust the import based on your Firebase setup

interface Category {
  id: string;
  nama: string;
  level: number;
  parent: string;
  thumbnail: string;
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  loading: true,
  error: null,
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const categoriesQuery = query(
      collection(firestore, "categories"),
      where("level", "==", 3),
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        setError("Failed to fetch categories");
        setLoading(false);
      },
    );

    // Cleanup function: Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoriesContext.Provider>
  );
};
