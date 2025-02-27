"use client";

import Carousel from "@/components/Carousel/Carousel";
import Features from "@/components/Features/Features";
import FooterSection from "@/components/Footer/Footer";
import HowItWorks from "@/components/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Carousel />

      {/* Features Section */}
      <Features />

      {/* How it Works Section */}
      <HowItWorks />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
