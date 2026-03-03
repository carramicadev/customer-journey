export default function ExpiredScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-100">
      <div className="rounded-xl bg-white p-10 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-red-600">
          Your transaction has expired
        </h1>
        <p className="mt-4 text-gray-500">Please place your order again.</p>
      </div>
    </div>
  );
}
