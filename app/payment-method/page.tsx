"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";
import {
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/shopping-cart";

// import PaymentMethodSection from "@/components/payment/PaymentMethodSection";
import PaymentAccordionSection from "@/components/payment/PaymentAccordionSection";

import PaymentInstruction from "@/components/payment/PaymentInstruction";
import { prepareTransactionData } from "@/utils/prepareTransactionData";

import { usePaymentMethod } from "@/hooks/usePaymentMethod";

import { PaymentMethod, PaymentResult } from "@/types/payment";

import { firestore } from "@/components/FirebaseProvider";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/types/contact-info";

/* ======================================================
   BUILD REAL MIDTRANS BODY FROM SHOPPING CART
   ====================================================== */

/* ======================================================
   PAGE
   ====================================================== */

export default function PaymentMethodPage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useSearchParams();

  const draftParam = params.get("draft");
  const invoiceId = draftParam?.split("-62")[0] ?? draftParam;

  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const [sender, setSender] = useState<ContactInfo | null>(null);
  const [savedResult, setSavedResult] = useState<PaymentResult | null>(null);

  const [expireTime, setExpireTime] = useState<number>(0);
  const [checkingDraft, setCheckingDraft] = useState(true);

  const { loading, result, error, createTransaction } = usePaymentMethod();

  /* ================= LOAD CART ================= */

  useEffect(() => {
    const draftId = invoiceId;

    if (!draftId) {
      router.replace("/shopping-cart");
      return;
    }

    if (!draftId || !user?.uid) return;

    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Load draft order data from Firestore
     * @param {string} draftId - Order ID
     * @returns {Promise<void>}
     */
    /*******  a7cf3589-bbb9-4248-805d-c60d426deecf  *******/
    const load = async () => {
      const ref = doc(firestore, "customer", user.uid, "orders", draftId);

      const snap = await getDoc(ref);

      if (!snap.exists()) {
        router.replace("/shopping-cart");
        return;
      }

      const data = snap.data();

      setOrders(data.orders || []);
      setSender(data.sender || null);
      if (data.createdAt?.seconds) {
        const expire = data.createdAt.seconds * 1000 + 24 * 60 * 60 * 1000;
        setExpireTime(expire);
      }

      if (data.midtrans) {
        setSavedResult(data.midtrans);
      }

      setCheckingDraft(false);
    };

    load();
  }, [user?.uid, invoiceId]);

  /* ================= PAY ================= */

  const handlePay = async () => {
    const draftId = invoiceId;

    if (!draftId) {
      alert("Draft tidak ditemukan");
      return;
    }

    const orderRef = doc(firestore, "customer", user!.uid, "orders", draftId);

    const snap = await getDoc(orderRef);
    const data = snap.data();

    if (data?.midtrans) {
      if (!confirm("Metode pembayaran sudah ada. Ganti metode?")) {
        return;
      }

      await updateDoc(orderRef, { midtrans: null });
      setSavedResult(null);
    }

    if (!selected) {
      alert("Pilih metode pembayaran dulu");
      return;
    }

    if (!orders.length) {
      alert("Order kosong");
      return;
    }

    if (!draftId) {
      alert("Draft tidak ditemukan");
      return;
    }

    /* ================= BUILD MIDTRANS BODY ================= */

    if (!sender) {
      alert("Data pengirim belum ada");
      return;
    }

    const baseRequest = prepareTransactionData(
      orders,
      invoiceId!,
      sender ?? undefined,
    );

    /* ================= CALL MIDTRANS ================= */

    const res = await createTransaction(baseRequest, selected);

    /* ================= SAVE MIDTRANS ================= */

    if (!res || !res.orderId) {
      alert("Gagal membuat transaksi");
      return;
    }

    await updateDoc(doc(firestore, "customer", user!.uid, "orders", draftId), {
      midtrans: {
        orderId: res.orderId ?? draftId,
        status: res.status ?? "pending",
        vaNumber: res.vaNumber ?? null,
        bank: res.bank ?? null,
        redirectUrl: res.redirectUrl ?? null,
        raw: res.raw ?? null,
      },

      paymentStatus: "pending",
    });

    /* ================= CLEAR CART ================= */

    // const cartRef = collection(firestore, "shopping-cart", user!.uid, "orders");

    // const cartSnap = await getDocs(cartRef);

    // await Promise.all(cartSnap.docs.map((d) => deleteDoc(d.ref)));
  };
  useEffect(() => {
    const handler = async () => {
      const r = result || savedResult;
      if (!r?.orderId) return;

      const res = await fetch("/api/midtrans/status", {
        method: "POST",
        body: JSON.stringify({ orderId: r.orderId }),
      });

      const data = await res.json();

      if (data.transaction_status) {
        setSavedResult((prev) => ({
          ...prev!,
          status: data.transaction_status,
        }));
      }
    };

    window.addEventListener("CHECK_PAYMENT_STATUS", handler);

    return () => window.removeEventListener("CHECK_PAYMENT_STATUS", handler);
  }, [result, savedResult]);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expireTime) return;

    const i = setInterval(() => {
      const diff = expireTime - Date.now();

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(i);

        setSavedResult((prev) => (prev ? { ...prev, status: "expire" } : prev));

        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(i);
  }, [expireTime]);

  if (checkingDraft) return null;

  /* ================= UI ================= */

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ================= LEFT PAYMENT ================= */}

        <div>
          <Card className="mb-4 p-6">
            <p className="text-2xl font-bold">
              Rp{" "}
              {orders
                .reduce(
                  (t: number, o: Order) =>
                    t +
                    o.products.reduce(
                      (s: number, p) => s + p.price * p.quantity,
                      0,
                    ) +
                    o.deliveryFee,
                  0,
                )

                .toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">Order ID : {invoiceId}</p>

            <div className="mt-4 rounded bg-gray-100 p-2 text-center text-sm font-semibold">
              Pilih dalam {timeLeft}
            </div>
          </Card>

          {timeLeft !== "EXPIRED" && !(result || savedResult) && (
            <PaymentAccordionSection
              selected={selected}
              onSelect={(method) => {
                setSelected(method);
              }}
            />
          )}

          {!(result || savedResult) && (
            <Card className="mt-6 p-6">
              <Button
                disabled={!selected || loading}
                className="w-full bg-primary py-6 text-white hover:bg-green-700"
                onClick={handlePay}
              >
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </Button>

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </Card>
          )}

          {(result || savedResult) && (
            <>
              <PaymentInstruction result={result || savedResult} />

              <div className="flex justify-center">
                <button
                  className="mt-4 text-sm font-semibold text-primary underline"
                  onClick={() => setSavedResult(null)}
                >
                  Ganti Metode Pembayaran
                </button>
              </div>
            </>
          )}
        </div>

        {/* ================= RIGHT ORDER SUMMARY ================= */}

        <Card className="h-fit bg-green-50 p-6">
          <h2 className="mb-2 text-lg font-semibold">Detail Pesanan</h2>

          {sender && (
            <div className="mb-4 border-b pb-4 text-sm">
              <p className="font-semibold">{sender.name}</p>
              <p>{sender.phone}</p>
              <p className="text-gray-600">{sender.address}</p>
            </div>
          )}

          {orders.map((o, i) => (
            <div key={i} className="mb-6 border-b pb-4">
              <p className="font-semibold">Order {i + 1}</p>

              {o.products.map((p: any, j: number) => (
                <div key={j} className="flex justify-between text-sm">
                  <span>
                    {p.name} x {p.quantity}
                  </span>

                  <span>Rp {(p.price * p.quantity).toLocaleString()}</span>
                </div>
              ))}

              <div className="mt-2 flex justify-between text-sm">
                <span>Kurir</span>

                <span>Rp {o.deliveryFee?.toLocaleString()}</span>
              </div>
            </div>
          ))}

          <div className="flex justify-between font-bold">
            <span>Total</span>

            <span>
              Rp{" "}
              {orders
                .reduce(
                  (t: number, o: Order) =>
                    t +
                    o.products.reduce(
                      (s: number, p) => s + p.price * p.quantity,
                      0,
                    ) +
                    o.deliveryFee,
                  0,
                )

                .toLocaleString()}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
