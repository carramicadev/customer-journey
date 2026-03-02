"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { firestore } from "@/components/FirebaseProvider";
import { Product } from "../../page";
import { currency } from "@/utils/formatter";
import { useAuth } from "@/context/AuthContext";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import ModalConfirm from "@/components/ConfirmModal";
import Loader from "@/components/AppLoading";

const ProductPage: React.FC = () => {
  const params = useParams<{ productId: string }>();
  const searchParams = useSearchParams();

  const orderIndex = searchParams.get("orderIndex");
  const orderId = searchParams.get("orderId");

  const [quantity, setQuantity] = useState<number>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useAuth();

  const isOutOfStock = (product?.stok ?? 0) < 1;

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!params?.productId) return;

    const docRef = doc(firestore, "product", params.productId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setProduct({
            id: docSnapshot.id,
            ...data,
          } as Product);
        } else {
          setProduct(undefined);
        }
        setLoading(false);
      },
      () => setLoading(false),
    );

    return () => unsubscribe();
  }, [params?.productId]);

  /* ================= RELATED PRODUCTS ================= */
  useEffect(() => {
    if (!product?.category?.id) return;

    const q = query(
      collection(firestore, "product"),
      where("category.id", "==", product.category.id),
      limit(8),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setRelatedProducts(data);
    });

    return () => unsubscribe();
  }, [product?.category?.id]);

  /* ================= QUANTITY ================= */
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && !isOutOfStock) {
      setQuantity(newQuantity);
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (type: string) => {
    if (isOutOfStock) return; // prevent

    if (!user) {
      router.push("/login");
      return;
    }

    const newData = {
      name: product?.nama,
      quantity,
      price: product?.harga,
      id: product?.id,
      imageUrl: product?.thumbnail?.[0] ?? "/product-images/product.webp",
      stok: product?.stok,
      sku: product?.sku,
      weight: product?.weight,
      height: product?.height,
      width: product?.width,
      length: product?.length,
    };

    if (orderId) {
      await setDoc(
        doc(firestore, "shopping-cart", user.uid, "orders", orderId),
        { products: arrayUnion(newData) },
        { merge: true },
      );
    } else {
      const collectionRef = collection(
        firestore,
        "shopping-cart",
        user.uid,
        "orders",
      );

      const snapshot = await getDocs(collectionRef);

      if (!snapshot.empty) {
        const firstDoc = snapshot.docs[0];
        await setDoc(
          doc(firestore, "shopping-cart", user.uid, "orders", firstDoc.id),
          { products: arrayUnion(newData) },
          { merge: true },
        );
      } else {
        await addDoc(collectionRef, {
          products: [newData],
          createdAt: serverTimestamp(),
        });
      }
    }

    if (type === "buy") {
      router.push("/shopping-cart");
    } else {
      setShowModal(true);
    }
  };

  /* ================= MODAL ACTION ================= */
  const handleContinueShopping = () => {
    setShowModal(false);
    router.push("/all-product");
  };

  const handleGoToCart = () => {
    setShowModal(false);
    router.push("/shopping-cart");
  };

  if (loading) return <Loader size="md" color="green" />;

  return (
    <>
      <div className="container mx-auto px-4 pb-20 pt-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* IMAGE */}
          <div className="relative rounded-xl bg-gray-100 p-6">
            {isOutOfStock && (
              <div className="absolute left-4 top-4 z-10 rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow">
                Out of Stock
              </div>
            )}

            <Swiper
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              className="mb-4"
              onSlideChange={(swiper: any) =>
                setActiveThumbIndex(swiper.activeIndex)
              }
            >
              {(product?.thumbnail?.length ?? 0) > 0 ? (
                product?.thumbnail?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      className="w-full rounded-lg object-cover"
                      alt=""
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img
                    src="/product-images/product.webp"
                    className="w-full rounded-lg"
                    alt=""
                  />
                </SwiperSlide>
              )}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              modules={[Thumbs]}
            >
              {product?.thumbnail?.map((thumbnail, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={thumbnail}
                    className={`cursor-pointer rounded-lg border-2 ${
                      activeThumbIndex === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DETAILS */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold md:text-3xl">{product?.nama}</h1>

            <p className="text-2xl font-semibold text-gray-800">
              {currency(product?.harga ?? 0)}
            </p>

            <p
              className={`text-sm font-medium ${
                isOutOfStock ? "text-red-500" : "text-green-600"
              }`}
            >
              {isOutOfStock
                ? "Out of stock"
                : `Stock available: ${product?.stok}`}
            </p>

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity</span>

              <div className="flex items-center overflow-hidden rounded-lg border">
                <button
                  disabled={isOutOfStock}
                  className="bg-gray-200 px-4 py-2 disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>

                <span className="px-4">{quantity}</span>

                <button
                  disabled={isOutOfStock || quantity >= (product?.stok ?? 0)}
                  className="bg-gray-200 px-4 py-2 disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            {isOutOfStock ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 font-semibold text-gray-600"
              >
                Out of Stock
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  className="w-full rounded-lg border-2 border-primary py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
                  onClick={() => handleAddToCart("add-to-cart")}
                >
                  Add to Cart
                </button>

                <button
                  className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-green-700"
                  onClick={() => handleAddToCart("buy")}
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* DESCRIPTION */}
            <div>
              <h2 className="mb-2 text-lg font-semibold">Product Details</h2>
              <p className="text-gray-600">{product?.description}</p>
            </div>
          </div>
        </div>

        {/* RELATED */}
        <div className="mt-14">
          <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((item, index) => (
              <div key={index} className="rounded-lg bg-gray-100 p-4">
                <img src={item.thumbnail?.[0]} className="rounded-lg" />
                <p className="mt-2 font-semibold">{item.nama}</p>
                <p className="text-gray-600">{currency(item.harga ?? 0)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ModalConfirm
        open={showModal}
        onOpenChange={setShowModal}
        product={{
          name: product?.nama ?? "",
          quantity,
          price: product?.harga ?? 0,
          id: product?.id ?? "",
          imageUrl: product?.thumbnail?.[0] ?? "/product-images/product.webp",
          stok: product?.stok ?? 0,
        }}
        onContinueShopping={handleContinueShopping}
        onGoToCart={handleGoToCart}
      />

      {orderIndex && (
        <button className="fixed bottom-4 left-4 z-10 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white shadow-lg">
          <InformationCircleIcon className="size-5" />
          Tambah product untuk order {orderIndex}
        </button>
      )}
    </>
  );
};

export default ProductPage;
