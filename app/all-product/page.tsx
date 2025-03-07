"use client";
import { useRouter } from "@/node_modules/next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
import Header from "../../components/header";
import { currency } from "@/utils/formatter";
import { useCategories } from "@/context/CategoriesContext";
import { useSearchParams } from "next/navigation";

type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export type Product = {
  id: string;
  height: number;
  harga: number;
  createdAt: Timestamp;
  sku: string;
  length: number;
  weight: number;
  updatedAt: Timestamp;
  width: number;
  stok: number;
  nama: string;
  qty_sold: number;
  thumbnail: string[];
  status: string;
  description: string;
  category?: Record<string, unknown>;
  cogs?: number;
  warning_stock?: number;
};

export default function AllProducts() {
  const searchParams = useSearchParams();
  const categId = searchParams.get("category");

  const [category, setCategory] = useState("");
  const router = useRouter();
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const { categories, loading, error } = useCategories();

  useEffect(() => {
    let filter = [];
    if (category) filter.push(where("category.id", "==", category));

    const getDoc = query(
      collection(firestore, "product"),
      ...filter,
      limit(20),
    );

    const unsubscribe = onSnapshot(
      getDoc,
      (snapshot) => {
        const updatedData = snapshot.docs
          .filter((doc) => doc.exists()) // Filter out deleted documents
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setAllProduct(updatedData as Product[]);
      },
      (error) => {
        console.error("Error fetching products:", error);
      },
    );

    return () => unsubscribe();
  }, [category]);
  useEffect(() => {
    if (categId) {
      setCategory(categId);
    }
  }, [categId]);
  console.log(allProduct);
  return (
    <>
      <Header />
      <div className="container mx-auto px-2 pt-28">
        <div className="mx-auto max-w-2xl px-4  sm:px-6  lg:max-w-7xl lg:px-8">
          <div className="ml-0 max-w-xs">
            <select
              id="categories"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option selected hidden>
                Choose a category
              </option>
              {categories.map((categ) => {
                return (
                  <option key={categ.id} value={categ.id}>
                    {categ.nama}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {allProduct.map((product) => (
              <div
                key={product.id}
                className="group relative mb-4"
                // onClick={() =>
                //   router.push(`/all-product/details/${product.id}`)
                // }
              >
                <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                  <img
                    src={
                      product.thumbnail?.[0] ?? "/product-images/product.webp"
                    }
                    alt={product.nama}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-2 text-sm text-gray-700">
                  <a href={`/all-product/details/${product.id}`}>
                    <span className="absolute inset-0" />
                    {product.nama}
                  </a>
                </h3>
                {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {currency(product.harga)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm md:hidden">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              See moore
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
