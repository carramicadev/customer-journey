import Image from "next/image";

export default function HeroSlide({ title, desc, image }: any) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full">
      <Image src={image} alt="" fill priority className="object-cover" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/35" />

      {/* TEXT LEFT (LIKE DESIGN) */}
      <div className="absolute inset-0 flex items-center">
        <div className="hero-text pointer-events-auto max-w-2xl px-6 text-white md:pl-[8%]">
          <h1 className="font-heading mb-6 font-serif text-5xl leading-tight sm:text-4xl md:text-6xl">
            {title}
          </h1>

          <p className="font-subheading mb-24 text-lg opacity-90 md:text-2xl">
            {desc}
          </p>

          <button className="font-body underline underline-offset-4">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}
