"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Clock,
  Truck,
  MapPin,
  Package,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Lock,
  Headphones,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DeliveryPolicyPage() {
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
            Delivery Policy
          </h1>

          <p className="font-subheading mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Every Carramica ceramic piece is delivered with exceptional
            protection and care. This policy explains how orders are processed,
            shipped, and safeguarded to ensure a seamless delivery experience.
          </p>
        </div>
      </Block>

      {/* ================= CONTENT ================= */}
      <div className="font-subheading mt-16 space-y-14 text-lg leading-relaxed text-gray-700">
        <Block i={1}>
          <div>
            <Title icon={Clock}>1. Order Processing Time</Title>

            <p>
              Orders are processed daily between
              <b> 09:00 – 18:00 WIB</b>. Payments confirmed before
              <b> 15:00 WIB (Monday–Friday)</b> will be shipped on the same day.
            </p>
          </div>
        </Block>

        <Block i={2}>
          <div>
            <Title icon={Truck}>2. Delivery Methods</Title>

            <ul className="list-disc space-y-2 pl-6">
              <li>Paxel (Recommended Fragile Courier)</li>
              <li>GoSend / GrabExpress</li>
              <li>Lalamove</li>
              <li>Dakota Cargo</li>
              <li>SAP Express</li>
              <li>Carramica Dedicated Courier</li>
            </ul>
          </div>
        </Block>

        <Block i={3}>
          <div>
            <Title icon={MapPin}>3. Estimated Delivery Time</Title>

            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full text-left">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-4">Area</th>
                    <th className="p-4">Estimated Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-4">Jabodetabek</td>
                    <td className="p-4">Same Day / Next Day</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-4">Java</td>
                    <td className="p-4">2 – 4 Days</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-4">Outside Java</td>
                    <td className="p-4">5 – 12 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Block>

        <Block i={4}>
          <div>
            <Title icon={Package}>4. Packaging Standards</Title>

            <p>
              All products are packed using multilayer ceramic-safe protection
              including bubble cushioning, reinforced boxes, and fragile
              labeling.
            </p>
          </div>
        </Block>

        <Block i={5}>
          <div>
            <Title icon={ShieldCheck}>5. 100% Breakage Protection</Title>

            <ul className="list-disc space-y-2 pl-6">
              <li>Recommended courier is used</li>
              <li>Unboxing video available</li>
              <li>Damage occurs during shipment</li>
            </ul>
          </div>
        </Block>

        <Block i={6}>
          <div>
            <Title icon={FileCheck}>6. Warranty Claim Procedure</Title>

            <ol className="list-decimal space-y-2 pl-6">
              <li>Record continuous unboxing video</li>
              <li>Contact Customer Service within 24 hours</li>
              <li>Provide order evidence</li>
            </ol>
          </div>
        </Block>

        <Block i={7}>
          <div>
            <Title icon={CreditCard}>7. Payment Security</Title>

            <p>
              Official payment links are issued only via Midtrans and shared
              through Carramica Official WhatsApp Account.
            </p>
          </div>
        </Block>

        <Block i={8}>
          <div>
            <Title icon={Lock}>8. Customer Data Protection</Title>

            <p>
              Customer data is used strictly for transaction and delivery
              purposes and will never be sold or distributed.
            </p>
          </div>
        </Block>

        <Block i={9}>
          <div>
            <Title icon={Headphones}>9. Customer Support</Title>

            <p>
              Customer Service is available daily from
              <b> 09:00 – 18:00 WIB </b>
              via Carramica Official WhatsApp.
            </p>
          </div>
        </Block>
      </div>
    </div>
  );
}
