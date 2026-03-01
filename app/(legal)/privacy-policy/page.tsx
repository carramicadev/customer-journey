"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PrivacyPolicyPage() {
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
        stagger: 0.15,
        duration: 1.1,
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

  return (
    <div ref={sectionRef}>
      {/* ================= HEADER ================= */}
      <Block i={0}>
        <div className="not-prose text-center">
          <h1 className="font-heading text-4xl text-primary md:text-5xl">
            Privacy Policy
          </h1>

          <p className="font-subheading mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Carramica respects and protects your privacy. This Privacy Policy
            explains how we collect, use, store, and safeguard your personal
            information when interacting with our services.
          </p>
        </div>
      </Block>

      {/* ================= CONTENT ================= */}
      <div className="font-subheading mt-16 space-y-14 text-lg leading-relaxed text-gray-700">
        <Block i={1}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal information required to process orders and
              improve customer experience, including:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>Full name</li>
              <li>Shipping and billing address</li>
              <li>Email address</li>
              <li>Phone or WhatsApp number</li>
              <li>Transaction information</li>
              <li>Order history</li>
            </ul>
          </div>
        </Block>

        <Block i={2}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              2. Use of Information
            </h2>

            <ul className="list-disc space-y-2 pl-6">
              <li>Processing and delivering orders</li>
              <li>Payment verification</li>
              <li>Customer support communication</li>
              <li>Website performance improvement</li>
              <li>Fraud prevention</li>
            </ul>
          </div>
        </Block>

        <Block i={3}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              3. Payment Security
            </h2>
            <p>
              Payments are securely processed via trusted payment gateways such
              as <strong>Midtrans</strong>. Carramica does not store sensitive
              payment credentials.
            </p>
          </div>
        </Block>

        <Block i={4}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              4. Data Sharing
            </h2>
            <p>
              Information may only be shared with authorized operational
              partners including logistics providers and payment processors.
            </p>
          </div>
        </Block>

        <Block i={5}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              5. Data Protection
            </h2>
            <p>
              Carramica applies industry-standard safeguards to protect customer
              data from unauthorized access or misuse.
            </p>
          </div>
        </Block>

        <Block i={6}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              6. Cookies & Analytics
            </h2>
            <p>
              Cookies may be used to enhance browsing experience and analyze
              website performance.
            </p>
          </div>
        </Block>

        <Block i={7}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              7. Customer Rights
            </h2>

            <ul className="list-disc space-y-2 pl-6">
              <li>Access personal information</li>
              <li>Request correction</li>
              <li>Request deletion</li>
              <li>Withdraw communication consent</li>
            </ul>
          </div>
        </Block>

        <Block i={8}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              8. Data Retention
            </h2>
            <p>
              Personal data is retained only as long as necessary for legal,
              operational, and warranty purposes.
            </p>
          </div>
        </Block>

        <Block i={9}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              9. Policy Updates
            </h2>
            <p>
              Carramica may update this Privacy Policy periodically. Updated
              versions will always be published on this page.
            </p>
          </div>
        </Block>

        <Block i={10}>
          <div>
            <h2 className="font-heading mb-4 text-2xl text-primary">
              10. Contact Information
            </h2>

            <ul className="list-disc space-y-2 pl-6">
              <li>Email: info@carramica.com</li>
              <li>WhatsApp: +62 812 9136 6950</li>
              <li>Service Hours: 09:00 – 18:00 WIB</li>
            </ul>
          </div>
        </Block>
      </div>
    </div>
  );
}
