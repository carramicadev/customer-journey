"use client";
import React, { useRef, useState } from "react";
import { auth, RecaptchaVerifier } from "@/components/FirebaseFrovider";
import { signInWithPhoneNumber } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const PhoneAuth: React.FC = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      // Ensure only digits are allowed
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // Set up reCAPTCHA
  const setUpRecaptcha = () => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        // "expired-callback": () => {
        //   // Response expired. Ask user to solve reCAPTCHA again.
        //   // ...
        // },
      },
    );
  };
  const [loading, setLoading] = useState(false);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setUpRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );
      setConfirmationResult(result);
      setOtpSent(true); // OTP has been sent
      alert("OTP sent!");
    } catch (error) {
      console.log("Error sending OTP:", error);
    }
    setLoading(false);
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await confirmationResult.confirm(otp.join(""));
      alert("Phone number verified!");
      router.push("/");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
    setLoading(false);
  };
  console.log(otp.join(""));
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {/* <h2>Phone Authentication</h2> */}

      {/* Step 1: Input phone number and send OTP */}
      {!otpSent && (
        <>
          <div id="recaptcha-container"></div>
          <div>
            {/* Welcome Message */}
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="mb-4 font-bold text-gray-800">
                Selamat Datang di
              </h1>
              <h1 className="mb-4 text-4xl font-bold text-gray-800">
                <span className="text-green-600">CARRAMICA</span>
              </h1>
            </div>

            {/* Phone Number Input */}
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
              <p className="mb-4 text-gray-600">
                Masukkan nomor telepon yang terhubung dengan Whatsapp untuk
                login
              </p>

              {/* <div className="mb-4 flex items-center overflow-hidden rounded-lg border border-gray-300"> */}
              {/* <span className="bg-gray-100 px-4 py-2 text-gray-600">+62</span>
      <input
        type="text"
        placeholder="822 1075 7525"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="flex-1 px-4 py-2 outline-none"
      /> */}
              <PhoneInput
                inputClass="input"
                inputStyle={{ width: "100%" }}
                // name="senderPhone"
                country={"id"} // Set a default country
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(`+${e}`)}
                // onBlur={(e) => handleCheckPhone(order.receiverPhone)}
                enableSearch={true} // Enable search in the country dropdown
                placeholder="Enter phone number"
              />
              {/* </div> */}

              {/* Terms and Conditions */}
              <p className="mb-6 text-sm text-gray-500">
                Dengan masuk kedalam aplikasi ini, saya menyetujui Syarat dan
                Ketentuan serta Kebijakan Privasi
              </p>

              {/* Login/Register Button */}
              <button
                disabled={loading}
                onClick={handleSendOtp}
                className="w-full rounded-lg bg-green-600 py-2 text-white transition duration-300 hover:bg-green-700"
              >
                {loading ? "Loading..." : "Login/Register"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Input OTP and verify */}
      {otpSent && (
        <div>
          {/* Welcome Message */}

          {/* Phone Number Input */}
          <div className="flex flex-col items-center justify-center text-center">
            <p className="mb-4 font-bold text-gray-600">OTP Verifikasi</p>
            <p className="mb-6 text-sm text-gray-500">
              masukkan 6 digit OTP yang telah dikirimkan SMS ke nomor{" "}
              {phoneNumber}
            </p>

            {/* <div className="mb-4 flex items-center overflow-hidden rounded-lg border border-gray-300"> */}
            {/* <span className="bg-gray-100 px-4 py-2 text-gray-600">+62</span>
      <input
        type="text"
        placeholder="822 1075 7525"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="flex-1 px-4 py-2 outline-none"
      /> */}
            <div className="mb-6 flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => el && (inputRefs.current[index] = el)}
                  className="h-12 w-12 rounded-lg border text-center focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            {/* Terms and Conditions */}

            {/* Login/Register Button */}
            <button
              disabled={loading}
              onClick={handleVerifyOtp}
              className="w-full rounded-lg bg-green-600 py-2 text-white transition duration-300 hover:bg-green-700"
            >
              {loading ? "Loading..." : "Konfirmasi"}
            </button>
          </div>
        </div>
        // <div>
        //   <input
        //     type="text"
        //     placeholder="Enter OTP"
        //     value={otp}
        //     onChange={(e) => setOtp(e.target.value)}
        //   />
        //   <button onClick={handleVerifyOtp}>Verify OTP</button>
        // </div>
      )}
    </div>
  );
};

export default PhoneAuth;
