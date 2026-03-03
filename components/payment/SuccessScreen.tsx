import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessScreen({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#cfe8e4]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* TOP SECTION */}
        <div className="flex flex-col items-center bg-[#cfe8e4] px-8 py-12 text-center">
          <div className="mb-4 rounded-full bg-teal-500 p-5">
            <CheckCircle2 className="size-10 text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Payment successful
          </h1>

          <div className="my-4 h-1 w-12 rounded bg-teal-500" />

          <p className="text-4xl font-bold text-gray-800">
            Rp{amount.toLocaleString()}
          </p>

          <p className="mt-2 text-sm text-gray-600">Order ID #{orderId}</p>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bg-gray-100 px-8 py-10 text-center">
          <p className="mb-6 text-gray-600">Close in 10 second</p>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-lg bg-gray-800 py-3 text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
