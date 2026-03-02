import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { orderId, uid } = await req.json();

  const db = admin.firestore();

  const legacyDoc = await db.collection("orders").doc(orderId).get();

  if (!legacyDoc.exists) {
    return NextResponse.json({ ok: false });
  }

  const data = legacyDoc.data();

  // ✅ TYPE SAFETY CHECK
  if (!data) {
    return NextResponse.json({ ok: false });
  }

  await db
    .collection("customer")
    .doc(uid)
    .collection("orders")
    .doc(orderId)
    .update({
      paymentStatus: data.paymentStatus ?? "pending",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return NextResponse.json({ ok: true });
}
