export default function FailedScreen({ status }: { status: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-100">
      <div className="rounded-xl bg-white p-10 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-yellow-600">Payment {status}</h1>
        <p className="mt-4 text-gray-500">Please try again.</p>
      </div>
    </div>
  );
}
