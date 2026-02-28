"use client";

export default function HeroDots({
  total,
  active,
  onChange,
}: {
  total: number;
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i === active
              ? "scale-125 bg-white"
              : "bg-white/40 hover:bg-white/70"
          }`}
        />
      ))}
    </div>
  );
}
