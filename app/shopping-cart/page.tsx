"use client";
import EditAddressModal from "@/components/AddModalAdress";
import Loader from "@/components/AppLoading";
import Card, { CardProps } from "@/components/Card";
import { firestore, functions } from "@/components/FirebaseFrovider";
import Header from "@/components/header";
import Modal from "@/components/Modal";
import ReceiverCard from "@/components/ReceiverCard";
import { useAuth } from "@/context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useCallback, useEffect } from "react";
import { Address } from "../profile/address";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import PhoneInput from "react-phone-input-2";
import { useRouter } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { deleteCollection } from "@/components/DeleteShoppingCart";

// Define TypeScript interfaces
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

interface RecipientInfo {
  receiverName: string;
  receiverPhone: string;
  address: string;
  koordinateReceiver: {
    lat: number;
    lng: number;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stok: number;
  sku: string;
  weight: number;
  height: number;
  width: number;
  length: number;
}

interface Order {
  id: string;
  recipient: RecipientInfo;
  products: Product[];
  courier: string;
  deliveryFee: number;
  giftCardMessage: string; // New field for gift card message
  isEditing: boolean; // Track editing state for each order
  dataCourier?: any;
  listService?: any[];
  dataComplete?: boolean;
}

const CheckoutPage: React.FC = () => {
  const { user } = useAuth();

  // State for form fields
  const [contactInfo, setContactInfo] = useState<CardProps>({
    senderName: "",
    senderPhone: "",
    address: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({}); // Track validation errors

  const [isEditingContactInfo, setIsEditingContactInfo] =
    useState<boolean>(false);
  const [contactIsCompleted, setContactIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [listService, setListService] = useState<any>({});
  const [koordinateOrigin, setKoordinateOrigin] = useState({
    lat: -6.198153,
    lng: 106.698915,
  });
  //   get address
  useEffect(() => {
    if (user?.uid) {
      // const fetchData = async () => {
      const getDoc = collection(firestore, "customer", user?.uid, "address");
      // const documentSnapshots = await getDocs(getDoc);
      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(updatedData as Address[]);
      });
      return () => unsubscribe();
      // };
      // fetchData();
    }
  }, [user?.uid]);

  //   getCOntact info/user info
  useEffect(() => {
    if (user?.uid) {
      const fetchUserData = async () => {
        setIsLoading(true);
        const userDocRef = doc(firestore, "customer", user?.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as CardProps;
          setContactInfo(userData); // Update state with fetched data
          setIsEditingContactInfo(false);
          false;
        } else {
          // setIsEditing(true);
          console.log("No user data found in Firestore.");
        }

        setIsLoading(false);
      };

      fetchUserData();
    }
  }, [user?.uid]);

  // Fetch contact info from Firestore
  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      const fetchContactInfo = async () => {
        try {
          const docRef = doc(firestore, `customer/${user?.uid}/account/info`); // Firestore document reference
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as CardProps; // Cast data to ContactInfo
            setContactInfo(data); // Update state with fetched data
            setContactIsCompleted(true);
          } else {
            setError("No contact info found."); // Handle case where document doesn't exist
          }

          //   get cart
        } catch (err) {
          setError("Failed to fetch contact info."); // Handle errors
          console.error(err);
        } finally {
          setIsLoading(false); // Set loading to false after fetching
        }
      };

      fetchContactInfo();
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (
      contactInfo.address &&
      contactInfo.senderName &&
      contactInfo.senderPhone
    ) {
      setContactIsCompleted(true);
    }
  }, [
    contactInfo.address && contactInfo.senderName && contactInfo.senderPhone,
  ]);

  useEffect(() => {
    if (
      !contactInfo.senderName &&
      !contactInfo.address &&
      !contactInfo.senderPhone
    ) {
      setIsEditingContactInfo(true);
    }
  }, []);

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.senderName) newErrors.senderName = "Name is required.";
    // if (!contactInfo.email) newErrors.email = "Email is required.";
    if (!contactInfo.senderPhone) newErrors.senderPhone = "Phone is required.";
    if (!contactInfo.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle saving contact info changes
  const handleSaveContactInfo = () => {
    if (!validateForm()) return;
    setIsEditingContactInfo(false); // Exit editing mode
  };
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<number>(0);

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      // const fetchData = async () => {
      const getDoc = collection(
        firestore,
        "shopping-cart",
        user?.uid,
        "orders",
      );
      // const documentSnapshots = await getDocs(getDoc);
      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          deliveryFee: doc.data()?.deliveryFee ?? 0,
        }));
        setOrders(updatedData as Order[]);
      });
      setIsLoading(false);
      return () => unsubscribe();
      // };
      // fetchData();
    }
  }, [user?.uid]);
  const [deliveryFee, setDeliveryFee] = useState<number>(31000);
  const [expandedOrderIndex, setExpandedOrderIndex] = useState<number | null>(
    null,
  );
  // Handle courier change
  const handleCourierChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCurrentOrder(index);
    const { value } = e.target;
    const updatedOrders = [...orders];

    // Set deliveryFee based on the selected courier
    // let deliveryFee = 0;
    // switch (value) {
    //   case "Lalamove bike":
    //     deliveryFee = 31000;
    //     break;
    //   case "JNE":
    //     deliveryFee = 25000;
    //     break;
    //   case "GoSend":
    //     deliveryFee = 20000;
    //     break;
    //   case "GrabExpress":
    //     deliveryFee = 22000;
    //     break;
    //   default:
    //     deliveryFee = 0;
    // }
    const courier = listService?.[index]
      ? listService?.[index]?.find?.(
          (option: any) => option?.courier_service_code === value,
        )
      : orders?.[index]?.listService?.find?.(
          (option: any) => option?.courier_service_code === value,
        );
    updatedOrders[index] = {
      ...updatedOrders[index],
      courier: courier?.courier_name,
      deliveryFee: courier?.price, // Update deliveryFee
      dataCourier: courier,
      isEditing: false,
    };

    setOrders(updatedOrders);
  };
  // Calculate totals for each order
  const orderTotals = orders.map((order) => {
    const subtotal = order.products.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0,
    );
    const total = subtotal + order.deliveryFee; // Include deliveryFee in the total
    return { subtotal, total };
  });

  // Calculate overall totals
  const overallSubtotal = orderTotals.reduce(
    (sum, order) => sum + order.subtotal,
    0,
  );
  const overallDeliveryFee = orders.reduce(
    (sum, order) => sum + order.deliveryFee,
    0,
  );
  const overallTotal = overallSubtotal + overallDeliveryFee;

  // Handle adding a new order
  const handleAddOrder = async () => {
    try {
      if (orders.length < 10 && user?.uid) {
        const collectionRef = collection(
          firestore,
          "shopping-cart",
          user?.uid,
          "orders",
        );
        const tambahProduk = await addDoc(collectionRef, {
          recipient: {
            receiverName: "",
            receiverPhone: "",
            address: "",
            koordinateReceiver: {
              lat: 0,
              lng: 0,
            },
          },
          courier: "",
          giftCardMessage: "", // Initialize gift card message
          isEditing: false, // Initialize editing state
          products: [],
          deliveryFee: 0,

          createdAt: serverTimestamp(),
        });
        const newOrder: Order = {
          id: tambahProduk?.id,
          recipient: {
            receiverName: "",
            receiverPhone: "",
            address: "",
            koordinateReceiver: {
              lat: 0,
              lng: 0,
            },
          },
          courier: "",
          giftCardMessage: "", // Initialize gift card message
          isEditing: false, // Initialize editing state
          products: [],
          deliveryFee: 0,
        };
        setOrders([...orders, newOrder]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Handle toggling accordion
  const toggleAccordion = (index: number) => {
    setExpandedOrderIndex(expandedOrderIndex === index ? null : index);
  };

  // Handle contact input changes
  const handleContactInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    setContactInfo((prevUser) => ({
      ...prevUser,
      senderPhone: value, // Add the "+" prefix
    }));

    // Clear the phone error when the userInfo starts typing
    if (errors.senderPhone) {
      setErrors((prevErrors) => ({ ...prevErrors, senderPhone: "" }));
    }
  };
  const handleRecipientInfoChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const updatedOrders = [...orders];
    updatedOrders[index].recipient = {
      ...updatedOrders[index].recipient,
      [name]: value,
    };
    setOrders(updatedOrders);
  };

  // Handle quantity changes
  const handleQuantityChange = useCallback(
    (orderIndex: number, productIndex: number, delta: number) => {
      setOrders((prevOrders) => {
        return prevOrders.map((order, oIdx) => {
          if (oIdx !== orderIndex) return order;

          return {
            ...order,
            products: order.products.map((product, pIdx) => {
              if (pIdx !== productIndex) return product;

              return {
                ...product,
                quantity: Math.max(1, product.quantity + delta),
              };
            }),
            isEditing: true,
            dataComplete: false,
          };
        });
      });
    },
    [],
  );

  // Handle product deletion
  const handleDeleteProduct = (orderIndex: number, productIndex: number) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];

      // Clone the order to avoid mutating state directly
      const updatedOrder = {
        ...updatedOrders[orderIndex],
        isEditing: true,
        dataComplete: false,
      };

      // Filter out the product that should be removed
      updatedOrder.products = updatedOrder.products.filter(
        (_, index) => index !== productIndex,
      );

      // Replace the order in the array with the updated one
      updatedOrders[orderIndex] = updatedOrder;

      return updatedOrders;
    });
  };

  // Handle adding a new product
  const router = useRouter();

  const handleAddProduct = (orderIndex: number, orderId: string) => {
    router.push(`/all-product?orderIndex=${orderIndex}&&orderId=${orderId}`);
  };

  // Handle gift card message change
  const handleGiftCardMessageChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    const updatedOrders = [...orders];
    updatedOrders[index].giftCardMessage = value;
    setOrders(updatedOrders);
  };

  // Handle editing state for each order
  const toggleEditOrder = (index: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order, i) =>
        i === index ? { ...order, isEditing: !order.isEditing } : order,
      ),
    );
  };

  //   modal sender data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
  const [tempSelectedCard, setTempSelectedCard] = useState<CardProps | null>(
    null,
  ); // Temporary selection

  const openModal = () => {
    setIsModalOpen(true);
    setTempSelectedCard(selectedCard); // Initialize temp selection with the current selected card
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempSelectedCard(null); // Reset temp selection when modal closes
  };

  const handleSelectCard = (card: CardProps) => {
    setTempSelectedCard(card); // Update temp selection when a card is clicked
  };

  const handleConfirmSelection = () => {
    setSelectedCard(tempSelectedCard); // Set the final selection
    closeModal(); // Close the modal
  };

  //   modal receiver data
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const handleAddNew = () => {
    setCurrentAddress({
      id: "",
      receiverName: "",
      receiverPhone: "",
      address: "",
      district: "",
      postalCode: 0,
      koordinateReceiver: {
        lat: 0,
        lng: 0,
      },
    });
    setIsEditing(true);
  };
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
  const [selectedReceiverIndex, setSelectedReceiverIndex] = useState<
    number | null
  >(null);
  const [tempReceiver, setTempReceiver] = useState<RecipientInfo | null>(null);
  const openReceiverModal = () => setIsReceiverModalOpen(true);
  const closeReceiverModal = () => {
    setIsReceiverModalOpen(false);
    setSelectedReceiverIndex(null);
    setTempReceiver(null); // Reset tempReceiver when modal closes
  };

  const handleSelectReceiver = (index: number) => {
    setSelectedReceiverIndex(index);
    setTempReceiver(addresses[index]); // Initialize tempReceiver with the selected recipient data
  };

  const handleReceiverChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!tempReceiver) return;

    const { name, value } = e.target;
    setTempReceiver({
      ...tempReceiver,
      [name]: value,
    });
  };

  const handleConfirmReceiverSelection = (index: number) => {
    setCurrentOrder(index);
    if (selectedReceiverIndex !== null && tempReceiver) {
      console.log(selectedReceiverIndex !== null && tempReceiver);

      setOrders((prevItems) =>
        prevItems.map((item, idx) =>
          idx === index
            ? {
                ...item,
                recipient: tempReceiver, // Update the recipient data
                dataComplete: false,
                // isEditing: false,
              }
            : item,
        ),
      );
    }
    closeReceiverModal();
  };
  const [cardDataSender, setCardDataSender] = useState<CardProps[]>([
    // {
    //   senderName: "John Doe",
    //   senderPhone: "123-456-7890",
    //   address: "123 Main St, Springfield, IL",
    // },
    // {
    //   senderName: "Jane Smith",
    //   senderPhone: "987-654-3210",
    //   address: "456 Elm St, Springfield, IL",
    // },
    // {
    //   senderName: "Alice Johnson",
    //   senderPhone: "555-555-5555",
    //   address: "789 Oak St, Springfield, IL",
    // },
  ]);

  // call getRate
  const [loadingRate, setLoadingRate] = useState(false);
  useEffect(() => {
    const fetchShippingRates = async () => {
      // Check required conditions
      const currentOrderData = orders?.[currentOrder];
      console.log(orders?.[currentOrder]);
      if (
        !currentOrderData?.products?.length ||
        !currentOrderData?.recipient?.koordinateReceiver?.lat ||
        !currentOrderData?.recipient?.koordinateReceiver?.lng ||
        !koordinateOrigin?.lat ||
        !koordinateOrigin?.lng ||
        !currentOrderData?.isEditing
      ) {
        return;
      }

      // Prepare products data
      const ordersProduct = currentOrderData.products.map((prod) => ({
        name: prod?.name,
        sku: prod?.sku,
        weight: prod?.weight,
        height: prod?.height,
        width: prod?.width,
        length: prod?.length,
        quantity: prod?.quantity,
      }));

      // Reset state before fetching
      setOrders((prev) =>
        prev.map((order, i) =>
          i === currentOrder
            ? {
                ...order,
                deliveryFee: 0,
                courier: "",
                dataCourier: {},
                listService: [],
              }
            : order,
        ),
      );
      setListService({ ...listService, [currentOrder]: [] });

      setLoadingRate(true);

      try {
        // Call cloud function
        const getRates = httpsCallable(functions, "getRates");
        const result = await getRates({
          items: ordersProduct,
          origin_latitude: koordinateOrigin.lat,
          origin_longitude: koordinateOrigin.lng,
          destination_latitude:
            currentOrderData.recipient.koordinateReceiver.lat,
          destination_longitude:
            currentOrderData.recipient.koordinateReceiver.lng,
        });

        // Update state with results
        setListService({
          ...listService,
          [currentOrder]: (result as any)?.data?.items?.pricing,
        });
      } catch (error) {
        console.error("Error fetching shipping rates:", error);
        setListService({ ...listService, [currentOrder]: [] });

        // enqueueSnackbar(`Failed to get shipping rates: ${error.message}`, {
        //   variant: "error",
        // });
      } finally {
        setLoadingRate(false);
      }
    };

    // Add slight delay to prevent rapid firing
    const timer = setTimeout(fetchShippingRates, 500);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [
    orders?.[currentOrder]?.products,
    orders?.[currentOrder]?.recipient?.koordinateReceiver?.lat,
    orders?.[currentOrder]?.recipient?.koordinateReceiver?.lng,
    koordinateOrigin?.lat,
    koordinateOrigin?.lng,
    orders?.[currentOrder]?.isEditing,
  ]);

  useEffect(() => {
    if (
      orders?.[currentOrder]?.dataCourier?.courier_service_code &&
      user?.uid &&
      !orders?.[currentOrder]?.isEditing &&
      listService?.[currentOrder]
    ) {
      const updateDocOrders = async () => {
        try {
          await setDoc(
            doc(
              firestore,
              "shopping-cart",
              user?.uid,
              "orders",
              orders?.[currentOrder]?.id,
            ),
            {
              ...orders?.[currentOrder],
              dataComplete: true,
              listService: listService?.[currentOrder],
            },
            { merge: true },
          );
          setCurrentOrder(currentOrder + 1);
          console.log("saved");
        } catch (e) {
          console.log(e);
        }
      };
      updateDocOrders();
    }
  }, [
    orders?.[currentOrder]?.dataCourier?.courier_service_code,
    user?.uid,
    !orders?.[currentOrder]?.isEditing,
  ]);

  // payment
  const prepareTransactionData = (orders: Order[], id: string) => {
    // Flatten all products
    const items = orders.flatMap((order) =>
      order.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      })),
    );

    // Add delivery fees as an item
    const deliveryFees = orders.map((order) => ({
      id: `delivery-${order.id}`,
      name: `Delivery Fee (${order.courier})`,
      price: order.deliveryFee,
      quantity: 1,
    }));

    // Calculate total amount
    const gross_amount = [...items, ...deliveryFees].reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      amount: gross_amount,
      item: [...items, ...deliveryFees],
      customer_details: {
        first_name: contactInfo?.senderName || "Customer",
        phone: contactInfo?.senderPhone || "",
        email: contactInfo?.email || "customer@example.com", // Replace with user email
      },
      id: `CUSTOMER_ORDER_${id}`,
    };
  };

  // delete cart
  const deleteUserOrders = async (): Promise<void> => {
    if (!user?.uid) {
      throw new Error("User UID is required");
    }

    try {
      const collectionPath = `shopping-cart/${user.uid}/orders`;
      await deleteCollection(collectionPath);
      console.log("All orders deleted successfully");
    } catch (error) {
      console.error("Error deleting orders:", error);
      throw error;
    }
  };

  const handleDeleteOrders = async () => {
    setIsLoading(true);
    try {
      await deleteUserOrders();
      // Optionally show success message
    } catch (error) {
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);
  const handleCheckout = async () => {
    try {
      if (user?.uid) {
        setLoadingCheckout(true);
        // 1. Prepare transaction data

        const collectionRef = collection(
          firestore,
          "customer",
          user?.uid,
          "orders",
        );
        const addOrdersCustomer = await addDoc(collectionRef, {
          sender: contactInfo,
          orders,
          paymentStatus: "pending",

          createdAt: serverTimestamp(),
        });

        const transactionData = prepareTransactionData(
          orders,
          addOrdersCustomer?.id,
        );

        // 2. Call Firebase Cloud Function
        const createTransaction = httpsCallable(functions, "createOrder");
        const result = await createTransaction(transactionData);

        // 3. Set Snap token
        setSnapToken((result as any)?.data?.items?.token);

        const docRef = doc(
          firestore,
          "customer",
          user?.uid,
          "orders",
          addOrdersCustomer?.id,
        );
        await setDoc(
          docRef,
          {
            midtrans: (result as any)?.data?.items,
          },
          { merge: true },
        );
        setLoadingCheckout(false);
        const token = (result as any)?.data?.items?.token;
        window.snap.pay(token, {
          async onSuccess(result: any) {
            console.log("Payment success:", result);
            const orderId = result?.order_id?.split("_")?.[3];
            // Update payment status in Firestore
            const orderRef = doc(
              firestore,
              `customer/${user?.uid}/orders/${orderId}`,
            );

            await updateDoc(orderRef, {
              paymentStatus: result?.transaction_status,
              // updatedAt: new Date(), // Optional: add update timestamp
              midtransRes: result, // Optional: store payment details
            });
            await Promise.all(
              orders.map(async (data) => {
                await Promise.all(
                  data.products.map(async (prod) => {
                    await setDoc(
                      doc(firestore, `product/${prod.id}`),
                      {
                        updatedAt: serverTimestamp(),
                        stok: increment(-prod.quantity),
                        qty_sold: increment(prod.quantity),
                      },
                      { merge: true },
                    );
                  }),
                );
              }),
            );

            handleDeleteOrders();
            setOrders([]);
            alert("Payment successful!");
          },
          onError: (error: any) => {
            console.error("Payment failed:", error);
          },
          onClose: () => {
            setOrders([]);
            handleDeleteOrders();
            console.log("Popup closed");
          },
        });
      }
    } catch (error) {
      setLoadingCheckout(false);
      console.error("Checkout failed:", error);
      alert("Failed to initiate payment");
    }
  };

  // useEffect(() => {
  //   if (!snapToken) return;

  //   const snapEmbed = (window as any).snap.embed;
  //   snapEmbed(snapToken, {
  //     embedId: "snap-container",
  //     onSuccess: (result: any) => {
  //       console.log("Payment success:", result);
  //       alert("Payment successful!");
  //     },
  //     onError: (error: any) => {
  //       console.error("Payment failed:", error);
  //     },
  //   });

  //   return () => {
  //     const container = document.getElementById("snap-container");
  //     if (container) container.innerHTML = "";
  //   };
  // }, [snapToken]);

  useEffect(() => {
    if (selectedCard) {
      setContactInfo(selectedCard);
    }
  }, [selectedCard]);

  // get rates ongkir

  //   useEffect(() => {
  //     if (selectedCardReceiver) {
  //       setContactInfo(selectedCardReceiver);
  //     }
  //   }, [selectedCardReceiver]);
  console.log(koordinateOrigin);
  console.log(orders);
  if (isLoading) {
    return <Loader size="md" color="green" />;
  }
  if (!user) {
    router.replace("/login");
  }
  return (
    <>
      <Header />
      <div className="container mx-auto px-2 pt-28">
        <h1 className="lg:lh-10 mb-6 mt-6 text-center text-2xl font-bold md:text-left">
          Daftar Orderan
        </h1>

        {/* Main Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Section */}
          <div className="ml-2 mr-2 lg:w-2/3">
            {/* Contact Information */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <div className="flex justify-start">
                <h2 className="mb-4 text-xl font-semibold">Data Pengirim</h2>
                <CheckCircleIcon
                  className={`${contactIsCompleted ? "ml-4 h-8 w-8 text-green-800 dark:text-white" : "ml-4 h-8 w-8 text-gray-800 dark:text-white"}`}
                />
              </div>
              {isEditingContactInfo ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={contactInfo.senderName}
                      onChange={handleContactInfoChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    {errors.senderName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.senderName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactInfoChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nomor Telepon
                    </label>
                    <PhoneInput
                      inputClass="input"
                      inputStyle={{ width: "100%" }}
                      country={"id"} // Set a default country
                      value={contactInfo.senderPhone.replace("+", "")} // Remove the "+" prefix for the library
                      onChange={handlePhoneChange}
                      enableSearch={true} // Enable search in the country dropdown
                      placeholder="Enter phone number"
                    />
                    {errors.senderPhone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.senderPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alamat
                    </label>
                    <textarea
                      //   type="text"
                      name="address"
                      rows={3}
                      value={contactInfo.address}
                      onChange={handleContactInfoChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  {/* <div>
                    <p className="mb-6 text-center text-sm text-gray-500">
                      Atau
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={openModal}
                      className="w-full rounded-lg border-2 border-green-600 py-2 text-green-600 transition-colors duration-300 hover:bg-green-100 hover:text-white"
                    >
                      Pilih data pengirim
                    </button>

                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <h2 className="mb-4 text-xl font-bold">
                        Pilih data pengirim
                      </h2>
                      <div className="space-y-4">
                        {cardDataSender.length > 0 ? (
                          cardDataSender.map((data, index) => (
                            <Card
                              key={index}
                              senderName={data.senderName}
                              senderPhone={data.senderPhone}
                              address={data.address}
                              isSelected={
                                tempSelectedCard?.senderName === data.senderName
                              } // Check if this card is temporarily selected
                              onSelect={() => handleSelectCard(data)} // Pass the entire card data
                            />
                          ))
                        ) : (
                          <div className="flex  flex-col items-center justify-center bg-gray-50">
                            <svg
                              className="mb-4 h-16 w-16 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>

                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                              No data available
                            </h2>
                            <p className="mb-6 text-gray-500">
                              There is no data to display at the moment.
                            </p>

                            <button
                              onClick={openModal}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Tambah data pengirim
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <button
                          disabled={cardDataSender.length < 1}
                          onClick={handleConfirmSelection}
                          className="w-full rounded bg-green-600 px-4 py-2 text-white"
                        >
                          Confirm Selection
                        </button>
                      </div>
                    </Modal>
                  </div> */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveContactInfo}
                      className="w-full rounded-md bg-green-600 px-4 py-2 text-white"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>Nama:</strong> {contactInfo.senderName}
                  </p>
                  <p>
                    <strong>Email:</strong> {contactInfo.email}
                  </p>
                  <p>
                    <strong>No. HP:</strong> {contactInfo.senderPhone}
                  </p>
                  <p>
                    <strong>Alamat:</strong> {contactInfo.address}
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsEditingContactInfo(true)}
                      className=" px-4 py-2 font-bold text-green-600"
                    >
                      Ubah Detail
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders */}
            {orders.map((order, index) => (
              <div
                key={index}
                className="mb-6 rounded-lg bg-green-100 p-6 shadow-md"
              >
                <h2 className="mb-4 text-xl font-semibold">
                  Orderan {index + 1}
                </h2>
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-start">
                        <h3 className="text-lg font-semibold">Data Penerima</h3>
                        <CheckCircleIcon
                          className={`${order.recipient?.address && order.recipient?.receiverName && order.recipient?.receiverPhone ? "ml-4 h-8 w-8 text-green-800 dark:text-white" : "ml-4 h-8 w-8 text-gray-800 dark:text-white"}`}
                        />
                      </div>
                      {order.isEditing ? (
                        <div className="space-y-2">
                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Nama Penerima
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={order.recipient?.receiverName}
                              onChange={(e) =>
                                handleRecipientInfoChange(index, e)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Nomor Telepon Penerima
                            </label>
                            <input
                              type="text"
                              name="phone"
                              value={order.recipient?.receiverPhone}
                              onChange={(e) =>
                                handleRecipientInfoChange(index, e)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Alamat Penerima
                            </label>
                            <textarea
                              //   type="text"
                              name="address"
                              value={order.recipient?.address}
                              rows={3}
                              onChange={(e) =>
                                handleRecipientInfoChange(index, e)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                          </div> */}
                          {order.recipient?.receiverName && (
                            <div className="grid grid-cols-1 gap-2">
                              <p>
                                <strong>Nama Penerima:</strong>{" "}
                                {order.recipient?.receiverName}
                              </p>
                              <p>
                                <strong>No. HP:</strong>{" "}
                                {order.recipient?.receiverPhone}
                              </p>
                              <p>
                                <strong>Alamat:</strong>{" "}
                                {order.recipient?.address}
                              </p>
                            </div>
                          )}
                          <div>
                            <button
                              onClick={openReceiverModal}
                              className="w-full rounded-lg border-2 border-green-600 py-2 text-green-600 transition-colors duration-300 hover:bg-green-100 hover:text-white"
                            >
                              Pilih data penerima
                            </button>

                            <Modal
                              isOpen={isReceiverModalOpen}
                              onClose={closeReceiverModal}
                            >
                              <h2 className="mb-4 text-xl font-bold">
                                Pilih data penerima
                              </h2>
                              <div className="space-y-4">
                                {addresses.map((item, i) => (
                                  <ReceiverCard
                                    key={i}
                                    recipient={item}
                                    isSelected={selectedReceiverIndex === i}
                                    onSelect={() => handleSelectReceiver(i)}
                                  />
                                ))}
                              </div>
                              <button
                                onClick={handleAddNew}
                                className="mb-6 mt-6 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                              >
                                Add New Address
                              </button>
                              <div className="mt-4">
                                <button
                                  disabled={!tempReceiver}
                                  onClick={() =>
                                    handleConfirmReceiverSelection(index)
                                  }
                                  className="w-full rounded bg-green-600 px-4 py-2 text-white"
                                >
                                  Confirm Selection
                                </button>
                              </div>
                            </Modal>
                          </div>
                          {/* <div className="flex justify-end">
                            <button
                              onClick={() => toggleEditOrder(index)}
                              className="w-full rounded-md bg-green-600 px-4 py-2 text-white"
                            >
                              Simpan
                            </button>
                          </div> */}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 gap-2">
                            <p>
                              <strong>Nama Penerima:</strong>{" "}
                              {order.recipient?.receiverName}
                            </p>
                            <p>
                              <strong>No. HP:</strong>{" "}
                              {order.recipient?.receiverPhone}
                            </p>
                            <p>
                              <strong>Alamat:</strong>{" "}
                              {order.recipient?.address}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => toggleEditOrder(index)}
                              className=" px-4 py-2 font-bold text-green-600"
                            >
                              Ubah Detail
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                  <div>
                    <div className="flex justify-start">
                      <h3 className="text-lg font-semibold">Produk</h3>
                      <CheckCircleIcon
                        className={`${order.products.length > 0 ? "ml-4 h-8 w-8 text-green-800 dark:text-white" : "ml-4 h-8 w-8 text-gray-800 dark:text-white"}`}
                      />
                    </div>
                    {order.products.map((product, pIndex) => (
                      <div key={pIndex}>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center">
                            {/* Product Image */}
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="mr-4 h-16 w-16 rounded-md object-cover"
                            />
                            <span>{product.name}</span>
                          </div>
                          <div className="flex items-center">
                            {/* Quantity Adjustment */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(index, pIndex, -1);
                                setCurrentOrder(index);
                              }}
                              className="rounded-l-md bg-gray-200 px-2 py-1"
                            >
                              -
                            </button>
                            <span className="bg-gray-100 px-4 py-1">
                              {product.quantity}
                            </span>
                            <button
                              disabled={product?.quantity >= product.stok}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(index, pIndex, 1);
                                setCurrentOrder(index);
                              }}
                              className="rounded-r-md bg-gray-200 px-2 py-1"
                            >
                              +
                            </button>
                            {/* Product Price */}
                            <span className="ml-4">
                              Rp {product.price.toLocaleString()}
                            </span>
                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(index, pIndex);
                                setCurrentOrder(index);
                              }}
                              className="ml-4 text-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          {product.quantity >= product.stok && (
                            <p className="mt-1 text-xs text-red-600">
                              Stok habis
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={() => handleAddProduct(index + 1, order?.id)}
                      className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-white"
                    >
                      Tambah Produk
                    </button>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Gift Card Message
                    </label>
                    <textarea
                      value={order.giftCardMessage}
                      onChange={(e) => handleGiftCardMessageChange(index, e)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      rows={3}
                      placeholder="Enter your gift card message..."
                    />
                  </div>
                </div>
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                  {/* Kurir Select */}
                  <div className="mt-4">
                    <div className="flex justify-start">
                      <h3 className="text-lg font-semibold">Kurir</h3>
                      <CheckCircleIcon
                        className={`${order.courier ? "ml-4 h-8 w-8 text-green-800 dark:text-white" : "ml-4 h-8 w-8 text-gray-800 dark:text-white"}`}
                      />
                    </div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pilih Kurir
                    </label>
                    <select
                      value={order?.dataCourier?.courier_service_code}
                      onChange={(e) => handleCourierChange(index, e)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option selected hidden>
                        {loadingRate ? "loading.." : "Jenis Service"}
                      </option>
                      {listService?.[index]
                        ? listService?.[index]?.map((kur: any) => {
                            return (
                              <option
                                key={kur?.courier_service_code}
                                value={kur?.courier_service_code}
                              >
                                <span>
                                  {kur?.courier_name},{" "}
                                  {kur?.courier_service_name}, {kur?.duration},
                                  Rp.{kur?.price}
                                </span>
                              </option>
                            );
                          })
                        : order?.listService
                          ? order?.listService?.map((kur: any) => {
                              return (
                                <option
                                  key={kur?.courier_service_code}
                                  value={kur?.courier_service_code}
                                >
                                  <span>
                                    {kur?.courier_name},{" "}
                                    {kur?.courier_service_name}, {kur?.duration}
                                    , Rp.{kur?.price}
                                  </span>
                                </option>
                              );
                            })
                          : []}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="ml-2 mr-2 lg:w-1/3">
            {/* Orders Accordion */}
            {orders.map((order, index) => (
              <div
                key={index}
                // className="mb-6 rounded-lg bg-white p-6 shadow-md"
                className={`${order.recipient?.address && order.recipient?.receiverName && order.recipient?.receiverPhone && contactIsCompleted && order.products.length > 0 && order.courier ? "mb-6 rounded-lg bg-green-100 p-6 shadow-md" : "mb-6 rounded-lg bg-white p-6 shadow-md"}`}
              >
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-center justify-start">
                    <h2 className="text-xl font-semibold">
                      Orderan {index + 1}
                    </h2>
                    <CheckCircleIcon
                      className={`${order.recipient?.address && order.recipient?.receiverName && order.recipient?.receiverPhone && contactIsCompleted && order.products.length > 0 && order.courier ? "ml-4 h-6 w-6 text-green-800 dark:text-white" : "ml-4 h-6 w-6 text-gray-800 dark:text-white"}`}
                    />
                    <p
                      //   className="text-sm text-gray-500"
                      className={`${order.recipient?.address && order.recipient?.receiverName && order.recipient?.receiverPhone && contactIsCompleted && order.products.length > 0 && order.courier ? "text-sm font-semibold text-green-800" : "text-sm font-semibold text-gray-500"}`}
                    >
                      {order.recipient?.address &&
                      order.recipient?.receiverName &&
                      order.recipient?.receiverPhone &&
                      contactIsCompleted &&
                      order.products.length > 0 &&
                      order.courier
                        ? "Data Lengkap"
                        : "Data Belum Lengkap"}
                    </p>
                  </div>

                  <span>
                    {expandedOrderIndex === index ? (
                      <ChevronUpIcon className="ml-4 h-8 w-8 p-0 text-gray-800 dark:text-white" />
                    ) : (
                      <ChevronDownIcon className="ml-4 h-8 w-8 p-0 text-gray-800 dark:text-white" />
                    )}
                  </span>
                </div>
                {expandedOrderIndex === index && (
                  <div className="mt-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Nama Penerima:</strong>{" "}
                        {order.recipient.receiverName}
                      </p>
                      <p>
                        <strong>No. HP:</strong> {order.recipient.receiverPhone}
                      </p>
                      <p>
                        <strong>Kurir:</strong> {order.courier}
                      </p>
                      <p>
                        <strong>Alamat Penerima:</strong>{" "}
                        {order.recipient.address}
                      </p>
                      <p>
                        <strong>Gift Card Message:</strong>{" "}
                        {order.giftCardMessage || "N/A"}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">Order</h3>
                      {order.products.map((product, pIndex) => (
                        <div
                          key={pIndex}
                          className="mb-2 flex items-center justify-between"
                        >
                          <span>{product.name}</span>
                          <span>
                            {product.quantity} x Rp{" "}
                            {product.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white"
                      onClick={() => {
                        const updatedOrders = orders.filter(
                          (_, i) => i !== index,
                        );
                        setOrders(updatedOrders);
                      }}
                    >
                      Hapus Order
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Order Button */}
            {orders.length < 10 && (
              <button
                disabled={
                  orders.length > 0 &&
                  !orders?.[orders.length - 1]?.dataComplete
                }
                className={`mb-6 w-full rounded-md px-4 py-2 text-white ${
                  orders.length > 0 &&
                  !orders?.[orders.length - 1]?.dataComplete
                    ? "cursor-not-allowed bg-gray-400" // Grey when disabled
                    : "bg-green-600 hover:bg-green-700" // Green when enabled
                }`}
                onClick={handleAddOrder}
              >
                Tambah Order {orders.length + 1}/10
              </button>
            )}

            {/* Summary Section */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                Ringkasan Pembayaran
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {overallSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Delivery Fee</span>
                  <span>Rp {overallDeliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {overallTotal.toLocaleString()}</span>
                </div>
              </div>
              <button
                disabled={
                  orders.some(
                    (order) =>
                      order.dataComplete === undefined ||
                      order.dataComplete === false,
                  ) || loadingCheckout
                }
                onClick={handleCheckout}
                className={`${
                  orders.some(
                    (order) =>
                      order.dataComplete === undefined ||
                      order.dataComplete === false,
                  ) ||
                  loadingCheckout ||
                  orders.length < 1
                    ? "mt-4 w-full cursor-not-allowed rounded-md bg-gray-400 px-4 py-2 text-white"
                    : "mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-white"
                }`}
              >
                {loadingCheckout ? "loading..." : "Lanjut ke Pembayaran"}
              </button>
              {orders.some(
                (order) =>
                  order.dataComplete === undefined ||
                  order.dataComplete === false,
              ) && (
                <p className="mt-1 text-xs text-red-600">
                  Data order belum lengkap semua
                </p>
              )}
              {/* {snapToken && <div id="snap-container" className="mt-4"></div>} */}
            </div>
          </div>
        </div>
      </div>
      <EditAddressModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentAddress={currentAddress}
        // onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
};

export default CheckoutPage;
