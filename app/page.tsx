import Hero from "@/components/home/hero/Hero";
import Trusted from "@/components/home/trusted/Trusted";
import Art from "@/components/home/art/Art";
import Why from "@/components/home/why/Why";
import How from "@/components/home/how/How";
import Signature from "@/components/home/signature/Signature";
import Testimonial from "@/components/home/testimonial/Testimonial";
import FAQ from "@/components/home/faq/FAQ";
import CTA from "@/components/home/cta/CTA";
export default function Home() {
  return (
    <>
      <Hero />
      <Trusted />
      <Art />
      <Why />
      <How />
      <Signature />
      <Testimonial />
      <FAQ />
      <CTA />
    </>
  );
}
