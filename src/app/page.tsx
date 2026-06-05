import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import StatsSection from "@/components/landing/StatsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>

      <Navbar />

      <HeroSection />

      <FeatureSection />

      <StatsSection />

      <CTASection />

      <Footer />

    </main>
  );
}