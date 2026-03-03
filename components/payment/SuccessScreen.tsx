export default function SuccessScreen({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-100">
      <div className="rounded-xl bg-white p-10 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-green-600">
          Payment successful
        </h1>
        <p className="mt-4 text-3xl font-bold">Rp {amount.toLocaleString()}</p>
        <p className="mt-2 text-sm text-gray-500">Order ID #{orderId}</p>
      </div>
    </div>
  );
}
