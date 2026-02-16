import { NextRequest, NextResponse } from "next/server";

/**
 * =========================================================
 * ENV CONFIG
 * =========================================================
 */

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === "true";

const MIDTRANS_URL = IS_PROD
  ? "https://api.midtrans.com/v2/charge"
  : "https://api.sandbox.midtrans.com/v2/charge";

/**
 * =========================================================
 * BASIC AUTH
 * =========================================================
 */

const getAuthHeader = () => {
  if (!SERVER_KEY) throw new Error("MIDTRANS_SERVER_KEY missing");

  const encoded = Buffer.from(`${SERVER_KEY}:`).toString("base64");

  return `Basic ${encoded}`;
};

/**
 * =========================================================
 * VALIDATE BODY (VERY IMPORTANT)
 * =========================================================
 */

const validateRequest = (body: any) => {
  if (!body?.transaction_details?.order_id) throw new Error("Missing order_id");

  if (!body?.transaction_details?.gross_amount)
    throw new Error("Missing gross_amount");

  if (!body?.payment_type) throw new Error("Missing payment_type");
};

/**
 * =========================================================
 * POST
 * =========================================================
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /**
     * =====================================
     * CUSTOM VA NUMBER
     * =====================================
     */

    validateRequest(body);

    /**
     * =====================================================
     * CALL MIDTRANS CORE API
     * =====================================================
     */

    const res = await fetch(MIDTRANS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("MIDTRANS RESPONSE:", data);

    /**
     * =====================================================
     * IF MIDTRANS ERROR
     * =====================================================
     */

    if (!res.ok) {
      console.error("MIDTRANS ERROR:", data);

      return NextResponse.json(
        {
          success: false,
          midtrans: data,
        },
        { status: res.status },
      );
    }

    /**
     * =====================================================
     * SUCCESS
     * =====================================================
     */

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("API MIDTRANS CREATE ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err?.message ?? "Internal error",
      },
      { status: 500 },
    );
  }
}
