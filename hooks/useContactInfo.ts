"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
import { CardProps } from "@/components/Card";
import { User } from "firebase/auth";

export const useContactInfo = (user: User | null) => {
  /* ================= STATE ================= */

  const [contactInfo, setContactInfo] = useState<CardProps>({
    senderName: "",
    senderPhone: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditingContactInfo, setIsEditingContactInfo] =
    useState<boolean>(false);
  const [contactIsCompleted, setContactIsCompleted] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH USER DATA ================= */

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserData = async () => {
      setLoading(true);
      const userDocRef = doc(firestore, "customer", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as CardProps;
        setContactInfo(userData);
        setIsEditingContactInfo(false);
      } else {
        console.log("No user data found in Firestore.");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user?.uid]);

  /* ================= FETCH CONTACT INFO ================= */

  useEffect(() => {
    if (!user?.uid) return;

    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const docRef = doc(firestore, `customer/${user.uid}/account/info`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as CardProps;
          setContactInfo(data);
          setContactIsCompleted(true);
        } else {
          setError("No contact info found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch contact info.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [user?.uid]);

  /* ================= AUTO COMPLETE CHECK ================= */

  useEffect(() => {
    if (
      contactInfo.address &&
      contactInfo.senderName &&
      contactInfo.senderPhone
    ) {
      setContactIsCompleted(true);
    }
  }, [contactInfo.address, contactInfo.senderName, contactInfo.senderPhone]);

  /* ================= AUTO EDIT MODE ================= */

  useEffect(() => {
    if (
      !contactInfo.senderName &&
      !contactInfo.address &&
      !contactInfo.senderPhone
    ) {
      setIsEditingContactInfo(true);
    }
  }, []);

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.senderName) newErrors.senderName = "Name is required.";
    if (!contactInfo.senderPhone) newErrors.senderPhone = "Phone is required.";
    if (!contactInfo.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLERS ================= */

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onPhoneChange = (value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      senderPhone: value,
    }));

    if (errors.senderPhone) {
      setErrors((prev) => ({ ...prev, senderPhone: "" }));
    }
  };

  const onSave = () => {
    if (!validateForm()) return;
    setIsEditingContactInfo(false);
  };

  const onEdit = () => {
    setIsEditingContactInfo(true);
  };

  /* ================= RETURN ================= */

  return {
    contactInfo,
    errors,
    isEditingContactInfo,
    contactIsCompleted,
    loading,
    error,

    onChange,
    onPhoneChange,
    onSave,
    onEdit,
  };
};
