import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import DignitySection from "../components/home/DignitySection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DignitySection />
    </div>
  );
}