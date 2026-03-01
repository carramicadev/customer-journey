"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  RefreshCcw,
  AlertTriangle,
  UserCheck,
  Scale,
  Mail,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function TermsConditionsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);

  /* ===============================
     SCROLL REVEAL
  =============================== */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(blocksRef.current, {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const Block = ({ children, i }: { children: React.ReactNode; i: number }) => (
    <div ref={(el) => el && (blocksRef.current[i] = el)}>{children}</div>
  );

  const Title = ({ icon: Icon, children }: any) => (
    <div className="mb-4 flex items-center gap-3">
      <Icon className="text-primary" size={26} />
      <h2 className="font-heading text-2xl text-primary">{children}</h2>
    </div>
  );

  return (
    <div ref={sectionRef}>
      {/* ================= HEADER ================= */}
      <Block i={0}>
        <div className="not-prose text-center">
          <h1 className="font-heading text-4xl text-primary md:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            These Terms & Conditions govern your access and use of Carramica’s
            website, services, and purchasing platforms. By placing an order or
            using our services, you agree to comply with the terms outlined
            below.
          </p>
        </div>
      </Block>

      {/* ================= CONTENT ================= */}
      <div className="font-subheading mt-16 space-y-14 text-lg leading-relaxed text-gray-700">
        {/* GENERAL */}
        <Block i={1}>
          <div>
            <Title icon={FileText}>1. General Agreement</Title>

            <p>
              By accessing Carramica website or purchasing products, customers
              agree to be legally bound by these Terms & Conditions, including
              all policies related to delivery, privacy, and payment.
            </p>
          </div>
        </Block>

        {/* PRODUCT */}
        <Block i={2}>
          <div>
            <Title icon={ShoppingBag}>2. Product Information</Title>

            <p>
              Carramica strives to ensure all product descriptions, images, and
              pricing information are accurate. However, slight variations in
              color, texture, or finishing may occur due to lighting conditions
              and ceramic production characteristics.
            </p>
          </div>
        </Block>

        {/* PAYMENT */}
        <Block i={3}>
          <div>
            <Title icon={CreditCard}>3. Payment Terms</Title>

            <ul className="list-disc space-y-2 pl-6">
              <li>Payments are processed via official Midtrans gateway.</li>
              <li>
                Payment links are shared only through Carramica Official
                WhatsApp Account.
              </li>
              <li>Orders will be processed only after payment confirmation.</li>
            </ul>
          </div>
        </Block>

        {/* SHIPPING */}
        <Block i={4}>
          <div>
            <Title icon={Truck}>4. Shipping & Delivery</Title>

            <p>
              Delivery timelines depend on courier services and destination
              areas. Carramica is not responsible for delays caused by logistics
              providers, natural events, or unforeseen operational disruptions.
            </p>
          </div>
        </Block>

        {/* WARRANTY */}
        <Block i={5}>
          <div>
            <Title icon={ShieldCheck}>5. Product Warranty</Title>

            <p>
              Carramica provides breakage protection under conditions stated in
              the Delivery Policy. Warranty claims require valid unboxing video
              evidence.
            </p>
          </div>
        </Block>

        {/* RETURN */}
        <Block i={6}>
          <div>
            <Title icon={RefreshCcw}>6. Returns & Refund Policy</Title>

            <ul className="list-disc space-y-2 pl-6">
              <li>Refund or replacement applies to verified damage.</li>
              <li>
                Minor defects may qualify for partial refund according to
                assessment.
              </li>
              <li>
                Refund method follows original payment method whenever possible.
              </li>
            </ul>
          </div>
        </Block>

        {/* LIABILITY */}
        <Block i={7}>
          <div>
            <Title icon={AlertTriangle}>7. Limitation of Liability</Title>

            <p>
              Carramica shall not be liable for indirect damages, misuse of
              products, improper handling after delivery, or third-party courier
              negligence outside protected shipment conditions.
            </p>
          </div>
        </Block>

        {/* USER RESPONSIBILITY */}
        <Block i={8}>
          <div>
            <Title icon={UserCheck}>8. Customer Responsibilities</Title>

            <ul className="list-disc space-y-2 pl-6">
              <li>Provide accurate shipping information.</li>
              <li>Ensure recipient availability.</li>
              <li>Follow unboxing claim procedures.</li>
            </ul>
          </div>
        </Block>

        {/* LAW */}
        <Block i={9}>
          <div>
            <Title icon={Scale}>9. Governing Law</Title>

            <p>
              These Terms & Conditions are governed by the laws of the Republic
              of Indonesia. Any disputes shall be resolved through mutual
              discussion before legal proceedings.
            </p>
          </div>
        </Block>

        {/* CONTACT */}
        <Block i={10}>
          <div>
            <Title icon={Mail}>10. Contact Information</Title>

            <p>
              For questions regarding these Terms & Conditions, customers may
              contact Carramica Customer Support:
            </p>

            <ul className="mt-2 list-disc pl-6">
              <li>Email: info@carramica.com</li>
              <li>WhatsApp: +62 812 9136 6950</li>
              <li>Operating Hours: 09:00 – 18:00 WIB</li>
            </ul>
          </div>
        </Block>
      </div>
    </div>
  );
}
