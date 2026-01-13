"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { auth } from "@/components/FirebaseFrovider";

export default function LoginPage() {
  const router = useRouter();

  /* ================= STATE ================= */

  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  /* ================= reCAPTCHA INIT ================= */

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   if (!(window as any).recaptchaVerifier) {
  //     (window as any).recaptchaVerifier = new RecaptchaVerifier(
  //       auth,
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //       },
  //     );
  //   }
  // }, []);
  const initRecaptcha = () => {
    if (typeof window === "undefined") return null;

    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }

    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      },
    );

    return (window as any).recaptchaVerifier;
  };

  const resetRecaptcha = () => {
    const verifier = (window as any).recaptchaVerifier;
    if (verifier) {
      verifier.clear();
      (window as any).recaptchaVerifier = null;
    }
  };

  /* ================= HANDLERS ================= */

  const sendOtp = async () => {
    if (!phoneNumber) {
      alert("Masukkan nomor telepon terlebih dahulu");
      return;
    }

    if (!phoneNumber.startsWith("+")) {
      alert("Format nomor tidak valid");
      return;
    }

    setLoading(true);
    try {
      // const appVerifier = (window as any).recaptchaVerifier;
      const appVerifier = initRecaptcha();

      if (!appVerifier) throw new Error("Recaptcha not ready");

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );

      setConfirmation(result);
      setStep("otp");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim OTP. Periksa nomor atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmation) return;

    const code = otp.join("");
    if (code.length !== 6) {
      alert("OTP harus 6 digit");
      return;
    }

    setLoading(true);
    try {
      await confirmation.confirm(code);
      document.cookie =
        "auth-token=logged-in; path=/; max-age=2592000; SameSite=Lax";

      router.replace("/");
    } catch (err) {
      console.error(err);
      alert("OTP salah atau sudah kedaluwarsa");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT UX ================= */

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        {/* reCAPTCHA container (WAJIB ADA) */}
        <div id="recaptcha-container" className="hidden" />

        {/* ===== BRAND ===== */}
        <div className="mb-6 text-center">
          <h1 className="text-sm font-semibold text-gray-600">
            Selamat Datang di
          </h1>
          <h2 className="text-3xl font-bold text-green-600">CARRAMICA</h2>
        </div>

        {/* ===== STEP 1: PHONE ===== */}
        {step === "phone" && (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Masukkan nomor telepon aktif untuk menerima <b>SMS OTP</b>.
            </p>

            <PhoneInput
              country="id"
              value={phoneNumber.replace("+", "")}
              onChange={(v) => setPhoneNumber(`+${v}`)}
              inputStyle={{ width: "100%" }}
              enableSearch
              placeholder="Contoh: 82210757525"
            />

            <p className="mt-4 text-xs text-gray-500">
              Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan serta
              Kebijakan Privasi Carramica.
            </p>

            <button
              disabled={loading}
              onClick={sendOtp}
              className="mt-6 w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Mengirim OTP..." : "Login / Daftar"}
            </button>
          </>
        )}

        {/* ===== STEP 2: OTP ===== */}
        {step === "otp" && (
          <>
            <p className="mb-4 text-center text-sm text-gray-600">
              Masukkan 6 digit OTP yang dikirim via <b>SMS</b> ke:
              <br />
              <span className="font-semibold">{phoneNumber}</span>
            </p>

            <div className="mb-6 flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => el && (inputRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpBackspace(i, e)}
                  maxLength={1}
                  className="size-12 rounded-md border text-center text-lg focus:border-green-500 focus:outline-none"
                />
              ))}
            </div>

            <button
              disabled={loading}
              onClick={verifyOtp}
              className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Memverifikasi..." : "Konfirmasi"}
            </button>

            <button
              onClick={() => {
                resetRecaptcha();
                setStep("phone");
                setOtp(Array(6).fill(""));
              }}
              className="mt-3 w-full text-sm text-gray-500 hover:underline"
            >
              Ganti nomor
            </button>
          </>
        )}
      </div>
    </div>
  );
}
