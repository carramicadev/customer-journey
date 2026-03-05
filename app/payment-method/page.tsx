"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Truck } from "lucide-react";
import { calculateETA } from "@/utils/calculateETA";

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
import SuccessScreen from "@/components/payment/SuccessScreen";
import ExpiredScreen from "@/components/payment/ExpiredScreen";
import FailedScreen from "@/components/payment/FailedScreen";

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

  /* ================= CREDIT CARD STATE ================= */
  const [card, setCard] = useState({
    number: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  const [sender, setSender] = useState<ContactInfo | null>(null);
  const [savedResult, setSavedResult] = useState<PaymentResult | null>(null);

  const [expireTime, setExpireTime] = useState<number>(0);
  const [checkingDraft, setCheckingDraft] = useState(true);

  const { loading, result, error, createTransaction } = usePaymentMethod();
  const finalStatus = savedResult?.status || result?.status || null;

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
      if (data.paymentStartAt?.seconds) {
        const expire =
          data.paymentStartAt.seconds * 1000 + 7 * 24 * 60 * 60 * 1000;

        setExpireTime(expire);
      } else if (data.createdAt?.seconds) {
        const expire = data.createdAt.seconds * 1000 + 7 * 24 * 60 * 60 * 1000;

        setExpireTime(expire);
      }

      if (data.midtrans) {
        setSavedResult({
          ...data.midtrans,
          status: data.paymentStatus ?? data.midtrans.status,
        });
      }

      setCheckingDraft(false);
    };

    load();
  }, [user?.uid, invoiceId]);

  /* ================= GET CARD TOKEN ================= */

  const getCardToken = async () => {
    if (!isValidCardNumber(card.number)) {
      alert("Nomor kartu tidak valid");
      return;
    }

    const cardData = {
      card_number: card.number.replace(/\s/g, ""),
      card_exp_month: card.expMonth,
      card_exp_year: card.expYear,
      card_cvv: card.cvv,
    };

    // @ts-ignore
    window.MidtransNew3ds.getCardToken(cardData, {
      onSuccess: async (res: any) => {
        await handleCreditCardCharge(res.token_id);
      },

      onFailure: (err: any) => {
        console.error(err);
        alert("Card validation failed");
      },
    });
  };

  /* ================= CREDIT CARD CHARGE ================= */

  const handleCreditCardCharge = async (token: string) => {
    if (!sender || !invoiceId) return;

    const baseRequest = prepareTransactionData(orders, invoiceId, sender);

    const body = {
      ...baseRequest,
      payment_type: "credit_card",
      credit_card: {
        token_id: token,
        authentication: true,
      },
    };

    const res = await fetch("/api/midtrans/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    open3DS(json.data.redirect_url);
  };

  /* ================= OPEN 3DS ================= */

  const open3DS = (redirectUrl: string) => {
    // @ts-ignore
    window.MidtransNew3ds.authenticate(redirectUrl, {
      performAuthentication(url: string) {
        window.open(url, "_blank");
      },

      onSuccess(response: any) {
        console.log("3DS SUCCESS", response);
      },

      onPending(response: any) {
        console.log("3DS PENDING", response);
      },

      onFailure(response: any) {
        console.log("3DS FAILED", response);
      },
    });
  };

  /* ================= CARD VALIDATION ================= */

  const isValidCardNumber = (num: string) => {
    const arr = num.replace(/\s/g, "").split("").reverse();

    let sum = 0;

    arr.forEach((n, i) => {
      let digit = parseInt(n);

      if (i % 2 !== 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
    });

    return sum % 10 === 0;
  };

  const detectCardType = (number: string) => {
    const n = number.replace(/\s/g, "");

    if (/^4/.test(n)) return "VISA";
    if (/^5[1-5]/.test(n)) return "MASTERCARD";
    if (/^3[47]/.test(n)) return "AMEX";
    if (/^35/.test(n)) return "JCB";

    return "UNKNOWN";
  };

  /* ================= PAY ================= */

  const handlePay = async () => {
    if (selected === "credit_card") {
      await getCardToken();
      return;
    }

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
      user?.uid,
    );

    /* ================= CALL MIDTRANS ================= */

    // if (selected === "credit_card") {
    //   getCardToken();
    //   return;
    // }

    const res = await createTransaction(baseRequest, selected);

    /* ================= SAVE MIDTRANS ================= */

    if (!res || !res.orderId) {
      alert("Gagal membuat transaksi");
      return;
    }

    await updateDoc(doc(firestore, "customer", user!.uid, "orders", draftId), {
      order_Id: draftId,

      paymentStartAt: serverTimestamp(),
      midtrans: {
        orderId: res.orderId ?? draftId,
        status: res.status ?? "pending",
        vaNumber: res.vaNumber ?? null,
        bank: res.bank ?? null,
        redirectUrl: res.redirectUrl ?? null,
        raw: res.raw ?? null,
      },

      paymentStatus: "pending",
      order_id: draftId,
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
        let mappedStatus = data.transaction_status;

        if (
          data.transaction_status === "capture" &&
          data.fraud_status === "accept"
        ) {
          mappedStatus = "settlement";
        }

        if (data.transaction_status === "settlement") {
          mappedStatus = "settlement";
        }

        if (data.transaction_status === "expire") {
          mappedStatus = "expire";
        }

        if (data.transaction_status === "cancel") {
          mappedStatus = "cancel";
        }

        if (data.transaction_status === "deny") {
          mappedStatus = "deny";
        }

        setSavedResult((prev) => ({
          ...prev!,
          status: mappedStatus,
        }));

        await updateDoc(
          doc(firestore, "customer", user!.uid, "orders", invoiceId!),
          {
            paymentStatus: mappedStatus,
          },
        );
      }
    };

    window.addEventListener("CHECK_PAYMENT_STATUS", handler);

    return () => window.removeEventListener("CHECK_PAYMENT_STATUS", handler);
  }, [result, savedResult]);

  const [timeLeft, setTimeLeft] = useState("");

  // =========== LOAD MIDTRANS 3DS SCRIPT ======
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://api.midtrans.com/v2/assets/js/midtrans-new-3ds.min.js";

    script.setAttribute(
      "data-environment",
      process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
        ? "production"
        : "sandbox",
    );

    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    );

    script.id = "midtrans-script";

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!savedResult?.orderId) return;
    if (
      ["settlement", "expire", "cancel", "deny"].includes(savedResult.status)
    ) {
      return;
    }

    const interval = setInterval(async () => {
      const res = await fetch("/api/midtrans/status", {
        method: "POST",
        body: JSON.stringify({ orderId: savedResult.orderId }),
      });

      const data = await res.json();

      if (data.transaction_status) {
        let mappedStatus = data.transaction_status;

        if (
          data.transaction_status === "capture" &&
          data.fraud_status === "accept"
        ) {
          mappedStatus = "settlement";
        }

        if (data.transaction_status === "settlement") {
          mappedStatus = "settlement";
        }

        if (data.transaction_status === "expire") {
          mappedStatus = "expire";
        }

        if (data.transaction_status === "cancel") {
          mappedStatus = "cancel";
        }

        if (data.transaction_status === "deny") {
          mappedStatus = "deny";
        }

        setSavedResult((prev) => ({
          ...prev!,
          status: mappedStatus,
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [savedResult?.orderId]);

  useEffect(() => {
    console.log("CARD TYPE:", detectCardType(card.number));
  }, [card.number]);

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
  // console.log(timeLeft);
  if (checkingDraft) return null;

  /* ================= FINAL STATUS SCREEN ================= */

  if (finalStatus === "settlement") {
    return (
      <SuccessScreen
        amount={orders.reduce(
          (t, o) =>
            t +
            o.products.reduce((s, p) => s + p.price * p.quantity, 0) +
            o.deliveryFee,
          0,
        )}
        orderId={invoiceId!}
      />
    );
  }

  if (finalStatus === "expire") {
    return <ExpiredScreen />;
  }

  if (["cancel", "deny"].includes(finalStatus ?? "")) {
    return <FailedScreen status={finalStatus!} />;
  }
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
              {timeLeft !== "EXPIRED" ? `Pilih dalam ${timeLeft}` : timeLeft}
            </div>
          </Card>

          {timeLeft !== "EXPIRED" && !(result || savedResult) && (
            <PaymentAccordionSection
              selected={selected}
              onSelect={(method) => {
                setSelected(method);
              }}
              status={timeLeft}
              card={card}
              setCard={setCard}
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

          {(result || savedResult) && finalStatus === "pending" && (
            <>
              <PaymentInstruction
                result={result || savedResult}
                status={timeLeft}
              />

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

              {o.recipient && (
                <div className="flex items-center gap-1 py-2">
                  <Truck className="size-3 text-gray-500" />
                  <p className="font-regular text-xs text-gray-500">
                    Estimasi tiba: {calculateETA(o.dataCourier?.duration)}
                  </p>
                </div>
              )}
              {/* Tampilkan nama penerima di samping order i */}
              {/* Tampilkan alamat penerima di bawah order i  */}
              {/* tampilkan tanggal perkiraan barang tiba dibawah alamat*/}

              {/* tanggal hari ini + durasi pengiriman tertinggi */}
              {/* misalnya: durasi 3-5 hari, maka tanggal hari ini + 5 hari kerja. hari minggu jangan dihitung */}

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
