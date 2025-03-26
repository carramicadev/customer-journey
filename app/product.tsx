import Loader from "@/components/AppLoading";
import { firestore } from "@/components/FirebaseFrovider";
import Footer from "@/components/footer";
import { useCategories } from "@/context/CategoriesContext";
import { currency } from "@/utils/formatter";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Product } from "./all-product/page";

export default function Example() {
  //   const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{
    [key: string]: Product[];
  }>({});

  const { categories, loading, error } = useCategories();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  // Fetch products for each category (maximum 4 products per category)
  useEffect(() => {
    const fetchProductsForCategories = async () => {
      setIsLoading(true);
      const productsData: { [key: string]: Product[] } = {};

      for (const category of categories) {
        const productsQuery = query(
          collection(firestore, "product"),
          where("category.id", "==", category.id),
          limit(4), // Fetch only 4 products per category
        );
        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Only include the category if it has at least one product
        if (products.length > 0) {
          productsData[category.id] = products;
        }
      }

      setProductsByCategory(productsData);
      setIsLoading(false);
    };

    if (categories.length > 0) {
      fetchProductsForCategories();
    }
  }, [categories]);

  const categoriesWithProducts = categories.filter(
    (category) => productsByCategory[category.id]?.length > 0,
  );
  console.log(productsByCategory);
  if (loading || isLoading) {
    return <Loader size="md" color="green" />;
  }
  return (
    <div className="lh-10 mt-6 bg-white">
      {categoriesWithProducts.map((categ) => {
        return (
          <div key={categ.id}>
            <div>
              <img
                className="w-full rounded-lg"
                src={categ?.thumbnail}
                alt=""
                // width={1310}
                // height={873}
              />
            </div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  {categ.nama}
                </h2>
                <a
                  href={`/all-product?category=${categ.id}`}
                  className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
                >
                  See Moore
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                {productsByCategory[categ.id]?.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                      <img
                        src={product.thumbnail?.[0]}
                        alt={product.nama}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      <a href={`/all-product/details/${product.id}`}>
                        <span className="absolute inset-0" />
                        {product.nama}
                      </a>
                    </h3>
                    {/* <p className="mt-1 text-sm text-gray-500">
                              {product.color}
                            </p> */}
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
        );
      })}
      <Footer />
    </div>
  );
}
