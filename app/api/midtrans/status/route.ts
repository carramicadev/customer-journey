import { NextRequest, NextResponse } from "next/server";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === "true";

const BASE = IS_PROD
  ? "https://api.midtrans.com/v2/"
  : "https://api.sandbox.midtrans.com/v2/";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();

  const auth = Buffer.from(`${SERVER_KEY}:`).toString("base64");

  const res = await fetch(`${BASE}${orderId}/status`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();

  return NextResponse.json(data);
}
