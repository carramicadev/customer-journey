import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExpiredScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3d5d8]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* TOP */}
        <div className="flex flex-col items-center bg-[#f3d5d8] px-8 py-12 text-center">
          <div className="mb-4 rounded-full bg-red-500 p-5">
            <AlertCircle className="size-10 text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Your transaction has expired
          </h1>

          <div className="my-4 h-1 w-12 rounded bg-red-500" />

          <p className="text-gray-600">
            We didn&apos;t receive the payment on time. Please place your order
            again.
          </p>
        </div>

        {/* BOTTOM */}
        <div className="bg-gray-100 px-8 py-10 text-center">
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-lg bg-gray-800 py-3 text-white"
          >
            Return to merchant&apos;s page
          </button>
        </div>
      </div>
    </div>
  );
}
