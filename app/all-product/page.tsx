"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { firestore } from "@/components/FirebaseProvider";
import { currency } from "@/utils/formatter";
import { useCategories } from "@/context/CategoriesContext";
import Loader from "@/components/AppLoading";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

/* ================= TYPES ================= */

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

/* ================= PAGE ================= */

export default function AllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categId = searchParams.get("category");
  const searchTerm = searchParams.get("search") ?? "";
  const orderIndex = searchParams.get("orderIndex");
  const orderId = searchParams.get("orderId");

  const [category, setCategory] = useState("");
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { categories, loading } = useCategories();

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    setIsLoading(true);

    const filters = [];
    if (category) {
      filters.push(where("category.id", "==", category));
    }

    const q = query(collection(firestore, "product"), ...filters);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setAllProduct(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [category]);

  useEffect(() => {
    if (categId) setCategory(categId);
  }, [categId]);

  /* ================= SEARCH FILTER ================= */

  const filteredData = useMemo(() => {
    if (!searchTerm) return allProduct;

    return allProduct.filter((product) =>
      product.nama?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allProduct, searchTerm]);

  /* ================= PAGINATION ================= */

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const canPrevPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  /* ================= LOADING ================= */

  if (loading || isLoading) {
    return <Loader size="md" color="green" />;
  }

  /* ================= RENDER ================= */

  return (
    <>
      <div className="container mx-auto mb-20 px-2 ">
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* CATEGORY FILTER */}
          <div className="max-w-xs">
            <select
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option hidden>Pilih kategori</option>
              {categories.map((categ) => (
                <option key={categ.id} value={categ.id}>
                  {categ.nama}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT GRID */}
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {currentData.map((product) => (
              <div key={product.id} className="group relative">
                <div className="h-56 overflow-hidden rounded-md bg-gray-200">
                  <img
                    src={
                      product.thumbnail?.[0] ?? "/product-images/product.webp"
                    }
                    alt={product.nama}
                    className="size-full object-cover"
                  />
                </div>

                <h3 className="mt-2 text-sm text-gray-700">
                  <a
                    href={`/all-product/details/${product.id}${
                      orderIndex && orderId
                        ? `?orderIndex=${orderIndex}&orderId=${orderId}`
                        : ""
                    }`}
                  >
                    {product.nama}
                  </a>
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {currency(product.harga)}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-10 flex justify-center gap-2">
            <button
              disabled={!canPrevPage}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-md bg-green-500 p-2 text-white disabled:bg-gray-300"
            >
              <ChevronLeftIcon className="size-6" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`rounded-md px-4 py-2 ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={!canNextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-md bg-green-500 p-2 text-white disabled:bg-gray-300"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Page {currentPage} of {totalPages} · Showing {currentData.length} of{" "}
            {filteredData.length}
          </p>
        </div>
      </div>

      {/* FLOATING BUTTON */}
      {orderIndex && orderId && (
        <button className="fixed bottom-4 left-4 flex items-center rounded-md bg-primary px-4 py-2 text-white shadow">
          <InformationCircleIcon className="mr-2 size-6" />
          Tambah product untuk order {orderIndex}
        </button>
      )}

      {/* <Footer /> */}
    </>
  );
}
