"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Header from "@/components/header";
import { useParams } from "@/node_modules/next/navigation";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
import { Product } from "../../page";
import { currency } from "@/utils/formatter";

const ProductPage: React.FC = () => {
  const params = useParams<{ productId: string; item: string }>();
  console.log(params);
  const [quantity, setQuantity] = useState<number>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0); // Track active thumbnail index
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!params?.productId) return;

    const docRef = doc(firestore, "product", params.productId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const product: Product = {
            id: docSnapshot.id,
            height: data.height ?? 0,
            harga: data.harga ?? 0,
            createdAt: data.createdAt ?? { seconds: 0, nanoseconds: 0 },
            sku: data.sku ?? "",
            length: data.length ?? 0,
            weight: data.weight ?? 0,
            updatedAt: data.updatedAt ?? { seconds: 0, nanoseconds: 0 },
            width: data.width ?? 0,
            stok: data.stok ?? 0,
            nama: data.nama ?? "",
            qty_sold: data.qty_sold ?? 0,
            category: data.category ?? {},
            description: data.description ?? "",
            cogs: data.cogs ?? 0,
            status: data.status ?? "Unknown",
            warning_stock: data.warning_stock ?? 0,
            thumbnail: data.thumbnail ?? [],
          };

          setProduct(product);
        } else {
          setProduct(undefined);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [params?.productId]);

  useEffect(() => {
    if (product?.category?.id && params.productId) {
      // const fetchData = async () => {
      const getDoc = query(
        collection(firestore, "product"),
        where("category.id", "==", product?.category?.id),
        where("id", "!=", params.productId),
        //   orderBy("createdAt", "desc"),
        limit(10),
      );
      // const documentSnapshots = await getDocs(getDoc);
      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRelatedProducts(updatedData as Product[]); // Update the state with the new data
      });
      return () => unsubscribe();
      // };
      // fetchData();
    }
  }, [product?.category?.id, params.productId]);
  //   const product: Product = {
  //     name: "Carramica Imperial Forest",
  //     price: 399000,
  //     material: "Porcelain",
  //     includes: ["1x Boovi", "2x Mug", "3x Dinner Plate"],
  //     description: "Comes with box, hang tags, and free gift card.",
  //     images: [
  //       "/product-images/product.webp",
  //       "/product-images/product.webp",
  //       "/product-images/product.webp",
  //       "/product-images/product.webp",
  //       "/product-images/product.webp",
  //     ],
  //     thumbnails: [
  //       "https://via.placeholder.com/100",
  //       "https://via.placeholder.com/100?text=Thumb+2",
  //       "https://via.placeholder.com/100?text=Thumb+3",
  //       "https://via.placeholder.com/100?text=Thumb+4",
  //     ],
  //   };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product?.nama}(s) to cart!`);
  };

  const handleThumbClick = (index: number) => {
    setActiveThumbIndex(index); // Update active thumbnail index
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-2 pt-28">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image Section */}
          <div className="rounded-lg bg-gray-100 p-8">
            {/* Main Image Swiper */}
            <Swiper
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              className="mb-4"
              onSlideChange={(swiper: {
                activeIndex: React.SetStateAction<number>;
              }) => setActiveThumbIndex(swiper.activeIndex)} // Update active thumbnail on slide change
            >
              {product?.thumbnail?.length > 0 ? (
                product?.thumbnail.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image ?? "/product-images/product.webp"}
                      alt={`Product ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img
                    src={"/product-images/product.webp"}
                    alt={`Product`}
                    className="w-full rounded-lg"
                  />
                </SwiperSlide>
              )}
            </Swiper>

            {/* Thumbnail Swiper */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Thumbs]}
            >
              {product?.thumbnail.map((thumbnail, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => handleThumbClick(index)}
                >
                  <img
                    src={thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    className={`cursor-pointer rounded-lg border-2 ${
                      activeThumbIndex === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product?.nama}</h1>
            <p className="text-xl text-gray-700">{currency(product?.harga)}</p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg">Quantity:</label>
                <div className="flex items-center rounded border">
                  <button
                    className="bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    className="bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="w-full rounded-lg border-2 border-green-600 py-2 text-green-600 transition-colors duration-300 hover:bg-green-100 hover:text-white"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
                onClick={handleAddToCart}
              >
                Buy Now
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Product Details</h2>
              {/* <p className="text-gray-600">Material: {product.material}</p>
              <p className="text-gray-600">Includes:</p>
              <ul className="list-inside list-disc text-gray-600">
                {product.includes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul> */}
              <p className="text-gray-600">{product?.description}</p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {relatedProducts.map((relatedProduct, index) => (
              <div key={index} className="rounded-lg bg-gray-100 p-4">
                <img
                  src={relatedProduct.thumbnail?.[0]}
                  alt="Related Product"
                  className="rounded-lg"
                />
                <p className="mt-2 text-lg font-semibold">
                  {relatedProduct.nama}
                </p>
                <p className="text-gray-700">{currency(product?.harga)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
