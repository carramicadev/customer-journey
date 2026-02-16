"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseProvider";
import { ContactInfo } from "@/types/contact-info";

export const useContactInfo = (userId?: string) => {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(
    null,
  );

  const contactIsCompleted = Boolean(
    selectedContact?.name &&
      selectedContact?.phone &&
      selectedContact?.address &&
      selectedContact?.district &&
      selectedContact?.postalCode &&
      selectedContact?.coordinate?.lat &&
      selectedContact?.coordinate?.lng,
  );

  const deleteContact = async (id: string) => {
    console.log("TRY DELETE CONTACT:", userId, id);

    if (!userId) {
      console.warn("DELETE ABORTED: userId undefined");
      return;
    }

    if (!id) {
      console.warn("DELETE ABORTED: id undefined");
      return;
    }

    console.log("DELETE CONTACT:", userId, id);

    await deleteDoc(doc(firestore, "customer", userId, "address", id));

    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
  };

  const saveContact = async (data: ContactInfo) => {
    if (!userId) return;

    const ref = collection(firestore, "customer", userId, "address");

    if (data.id) {
      await setDoc(doc(ref, data.id), data, { merge: true });
      setSelectedContact(data);
    } else {
      const docRef = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
      });
      setSelectedContact({ ...data, id: docRef.id });
    }
  };

  /* ===== FETCH CONTACTS ===== */
  useEffect(() => {
    if (!userId) return;

    const ref = collection(firestore, "customer", userId, "address");

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data() as any;

        return {
          ...raw,
          id: d.id, // 🔥 PAKSA id dari Firestore, override semua
        };
      }) as ContactInfo[];

      setContacts(data);
    });

    return () => unsub();
  }, [userId]);

  // simpan ke localStorage setiap kali selectedContact berubah
  useEffect(() => {
    if (selectedContact?.id) {
      localStorage.setItem("selectedContactId", selectedContact.id);
    }
  }, [selectedContact]);

  // restore selected contact saat refresh
  useEffect(() => {
    if (!contacts.length) return;

    const savedId = localStorage.getItem("selectedContactId");
    if (!savedId) return;

    const found = contacts.find((c) => c.id === savedId);
    if (found) {
      setSelectedContact(found);
    }
  }, [contacts]);

  /* ===== ADD CONTACT ===== */
  const addContact = async (data: ContactInfo) => {
    if (!userId) return;

    const ref = collection(firestore, "customer", userId, "address");

    const docRef = await addDoc(ref, {
      ...data,
      type: "both",
      createdAt: serverTimestamp(),
    });

    setSelectedContact({ ...data, id: docRef.id });
  };

  return {
    contacts,
    selectedContact,
    setSelectedContact,
    contactIsCompleted,
    addContact,
    deleteContact,
    saveContact,
  };
};
