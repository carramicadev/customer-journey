import AboutHero from "@/components/about/hero/AboutHero";
import Location from "@/components/about/location/Location";
import Story from "@/components/about/story/Story";
import TodayCarramica from "@/components/about/today/TodayCarramica";
import TurningPoint from "@/components/about/turning-point/TurningPoint";
import CTA from "@/components/home/cta/CTA";
import Trusted from "@/components/home/trusted/Trusted";

export default function AboutUs() {
  return (
    <>
      <AboutHero />
      <Story />
      <TurningPoint />
      <TodayCarramica />
      <Trusted />
      <Location />
      <CTA />

      {/* NEXT SECTION */}
      {/* Story */}
      {/* Turning Point */}
      {/* Today Carramica */}
      {/* Location */}
    </>
  );
}
