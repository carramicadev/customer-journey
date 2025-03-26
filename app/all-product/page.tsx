"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import Loader from "@/components/AppLoading";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import Footer from "@/components/footer";

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

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function AllProducts() {
  const searchParams = useSearchParams();
  const categId = searchParams.get("category");
  const orderIndex = searchParams.get("orderIndex");
  const orderId = searchParams.get("orderId");

  const [category, setCategory] = useState("");
  const router = useRouter();
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const { categories, loading, error } = useCategories();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    let filter = [];
    if (category) filter.push(where("category.id", "==", category));

    const getDoc = query(collection(firestore, "product"), ...filter);

    const unsubscribe = onSnapshot(
      getDoc,
      (snapshot) => {
        const updatedData = snapshot.docs
          .filter((doc) => doc.exists())
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
    setIsLoading(false);
    return () => unsubscribe();
  }, [category]);

  useEffect(() => {
    if (categId) {
      setCategory(categId);
    }
  }, [categId]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter products based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return allProduct;
    return allProduct.filter((product) =>
      product?.nama?.toLowerCase().includes(searchTerm?.toLowerCase()),
    );
  }, [allProduct, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const canNextPage = currentPage < totalPages;
  const canPrevPage = currentPage > 1;

  if (loading || isLoading) {
    return <Loader size="md" color="green" />;
  }

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="container mx-auto mb-20 px-2 pt-28 ">
        <div className="lh-10 mx-auto mt-6 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
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
              {categories.map((categ) => (
                <option key={categ.id} value={categ.id}>
                  {categ.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {currentData.map((product) => (
              <div key={product.id} className="group relative mb-4">
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
                  <a
                    href={`/all-product/details/${product.id}${
                      orderIndex && orderId
                        ? `?orderIndex=${orderIndex}&orderId=${orderId}`
                        : ""
                    }`}
                  >
                    <span className="absolute inset-0" />
                    {product.nama}
                  </a>
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {currency(product.harga)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={prevPage}
              disabled={!canPrevPage}
              className={`rounded-md ${
                canPrevPage
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              <ChevronLeftIcon className="h-8 w-8 p-0 text-green-800 dark:text-white" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`rounded-md px-4 py-2 ${
                  currentPage === page
                    ? "bg-green-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className={`rounded-md ${
                canNextPage
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              <ChevronRightIcon className="h-8 w-8 p-0 text-green-800 dark:text-white" />
            </button>
          </div>

          <div className="mt-4 text-center text-gray-600">
            <p>
              Page {currentPage} of {totalPages} | Showing {currentData.length}{" "}
              of {filteredData.length} products
            </p>
          </div>
        </div>
      </div>
      {orderIndex && orderId && (
        <button className="fixed bottom-0 left-0 m-4 flex rounded-md bg-green-600 px-4 py-2 text-white shadow-lg hover:bg-green-700">
          <InformationCircleIcon className="mr-4 h-6 w-6 text-white dark:text-white" />
          {` Tambah product untuk order ${orderIndex}`}
        </button>
      )}
      <Footer />
    </>
  );
}
