import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <section className="bg-[#FAFAFA]">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        {/* CONTENT WRAPPER */}
        <div
          className="
            font-subheading
            prose
            prose-lg
            prose-headings:font-heading
            prose-headings:text-primary
            prose-strong:text-primary
            prose-a:text-primary
            max-w-none
            text-gray-700
          "
        >
          {children}
        </div>
      </div>
    </section>
  );
}
