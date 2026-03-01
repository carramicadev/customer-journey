import Image from "next/image";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mt-20">
      {/* ===== HEADER KHUSUS PAYMENT ===== */}
      {/* image ada di tengah */}
      <div className="flex w-full items-center justify-center bg-primary py-6">
        <Image
          src="/logoCarramicaWhite.svg"
          alt="Carramica"
          width={140}
          height={70}
        />
      </div>

      {children}
    </div>
  );
}
